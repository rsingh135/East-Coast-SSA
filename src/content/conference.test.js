import { describe, it, expect } from 'vitest'
import { agenda, event, frameLabels, navSections, speakers, schedule, tiers, partners, faq, gallery } from './conference'

// The content file is edited by non-engineers every year. These tests catch a
// broken shape before it reaches a component that silently renders nothing.

describe('event', () => {
  it('exposes the fields the hero and nav frame read', () => {
    expect(event.wordmarkLines).toHaveLength(2)
    expect(event.datePill).toMatch(/^\d{2}\/\d{2}\.\d{2}$/)
    expect(event.registerUrl).toBeTruthy()
  })
})

describe('collections', () => {
  it('gives every entry a unique id', () => {
    const groups = [speakers, tiers, faq, gallery, partners.hosts, partners.sponsors]
    for (const group of groups) {
      const ids = group.map((entry) => entry.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('keeps both schedule days populated and ordered by day', () => {
    expect(schedule.friday.items.length).toBeGreaterThan(0)
    expect(schedule.saturday.items.length).toBeGreaterThan(schedule.friday.items.length)
    for (const day of [schedule.friday, schedule.saturday]) {
      for (const item of day.items) {
        expect(item.time).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/)
        expect(item.title).toBeTruthy()
      }
    }
  })

  it('marks exactly one featured tier', () => {
    expect(tiers.filter((tier) => tier.featured)).toHaveLength(1)
  })

  it('gives every gallery image alt text', () => {
    for (const image of gallery) expect(image.alt).toBeTruthy()
  })
})

describe('agenda', () => {
  it('gives every segment either copy or a keyword, never both and never neither', () => {
    for (const segment of agenda.segments) {
      expect(Boolean(segment.text) !== Boolean(segment.keyword)).toBe(true)
    }
  })

  it('pairs every keyword with a captioned thumbnail', () => {
    const keywords = agenda.segments.filter((segment) => segment.keyword)
    expect(keywords.length).toBeGreaterThan(0)
    for (const segment of keywords) {
      expect(segment.media?.src).toBeTruthy()
      expect(segment.media?.alt).toBeTruthy()
    }
  })

  it('keeps keywords unique, since each one keys a badge', () => {
    const keywords = agenda.segments.filter((segment) => segment.keyword).map((segment) => segment.keyword)
    expect(new Set(keywords).size).toBe(keywords.length)
  })
})

describe('navigation', () => {
  it('gives every nav section a frame label', () => {
    for (const section of navSections) {
      expect(frameLabels[section.id]).toBeTruthy()
    }
  })

  it('keeps nav ids unique', () => {
    const ids = navSections.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
