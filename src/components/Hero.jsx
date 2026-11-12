import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { event } from '../content/conference'
import logo from '../assets/brand/silc-logo-dark.webp'

/**
 * The conference film, served from `public/`. Re-encoded from the 4K master to
 * 1080p 60fps with the audio track stripped — it plays muted behind type under
 * a scrim, so neither the extra resolution nor the audio ever reaches a viewer,
 * and both would only cost the first paint. See the README for the encode.
 *
 * It plays once and holds on its final frame: a video that is not looping
 * stays on its last frame when it ends, so no script is needed for the hold.
 *
 * The poster is its own first frame, so the band is never an empty box while
 * the video loads and never a different image when it starts. Under reduced
 * motion the film never plays, so the poster is the last frame instead — the
 * same still everyone else ends on.
 */
const HERO_VIDEO = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'
const HERO_FINAL_FRAME = '/hero-final.jpg'

/**
 * Opening screen: a full-bleed media band with the SILC logo set large across
 * it, rising up out of a hard mask.
 */
export function Hero() {
  const rootRef = useRef(null)
  // A film is motion whether or not GSAP drives it, so reduced motion holds
  // the band on a still rather than only skipping the entrance.
  const reducedMotion = useReducedMotion()

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
      bg="forest"
      frame="hero"
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between overflow-hidden pt-[var(--frame-bar)] pb-[var(--frame-bar)]"
    >
      {/* Media band. Sits behind the type and bleeds off both edges. */}
      {/* Masked top and bottom so the band dissolves into the canvas rather
          than ending on a hard edge. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] h-[64%] [mask-image:linear-gradient(transparent,black_22%,black_78%,transparent)]"
        aria-hidden="true"
      >
        <video
          data-hero-media
          data-testid="hero-media"
          poster={reducedMotion ? HERO_FINAL_FRAME : HERO_POSTER}
          autoPlay={!reducedMotion}
          muted
          playsInline
          preload="metadata"
          className="size-full object-cover opacity-0 grayscale"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Scrim keeps the logo legible over any frame of the film. */}
        <div className="absolute inset-0 bg-ground/60" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-6 px-4 pt-6 md:px-6">
        <p data-hero-meta className="label max-w-[16rem] text-muted opacity-0 md:max-w-none">
          {event.hostLine}
        </p>
        {/* Short form on phones: beside the two-line host credit, the full name
            breaks one word per line. */}
        <p data-hero-meta className="label shrink-0 text-right text-muted opacity-0">
          <span className="md:hidden">{event.cityShort}</span>
          <span className="hidden md:inline">{event.city}</span>
        </p>
      </div>

      <h1 className="relative z-10 flex justify-center px-4 md:px-6">
        <span className="line-mask">
          {/* Intrinsic size is set so the image reserves its box before it
              loads; the width cap keeps the vine clear of the nav on wide
              screens. */}
          <img
            data-hero-line
            src={logo}
            alt={event.name}
            width={1136}
            height={482}
            className="block h-auto w-[min(88vw,58rem)]"
          />
        </span>
      </h1>

      <div className="relative z-10 flex flex-col gap-6 px-4 pb-6 md:flex-row md:items-end md:justify-between md:px-6">
        <div data-hero-meta className="opacity-0">
          <p className="label text-fg">{event.dates}</p>
          <p className="label mt-2 text-muted">
            {event.cityShort} · {event.arrivalNote}
          </p>
        </div>

        <a
          data-hero-meta
          href="#register"
          className="group label inline-flex w-fit items-center gap-3 rounded-full border border-fg/25 py-3 pr-4 pl-5 text-fg opacity-0 transition-colors duration-300 hover:border-accent hover:text-accent"
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
