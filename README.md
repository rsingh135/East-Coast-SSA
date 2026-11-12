# SILC — Sikh Ivy League Conference

Website for the Sikh Ivy League Conference (SILC), an inter-SSA gathering hosted on rotation by the Ivy
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
Dates, venue, speakers, schedule, registration, partners, FAQ, gallery — all of
it. Components read from there and nothing is hard-coded in the markup, so a new
host committee edits data, not JSX.

Placeholders are marked `TODO`. The ones that matter before launch:

- `event.registerUrl` — currently `#`; point it at the Luma or Google Form link
- `event.venue` — waiting on the host
- `event.dates`, `event.datePill` — confirm the weekend
- `speakers[]` — placeholder lineup
- `partners.sponsors[]` — placeholder sponsors
- Images — see below (the hero film and the archive photographs are real)

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

### Partner logos

Host chapters carry no logo. Each renders as a wordmark set in the site's own
display face, because a university's shield and logotype are registered
trademarks licensed per-use by that school's trademark office — and an SSA
chapter is not the university. Naming a school in type is fair; shipping its
mark without a licence is not.

Once a school or sponsor clears its mark, drop the file in `public/logos/` and
add `logo: '/logos/<file>.svg'` to that entry. The card swaps the type for the
image with no other change.

## Static assets

`public/` is copied to the site root verbatim — no hashing, no bundling.
Reference these by absolute path (`/hero.mp4`), never by import. Filenames are
stable rather than content-hashed, so they get a week of caching with a month of
`stale-while-revalidate` rather than the `immutable` year `dist/assets/` gets. A
file replaced in place reaches returning visitors within that week; if it has to
land sooner, ship it under a new name.

### `hero.mp4` / `hero-poster.jpg` / `hero-final.jpg`

The film behind the hero logo, its first frame, and its last frame. All three
are derived from the 4K master `herovid.mp4`, which is untracked — it is 13 MB
and nothing serves it, so keep a copy somewhere outside the repo. The video
plays once, muted and grayscaled behind a scrim, then holds on its last frame,
so the master's resolution and audio track never reach a viewer and only cost
first paint.

The master is 24fps footage padded to 30fps by repeating every fifth frame,
which reads as a regular hitch. The encode drops those repeats (`decimate`) to
recover the clean 24fps, then motion-interpolates to 60fps (`minterpolate`) so
the pan is smooth on 60Hz screens. The night skyline interpolates cleanly; if
the footage is ever swapped, step through the output for warped edges before
shipping it.

```sh
# 1080p60, no audio, faststart so playback begins before the file finishes.
# minterpolate is slow — expect a couple of minutes.
ffmpeg -i herovid.mp4 -an \
  -vf "scale=1920:-2:flags=lanczos,decimate=cycle=5,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
  -c:v libx264 -profile:v high -preset slow -crf 24 \
  -maxrate 3M -bufsize 6M -pix_fmt yuv420p -movflags +faststart \
  public/hero.mp4

# Poster = the video's own first frame, so the band never changes image on play.
ffmpeg -ss 0.5 -i herovid.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 6 \
  public/hero-poster.jpg

# Final frame = the still the film holds on, read from the encoded file so it
# matches exactly.
ffmpeg -sseof -0.1 -i public/hero.mp4 -update 1 -vf "scale=1280:-2" -q:v 6 \
  public/hero-final.jpg
```

Under `prefers-reduced-motion` the film never plays and the hero shows
`hero-final.jpg` instead — the same still everyone else ends on.

### `archive/`

Photographs from previous conferences, listed in `gallery` in the content file.
Camera originals stay out of the repo (they are gitignored); what ships is a
resized, re-encoded, EXIF-stripped copy — around a quarter the weight.

```sh
ffmpeg -i <camera-file>.JPG -map_metadata -1 \
  -vf "scale=w=1400:h=1400:force_original_aspect_ratio=decrease" -q:v 4 \
  public/archive/<descriptive-name>.jpg
```

`-map_metadata -1` is not optional. Camera files carry GPS coordinates, serial
numbers and timestamps, and these are photographs of identifiable students.

Record the output's real pixel dimensions in the gallery entry's `width` and
`height`. The photographs load lazily, and without them the grid has no height
until each one arrives and shoves the rest of the page down.

```sh
ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
  -of csv=p=0 public/archive/<file>.jpg
```

## Structure

```
public/                   served at the site root, unhashed — film, photographs
src/
  content/conference.js   all copy and data
  components/             one file per page section
  hooks/                  scroll, cursor, overlay, animation helpers
  lib/                    GSAP registration, placeholder generation
  styles/index.css        design tokens (@theme), base and component layers
  assets/brand/           SILC logo (transparent PNG, ivy and cream variants)
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
request to `main`, then checks the bundle actually emitted its JS, CSS, font,
logo and favicon assets. A compiling build with missing assets is otherwise invisible.

## Deploying

Hosted on Vercel. Connect the repository once at
[vercel.com/new](https://vercel.com/new) and every push to `main` deploys, with
pull requests getting preview URLs. Vercel's Git integration is used rather than
a deploy step in Actions, so no deployment tokens live in the repo.

`vercel.json` holds the build config, the SPA rewrite, long-lived caching for
hashed assets, and basic security headers. It needs no changes to deploy.
