import { describe, it, expect } from 'vitest'
import {
  agenda,
  event,
  frameLabels,
  navSections,
  speakers,
  schedule,
  registration,
  partners,
  faq,
  gallery,
} from './conference'

// The content file is edited by non-engineers every year. These tests catch a
// broken shape before it reaches a component that silently renders nothing.

describe('event', () => {
  it('exposes the fields the hero and nav frame read', () => {
    expect(event.name).toBeTruthy()
    expect(event.shortName).toBeTruthy()
    expect(event.datePill).toMatch(/\d{4}$/)
    expect(event.registerUrl).toBeTruthy()
  })
})

describe('images', () => {
  it('never points at a third-party host', () => {
    // A blocked or down remote image renders as a broken one, which the browser
    // draws with its own border. Every source is a data URI or a local file.
    const sources = [
      ...speakers.map((speaker) => speaker.image),
      ...agenda.segments.filter((segment) => segment.media).map((segment) => segment.media.src),
      ...partners.hosts.map((host) => host.logo),
      ...partners.sponsors.map((sponsor) => sponsor.logo),
      ...gallery.map((image) => image.src),
    ].filter(Boolean)

    expect(sources.length).toBeGreaterThan(0)
    for (const src of sources) {
      expect(src.startsWith('data:image/svg+xml,') || src.startsWith('/')).toBe(true)
    }
  })

  it('gives a partner without a logo something to render instead', () => {
    // The card falls back to type; an entry with neither would render empty.
    for (const partner of [...partners.hosts, ...partners.sponsors]) {
      expect(Boolean(partner.logo) || Boolean(partner.wordmark) || Boolean(partner.name)).toBe(true)
    }
  })
})

describe('collections', () => {
  it('gives every entry a unique id', () => {
    const groups = [speakers, registration.facts, faq, gallery, partners.hosts, partners.sponsors]
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

  it('gives the registration call to action both a live and a pending label', () => {
    expect(registration.ctaLabel).toBeTruthy()
    expect(registration.pendingLabel).toBeTruthy()
    for (const fact of registration.facts) {
      expect(fact.label).toBeTruthy()
      expect(fact.value).toBeTruthy()
    }
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

  it('captions any thumbnail a keyword carries', () => {
    const keywords = agenda.segments.filter((segment) => segment.keyword)
    expect(keywords.length).toBeGreaterThan(0)
    for (const segment of keywords.filter((keyword) => keyword.media)) {
      expect(segment.media.src).toBeTruthy()
      expect(segment.media.alt).toBeTruthy()
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
