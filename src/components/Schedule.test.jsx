import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Schedule } from './Schedule'
import { schedule } from '../content/conference'

const { friday, saturday } = schedule

describe('Schedule', () => {
  beforeEach(() => {
    global.resizeObserverInstances = []
  })

  it('does not let the resize observer interrupt the pill mid-travel', async () => {
    // ResizeObserver invokes its callback the moment observe() is called. When
    // the observer was created alongside the day change, that callback landed a
    // frame into the animation and snapped the pill to its destination — the
    // travel was being cancelled, not running fast.
    const user = userEvent.setup()
    render(<Schedule />)

    const observed = global.resizeObserverInstances.length
    expect(observed).toBe(1)

    await user.click(screen.getByRole('tab', { name: saturday.label }))

    // Changing day must not spin up a fresh observer, whose initial callback
    // would immediately reposition the pill.
    expect(global.resizeObserverInstances).toHaveLength(observed)
  })

  it('still repositions the pill on a real resize', async () => {
    const user = userEvent.setup()
    render(<Schedule />)

    const [observer] = global.resizeObserverInstances
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect')

    observer.trigger() // a genuine resize, not the initial observe callback
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    await user.click(screen.getByRole('tab', { name: saturday.label }))
  })

  it('opens on Friday, the day people arrive', () => {
    render(<Schedule />)
    expect(screen.getByRole('tab', { name: friday.label })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(friday.dateLine)
  })

  it('lists every item of the selected day and none of the other', async () => {
    const user = userEvent.setup()
    render(<Schedule />)

    const panel = () => screen.getByRole('tabpanel')
    for (const item of friday.items) {
      expect(within(panel()).getByRole('heading', { name: item.title })).toBeInTheDocument()
    }
    expect(within(panel()).queryByRole('heading', { name: saturday.items[1].title })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: saturday.label }))
    for (const item of saturday.items) {
      expect(within(panel()).getByRole('heading', { name: item.title })).toBeInTheDocument()
    }
  })

  it('swaps the heading and the day note with the day', async () => {
    const user = userEvent.setup()
    render(<Schedule />)

    await user.click(screen.getByRole('tab', { name: saturday.label }))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(saturday.dateLine)
    expect(screen.getByText(saturday.note)).toBeInTheDocument()
  })

  it('moves between days with the arrow keys and follows with focus', async () => {
    const user = userEvent.setup()
    render(<Schedule />)

    screen.getByRole('tab', { name: friday.label }).focus()
    await user.keyboard('{ArrowRight}')

    const saturdayTab = screen.getByRole('tab', { name: saturday.label })
    expect(saturdayTab).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(saturdayTab)

    // Wraps back around rather than dead-ending.
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: friday.label })).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps only the selected tab in the tab order', () => {
    render(<Schedule />)
    expect(screen.getByRole('tab', { name: friday.label })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: saturday.label })).toHaveAttribute('tabindex', '-1')
  })

  it('masks the date so it slides in rather than blinking on a day change', () => {
    render(<Schedule />)
    const headline = document.querySelector('[data-schedule-headline]')
    expect(headline).not.toBeNull()
    expect(headline.parentElement.className).toContain('line-mask')
  })

  it('carries one moving pill rather than a background per tab', () => {
    render(<Schedule />)

    // The pill is the only white surface; if it ever failed to render, the
    // active tab's dark label would sit on a black bar.
    const thumb = screen.getByTestId('schedule-thumb')
    expect(thumb).toHaveAttribute('aria-hidden', 'true')
    expect(thumb.className).toContain('from-white')

    for (const day of [friday, saturday]) {
      expect(screen.getByRole('tab', { name: day.label }).className).not.toMatch(/\bbg-\w/)
    }
  })

  it('labels the panel with its tab', () => {
    render(<Schedule />)
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', `tab-${friday.id}`)
  })

  it('shows a time and a location for every item', () => {
    render(<Schedule />)
    const rows = screen.getByRole('tabpanel').querySelectorAll('[data-schedule-row]')
    expect(rows).toHaveLength(friday.items.length)
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(friday.items[index].time)
      expect(row).toHaveTextContent(friday.items[index].location)
    })
  })
})
