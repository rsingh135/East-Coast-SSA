import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Register } from './Register'
import { registration } from '../content/conference'

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

const LIVE_URL = 'https://lu.ma/east-coast-ssa'

describe('Register', () => {
  const originalMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('opens the form in a new tab, safely, once there is a form', () => {
    render(<Register registerUrl={LIVE_URL} />)

    const cta = screen.getByRole('link', { name: new RegExp(registration.ctaLabel, 'i') })
    expect(cta).toHaveAttribute('href', LIVE_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('states the situation instead of offering a dead link', () => {
    // '#' is the placeholder in the content file. A button that goes nowhere is
    // worse than no button.
    render(<Register registerUrl="#" />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByTestId('register-pending')).toHaveTextContent(registration.pendingLabel)
  })

  it('treats an empty url as pending too', () => {
    render(<Register registerUrl="" />)
    expect(screen.getByTestId('register-pending')).toBeInTheDocument()
  })

  it('lists the practical facts as a description list', () => {
    render(<Register registerUrl={LIVE_URL} />)

    for (const fact of registration.facts) {
      expect(screen.getByText(fact.label)).toBeInTheDocument()
      expect(screen.getByText(fact.value)).toBeInTheDocument()
    }
  })

  it('carries the headline and the supporting note', () => {
    render(<Register registerUrl={LIVE_URL} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(registration.headline)
    expect(screen.getByText(registration.note)).toBeInTheDocument()
  })

  it('shows everything immediately under reduced motion', () => {
    mockReducedMotion(true)
    render(<Register registerUrl={LIVE_URL} />)

    const revealed = [
      ...document.querySelectorAll('[data-register-fade]'),
      ...document.querySelectorAll('[data-register-line]'),
    ]
    expect(revealed.length).toBeGreaterThan(0)
    for (const element of revealed) {
      expect(element.style.opacity).toBe('1')
    }
  })
})
