import { useState } from 'react'
import { event, frameLabels } from '../content/conference'
import { MenuOverlay } from './MenuOverlay'

/**
 * Fixed top and bottom bars that frame the whole page.
 *
 * Presentational: `frameKey` and `theme` come from `useSectionFrame` in App,
 * which keeps the scroll observation out of here and this component trivial
 * to test.
 */
export function NavFrame({ frameKey = 'hero', theme = 'ink' }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // While the overlay is up it owns the colour scheme, not the section below.
  const onPaper = theme === 'paper' && !menuOpen
  const barText = onPaper ? 'text-near-black' : 'text-white'
  const hoverText = onPaper ? 'hover:text-accent-deep' : 'hover:text-accent-bright'
  const rule = onPaper ? 'border-near-black/10' : 'border-white/10'

  const item = `label ${hoverText} transition-colors duration-300`

  return (
    <>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* pointer-events-none so the bars never eat a scroll or a click meant
          for the page; each control re-enables them for itself. */}
      <header
        data-theme={theme}
        className={`pointer-events-none fixed inset-x-0 top-0 z-100 flex h-[var(--frame-bar)] items-center justify-between border-b px-4 transition-colors duration-500 md:px-6 ${barText} ${rule}`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-expanded={menuOpen}
          className={`${item} pointer-events-auto`}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <a href="#hero" className={`${item} pointer-events-auto font-display text-sm font-extrabold tracking-tight`}>
          {event.shortName}
        </a>

        <a href="#register" className={`${item} pointer-events-auto`}>
          Register
        </a>
      </header>

      {/* A div, not a <footer>: the page's real footer owns the contentinfo
          landmark, and two of them would be ambiguous. This is a status strip. */}
      <div
        data-theme={theme}
        data-testid="frame-bottom"
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-100 flex h-[var(--frame-bar)] items-center justify-between border-t px-4 transition-colors duration-500 md:px-6 ${barText} ${rule}`}
      >
        <a
          href={event.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} pointer-events-auto hidden sm:block`}
        >
          Instagram
        </a>

        <span className={`label ${onPaper ? 'text-near-black' : 'text-white'}`}>{event.datePill}</span>

        {/* aria-live so the label change is announced rather than silently swapped. */}
        <span className="label text-right" aria-live="polite" data-testid="frame-status">
          {frameLabels[frameKey] ?? frameLabels.hero}
        </span>
      </div>
    </>
  )
}
