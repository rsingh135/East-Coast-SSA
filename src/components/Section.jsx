/**
 * Every page section renders through here so the nav frame and the body
 * background have one consistent contract to read:
 *   data-bg    — "ink" (black) or "paper" (light), drives frame inversion
 *   data-frame — key into `frameLabels`, drives the bottom-right nav slot
 */
export function Section({ id, bg = 'ink', frame, className = '', children, ...rest }) {
  const isInk = bg === 'ink'

  return (
    <section
      id={id}
      data-bg={bg}
      data-frame={frame ?? id}
      className={`relative w-full ${isInk ? 'bg-ink text-white' : 'bg-paper text-near-black'} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
