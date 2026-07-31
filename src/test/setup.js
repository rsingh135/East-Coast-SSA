import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

// jsdom ships neither of these, and both are load-bearing for GSAP/ScrollTrigger
// and the reduced-motion hook.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// Mirrors the real thing closely enough to matter: a live ResizeObserver
// invokes its callback once as soon as observe() is called, which is easy to
// mistake for a genuine resize. Instances are exposed so tests can fire later
// callbacks by hand.
if (!global.ResizeObserver) {
  global.resizeObserverInstances = []

  global.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback
      global.resizeObserverInstances.push(this)
    }

    observe() {
      this.callback([], this)
    }

    unobserve() {}

    disconnect() {
      global.resizeObserverInstances = global.resizeObserverInstances.filter((instance) => instance !== this)
    }

    /** Simulates an actual resize, as opposed to the initial observe callback. */
    trigger() {
      this.callback([], this)
    }
  }
}

if (!window.HTMLMediaElement.prototype.play) {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
}
