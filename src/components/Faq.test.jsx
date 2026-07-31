import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Faq } from './Faq'
import { faq } from '../content/conference'

const [first, second] = faq

describe('Faq', () => {
  it('lists every question', () => {
    render(<Faq />)
    for (const item of faq) {
      expect(screen.getByRole('button', { name: new RegExp(item.q, 'i') })).toBeInTheDocument()
    }
  })

  it('opens the first question so the section is never a wall of closed rows', () => {
    render(<Faq />)
    expect(screen.getByRole('button', { name: new RegExp(first.q, 'i') })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: new RegExp(second.q, 'i') })).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps only one question open at a time', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(screen.getByRole('button', { name: new RegExp(second.q, 'i') }))
    expect(screen.getByRole('button', { name: new RegExp(second.q, 'i') })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: new RegExp(first.q, 'i') })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the open question when it is clicked again', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const trigger = screen.getByRole('button', { name: new RegExp(first.q, 'i') })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('wires each trigger to its own panel, both ways', () => {
    render(<Faq />)
    for (const item of faq) {
      const trigger = screen.getByRole('button', { name: new RegExp(item.q, 'i') })
      const panel = document.getElementById(`faq-panel-${item.id}`)

      expect(trigger).toHaveAttribute('aria-controls', `faq-panel-${item.id}`)
      expect(panel).toHaveAttribute('aria-labelledby', `faq-trigger-${item.id}`)
      expect(panel).toHaveTextContent(item.a)
    }
  })

  it('marks collapsed answers inert so they stay out of the tab order', async () => {
    // The panel stays in the DOM for the open animation, so it has to be made
    // inert instead — otherwise there is invisible content to tab through.
    const user = userEvent.setup()
    render(<Faq />)

    expect(document.getElementById(`faq-panel-${first.id}`).hasAttribute('inert')).toBe(false)
    expect(document.getElementById(`faq-panel-${second.id}`).hasAttribute('inert')).toBe(true)

    await user.click(screen.getByRole('button', { name: new RegExp(second.q, 'i') }))
    expect(document.getElementById(`faq-panel-${second.id}`).hasAttribute('inert')).toBe(false)
  })
})
