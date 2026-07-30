import { describe, it, expect } from 'vitest'
import { placeholderImage } from './placeholder'

describe('placeholderImage', () => {
  it('returns an inline SVG data URI, not a remote URL', () => {
    const src = placeholderImage('Speaker 01')
    expect(src.startsWith('data:image/svg+xml,')).toBe(true)
    // The only URL inside is the SVG namespace, which is an identifier rather
    // than something the browser fetches.
    const fetched = decodeURIComponent(src).match(/https?:\/\/(?!www\.w3\.org\/)/g)
    expect(fetched).toBeNull()
  })

  it('carries the label and the requested dimensions', () => {
    const svg = decodeURIComponent(placeholderImage('Langar', { width: 320, height: 200 }))
    expect(svg).toContain('width="320"')
    expect(svg).toContain('height="200"')
    expect(svg).toContain('>Langar<')
  })

  it('escapes a label that would otherwise break the SVG', () => {
    const svg = decodeURIComponent(placeholderImage('Q&A <2027>'))
    expect(svg).toContain('Q&amp;A &lt;2027&gt;')
    expect(svg).not.toContain('<2027>')
  })
})
