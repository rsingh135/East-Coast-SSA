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

    const columns = [0, 1, 2].map((index) => screen.getByTestId(`gallery-column-${index}`))
    const total = columns.reduce((count, column) => count + column.querySelectorAll('img').length, 0)
    expect(total).toBe(gallery.length)

    for (const column of columns) {
      expect(column.querySelectorAll('img').length).toBeGreaterThan(0)
      expect(column.className).not.toContain('hidden')
    }
  })

  it('lazy-loads the photographs, since they sit near the bottom of the page', () => {
    render(<Gallery />)
    for (const image of gallery) {
      expect(screen.getByAltText(image.alt)).toHaveAttribute('loading', 'lazy')
    }
  })
})
