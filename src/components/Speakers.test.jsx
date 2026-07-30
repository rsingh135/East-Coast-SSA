import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Speakers } from './Speakers'
import { speakers } from '../content/conference'

const first = speakers[0]
const second = speakers[1]
const last = speakers.at(-1)
const cardCount = speakers.length + 1 // + the "more announced soon" card

describe('Speakers', () => {
  it('announces changes from a live region that survives them', async () => {
    // A live region that is itself replaced on change is never announced, so
    // the region has to be the stable wrapper, not the keyed child.
    const user = userEvent.setup()
    render(<Speakers />)

    const live = screen.getByTestId('speaker-details')
    expect(live).toHaveAttribute('aria-live', 'polite')

    await user.click(screen.getByRole('button', { name: 'Next speaker' }))
    expect(screen.getByTestId('speaker-details')).toBe(live)
    expect(live).toHaveTextContent(second.name)
  })

  it('masks the detail lines so they can climb in on a change', () => {
    render(<Speakers />)
    const lines = screen.getByTestId('speaker-details').querySelectorAll('[data-speaker-line]')
    expect(lines.length).toBe(3) // index, name, role
    for (const line of lines) {
      expect(line.parentElement.className).toContain('line-mask')
    }
  })

  it('opens on the first speaker and counts the pending card in the total', () => {
    render(<Speakers />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(first.name)
    expect(screen.getByTestId('speaker-counter')).toHaveTextContent(`01 / 0${cardCount}`)
  })

  it('advances and retreats with the arrow buttons', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByRole('button', { name: 'Next speaker' }))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(second.name)

    await user.click(screen.getByRole('button', { name: 'Previous speaker' }))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(first.name)
  })

  it('wraps around in both directions', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    // Back from the first card lands on the pending card at the end.
    await user.click(screen.getByRole('button', { name: 'Previous speaker' }))
    expect(screen.getByTestId('speaker-counter')).toHaveTextContent(`0${cardCount} / 0${cardCount}`)

    await user.click(screen.getByRole('button', { name: 'Next speaker' }))
    expect(screen.getByTestId('speaker-counter')).toHaveTextContent(`01 / 0${cardCount}`)
  })

  it('jumps straight to a speaker when their card is clicked', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByTestId(`speaker-card-${last.id}`))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(last.name)
    expect(screen.getByTestId(`speaker-card-${last.id}`)).toHaveAttribute('aria-current', 'true')
  })

  it('moves with the left and right arrow keys', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    const carousel = screen.getByRole('group', { name: 'Speaker carousel' })
    carousel.focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(second.name)

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(first.name)
  })

  it('gives the open card room and leaves the rest as slivers', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    const openCard = screen.getByTestId(`speaker-card-${first.id}`)
    const sliver = screen.getByTestId(`speaker-card-${second.id}`)
    expect(openCard.style.flexGrow).toBe('8')
    expect(sliver.style.flexGrow).toBe('1')

    await user.click(sliver)
    expect(sliver.style.flexGrow).toBe('8')
    expect(openCard.style.flexGrow).toBe('1')
  })

  it('expands the active profile and closes it again', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByRole('button', { name: `Expand ${first.name}'s profile` }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(first.bio)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes an expanded profile on Escape', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByRole('button', { name: `Expand ${first.name}'s profile` }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('drops the expanded profile when the speaker changes underneath it', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByRole('button', { name: `Expand ${first.name}'s profile` }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next speaker' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers nothing to expand on the pending card', async () => {
    const user = userEvent.setup()
    render(<Speakers />)

    await user.click(screen.getByRole('button', { name: 'Previous speaker' }))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/more announced soon/i)
    expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument()
  })
})
