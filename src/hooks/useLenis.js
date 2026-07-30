import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Smooth scroll, driven by GSAP's ticker so Lenis and ScrollTrigger stay on
 * the same frame. Skipped entirely when reduced motion is requested.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    const raf = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [enabled])
}
