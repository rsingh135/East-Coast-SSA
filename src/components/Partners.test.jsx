import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Partners } from './Partners'
import { event, partners, visibility } from '../content/conference'

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

const all = [...partners.hosts, ...(visibility.sponsors ? partners.sponsors : [])]

describe('Partners', () => {
  const originalMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('shows every host chapter and sponsor, named for screen readers', () => {
    render(<Partners />)
    for (const partner of all) {
      // A partner with a licensed mark is named by its alt text; one without is
      // set as a wordmark, and carries the full chapter name in a sr-only span.
      const named = partner.logo
        ? screen.getByAltText(partner.name)
        : screen.getByText(partner.name, { selector: '.sr-only' })
      expect(named).toBeInTheDocument()
    }
  })

  it('sets an unlicensed partner as a wordmark rather than a stand-in image', () => {
    // A grey placeholder box reads as a logo that failed to load. Type does not.
    render(<Partners />)
    for (const partner of all.filter((entry) => !entry.logo)) {
      const card = screen.getByTestId(`partner-${partner.id}`)
      expect(card.querySelector('img')).toBeNull()
      expect(card).toHaveTextContent(partner.wordmark ?? partner.name)
    }
  })

  it('lists every Ivy League chapter as a host', () => {
    render(<Partners />)
    const ivies = ['Brown', 'Columbia', 'Cornell', 'Dartmouth', 'Harvard', 'Penn', 'Princeton', 'Yale']
    for (const school of ivies) {
      expect(partners.hosts.some((host) => host.name.startsWith(school))).toBe(true)
    }
    expect(partners.hosts).toHaveLength(ivies.length)
  })

  it('lists sponsors only once the content file switches them on', () => {
    render(<Partners />)
    expect(screen.getByRole('heading', { name: /host chapters/i })).toBeInTheDocument()
    const sponsorsHeading = screen.queryByRole('heading', { name: /^sponsors$/i })
    if (visibility.sponsors) expect(sponsorsHeading).toBeInTheDocument()
    else expect(sponsorsHeading).not.toBeInTheDocument()
  })

  it('sends would-be sponsors to the donation page in a new tab', () => {
    render(<Partners />)
    const link = screen.getByRole('link', { name: /become a sponsor/i })
    expect(link).toHaveAttribute('href', event.sponsorUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
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
