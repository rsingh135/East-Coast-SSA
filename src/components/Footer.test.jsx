import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Footer } from './Footer'
import { event, navSections } from '../content/conference'

describe('Footer', () => {
  it('is the page-level contentinfo landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('repeats the whole section list for anyone who reached the bottom', () => {
    render(<Footer />)
    const nav = within(screen.getByRole('navigation', { name: 'Footer' }))

    for (const section of navSections) {
      expect(nav.getByRole('link', { name: section.label })).toHaveAttribute('href', `#${section.id}`)
    }
  })

  it('offers contact and socials, with the external link made safe', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: event.email })).toHaveAttribute('href', `mailto:${event.email}`)

    const instagram = screen.getByRole('link', { name: 'Instagram' })
    expect(instagram).toHaveAttribute('href', event.instagramUrl)
    expect(instagram).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('carries the event identity and the year', () => {
    render(<Footer />)
    expect(screen.getByText(event.hostLine)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`© ${event.year}`))).toBeInTheDocument()
  })
})
