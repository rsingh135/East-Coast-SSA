import { useEffect } from 'react'

/**
 * Shared behaviour for every full-screen layer: Escape closes it, page scroll
 * locks while it is up, and focus moves into it on open.
 *
 * `focusRef` should point at the first thing worth landing on — a close button
 * or the first link.
 */
export function useOverlay(open, onClose, focusRef) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    focusRef?.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, focusRef])
}
