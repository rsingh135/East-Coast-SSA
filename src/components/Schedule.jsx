import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { gsap } from '../lib/gsap'
import { schedule } from '../content/conference'

/**
 * Two-day programme behind a FRI / SAT toggle. Friday is the short arrival
 * evening, Saturday is the full day, so they are separate panels rather than
 * one long list.
 *
 * The toggle is a real tablist: arrow keys move between days, and each panel
 * is labelled by its tab.
 */
export function Schedule() {
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const tabsRef = useRef({})
  const thumbRef = useRef(null)
  // Live edge positions of the pill, tweened independently of each other.
  const edgesRef = useRef({ left: 0, right: 0, placed: false })
  const days = useMemo(() => [schedule.friday, schedule.saturday], [])
  const [dayId, setDayId] = useState(days[0].id)

  const activeIndex = days.findIndex((day) => day.id === dayId)
  const active = days[activeIndex]

  const onTabKeyDown = (keyEvent) => {
    const delta = keyEvent.key === 'ArrowRight' ? 1 : keyEvent.key === 'ArrowLeft' ? -1 : 0
    if (delta === 0) return

    keyEvent.preventDefault()
    const next = days[(activeIndex + delta + days.length) % days.length]
    setDayId(next.id)
    // Follow the selection with focus, as a tablist is expected to.
    keyEvent.currentTarget.querySelector(`#tab-${next.id}`)?.focus()
  }

  /**
   * Moves the pill under the selected tab.
   *
   * The two edges are animated independently: the edge leading the direction of
   * travel arrives first and the trailing edge follows, so the pill elongates
   * across the gap and contracts once it lands. That stretch is the liquid part
   * — scaling the whole pill instead just distorts both edges symmetrically and
   * reads as a wobble.
   */
  const moveThumb = useCallback((animate) => {
    const thumb = thumbRef.current
    const target = tabsRef.current[dayId]
    const container = thumb?.parentElement
    if (!thumb || !target || !container) return

    // Measured from rects rather than offsetLeft, so the border and padding on
    // the container cannot shift the pill off its tab.
    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const borderLeft = parseFloat(getComputedStyle(container).borderLeftWidth) || 0
    const left = targetRect.left - containerRect.left - borderLeft
    const width = targetRect.width

    // jsdom and pre-layout paints report zero; nothing meaningful to place yet.
    if (width === 0) return

    const edges = edgesRef.current
    // Interrupting mid-travel continues from where the pill actually is.
    // The pill itself is killed too, or a stale scaleY tween keeps squashing
    // after the position has already snapped.
    gsap.killTweensOf(edges)
    gsap.killTweensOf(thumb)

    // Only x and width here — scaleY is tweened separately and must survive.
    const draw = () => gsap.set(thumb, { x: edges.left, width: Math.max(0, edges.right - edges.left) })

    if (!animate || !edges.placed) {
      edges.left = left
      edges.right = left + width
      edges.placed = true
      draw()
      gsap.set(thumb, { scaleY: 1 })
      return
    }

    const movingRight = left > edges.left
    const LEAD = 0.28 // edge facing the destination: leaves fast, arrives early
    const TRAIL = 0.6 // edge left behind: lags, which is what stretches the pill

    gsap
      .timeline({ onUpdate: draw })
      .to(edges, { left, duration: movingRight ? TRAIL : LEAD, ease: 'power2.inOut' }, 0)
      .to(edges, { right: left + width, duration: movingRight ? LEAD : TRAIL, ease: 'power2.out' }, 0)
      // Volume preservation: as the pill stretches wide it thins vertically,
      // then rebounds. Without this the stretch reads as a flat smear.
      .to(thumb, { scaleY: 0.82, duration: 0.16, ease: 'power2.out' }, 0)
      .to(thumb, { scaleY: 1, duration: 0.48, ease: 'elastic.out(1, 0.45)' }, 0.2)
  }, [dayId])

  const reducedMotion = useGsapEntrance(
    rootRef,
    (entranceGsap, timeline, isReduced) => {
      const reveal = '[data-schedule-reveal]'

      if (isReduced) {
        entranceGsap.set(reveal, { y: 0, opacity: 1 })
        return
      }

      timeline.fromTo(
        reveal,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
      )
    },
    { scroll: true },
  )

  // Place the pill before first paint, then animate it on every day change.
  const isFirstThumbPlacement = useRef(true)
  useLayoutEffect(() => {
    moveThumb(!isFirstThumbPlacement.current && !reducedMotion)
    isFirstThumbPlacement.current = false
  }, [moveThumb, reducedMotion])

  // Kept out of the effect above on purpose. ResizeObserver invokes its
  // callback immediately on observe(), so recreating it per day change fired a
  // snap-to-position one frame into the travel and killed the animation.
  // Mounted once, and the first callback — the one observe() triggers — is
  // ignored.
  const moveThumbRef = useRef(moveThumb)
  useLayoutEffect(() => {
    moveThumbRef.current = moveThumb
  })

  useEffect(() => {
    const container = thumbRef.current?.parentElement
    if (!container || typeof ResizeObserver === 'undefined') return undefined

    let isInitialCallback = true
    const observer = new ResizeObserver(() => {
      if (isInitialCallback) {
        isInitialCallback = false
        return
      }
      moveThumbRef.current(false)
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  // Re-enter the whole panel whenever the day changes: the heading climbs out
  // of its mask, the rows follow underneath it. Skipped on mount so it does not
  // race the scroll entrance above.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return undefined
    }
    if (reducedMotion) return undefined

    const root = rootRef.current
    const list = listRef.current
    if (!root || !list) return undefined

    const headline = root.querySelector('[data-schedule-headline]')
    const note = root.querySelector('[data-schedule-note]')
    const rows = list.querySelectorAll('[data-schedule-row]')

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (headline) timeline.fromTo(headline, { yPercent: 105 }, { yPercent: 0, duration: 0.85 }, 0)
      if (note) timeline.fromTo(note, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
      if (rows.length > 0) {
        timeline.fromTo(rows, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.15)
      }
    }, root)

    return () => context.revert()
  }, [dayId, reducedMotion])

  return (
    <Section
      id="schedule"
      bg="ink"
      frame="schedule"
      ref={rootRef}
      className="px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div data-schedule-reveal className="flex flex-wrap items-end justify-between gap-6 opacity-0">
          <div>
            <p className="label text-muted">Schedule</p>

            {/* Masked so the date slides in on a day change rather than
                blinking; padding clears the descenders inside the clip. */}
            <h2 className="line-mask mt-4 -mb-[0.15em]">
              <span data-schedule-headline className="display block pb-[0.15em] text-display">
                {active.dateLine}
              </span>
            </h2>

            <p data-schedule-note className="mt-4 max-w-md font-light text-muted">
              {active.note}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Conference day"
            onKeyDown={onTabKeyDown}
            // Recessed track: the inner shadow gives the pill something to sit
            // inside, which is what sells the depth.
            className="relative flex rounded-full border border-white/15 bg-white/5 p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.55)]"
          >
            {/* The moving pill. Sits behind the labels; the buttons themselves
                carry no background, so only one surface ever moves. */}
            <span
              ref={thumbRef}
              data-testid="schedule-thumb"
              aria-hidden="true"
              // Soft-3D surface: a top-lit gradient, a bright inner edge and a
              // cast shadow, so the pill reads as an object moving over the
              // track rather than a flat block of colour.
              // w-1/2 is the two-tab fallback if measurement never runs: the
              // active label is dark, so the pill must never be missing.
              className="absolute top-1 bottom-1 left-0 w-1/2 rounded-full bg-gradient-to-b from-white to-[#d8d8d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.45)]"
            />

            {days.map((day) => {
              const isActive = day.id === dayId

              return (
                <button
                  key={day.id}
                  id={`tab-${day.id}`}
                  ref={(element) => {
                    tabsRef.current[day.id] = element
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${day.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setDayId(day.id)}
                  className={`label relative z-10 rounded-full px-7 py-3 transition-colors duration-300 ease-out ${
                    isActive ? 'text-near-black' : 'text-muted hover:text-white'
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </div>

        <div
          ref={listRef}
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          data-schedule-reveal
          className="mt-14 opacity-0"
        >
          {active.items.map((item) => (
            <article
              key={`${active.id}-${item.time}-${item.title}`}
              data-schedule-row
              // items-center, not items-baseline: the columns are wildly
              // different sizes, and the right column can run to two lines, so
              // baselines leave the row looking ragged.
              className="group grid grid-cols-1 gap-2 border-t border-white/10 py-6 transition-colors duration-300 hover:border-white/40 md:grid-cols-[8rem_1fr_18rem] md:items-center md:gap-8"
            >
              <p className="label text-muted transition-colors duration-300 group-hover:text-accent-bright">
                {item.time}
              </p>

              <h3 className="display text-display-sm">{item.title}</h3>

              <div className="md:text-right">
                <p className="label text-muted">{item.location}</p>
                {item.detail ? <p className="mt-2 text-sm font-light text-muted">{item.detail}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
