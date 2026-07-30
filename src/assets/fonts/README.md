# Vendored fonts

## Satoshi (display)

`satoshi-variable.woff2` — variable roman, weights 300–900, 42 KB.

- **Foundry:** Indian Type Foundry
- **Source:** https://www.fontshare.com/fonts/satoshi
- **Licence:** ITF Free Font Licence — free for personal and commercial use,
  self-hosting permitted.

Vendored rather than loaded from `cdn.fontshare.com` so the site has no
third-party font request, no render-blocking external dependency, and no
dependence on Fontshare staying up. Satoshi is not on npm or Google Fonts, so
there is no package to install.

To update, grab the current variable file from the Fontshare CSS API:

```sh
curl -sL "https://api.fontshare.com/v2/css?f%5B%5D=satoshi@1,2" | grep -o "https\?://[^']*\.woff2"
```

The other typefaces (Inter for body, JetBrains Mono for labels) come from npm
via `@fontsource-variable/*` and need nothing here.
