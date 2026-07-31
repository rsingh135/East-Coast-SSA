import { event, navSections } from '../content/conference'

/**
 * Closing block. Sits above the fixed nav strip, so it carries bottom padding
 * of a full bar height to clear it.
 */
export function Footer() {
  return (
    <footer
      data-bg="ink"
      className="relative w-full bg-ink px-4 pt-24 pb-[calc(var(--frame-bar)+2rem)] text-white md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display text-display-sm">{event.name}</p>
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
                className="label text-muted transition-colors duration-300 hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${event.email}`}
              className="label text-muted transition-colors duration-300 hover:text-white"
            >
              {event.email}
            </a>
            <a
              href={event.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-muted transition-colors duration-300 hover:text-white"
            >
              Instagram
            </a>
            <a href="#hero" className="label group flex items-center gap-2 text-muted transition-colors duration-300 hover:text-white">
              Back to top
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                ↑
              </span>
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="label text-muted">
            © {event.year} {event.name}
          </p>
          <p className="label text-muted">Built by the host committee</p>
        </div>
      </div>
    </footer>
  )
}
