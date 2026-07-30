import { useEffect, useMemo, useRef, useState } from 'react'
import { Section } from './Section'
import { SpeakerOverlay } from './SpeakerOverlay'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { gsap } from '../lib/gsap'
import { speakers } from '../content/conference'

const pad = (value) => String(value).padStart(2, '0')

/** Trailing card that stands in for the speakers we haven't announced yet. */
const PENDING_CARD = {
  id: 'pending',
  pending: true,
  name: 'More announced soon',
  role: 'Lineup in progress',
  org: '',
  badge: '+/',
}

/**
 * Speaker carousel. One card is wide and the rest collapse to slivers, so the
 * whole lineup stays on screen and the active profile still reads at size.
 *
 * Switching is driven by flex-grow rather than a translated track — nothing to
 * measure, and it reflows correctly at any width.
 */
export function Speakers() {
  const rootRef = useRef(null)
  const detailsRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const cards = useMemo(() => [...speakers, PENDING_CARD], [])
  const active = cards[index]

  const go = (delta) => {
    setIndex((current) => (current + delta + cards.length) % cards.length)
    setExpanded(false)
  }

  const onKeyDown = (keyEvent) => {
    if (keyEvent.key === 'ArrowRight') {
      keyEvent.preventDefault()
      go(1)
    }
    if (keyEvent.key === 'ArrowLeft') {
      keyEvent.preventDefault()
      go(-1)
    }
  }

  const reducedMotion = useGsapEntrance(
    rootRef,
    (timelineGsap, timeline, isReduced) => {
      const reveal = '[data-speakers-reveal]'

      if (isReduced) {
        timelineGsap.set(reveal, { y: 0, opacity: 1 })
        return
      }

      timeline.fromTo(
        reveal,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' },
      )
    },
    { scroll: true },
  )

  // Re-enter the details on every change: masked lines climb out from below,
  // the bio fades up behind them. Runs on index, not on mount — the entrance
  // above owns the first appearance.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return undefined
    }
    if (reducedMotion) return undefined

    const details = detailsRef.current
    if (!details) return undefined

    // Query the elements rather than passing selector strings: the bio is
    // absent on the pending card, and GSAP warns on a target it cannot find.
    const lines = details.querySelectorAll('[data-speaker-line]')
    const fade = details.querySelector('[data-speaker-fade]')

    const context = gsap.context(() => {
      if (lines.length > 0) {
        gsap.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 0.65, stagger: 0.07, ease: 'expo.out' })
      }
      if (fade) {
        gsap.fromTo(fade, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.12 })
      }
    }, details)

    return () => context.revert()
  }, [index, reducedMotion])

  return (
    <Section
      id="speakers"
      bg="paper"
      frame="speakers"
      ref={rootRef}
      className="flex min-h-svh items-center px-4 py-[calc(var(--frame-bar)+4rem)] md:px-8"
    >
      <SpeakerOverlay speaker={active.pending ? null : active} open={expanded} onClose={() => setExpanded(false)} />

      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
        {/* Left: who is currently selected. */}
        <div data-speakers-reveal className="flex flex-col gap-6 opacity-0">
          <p className="label text-near-black/50">Speakers</p>

          {/* The live region is the stable wrapper — a region that is itself
              replaced on every change never gets announced. */}
          <div ref={detailsRef} aria-live="polite" data-testid="speaker-details">
            <span className="line-mask">
              <span data-speaker-line className="display block text-display text-near-black/15">
                {pad(index + 1)}
              </span>
            </span>

            {/* Padding inside the mask plus a matching negative margin outside
                it: descenders clear the clip without changing the layout. */}
            <h2 className="line-mask mt-2 -mb-[0.15em]">
              <span data-speaker-line className="display block pb-[0.15em] text-display-sm">
                {active.name}
              </span>
            </h2>

            <span className="line-mask mt-4">
              <span data-speaker-line className="label block text-near-black/60">
                {active.org ? `${active.role} · ${active.org}` : active.role}
              </span>
            </span>

            {active.bio ? (
              <p data-speaker-fade className="mt-6 max-w-prose leading-relaxed font-light text-near-black/70">
                {active.bio}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous speaker"
              className="label flex size-12 items-center justify-center rounded-full border border-near-black/25 transition-colors duration-300 hover:border-accent-deep hover:text-accent-deep"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next speaker"
              className="label flex size-12 items-center justify-center rounded-full border border-near-black/25 transition-colors duration-300 hover:border-accent-deep hover:text-accent-deep"
            >
              <span aria-hidden="true">→</span>
            </button>
            <p className="label text-near-black/50" data-testid="speaker-counter">
              {pad(index + 1)} / {pad(cards.length)}
            </p>
          </div>
        </div>

        {/* Right: the whole lineup, with the selected card opened up. */}
        <div
          data-speakers-reveal
          role="group"
          aria-label="Speaker carousel"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="flex h-[55vh] gap-2 opacity-0 md:h-[70vh]"
        >
          {cards.map((card, cardIndex) => {
            const isActive = cardIndex === index

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setIndex(cardIndex)}
                aria-label={`Show ${card.name}`}
                aria-current={isActive}
                data-testid={`speaker-card-${card.id}`}
                // flex-grow is the whole animation: 8 for the open card, 1 for a sliver.
                style={{ flexGrow: isActive ? 8 : 1 }}
                className="group relative min-w-0 flex-1 basis-0 overflow-hidden rounded-2xl bg-near-black/10 transition-[flex-grow] duration-700 ease-out"
              >
                {card.pending ? (
                  <span className="label absolute inset-0 flex items-center justify-center px-2 text-center text-near-black/50">
                    {isActive ? card.name : '+'}
                  </span>
                ) : (
                  <img
                    src={card.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover object-top grayscale transition duration-700 group-hover:grayscale-0"
                  />
                )}

                {/* Badge overlaps the top-left corner of the open card only. */}
                {isActive ? (
                  <span className="label absolute top-3 left-3 flex size-14 items-center justify-center rounded-full bg-ink text-white">
                    {card.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Expand toggle sits with the cards but outside the card buttons, so it
          is never a button inside a button. */}
      {!active.pending ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Expand ${active.name}'s profile`}
          className="label absolute bottom-[calc(var(--frame-bar)+1.5rem)] left-4 flex items-center gap-3 rounded-full border border-near-black/25 bg-paper/80 py-3 pr-4 pl-5 backdrop-blur transition-colors duration-300 hover:border-accent-deep hover:text-accent-deep md:left-8"
        >
          Expand
          <span aria-hidden="true">↖</span>
        </button>
      ) : null}
    </Section>
  )
}
