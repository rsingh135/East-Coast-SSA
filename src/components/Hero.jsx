import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { event } from '../content/conference'

/**
 * Stand-in for the conference film: a near-black frame with a faint blue
 * wash, so the band reads as media without a placeholder service branding it.
 */
const HERO_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='45%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%231b3a6b'/%3E%3Cstop offset='100%25' stop-color='%230a0a0a'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23g)'/%3E%3C/svg%3E"

/**
 * Opening screen: a full-bleed media band with the wordmark set oversized
 * across it, each line sliding up out of a hard mask.
 */
export function Hero() {
  const rootRef = useRef(null)

  useGsapEntrance(rootRef, (gsap, timeline, reducedMotion) => {
    const lines = '[data-hero-line]'
    const meta = '[data-hero-meta]'
    const media = '[data-hero-media]'

    if (reducedMotion) {
      // Everything that starts hidden in markup has to be revealed here, or
      // the section renders blank for anyone who asked for less motion.
      gsap.set([lines, meta, media], { yPercent: 0, y: 0, scale: 1, opacity: 1 })
      return
    }

    timeline
      .fromTo(media, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' })
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' }, 0.15)
      .fromTo(meta, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power2.out' }, 0.6)
  })

  return (
    <Section
      id="hero"
      bg="ink"
      frame="hero"
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between overflow-hidden pt-[var(--frame-bar)] pb-[var(--frame-bar)]"
    >
      {/* Media band. Sits behind the type and bleeds off both edges. */}
      <div className="pointer-events-none absolute inset-x-0 top-[18%] h-[64%]" aria-hidden="true">
        <video
          data-hero-media
          data-testid="hero-media"
          /* TODO: add the conference film here — <source src="…" type="video/mp4" />.
             Until then the poster is an inline SVG: no request, no placeholder
             service stamping its dimensions across the frame. */
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="size-full object-cover opacity-0 grayscale"
        />
        {/* Scrim keeps white type legible over any frame of the film. */}
        <div className="absolute inset-0 bg-ink/50" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-6 px-4 pt-6 md:px-6">
        <p data-hero-meta className="label max-w-[16rem] text-muted opacity-0 md:max-w-none">
          {event.hostLine}
        </p>
        <p data-hero-meta className="label text-right text-muted opacity-0">
          {event.city}
        </p>
      </div>

      <h1 className="relative z-10 px-4 md:px-6">
        <span className="sr-only">{event.name}</span>
        {event.wordmarkLines.map((line) => (
          <span key={line} className="line-mask" aria-hidden="true">
            {/* nowrap: these are deliberate lines, and a wrap inside a mask
                would be clipped rather than flow. The clamp on --text-hero is
                what keeps each line inside the viewport. */}
            <span data-hero-line className="display block text-hero whitespace-nowrap">
              {line}
            </span>
          </span>
        ))}
      </h1>

      <div className="relative z-10 flex flex-col gap-6 px-4 pb-6 md:flex-row md:items-end md:justify-between md:px-6">
        <div data-hero-meta className="opacity-0">
          <p className="label text-white">{event.dates}</p>
          <p className="label mt-2 text-muted">
            {event.hostSchool} · {event.arrivalNote}
          </p>
        </div>

        <a
          data-hero-meta
          href="#register"
          className="group label inline-flex w-fit items-center gap-3 rounded-full border border-white/25 py-3 pr-4 pl-5 text-white opacity-0 transition-colors duration-300 hover:border-accent-bright hover:text-accent-bright"
        >
          Register
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </Section>
  )
}
