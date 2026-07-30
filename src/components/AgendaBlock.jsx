import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { agenda } from '../content/conference'

/**
 * An emphasised phrase that carries a thumbnail. The thumbnail is absolutely
 * positioned, so revealing it never reflows the sentence around it.
 *
 * Focusable, so the reveal is reachable by keyboard and not hover-only.
 */
function KeywordBadge({ keyword, media }) {
  return (
    <span className="group relative inline-block" tabIndex={0} data-cursor="hover">
      <span className="border-b border-white/30 text-white transition-colors duration-300 group-hover:border-accent-bright group-hover:text-accent-bright group-focus-visible:border-accent-bright group-focus-visible:text-accent-bright">
        {keyword}
      </span>

      <span
        data-testid={`badge-${keyword}`}
        className="pointer-events-none absolute -top-3 left-1/2 z-20 block w-36 -translate-x-1/2 -translate-y-full scale-90 opacity-0 transition duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
      >
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="h-24 w-36 -rotate-3 rounded-xl object-cover shadow-2xl shadow-black/60"
        />
      </span>
    </span>
  )
}

/**
 * The opening statement: one centred paragraph on black, with a few phrases
 * that reveal a thumbnail, and a cue down to the lineup.
 */
export function AgendaBlock() {
  const rootRef = useRef(null)

  useGsapEntrance(
    rootRef,
    (gsap, timeline, reducedMotion) => {
      const reveal = '[data-agenda-reveal]'

      if (reducedMotion) {
        gsap.set(reveal, { y: 0, opacity: 1 })
        return
      }

      timeline.fromTo(reveal, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out' })

      // Standing pulse on the scroll cue, independent of the entrance.
      gsap.to('[data-agenda-arrow]', {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: 'sine.inOut',
      })
    },
    { scroll: true },
  )

  return (
    <Section
      id="agenda"
      bg="ink"
      frame="agenda"
      ref={rootRef}
      className="flex min-h-svh flex-col items-center justify-center gap-14 px-6 py-32 text-center"
    >
      <p data-agenda-reveal className="label text-muted opacity-0">
        {agenda.eyebrow}
      </p>

      <p
        data-agenda-reveal
        data-testid="agenda-copy"
        className="max-w-4xl text-xl leading-[1.35] font-light text-muted opacity-0 md:text-3xl md:leading-[1.3]"
      >
        {agenda.segments.map((segment, index) =>
          segment.keyword ? (
            <KeywordBadge key={segment.keyword} keyword={segment.keyword} media={segment.media} />
          ) : (
            // Plain copy has no natural key; its position in the paragraph is its identity.
            <span key={`text-${index}`}>{segment.text}</span>
          ),
        )}
      </p>

      <a
        data-agenda-reveal
        href="#speakers"
        className="label group flex flex-col items-center gap-3 text-muted opacity-0 transition-colors duration-300 hover:text-white"
      >
        {agenda.cue}
        <span data-agenda-arrow className="text-base" aria-hidden="true">
          ↓
        </span>
      </a>
    </Section>
  )
}
