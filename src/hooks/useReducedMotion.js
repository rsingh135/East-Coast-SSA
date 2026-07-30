import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * True when the OS asks for reduced motion. Every GSAP timeline in the app
 * checks this and jumps straight to its final state instead of animating.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
