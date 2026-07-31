import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HOVER_SELECTOR = 'a, button, [data-cursor="hover"]'
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

/**
 * Arrow cursor: black fill, white outline, so it stays legible on both the ink
 * and paper halves of the page without any blend trickery.
 *
 * Not rendered on touch devices or under reduced motion — the native cursor
 * beats a laggy imitation of one.
 *
 * The wrapper owns position (GSAP writes an inline transform there) and the
 * arrow owns scale, so the two never fight over the same property.
 */
export function Cursor() {
  const wrapperRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined
    if (!window.matchMedia?.(FINE_POINTER).matches) return undefined

    const wrapper = wrapperRef.current
    if (!wrapper) return undefined

    document.body.classList.add('has-custom-cursor')
    wrapper.dataset.active = 'true'

    // Written straight to the transform with no tween at all: an arrow that
    // eases toward the pointer feels broken, however short the duration. The
    // SVG offsets itself so its tip lands exactly on this point.
    const moveX = gsap.quickSetter(wrapper, 'x', 'px')
    const moveY = gsap.quickSetter(wrapper, 'y', 'px')

    const onMove = (pointerEvent) => {
      moveX(pointerEvent.clientX)
      moveY(pointerEvent.clientY)
      wrapper.dataset.visible = 'true'
    }

    const onOver = (pointerEvent) => {
      const { target } = pointerEvent
      wrapper.dataset.hover = target instanceof Element && target.closest(HOVER_SELECTOR) ? 'true' : 'false'
    }

    const onLeave = () => {
      wrapper.dataset.visible = 'false'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
      gsap.killTweensOf(wrapper)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      ref={wrapperRef}
      data-testid="cursor"
      data-active="false"
      data-visible="false"
      data-hover="false"
      aria-hidden="true"
      className="group pointer-events-none fixed top-0 left-0 z-100 hidden data-[active=true]:block"
    >
      <svg
        data-testid="cursor-arrow"
        viewBox="0 0 24 24"
        width="26"
        height="26"
        className={[
          // The tip sits at roughly (5.5, 2.9) in the 24-unit viewBox, so the
          // shape is nudged back by that much to put the tip on the pointer,
          // and every transform pivots about the tip rather than the box.
          'block -translate-x-[6px] -translate-y-[3px] origin-[23%_12%]',
          'rotate-[-12deg] opacity-0 drop-shadow-sm',
          'transition-[opacity,scale] duration-200 ease-out',
          'group-data-[visible=true]:opacity-100',
          // Grows a touch over anything interactive; the fill stays black so
          // the shape reads the same everywhere.
          'group-data-[hover=true]:scale-125',
        ].join(' ')}
      >
        <path
          d="M5.5 3.21V20.79c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
