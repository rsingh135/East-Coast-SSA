const escapeXml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Builds a placeholder image as an inline SVG data URI.
 *
 * Generated locally rather than fetched from a placeholder service: no network
 * request, nothing to block, nothing to be down, and identical output in dev,
 * CI and production. A blocked remote placeholder renders as a broken image,
 * which the browser draws with its own border — that is what these replace.
 *
 * Swapping in a real photo means replacing the call with a URL string.
 */
export function placeholderImage(label, { width = 800, height = 1100, bg = '#141414', fg = '#6f6f6f' } = {}) {
  const fontSize = Math.round(Math.min(width, height) * 0.075)
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="100%" height="100%" fill="${bg}"/>`,
    `<text x="50%" y="50%" fill="${fg}" font-family="monospace" font-size="${fontSize}"`,
    ` letter-spacing="2" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>`,
    `</svg>`,
  ].join('')

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
