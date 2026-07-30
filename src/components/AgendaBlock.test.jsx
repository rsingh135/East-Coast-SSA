import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgendaBlock } from './AgendaBlock'
import { agenda } from '../content/conference'

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

const keywordSegments = agenda.segments.filter((segment) => segment.keyword)

describe('AgendaBlock', () => {
  const originalMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders the statement in order, keywords included', () => {
    render(<AgendaBlock />)
    const expected = agenda.segments.map((segment) => segment.text ?? segment.keyword).join('')
    expect(screen.getByTestId('agenda-copy')).toHaveTextContent(expected.replace(/\s+/g, ' ').trim())
  })

  it('gives every keyword a thumbnail with real alt text', () => {
    render(<AgendaBlock />)
    expect(keywordSegments.length).toBeGreaterThan(0)
    for (const segment of keywordSegments) {
      expect(screen.getByAltText(segment.media.alt)).toBeInTheDocument()
    }
  })

  it('keeps the thumbnail out of the text flow so revealing it cannot reflow the sentence', () => {
    render(<AgendaBlock />)
    for (const segment of keywordSegments) {
      const badge = screen.getByTestId(`badge-${segment.keyword}`)
      expect(badge.className).toContain('absolute')
      expect(badge.className).toContain('pointer-events-none')
    }
  })

  it('makes each keyword reachable by keyboard, not hover only', () => {
    render(<AgendaBlock />)
    for (const segment of keywordSegments) {
      const wrapper = screen.getByTestId(`badge-${segment.keyword}`).parentElement
      expect(wrapper).toHaveAttribute('tabindex', '0')
      expect(wrapper.className).toContain('group')
    }
  })

  it('cues the way to the speakers section', () => {
    render(<AgendaBlock />)
    expect(screen.getByRole('link', { name: new RegExp(agenda.cue, 'i') })).toHaveAttribute('href', '#speakers')
  })

  it('shows the whole block immediately under reduced motion', () => {
    mockReducedMotion(true)
    render(<AgendaBlock />)
    const revealed = document.querySelectorAll('[data-agenda-reveal]')
    expect(revealed.length).toBeGreaterThan(0)
    for (const element of revealed) {
      expect(element.style.opacity).toBe('1')
    }
  })
})
