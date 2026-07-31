# East Coast SSA Conference

Website for the East Coast inter-SSA conference, hosted on rotation by the Ivy
League Sikh Student Associations.

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |

## Editing the content

**Almost every change you need lives in one file: `src/content/conference.js`.**
Dates, venue, speakers, schedule, ticket tiers, partners, FAQ, gallery — all of
it. Components read from there and nothing is hard-coded in the markup, so a new
host committee edits data, not JSX.

Placeholders are marked `TODO`. The ones that matter before launch:

- `event.registerUrl` — currently `#`; point it at the Luma or Google Form link
- `event.hostSchool`, `event.venue` — waiting on the rotating host
- `event.dates`, `event.datePill` — confirm the weekend
- `speakers[]` — placeholder lineup
- Images — see below

### Images

Images are generated locally as inline SVGs via `placeholderImage(...)` from
`src/lib/placeholder.js`. To drop in a real photo, replace the call with a URL
or an imported asset:

```js
image: '/photos/speaker-01.jpg',
```

They are generated rather than fetched from a placeholder service because a
blocked or unavailable remote placeholder renders as a broken image, complete
with the browser's own border.

## Structure

```
src/
  content/conference.js   all copy and data
  components/             one file per page section
  hooks/                  scroll, cursor, overlay, animation helpers
  lib/                    GSAP registration, placeholder generation
  styles/index.css        design tokens (@theme), base and component layers
  assets/fonts/           vendored Satoshi — see that folder's README
```

Design tokens (colours, type scale, the nav bar height) are defined once in the
`@theme` block of `src/styles/index.css`. Change them there, not in components.

## Accessibility

Motion is gated on `prefers-reduced-motion` throughout — every animated section
renders complete and static when it's set. The custom cursor is not rendered on
touch devices or under reduced motion. Please keep it that way when adding
sections.

## CI

`.github/workflows/ci.yml` runs lint, tests, and a build on every push and pull
request to `main`, then checks the bundle actually emitted its JS, CSS and font
assets. A compiling build with missing assets is otherwise invisible.

## Deploying

Hosted on Vercel. Connect the repository once at
[vercel.com/new](https://vercel.com/new) and every push to `main` deploys, with
pull requests getting preview URLs. Vercel's Git integration is used rather than
a deploy step in Actions, so no deployment tokens live in the repo.

`vercel.json` holds the build config, the SPA rewrite, long-lived caching for
hashed assets, and basic security headers. It needs no changes to deploy.
