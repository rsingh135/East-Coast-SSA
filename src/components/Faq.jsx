import { useRef, useState } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { faq } from '../content/conference'

/**
 * One question. The panel animates on grid-template-rows rather than a measured
 * height, so it opens smoothly at any content length with nothing to measure or
 * re-measure on resize.
 */
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-t border-white/15">
      <h3>
        <button
          type="button"
          id={`faq-trigger-${item.id}`}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${item.id}`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-accent-bright"
        >
          <span className="display text-display-sm">{item.q}</span>
          <span
            aria-hidden="true"
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg transition-transform duration-500 ease-out ${
              isOpen ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>
      </h3>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {/* `inert` keeps a collapsed answer out of the tab order and away from
            screen readers while it stays in the DOM for the animation. */}
        <div
          id={`faq-panel-${item.id}`}
          role="region"
          aria-labelledby={`faq-trigger-${item.id}`}
          inert={!isOpen}
          className="overflow-hidden"
        >
          <p className="max-w-2xl pb-8 leading-relaxed font-light text-white/70">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Questions people actually ask, one open at a time.
 */
export function Faq() {
  const rootRef = useRef(null)
  const [openId, setOpenId] = useState(faq[0]?.id ?? null)

  useGsapEntrance(
    rootRef,
    (gsap, timeline, reducedMotion) => {
      const reveal = '[data-faq-reveal]'

      if (reducedMotion) {
        gsap.set(reveal, { y: 0, opacity: 1 })
        return
      }

      timeline.fromTo(
        reveal,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power2.out' },
      )
    },
    { scroll: true },
  )

  return (
    <Section id="faq" bg="ink" frame="faq" ref={rootRef} className="px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8">
      <div className="mx-auto max-w-4xl">
        <div data-faq-reveal className="opacity-0">
          <p className="label text-muted">Questions</p>
          <h2 className="display mt-4 text-display">Before you come</h2>
        </div>

        <div className="mt-14">
          {faq.map((item) => (
            <div key={item.id} data-faq-reveal className="opacity-0">
              <FaqItem
                item={item}
                isOpen={openId === item.id}
                // Clicking the open question closes it, rather than trapping
                // one panel permanently open.
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
