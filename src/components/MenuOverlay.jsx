import { useRef } from 'react'
import { navSections, event } from '../content/conference'
import { useOverlay } from '../hooks/useOverlay'

/**
 * Full-screen navigation overlay. Always ink-on-white regardless of the
 * section underneath, so it reads as a separate layer rather than a panel.
 *
 * Escape closes it, the first link takes focus on open, and body scroll is
 * locked while it is up.
 */
export function MenuOverlay({ open, onClose }) {
  const firstLinkRef = useRef(null)

  useOverlay(open, onClose, firstLinkRef)

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-90 flex flex-col justify-between bg-ink px-6 pt-[var(--frame-bar)] pb-[var(--frame-bar)] text-white md:px-10"
    >
      <nav className="flex flex-1 flex-col justify-center gap-1">
        {navSections.map((section, index) => (
          <a
            key={section.id}
            ref={index === 0 ? firstLinkRef : null}
            href={`#${section.id}`}
            onClick={onClose}
            className="group flex items-baseline gap-4 py-1 transition-colors hover:text-accent-bright md:gap-8"
          >
            <span className="label text-muted transition-colors group-hover:text-accent-bright">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="display text-display-sm">{section.label}</span>
          </a>
        ))}
      </nav>

      <div className="label flex flex-wrap items-center justify-between gap-4 text-muted">
        <span>{event.dates}</span>
        <a href={`mailto:${event.email}`} className="transition-colors hover:text-white">
          {event.email}
        </a>
      </div>
    </div>
  )
}
