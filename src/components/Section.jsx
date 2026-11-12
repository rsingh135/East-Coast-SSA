/**
 * Every page section renders through here so the nav frame and the body
 * background have one consistent contract to read:
 *   data-bg    — "forest" (dark, default) or "canvas" (light); scopes the
 *                colour roles in index.css and drives frame inversion
 *   data-frame — key into `frameLabels`, drives the bottom-right nav slot
 */
export function Section({ id, bg = 'forest', frame, className = '', ref, children, ...rest }) {
  
  return (
    <section
      id={id}
      ref={ref}
      data-bg={bg}
      data-frame={frame ?? id}
      className={`relative w-full bg-ground text-fg ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
