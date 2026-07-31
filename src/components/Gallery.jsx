import { useEffect, useMemo, useRef } from 'react'
import { Section } from './Section'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { gallery } from '../content/conference'

const COLUMN_COUNT = 3
// Each column drifts at its own rate; the middle one runs against the others.
const COLUMN_DRIFT = [-60, 40, -100]

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
      bg="ink"
      frame="gallery"
      ref={rootRef}
      className="overflow-hidden px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="label text-muted">Archive</p>
        <h2 className="display mt-4 text-display">Previous years</h2>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {columns.map((column, index) => (
            <div
              // Columns are positional by nature; there is no id to key on.
              key={`gallery-column-${index}`}
              data-gallery-column
              data-testid={`gallery-column-${index}`}
              // On the two-column layout the third column wraps to a full-width
              // row rather than being hidden — hiding it would drop photos.
              className={`flex flex-col gap-3 md:gap-4 ${index === COLUMN_COUNT - 1 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              {column.map((image) => (
                <figure key={image.id} className="overflow-hidden rounded-2xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full object-cover grayscale transition duration-700 hover:grayscale-0"
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
