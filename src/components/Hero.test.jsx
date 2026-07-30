import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { event } from '../content/conference'

function mockReducedMotion(reduce) {
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('reduced-motion') ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))
}

describe('Hero', () => {
  const originalMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('names the conference once for assistive tech, then sets it oversized', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAccessibleName(event.name)
    for (const line of event.wordmarkLines) {
      expect(heading).toHaveTextContent(line)
    }
  })

  it('masks each wordmark line so it can slide up independently', () => {
    render(<Hero />)
    const lines = document.querySelectorAll('[data-hero-line]')
    expect(lines).toHaveLength(event.wordmarkLines.length)
    for (const line of lines) {
      expect(line.parentElement.className).toContain('line-mask')
    }
  })

  it('never lets a wordmark line wrap inside its mask', () => {
    // A wrap inside an overflow-hidden mask gets clipped instead of flowing,
    // and any width cap in `ch` on the heading resolves against the heading's
    // own 16px font-size — which is what clipped it the first time round.
    render(<Hero />)
    for (const line of document.querySelectorAll('[data-hero-line]')) {
      expect(line.className).toContain('whitespace-nowrap')
    }
    expect(screen.getByRole('heading', { level: 1 }).className).not.toMatch(/max-w-\[\d+ch\]/)
  })

  it('carries the event metadata the frame does not', () => {
    render(<Hero />)
    expect(screen.getByText(event.dates)).toBeInTheDocument()
    expect(screen.getByText(event.city)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(event.hostSchool))).toBeInTheDocument()
  })

  it('sends the CTA to the registration section', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '#register')
  })

  it('leaves the media decorative and out of the tab order', () => {
    render(<Hero />)
    const media = screen.getByTestId('hero-media')
    expect(media).toHaveAttribute('poster')
    expect(media.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('reveals everything immediately under reduced motion', () => {
    mockReducedMotion(true)
    render(<Hero />)

    // Lines, metadata and media all start hidden in markup, so all three have
    // to be shown when the entrance animation is skipped.
    const revealed = [
      ...document.querySelectorAll('[data-hero-line]'),
      ...document.querySelectorAll('[data-hero-meta]'),
      screen.getByTestId('hero-media'),
    ]
    for (const element of revealed) {
      expect(element.style.opacity).toBe('1')
      expect(element.style.transform ?? '').not.toContain('110%')
    }
  })
})
