import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('publishes the bg and frame contract the nav frame reads', () => {
    render(
      <Section id="speakers" bg="paper" frame="speakers">
        content
      </Section>,
    )
    const section = screen.getByText('content')
    expect(section).toHaveAttribute('data-bg', 'paper')
    expect(section).toHaveAttribute('data-frame', 'speakers')
  })

  it('defaults to an ink background and falls back to the id for the frame key', () => {
    render(<Section id="hero">content</Section>)
    const section = screen.getByText('content')
    expect(section).toHaveAttribute('data-bg', 'ink')
    expect(section).toHaveAttribute('data-frame', 'hero')
  })
})
