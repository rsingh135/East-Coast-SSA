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

  it('sets the logo as the heading, named once for assistive tech', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAccessibleName(event.name)
    expect(screen.getByRole('img', { name: event.name })).toBeInTheDocument()
  })

  it('masks the logo so it can slide up into place', () => {
    render(<Hero />)
    const lines = document.querySelectorAll('[data-hero-line]')
    expect(lines).toHaveLength(1)
    expect(lines[0].parentElement.className).toContain('line-mask')
  })

  it('carries the event metadata the frame does not', () => {
    render(<Hero />)
    expect(screen.getByText(event.dates)).toBeInTheDocument()
    expect(screen.getByText(event.city)).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(event.cityShort)).length).toBeGreaterThan(0)
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

  it('plays the film once, starting from its first frame', () => {
    mockReducedMotion(false)
    render(<Hero />)
    const media = screen.getByTestId('hero-media')
    // No loop: a video that ends without looping holds its last frame.
    expect(media).not.toHaveAttribute('loop')
    expect(media.autoplay).toBe(true)
    expect(media).toHaveAttribute('poster', '/hero-poster.jpg')
  })

  it('shows the final frame as a still under reduced motion', () => {
    mockReducedMotion(true)
    render(<Hero />)
    const media = screen.getByTestId('hero-media')
    expect(media.autoplay).toBe(false)
    expect(media).toHaveAttribute('poster', '/hero-final.jpg')
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
