import { useEffect, useRef } from 'react'
import { Slide } from './Slide'

export type MAengsteProps = {
  /** Tags are thrown in when the slide comes into view. Off shows the settled pile right away. */
  fly?: boolean
  chrome?: boolean
}

/** One word per problem a car-wash customer can have. The first one carries the slide's one signal accent. */
const WORDS = [
  'Kratzer', 'Wertverlust', 'Blamage', 'Abzocke', 'Wartezeit', 'Abofalle', 'Streifen', 'Umweltsünde',
  'Kontrollverlust', 'Wasserflecken', 'Hitze', 'Regen', 'Vogelkot', 'Staub', 'Teer', 'Felgen', 'Unterboden',
  'Spiegel', 'Dachbox', 'Tieferlegung', 'Verdeck', 'Lackschaden', 'Delle', 'Politur', 'Versiegelung',
  'Tierhaare', 'Kaugummi', 'Hund', 'Fussmatten', 'Geruch', 'Kleingeld', 'Mindestumsatz', 'Kündigung',
  'Zusatzkosten', 'Trinkgeld', 'Öffnungszeiten', 'Sonntag', 'Parkplatz', 'Zeitdruck', 'Einfahrt', 'Bürsten',
  'Hochdruck', 'Chemie', 'Sensoren', 'Haftung', 'Reklamation', 'Schiebedach', 'Wassereintritt', 'Zuschauer',
  'Drängeln', 'Programmwahl', 'Misstrauen', 'Aufschieben', 'Wasserverbrauch', 'Gewissen',
] as const

const STEP = 1000 / 60

/** Stable pseudo-random numbers, so the pile looks thrown but lands the same every time. */
const rnd = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return v - Math.floor(v)
}

export function MAengste({ fly = true, chrome = true }: MAengsteProps) {
  const stage = useRef<HTMLDivElement>(null)
  const tags = useRef<(HTMLLIElement | null)[]>([])
  /** Takes a tag out of the pile. Set once the physics is running. */
  const vanish = useRef<(i: number) => void>(() => {})

  useEffect(() => {
    let dead = false
    let cleanup = () => {}

    ;(async () => {
      // Client-only: the physics and GSAP plugins never run during the static build.
      const [{ gsap }, { Draggable }, { InertiaPlugin }, Matter] = await Promise.all([
        import('gsap'),
        import('gsap/Draggable'),
        import('gsap/InertiaPlugin'),
        import('matter-js').then((m) => m.default),
      ])
      await document.fonts?.ready
      const root = stage.current
      if (dead || !root) return
      gsap.registerPlugin(Draggable, InertiaPlugin)
      const { Engine, Bodies, Body, Composite, Events } = Matter

      // Stage px, not screen px: the slide is scaled as a whole, offsetWidth ignores that.
      const W = root.offsetWidth
      const H = root.offsetHeight
      const engine = Engine.create({ gravity: { x: 0, y: 2.4 } })
      const wall = { isStatic: true, friction: 0.8 }
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + 100, W * 3, 200, wall),
        Bodies.rectangle(-100, H / 2 - 1500, 200, H + 3000, wall),
        Bodies.rectangle(W + 100, H / 2 - 1500, 200, H + 3000, wall),
      ])

      const items = tags.current.flatMap((el, i) => {
        if (!el) return []
        const w = el.offsetWidth
        const h = el.offsetHeight
        const body = Bodies.rectangle(0, 0, w, h, {
          chamfer: { radius: h / 2 - 1 },
          restitution: 0.38,
          friction: 0.55,
          frictionAir: 0.004,
          density: 0.0018,
        })
        // Heavier against spinning, so the words land readable instead of upside down.
        Body.setInertia(body, body.inertia * 6)
        return [{
          el,
          body,
          w,
          h,
          i,
          live: false,
          landed: false,
          gone: false,
          face: el.firstElementChild as HTMLElement,
          setX: gsap.quickSetter(el, 'x', 'px'),
          setY: gsap.quickSetter(el, 'y', 'px'),
          setR: gsap.quickSetter(el, 'rotation', 'deg'),
        }]
      })
      type Item = (typeof items)[number]

      const spawn = (it: Item, y = -100) => {
        if (it.live || it.gone) return
        const { body, i } = it
        Body.setPosition(body, { x: W * (0.06 + 0.88 * rnd(i, 1)), y })
        Body.setAngle(body, (rnd(i, 2) - 0.5) * 0.5)
        Body.setVelocity(body, { x: (rnd(i, 3) - 0.5) * 8, y: 6 + rnd(i, 4) * 4 })
        Body.setAngularVelocity(body, (rnd(i, 5) - 0.5) * 0.04)
        Composite.add(engine.world, body)
        it.live = true
        gsap.set(it.el, { autoAlpha: 1 })
      }

      // First hard hit squashes the tag, so the landing reads as a slap.
      const byBody = new Map(items.map((it) => [it.body.id, it]))
      let quiet = false
      Events.on(engine, 'collisionStart', (e) => {
        if (quiet) return
        for (const { bodyA, bodyB } of e.pairs) {
          for (const it of [byBody.get(bodyA.id), byBody.get(bodyB.id)]) {
            if (!it || it.landed || it.body.speed < 8) continue
            it.landed = true
            gsap.fromTo(
              it.face,
              { scaleX: 1.14, scaleY: 0.8 },
              { scaleX: 1, scaleY: 1, duration: 0.45, ease: 'elastic.out(1.1, 0.4)', overwrite: true },
            )
          }
        }
      })

      // Grabbed tag: it follows the pointer and shoves the others out of the way.
      let held: { it: Item; angle: number; mass: number } | null = null

      const render = () => {
        for (const it of items) {
          if (!it.live || it === held?.it) continue
          it.setX(it.body.position.x - it.w / 2)
          it.setY(it.body.position.y - it.h / 2)
          it.setR((it.body.angle * 180) / Math.PI)
        }
      }

      // Cap how hard a dragged tag can hit: a fast pull should push the pile, not blow it apart.
      const pull = (v: number) => Math.max(-24, Math.min(24, v))
      const follow = () => {
        if (!held) return
        const { it, angle } = held
        const tx = Number(gsap.getProperty(it.el, 'x')) + it.w / 2
        const ty = Number(gsap.getProperty(it.el, 'y')) + it.h / 2
        Body.setVelocity(it.body, { x: pull(tx - it.body.position.x), y: pull(ty - it.body.position.y) })
        Body.setAngle(it.body, angle)
        Body.setAngularVelocity(it.body, 0)
      }

      let acc = 0
      const tick = (_t: number, dt: number) => {
        acc = Math.min(acc + dt, STEP * 4)
        while (acc >= STEP) {
          follow()
          Engine.update(engine, STEP)
          acc -= STEP
        }
        render()
      }

      /** Drops every tag and runs the simulation until the pile rests. For print and reduced motion. */
      const settle = () => {
        quiet = true
        items.forEach((it) => {
          spawn(it)
          for (let s = 0; s < 8; s++) Engine.update(engine, STEP)
        })
        for (let s = 0; s < 1500; s++) Engine.update(engine, STEP)
        render()
        quiet = false
      }

      // A clicked fear is taken away: the tag pops out and the pile falls into the gap.
      vanish.current = (i) => {
        const it = items.find((x) => x.i === i)
        if (!it || it.gone) return
        it.gone = true
        it.live = false
        Composite.remove(engine.world, it.body)
        drags[items.indexOf(it)]?.disable()
        gsap.to(it.face, { scale: 0.6, duration: 0.14, ease: 'power2.in', overwrite: true })
        gsap.to(it.el, { autoAlpha: 0, duration: 0.14, ease: 'power2.in' })
      }

      const clamp = gsap.utils.clamp(-35, 35)
      const drags = items.map(
        (it) =>
          Draggable.create(it.el, {
            type: 'x,y',
            zIndexBoost: true,
            // Fires only when the tag was not dragged.
            onClick() {
              vanish.current(it.i)
            },
            onPress() {
              held = { it, angle: it.body.angle, mass: it.body.mass }
              Body.setMass(it.body, it.body.mass * 0.35)
              InertiaPlugin.track(it.el, 'x,y')
            },
            onRelease() {
              if (!held) return
              Body.setMass(it.body, held.mass)
              Body.setPosition(it.body, {
                x: Number(gsap.getProperty(it.el, 'x')) + it.w / 2,
                y: Number(gsap.getProperty(it.el, 'y')) + it.h / 2,
              })
              // Throw speed is px per second, Matter wants px per step.
              Body.setVelocity(it.body, {
                x: clamp(InertiaPlugin.getVelocity(it.el, 'x') / 60),
                y: clamp(InertiaPlugin.getVelocity(it.el, 'y') / 60),
              })
              InertiaPlugin.untrack(it.el)
              held = null
            },
          })[0],
      )

      gsap.ticker.add(tick)
      window.addEventListener('beforeprint', settle)

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const tl = gsap.timeline({ paused: true, delay: 0.05 })
      items.forEach((it, k) => tl.call(() => spawn(it), [], k * 0.04))
      let io: IntersectionObserver | null = null
      if (!fly || reduce) settle()
      else {
        io = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return
            tl.play()
            io?.disconnect()
          },
          { threshold: 0.15 },
        )
        io.observe(root)
      }

      cleanup = () => {
        vanish.current = () => {}
        io?.disconnect()
        tl.kill()
        gsap.ticker.remove(tick)
        window.removeEventListener('beforeprint', settle)
        drags.forEach((d) => d.kill())
        Events.off(engine, 'collisionStart')
        Engine.clear(engine)
        items.forEach((it) => gsap.set([it.el, it.face], { clearProps: 'all' }))
      }
    })()

    return () => {
      dead = true
      cleanup()
    }
  }, [fly])

  return (
    <Slide
      n={2}
      kicker="Das Problem"
      source="Pip-Karte: Find the Fear"
      chrome={chrome}
      // The statement is a word behind the pile, not a title. The sentence stays for screen readers.
      background={
        <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          <h2 className="sr-only">Diese Ängste entscheiden über jedes Abo.</h2>
          <p aria-hidden="true" className="select-none whitespace-nowrap text-[440px] font-medium leading-none tracking-[-0.05em] text-ink/[0.055]">
            ÄNGSTE
          </p>
        </div>
      }
    >
      <div ref={stage} className="relative flex-1">
        <ul>
          {WORDS.map((w, i) => (
            <li
              key={w}
              ref={(el) => {
                tags.current[i] = el
              }}
              tabIndex={0}
              role="button"
              aria-label={w}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                vanish.current(i)
              }}
              className="group invisible absolute left-0 top-0 cursor-grab touch-none select-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal active:cursor-grabbing"
            >
              {/* Chip: fixed height, the word centred by flex. Everything is 10 % larger than the body step
                  (22px type, 53 / 44px high). About half are cut larger (taller, wider), the first always. */}
              <span
                className={`flex ${i === 0 || rnd(i, 7) < 0.5 ? 'h-[53px] px-[26px]' : 'h-[44px] px-[20px]'} items-center whitespace-nowrap rounded-full border-2 bg-stone text-[22px] leading-[1.35] tracking-[-0.01em] transition-colors duration-300 ease-frame ${
                  i === 0
                    ? 'border-signal text-signal group-hover:bg-signal group-hover:text-paper group-focus-visible:bg-signal group-focus-visible:text-paper'
                    : 'border-ink text-ink group-hover:bg-ink group-hover:text-paper group-focus-visible:bg-ink group-focus-visible:text-paper'
                }`}
              >
                {w}.
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  )
}
