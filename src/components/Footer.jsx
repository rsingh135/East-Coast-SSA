import { event, navSections } from '../content/conference'
import logo from '../assets/brand/silc-logo-dark.webp'

/**
 * Closing block. Sits above the fixed nav strip, so it carries bottom padding
 * of a full bar height to clear it.
 */
export function Footer() {
  return (
    <footer
      data-bg="forest"
      className="relative w-full bg-ground px-4 pt-24 pb-[calc(var(--frame-bar)+2rem)] text-fg md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <img src={logo} alt={event.name} width={1136} height={482} loading="lazy" className="h-auto w-56" />
            <p className="label mt-4 text-muted">{event.hostLine}</p>
            <p className="label mt-2 text-muted">
              {event.dates} · {event.city}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="label text-muted transition-colors duration-300 hover:text-fg"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${event.email}`}
              className="label text-muted transition-colors duration-300 hover:text-fg"
            >
              {event.email}
            </a>
            <a
              href={event.sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-muted transition-colors duration-300 hover:text-fg"
            >
              Sponsor SILC
            </a>
            <a
              href={event.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-muted transition-colors duration-300 hover:text-fg"
            >
              Instagram
            </a>
            <a href="#hero" className="label group flex items-center gap-2 text-muted transition-colors duration-300 hover:text-fg">
              Back to top
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                ↑
              </span>
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-fg/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="label text-muted">
            © {new Date().getFullYear()} {event.name}
          </p>
          <p className="label text-muted">Built by the host committee</p>
        </div>
      </div>
    </footer>
  )
}
