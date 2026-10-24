"""Put a real screenshot onto the chroma-green screen of a generated device photo.

usage: composite.py scene.png screenshot.png crop(x0,y0,x1,y1) out.png [--aspect A] [--fix-reflection]
"""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

args = sys.argv[1:]
scene_p, shot_p, crop_s, out_p = args[:4]
aspect = None
fix_refl = '--fix-reflection' in args
if '--aspect' in args:
    aspect = float(args[args.index('--aspect') + 1])

scene = Image.open(scene_p).convert('RGB')
S = np.asarray(scene).astype(np.float32)
r, g, b = S[..., 0], S[..., 1], S[..., 2]
green = g - np.maximum(r, b)

# Screen = largest connected strongly-green blob.
hard = green > 60
lab, n = ndimage.label(hard)
sizes = ndimage.sum(hard, lab, range(1, n + 1))
screen_id = int(np.argmax(sizes)) + 1
screen = lab == screen_id
screen = ndimage.binary_fill_holes(screen)

# Corners: fit a line to the middle of each side of the blob outline, intersect.
edge = screen & ~ndimage.binary_erosion(screen)
ys, xs = np.nonzero(edge)
pts = np.stack([xs, ys], 1).astype(np.float64)
s, d = pts[:, 0] + pts[:, 1], pts[:, 0] - pts[:, 1]
tl, br = pts[np.argmin(s)], pts[np.argmax(s)]
tr, bl = pts[np.argmax(d)], pts[np.argmin(d)]
rough = [tl, tr, br, bl]

def side_points(p, q):
    v = q - p
    L = np.linalg.norm(v)
    u = v / L
    nrm = np.array([-u[1], u[0]])
    t = (pts - p) @ u
    off = (pts - p) @ nrm
    sel = (t > 0.25 * L) & (t < 0.75 * L) & (np.abs(off) < 0.06 * L + 6)
    return pts[sel]

def fit_line(P):
    c = P.mean(0)
    _, _, vt = np.linalg.svd(P - c)
    dirv = vt[0]
    return c, dirv

lines = [fit_line(side_points(rough[i], rough[(i + 1) % 4])) for i in range(4)]

def intersect(l1, l2):
    (c1, d1), (c2, d2) = l1, l2
    A = np.array([d1, -d2]).T
    t = np.linalg.solve(A, c2 - c1)
    return c1 + t[0] * d1

quad = [intersect(lines[(i - 1) % 4], lines[i]) for i in range(4)]  # tl, tr, br, bl
quad = np.array(quad)
print('quad', quad.round(1).tolist())
wtop = np.linalg.norm(quad[1] - quad[0]); wbot = np.linalg.norm(quad[2] - quad[3])
hl = np.linalg.norm(quad[3] - quad[0]); hr = np.linalg.norm(quad[2] - quad[1])
print('apparent aspect', round((wtop + wbot) / (hl + hr), 3))

# Screenshot crop, then match the target aspect (stretch only what is left over).
x0, y0, x1, y1 = map(int, crop_s.split(','))
shot = Image.open(shot_p).convert('RGB').crop((x0, y0, x1, y1))
if aspect is None:
    aspect = (wtop + wbot) / (hl + hr)
sw, sh = shot.size
print('shot aspect', round(sw / sh, 3), '-> target', aspect)

# Render the screenshot big so the warp has detail to sample from.
TW = 2400
TH = int(round(TW / aspect))
shot = shot.resize((TW, TH), Image.LANCZOS)
shot = shot.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))

# Grow the quad a touch so the warped image fills under the soft mask edge.
c = quad.mean(0)
quad_g = c + (quad - c) * 1.01

def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(A))
    H = vt[-1].reshape(3, 3)
    return H / H[2, 2]

src = np.array([[0, 0], [TW, 0], [TW, TH], [0, TH]], float)
# PIL wants the map from output pixel -> input pixel.
H = homography(quad_g, src)
coeffs = H.flatten()[:8].tolist()
W, Hh = scene.size
warped = shot.transform((W, Hh), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
Wp = np.asarray(warped).astype(np.float32)

# Soft matte from greenness, restricted to the screen blob (dilated a little).
region = ndimage.binary_dilation(screen, iterations=4)
alpha = np.clip((green - 15) / 70.0, 0, 1) * region
alpha = ndimage.gaussian_filter(alpha, 0.7)

# Light sheen: the glass catches a faint diagonal highlight.
yy, xx = np.mgrid[0:Hh, 0:W].astype(np.float32)
diag = (xx - c[0]) * 0.6 + (yy - c[1]) * -0.8
sheen = np.clip(1 - np.abs(diag + 0.25 * max(wtop, hl)) / (0.35 * max(wtop, hl)), 0, 1) * 0.07
Wp = Wp + (255 - Wp) * sheen[..., None]

out = S.copy()
# Despill: no green fringe left on the bezel.
spill = region & (green > 0)
out[..., 1] = np.where(spill, np.minimum(g, np.maximum(r, b) + 4), g)

if fix_refl:
    # Green reflection on a wet floor: pull its chroma back to the floor's own tint and lift it a
    # little, so it reads as the light page reflecting. Only below the screen.
    rb = (r + b) / 2 + 1
    floor = (~region) & (yy > quad[:, 1].max()) & (green < 3)
    ratio = np.median(g[floor] / rb[floor])
    resid = g - rb * ratio
    zone = (~region) & (yy > quad[:, 1].max())
    k = ndimage.gaussian_filter(np.clip(resid / 10.0, 0, 1) * zone, 3.0)
    k = ndimage.grey_dilation(k, size=5)
    k = np.clip(k * 1.5, 0, 1) * zone
    target_g = rb * ratio
    out[..., 1] = out[..., 1] * (1 - k) + target_g * k
    for ch in range(3):
        out[..., ch] = out[..., ch] + (235 - out[..., ch]) * 0.18 * k

out = out * (1 - alpha[..., None]) + Wp * alpha[..., None]
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(out_p)
print('saved', out_p)
