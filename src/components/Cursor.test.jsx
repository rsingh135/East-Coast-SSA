import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Cursor } from './Cursor'

// Pointer capability and reduced motion are both media queries; drive them
// directly so each branch of the cursor is exercised.
function mockMedia({ finePointer = true, reducedMotion = false } = {}) {
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('pointer: fine') ? finePointer : reducedMotion,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))
}

function movePointer(target = document.body) {
  act(() => {
    const move = new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 60 })
    window.dispatchEvent(move)
    const over = new MouseEvent('pointerover', { bubbles: true })
    Object.defineProperty(over, 'target', { value: target })
    window.dispatchEvent(over)
  })
}

describe('Cursor', () => {
  const originalMatchMedia = window.matchMedia
  beforeEach(() => mockMedia())
  afterEach(() => {
    window.matchMedia = originalMatchMedia
    document.body.classList.remove('has-custom-cursor')
  })

  it('activates on a fine pointer and hides the native cursor', () => {
    render(<Cursor />)
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-active', 'true')
    expect(document.body.classList.contains('has-custom-cursor')).toBe(true)
  })

  it('restores the native cursor on unmount', () => {
    const { unmount } = render(<Cursor />)
    unmount()
    expect(document.body.classList.contains('has-custom-cursor')).toBe(false)
  })

  it('becomes visible once the pointer moves', () => {
    render(<Cursor />)
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-visible', 'false')
    movePointer()
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-visible', 'true')
  })

  it('enters the hover state over an interactive element and leaves it again', () => {
    const button = document.createElement('button')
    document.body.append(button)
    render(<Cursor />)

    movePointer(button)
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-hover', 'true')

    movePointer(document.body)
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-hover', 'false')
    button.remove()
  })

  it('stays inert on a coarse pointer', () => {
    mockMedia({ finePointer: false })
    render(<Cursor />)
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-active', 'false')
    expect(document.body.classList.contains('has-custom-cursor')).toBe(false)
  })

  it('renders nothing under reduced motion', () => {
    mockMedia({ reducedMotion: true })
    render(<Cursor />)
    expect(screen.queryByTestId('cursor')).not.toBeInTheDocument()
  })

  it('draws a black arrow with a white outline, anchored at its tip', () => {
    render(<Cursor />)
    const path = screen.getByTestId('cursor-arrow').querySelector('path')

    // Black on white is what keeps it legible over both the ink and paper
    // sections without relying on blend modes.
    expect(path).toHaveAttribute('fill', '#000000')
    expect(path).toHaveAttribute('stroke', '#FFFFFF')

    // Transforms have to pivot about the tip, since the tip is where the
    // pointer actually is — pivoting about the box would drift the hotspot.
    expect(screen.getByTestId('cursor-arrow').getAttribute('class')).toContain('origin-[23%_12%]')
  })
})
