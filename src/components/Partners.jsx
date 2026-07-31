import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { event, partners } from '../content/conference'

/**
 * One logo in a soft card. Renders as a link when the partner has a `url` in
 * the content file, and as a plain card otherwise — so the hover lift only
 * appears on something that actually goes somewhere.
 */
function PartnerCard({ partner }) {
  const isLink = Boolean(partner.url)
  const Tag = isLink ? 'a' : 'div'

  return (
    <Tag
      data-partner-card
      data-testid={`partner-${partner.id}`}
      {...(isLink ? { href: partner.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex items-center justify-center rounded-2xl border border-near-black/10 bg-white/70 px-6 py-8 opacity-0 transition duration-500 ease-out ${
        isLink ? 'hover:-translate-y-1 hover:border-accent-deep/40 hover:bg-white hover:shadow-lg' : ''
      }`}
    >
      <img
        src={partner.logo}
        alt={partner.name}
        loading="lazy"
        className="h-10 w-auto max-w-full object-contain opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100"
      />
    </Tag>
  )
}

function PartnerGroup({ title, items, columns }) {
  return (
    <div>
      <h3 className="label text-near-black/50">{title}</h3>
      <div className={`mt-6 grid grid-cols-2 gap-3 md:gap-4 ${columns}`}>
        {items.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  )
}

/**
 * Host chapters and sponsors, on the light half of the page.
 */
export function Partners() {
  const rootRef = useRef(null)

  useGsapEntrance(
    rootRef,
    (gsap, timeline, reducedMotion) => {
      const heading = '[data-partners-reveal]'
      const cards = '[data-partner-card]'

      if (reducedMotion) {
        gsap.set([heading, cards], { y: 0, opacity: 1 })
        return
      }

      timeline
        .fromTo(heading, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
        .fromTo(
          cards,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' },
          0.2,
        )
    },
    { scroll: true },
  )

  return (
    <Section
      id="partners"
      bg="paper"
      frame="partners"
      ref={rootRef}
      className="px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-partners-reveal className="opacity-0">
            <p className="label text-near-black/50">Partners</p>
            <h2 className="display mt-4 max-w-2xl text-display">{event.hostLine}</h2>
          </div>

          <a
            data-partners-reveal
            href={`mailto:${event.email}?subject=Sponsoring%20${encodeURIComponent(event.name)}`}
            className="label group flex w-fit items-center gap-3 rounded-full border border-near-black/25 py-3 pr-4 pl-5 opacity-0 transition-colors duration-300 hover:border-accent-deep hover:text-accent-deep"
          >
            Become a sponsor
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-12">
          <PartnerGroup title="Host chapters" items={partners.hosts} columns="md:grid-cols-3 lg:grid-cols-6" />
          <PartnerGroup title="Sponsors" items={partners.sponsors} columns="md:grid-cols-4" />
        </div>
      </div>

      {/* Persistent badge, matching the circular marks on the speaker cards. */}
      <span
        aria-hidden="true"
        className="label pointer-events-none absolute right-4 bottom-[calc(var(--frame-bar)+1.5rem)] flex size-16 items-center justify-center rounded-full bg-ink text-white md:right-8"
      >
        {event.shortName.split(' ')[0]}.
      </span>
    </Section>
  )
}
