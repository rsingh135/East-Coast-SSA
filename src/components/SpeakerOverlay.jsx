import { useRef } from 'react'
import { useOverlay } from '../hooks/useOverlay'

/**
 * A speaker profile at full size: portrait on the left, everything we know
 * about them on the right. Opened by the expand toggle on the carousel card.
 */
export function SpeakerOverlay({ speaker, open, onClose }) {
  const closeRef = useRef(null)

  useOverlay(open, onClose, closeRef)

  if (!open || !speaker) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name}, ${speaker.role}`}
      className="fixed inset-0 z-90 overflow-y-auto bg-ink text-white"
    >
      <div className="mx-auto grid min-h-full max-w-6xl grid-cols-1 gap-8 px-4 py-[calc(var(--frame-bar)+2rem)] md:grid-cols-2 md:gap-14 md:px-8">
        <img
          src={speaker.image}
          alt={`${speaker.name}, ${speaker.role}`}
          className="h-[50vh] w-full rounded-2xl object-cover object-top md:h-[70vh]"
        />

        <div className="flex flex-col justify-center gap-6">
          <p className="label text-accent-bright">{speaker.badge}</p>

          <div>
            <h2 className="display text-display">{speaker.name}</h2>
            <p className="label mt-4 text-muted">
              {speaker.role} · {speaker.org}
            </p>
          </div>

          <p className="max-w-prose text-lg leading-relaxed font-light text-white/80">{speaker.bio}</p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="label group flex w-fit items-center gap-3 rounded-full border border-white/25 py-3 pr-4 pl-5 transition-colors duration-300 hover:border-accent-bright hover:text-accent-bright"
          >
            Close
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
              ↘
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
