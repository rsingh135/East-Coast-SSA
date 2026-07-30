import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/**
 * Tracks which `<section data-frame data-bg>` currently owns the viewport
 * centre, so the nav frame knows what label to show and whether to invert.
 *
 * Returns `{ frameKey, theme }`. Purely observational — no DOM writes.
 */
export function useSectionFrame(fallbackKey = 'hero') {
  const [state, setState] = useState({ frameKey: fallbackKey, theme: 'ink' })

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[data-frame]'))
    if (sections.length === 0) return undefined

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        // Sections are contiguous, so exactly one can straddle the centre line.
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (!self.isActive) return
          setState({
            frameKey: section.dataset.frame,
            theme: section.dataset.bg === 'paper' ? 'paper' : 'ink',
          })
        },
      }),
    )

    ScrollTrigger.refresh()
    return () => triggers.forEach((trigger) => trigger.kill())
  }, [])

  return state
}
