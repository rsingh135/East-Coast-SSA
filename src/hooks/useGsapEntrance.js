import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from './useReducedMotion'

/**
 * Runs one GSAP timeline scoped to a section, cleaned up on unmount.
 *
 * The builder receives `(gsap, timeline, reducedMotion)`. Every caller is
 * expected to branch on `reducedMotion` and set its final state directly —
 * that way the section is always fully visible, animated or not.
 *
 * Pass `{ scroll: true }` to fire the timeline when the section scrolls in
 * rather than on mount.
 */
export function useGsapEntrance(ref, build, { scroll = false, start = 'top 75%' } = {}) {
  const reducedMotion = useReducedMotion()

  // Keep the latest builder without making it an effect dependency, so an
  // inline arrow at the call site doesn't rebuild the timeline every render.
  // Synced in its own effect — declared first, so it runs before the timeline
  // effect below on every commit, including mount.
  const buildRef = useRef(build)
  useLayoutEffect(() => {
    buildRef.current = build
  })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const context = gsap.context(() => {
      // Under reduced motion there is nothing to trigger — the builder just
      // sets end state, so a plain timeline is enough.
      const timeline = gsap.timeline(
        scroll && !reducedMotion ? { scrollTrigger: { trigger: element, start, once: true } } : {},
      )
      buildRef.current(gsap, timeline, reducedMotion)
    }, element)

    return () => context.revert()
  }, [ref, reducedMotion, scroll, start])

  return reducedMotion
}
