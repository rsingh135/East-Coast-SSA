import { useRef } from 'react'
import { Section } from './Section'
import { useGsapEntrance } from '../hooks/useGsapEntrance'
import { event, partners, visibility } from '../content/conference'

/**
 * One partner in a soft card. Renders as a link when the partner has a `url` in
 * the content file, and as a plain card otherwise — so the hover lift only
 * appears on something that actually goes somewhere.
 *
 * With no `logo`, the card sets the partner's name as a wordmark instead of
 * showing a grey stand-in box. Real type in the site's own face is the honest
 * rendering of "we have not licensed this school's mark", and it needs no
 * asset, no request and no alt text to stand in for the image.
 */
function PartnerCard({ partner }) {
  const isLink = Boolean(partner.url)
  const Tag = isLink ? 'a' : 'div'

  return (
    <Tag
      data-partner-card
      data-testid={`partner-${partner.id}`}
      {...(isLink ? { href: partner.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex min-h-[6.5rem] items-center justify-center rounded-2xl border border-fg/10 bg-fg/5 px-6 py-8 opacity-0 transition duration-500 ease-out ${
        isLink ? 'hover:-translate-y-1 hover:border-accent/40 hover:bg-fg/10' : ''
      }`}
    >
      {partner.logo ? (
        // No blend mode: multiply was there to sink dark logos into a light
        // card, and on a dark card it would erase them.
        <img
          src={partner.logo}
          alt={partner.name}
          loading="lazy"
          className="h-10 w-auto max-w-full object-contain opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : (
        <span className="display text-center text-xl leading-none text-fg opacity-60 transition-opacity duration-500 group-hover:opacity-100 md:text-2xl">
          <span aria-hidden="true">{partner.wordmark ?? partner.name}</span>
          {/* The card shows the short name; assistive tech gets the full one. */}
          <span className="sr-only">{partner.name}</span>
        </span>
      )}
    </Tag>
  )
}

function PartnerGroup({ title, items, columns }) {
  return (
    <div>
      <h3 className="label text-muted">{title}</h3>
      <div className={`mt-6 grid grid-cols-2 gap-3 md:gap-4 ${columns}`}>
        {items.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  )
}

/**
 * Host chapters and sponsors.
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
      bg="forest"
      frame="partners"
      ref={rootRef}
      className="px-4 py-[calc(var(--frame-bar)+5rem)] md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div data-partners-reveal className="opacity-0">
          <p className="label text-muted">Partners</p>
          <h2 className="display mt-4 max-w-2xl text-display">{event.hostLine}</h2>
        </div>

        <div className="mt-16 flex flex-col gap-12">
          {/* Four across: eight chapters fill two full rows, where six columns
              would leave the last two stranded on a row of their own. */}
          <PartnerGroup title="Host chapters" items={partners.hosts} columns="md:grid-cols-4" />
          {visibility.sponsors && (
            <PartnerGroup title="Sponsors" items={partners.sponsors} columns="md:grid-cols-4" />
          )}
        </div>

        {/* The sponsorship ask gets a panel of its own rather than a button in
            the header: it is the one action on this section, and it funds the
            free registration everything else depends on. */}
        <div
          data-partners-reveal
          className="mt-16 flex flex-col gap-8 rounded-3xl border border-fg/15 bg-fg/5 p-8 opacity-0 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div className="max-w-xl">
            <p className="label text-accent">Support SILC</p>
            <h3 className="display mt-4 text-display-sm">Keep it free for every student</h3>
            <p className="mt-4 leading-relaxed font-light text-fg/70">
              Registration costs students nothing because sponsors and donors cover the rest — the venue, langar and
              programming. Give as an individual, or bring your company on as a sponsor.
            </p>
          </div>

          <a
            href={event.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group label inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-fg py-5 pr-7 pl-8 text-ground transition-colors duration-300 hover:bg-accent"
          >
            Become a sponsor
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

    </Section>
  )
}
