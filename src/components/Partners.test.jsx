import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Partners } from './Partners'
import { event, partners } from '../content/conference'

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

const all = [...partners.hosts, ...partners.sponsors]

describe('Partners', () => {
  const originalMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('shows every host chapter and sponsor, named for screen readers', () => {
    render(<Partners />)
    for (const partner of all) {
      expect(screen.getByAltText(partner.name)).toBeInTheDocument()
    }
  })

  it('separates hosts from sponsors', () => {
    render(<Partners />)
    expect(screen.getByRole('heading', { name: /host chapters/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /sponsors/i })).toBeInTheDocument()
  })

  it('offers a sponsorship contact addressed to the conference', () => {
    render(<Partners />)
    const link = screen.getByRole('link', { name: /become a sponsor/i })
    expect(link.getAttribute('href')).toContain(`mailto:${event.email}`)
    expect(link.getAttribute('href')).toContain('subject=')
  })

  it('only makes a card interactive when the partner has a link', () => {
    // Hover lift on something that goes nowhere is a false affordance, so the
    // card is a plain element until the content file gives it a `url`.
    render(<Partners />)
    for (const partner of all) {
      const card = screen.getByTestId(`partner-${partner.id}`)
      if (partner.url) {
        expect(card.tagName).toBe('A')
        expect(card.className).toContain('hover:-translate-y-1')
      } else {
        expect(card.tagName).not.toBe('A')
        expect(card.className).not.toContain('hover:-translate-y-1')
      }
    }
  })

  it('reveals the whole section immediately under reduced motion', () => {
    mockReducedMotion(true)
    render(<Partners />)

    const revealed = [
      ...document.querySelectorAll('[data-partners-reveal]'),
      ...document.querySelectorAll('[data-partner-card]'),
    ]
    expect(revealed.length).toBeGreaterThan(0)
    for (const element of revealed) {
      expect(element.style.opacity).toBe('1')
    }
  })
})
