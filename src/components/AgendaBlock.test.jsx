import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgendaBlock, KeywordBadge } from './AgendaBlock'
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
const media = { src: '/photos/mentors.jpg', alt: 'Students talking with a mentor' }

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

  it('keeps a keyword without media as plain emphasis, with no focus stop', () => {
    render(<KeywordBadge keyword="langar" />)
    const keyword = screen.getByText('langar')
    expect(keyword).not.toHaveAttribute('tabindex')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('gives a keyword with media a thumbnail with real alt text', () => {
    render(<KeywordBadge keyword="mentors" media={media} />)
    expect(screen.getByAltText(media.alt)).toHaveAttribute('src', media.src)
  })

  it('keeps the thumbnail out of the text flow so revealing it cannot reflow the sentence', () => {
    render(<KeywordBadge keyword="mentors" media={media} />)
    const badge = screen.getByTestId('badge-mentors')
    expect(badge.className).toContain('absolute')
    expect(badge.className).toContain('pointer-events-none')
  })

  it('makes a thumbnail keyword reachable by keyboard, not hover only', () => {
    render(<KeywordBadge keyword="mentors" media={media} />)
    const wrapper = screen.getByTestId('badge-mentors').parentElement
    expect(wrapper).toHaveAttribute('tabindex', '0')
    expect(wrapper.className).toContain('group')
  })

  it('renders every keyword in the content, with or without media', () => {
    render(<AgendaBlock />)
    for (const segment of keywordSegments) {
      expect(screen.getByText(segment.keyword)).toBeInTheDocument()
      if (segment.media) expect(screen.getByAltText(segment.media.alt)).toBeInTheDocument()
    }
  })

  it('cues the way to the next section', () => {
    render(<AgendaBlock />)
    expect(screen.getByRole('link', { name: new RegExp(agenda.cue.label, 'i') })).toHaveAttribute('href', agenda.cue.href)
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
