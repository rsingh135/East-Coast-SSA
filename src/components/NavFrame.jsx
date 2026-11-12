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
export function NavFrame({ frameKey = 'hero', theme = 'forest' }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // While the overlay is up it owns the colour scheme, not the section below.
  // `data-theme` scopes the colour roles, so the classes never change.
  const barTheme = menuOpen ? 'forest' : theme
  // Translucent ground so copy scrolling underneath never collides with the
  // bar labels; clear over the menu, which supplies its own ground.
  const barBg = menuOpen ? 'bg-transparent' : 'bg-ground/85 backdrop-blur-md'
  const bar = `pointer-events-none fixed inset-x-0 z-100 flex h-[var(--frame-bar)] items-center justify-between px-4 text-fg transition-colors duration-500 md:px-6 border-fg/10 ${barBg}`

  const item = 'label hover:text-accent transition-colors duration-300'

  return (
    <>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* pointer-events-none so the bars never eat a scroll or a click meant
          for the page; each control re-enables them for itself. */}
      <header
        data-theme={barTheme}
        className={`${bar} top-0 border-b`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-expanded={menuOpen}
          className={`${item} pointer-events-auto`}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <a href="#hero" className={`${item} pointer-events-auto font-display !text-base !font-semibold !tracking-[0.3em]`}>
          {event.shortName}
        </a>

        <a href="#register" className={`${item} pointer-events-auto`}>
          Register
        </a>
      </header>

      {/* A div, not a <footer>: the page's real footer owns the contentinfo
          landmark, and two of them would be ambiguous. This is a status strip. */}
      <div
        data-theme={barTheme}
        data-testid="frame-bottom"
        className={`${bar} bottom-0 border-t`}
      >
        <a
          href={event.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} pointer-events-auto hidden sm:block`}
        >
          Instagram
        </a>

        <span className="label">{event.datePill}</span>

        {/* aria-live so the label change is announced rather than silently swapped. */}
        <span className="label text-right" aria-live="polite" data-testid="frame-status">
          {frameLabels[frameKey] ?? frameLabels.hero}
        </span>
      </div>
    </>
  )
}
