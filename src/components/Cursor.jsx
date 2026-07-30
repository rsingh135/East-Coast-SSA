import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HOVER_SELECTOR = 'a, button, [data-cursor="hover"]'
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

/**
 * Minimal ring cursor. Trails the pointer with GSAP quickTo, grows and turns
 * accent blue over interactive elements.
 *
 * Not rendered on touch devices or under reduced motion — the native cursor
 * beats a laggy imitation of one.
 *
 * The wrapper owns position (GSAP writes an inline transform there) and the
 * inner ring owns scale, so the two never fight over the same property.
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

    gsap.set(wrapper, { xPercent: -50, yPercent: -50 })
    const moveX = gsap.quickTo(wrapper, 'x', { duration: 0.35, ease: 'power3' })
    const moveY = gsap.quickTo(wrapper, 'y', { duration: 0.35, ease: 'power3' })

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
      <div
        data-testid="cursor-ring"
        className={[
          'size-8 rounded-full border border-white opacity-0',
          // Difference blending keeps one white ring legible on ink and paper alike.
          'mix-blend-difference transition duration-200 ease-out',
          'group-data-[visible=true]:opacity-100',
          'group-data-[hover=true]:scale-200 group-data-[hover=true]:border-accent-bright',
          'group-data-[hover=true]:bg-accent-bright/15 group-data-[hover=true]:mix-blend-normal',
        ].join(' ')}
      />
    </div>
  )
}
