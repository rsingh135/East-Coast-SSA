import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuOverlay } from './MenuOverlay'

describe('MenuOverlay', () => {
  it('renders nothing when closed and leaves body scroll alone', () => {
    render(<MenuOverlay open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('locks body scroll while open and releases it on unmount', () => {
    const { unmount } = render(<MenuOverlay open onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('focuses the first link on open', () => {
    render(<MenuOverlay open onClose={() => {}} />)
    expect(document.activeElement).toBe(screen.getAllByRole('link')[0])
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<MenuOverlay open onClose={onClose} />)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes when a section link is followed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<MenuOverlay open onClose={onClose} />)

    await user.click(screen.getByRole('link', { name: /speakers/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
