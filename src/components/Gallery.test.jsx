import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Gallery } from './Gallery'
import { gallery } from '../content/conference'

describe('Gallery', () => {
  it('shows every photograph, each with its own alt text', () => {
    render(<Gallery />)
    for (const image of gallery) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument()
    }
  })

  it('spreads the photographs across the columns without dropping any', () => {
    // Round-robin, so a column can never be hidden or emptied at a breakpoint
    // and take photographs with it.
    render(<Gallery />)

    const columns = [...document.querySelectorAll('[data-gallery-column]')]
    const total = columns.reduce((count, column) => count + column.querySelectorAll('img').length, 0)
    expect(total).toBe(gallery.length)

    for (const column of columns) {
      expect(column.querySelectorAll('img').length).toBeGreaterThan(0)
      expect(column.className).not.toContain('hidden')
    }
  })

  it('never leaves a column holding fewer than half of what its neighbours do', () => {
    // Three columns need six photographs to fill; below that the layout drops
    // to two, or the last column reads as a gap rather than a composition.
    render(<Gallery />)

    const counts = [...document.querySelectorAll('[data-gallery-column]')].map(
      (column) => column.querySelectorAll('img').length,
    )
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1)
  })

  it('reserves each photograph its space before it loads', () => {
    // Without intrinsic dimensions a lazily-loaded grid collapses to nothing
    // and shoves the page down as each photograph arrives.
    render(<Gallery />)
    for (const image of gallery) {
      const rendered = screen.getByAltText(image.alt)
      expect(rendered).toHaveAttribute('width', String(image.width))
      expect(rendered).toHaveAttribute('height', String(image.height))
    }
  })

  it('lazy-loads the photographs, since they sit near the bottom of the page', () => {
    render(<Gallery />)
    for (const image of gallery) {
      expect(screen.getByAltText(image.alt)).toHaveAttribute('loading', 'lazy')
    }
  })
})
