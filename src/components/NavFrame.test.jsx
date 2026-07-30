import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavFrame } from './NavFrame'
import { event, frameLabels, navSections } from '../content/conference'

describe('NavFrame', () => {
  it('shows the label for the section that owns the viewport', () => {
    const { rerender } = render(<NavFrame frameKey="hero" theme="ink" />)
    expect(screen.getByTestId('frame-status')).toHaveTextContent(frameLabels.hero)

    rerender(<NavFrame frameKey="speakers" theme="paper" />)
    expect(screen.getByTestId('frame-status')).toHaveTextContent(frameLabels.speakers)
  })

  it('falls back to the hero label for an unknown section key', () => {
    render(<NavFrame frameKey="nonexistent" theme="ink" />)
    expect(screen.getByTestId('frame-status')).toHaveTextContent(frameLabels.hero)
  })

  it('inverts the bars over a light section', () => {
    const { rerender } = render(<NavFrame frameKey="hero" theme="ink" />)
    expect(screen.getByRole('banner').className).toContain('text-white')

    rerender(<NavFrame frameKey="speakers" theme="paper" />)
    expect(screen.getByRole('banner').className).toContain('text-near-black')
  })

  it('always renders the date pill and register link', () => {
    render(<NavFrame />)
    expect(screen.getByText(event.datePill)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '#register')
  })

  it('opens the menu overlay and closes it again from the same control', async () => {
    const user = userEvent.setup()
    render(<NavFrame />)
    const trigger = screen.getByRole('button', { name: 'Menu' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the overlay dark even while sitting over a light section', async () => {
    const user = userEvent.setup()
    render(<NavFrame frameKey="speakers" theme="paper" />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('banner').className).toContain('text-white')
  })

  it('links the overlay to every section in the page order', async () => {
    const user = userEvent.setup()
    render(<NavFrame />)
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const overlay = within(screen.getByRole('dialog'))

    for (const section of navSections) {
      expect(overlay.getByRole('link', { name: new RegExp(section.label, 'i') })).toHaveAttribute(
        'href',
        `#${section.id}`,
      )
    }
  })
})
