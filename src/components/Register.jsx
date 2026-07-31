import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { event, registration } from '../content/conference'

/** A placeholder URL is not a destination; treat only a real link as live. */
const isLiveUrl = (url) => Boolean(url) && url !== '#'

/**
 * The one thing this page is asking people to do. No tiers and no counter —
 * registration is a single free sign-up on an external form.
 *
 * `registerUrl` is a prop so the pending and live states are both reachable
 * without mocking the content module.
 */
export function Register({ registerUrl = event.registerUrl }) {
  const rootRef = useRef(null)
  const isLive = isLiveUrl(registerUrl)

  useGsapEntrance(
    rootRef,
    (gsap, timeline, reducedMotion) => {
      const line = '[data-register-line]'
      const fade = '[data-register-fade]'

      if (reducedMotion) {
        gsap.set([line, fade], { yPercent: 0, y: 0, opacity: 1 })
        return
      }

      timeline
        .fromTo(line, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: 'expo.out' })
        .fromTo(fade, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0.2)
    },
    { scroll: true },
  )

  return (
    <Section
      id="register"
      bg="ink"
      frame="register"
      ref={rootRef}
      className="flex min-h-svh flex-col justify-center px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p data-register-fade className="label text-muted opacity-0">
          {registration.eyebrow}
        </p>

        <h2 className="line-mask mt-6 -mb-[0.15em]">
          <span data-register-line className="display block pb-[0.15em] text-hero">
            {registration.headline}
          </span>
        </h2>

        <p data-register-fade className="mt-10 max-w-xl text-lg leading-relaxed font-light text-muted opacity-0">
          {registration.note}
        </p>

        <div data-register-fade className="mt-12 opacity-0">
          {isLive ? (
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-6 rounded-full bg-white py-6 pr-8 pl-10 text-near-black transition-colors duration-300 hover:bg-accent-bright hover:text-white"
            >
              <span className="display text-2xl md:text-3xl">{registration.ctaLabel}</span>
              <span
                aria-hidden="true"
                className="text-2xl transition-transform duration-300 group-hover:translate-x-2 md:text-3xl"
              >
                →
              </span>
            </a>
          ) : (
            // No dead link: until there is a form to point at, this states the
            // situation instead of inviting a click that goes nowhere.
            <p
              data-testid="register-pending"
              className="label inline-flex items-center gap-3 rounded-full border border-dashed border-white/30 px-8 py-6 text-muted"
            >
              {registration.pendingLabel}
            </p>
          )}
        </div>

        <dl data-register-fade className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 opacity-0 md:grid-cols-4">
          {registration.facts.map((fact) => (
            <div key={fact.id}>
              <dt className="label text-muted">{fact.label}</dt>
              <dd className="mt-3 font-light">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
