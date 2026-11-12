import { useEffect, useMemo, useRef } from 'react'
import { Section } from './Section'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { gallery } from '../content/conference'

const MAX_COLUMNS = 3
// Each column drifts at its own rate; the middle one runs against the others.
const COLUMN_DRIFT = [-60, 40, -100]

/**
 * Three columns need six photographs to fill evenly. With fewer, one column
 * ends up holding a single frame against two in each of its neighbours, and
 * reads as a gap rather than a composition — so the archive drops to two.
 */
const COLUMN_COUNT = gallery.length >= MAX_COLUMNS * 2 ? MAX_COLUMNS : 2

// The grid is two-up on mobile whatever the column count. At three columns the
// last one wraps onto a row of its own, so it spans both — hiding it would
// drop photographs.
const GRID_COLUMNS = COLUMN_COUNT === MAX_COLUMNS ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
const WRAPPED_COLUMN = COLUMN_COUNT === MAX_COLUMNS ? 'col-span-2 md:col-span-1' : ''

/**
 * Photographs from previous years, in columns that drift at different rates as
 * the section passes. Deliberately the quietest section on the page.
 */
export function Gallery() {
  const rootRef = useRef(null)
  const reducedMotion = useReducedMotion()

  // Round-robin rather than chunking, so the columns stay of similar height
  // whatever the aspect ratios happen to be.
  const columns = useMemo(() => {
    const buckets = Array.from({ length: COLUMN_COUNT }, () => [])
    gallery.forEach((image, index) => buckets[index % COLUMN_COUNT].push(image))
    return buckets
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return undefined

    const context = gsap.context(() => {
      for (const [index, column] of root.querySelectorAll('[data-gallery-column]').entries()) {
        gsap.fromTo(
          column,
          { y: 0 },
          {
            y: COLUMN_DRIFT[index % COLUMN_DRIFT.length],
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              // Tied to scroll position rather than played once, so the drift
              // tracks the scrollbar in both directions.
              scrub: true,
            },
          },
        )
      }
    }, root)

    return () => context.revert()
  }, [reducedMotion])

  return (
    <Section
      id="gallery"
      bg="forest"
      frame="gallery"
      ref={rootRef}
      className="overflow-hidden px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="label text-muted">Archive</p>
        <h2 className="display mt-4 text-display">Previous years</h2>

        <div className={`mt-14 grid gap-3 md:gap-4 ${GRID_COLUMNS}`}>
          {columns.map((column, index) => (
            <div
              // Columns are positional by nature; there is no id to key on.
              key={`gallery-column-${index}`}
              data-gallery-column
              data-testid={`gallery-column-${index}`}
              className={`flex flex-col gap-3 md:gap-4 ${index === COLUMN_COUNT - 1 ? WRAPPED_COLUMN : ''}`}
            >
              {column.map((image) => (
                <figure key={image.id} className="overflow-hidden rounded-2xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    // h-auto so the intrinsic size only reserves space; the
                    // width attribute must not fight the column's own width.
                    // Full colour. The hover is a slow push-in, held inside the
                    // figure's rounded clip, so the frame itself never moves.
                    className="h-auto w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.04]"
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
