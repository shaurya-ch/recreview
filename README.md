# recreview

A personal album review tracker. Search MusicBrainz for a release,
rate it, write what you thought, and keep a local library of reviews.

![React][react]
![TypeScript][ts]
![Vite][vite]
![Tailwind CSS][tw]

[react]: https://img.shields.io/badge/React_19-black?style=flat&logo=react
[ts]: https://img.shields.io/badge/TypeScript-black?style=flat&logo=typescript
[vite]: https://img.shields.io/badge/Vite-black?style=flat&logo=vite
[tw]: https://img.shields.io/badge/Tailwind_4-black?style=flat&logo=tailwindcss

## Features

- **Search albums** against the
  [MusicBrainz](https://musicbrainz.org/) release-group API,
  including
  [Lucene](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html)
  queries (`red AND taylor swift`)
- **Cover art** from the
  [Cover Art Archive](https://coverartarchive.org/) when a release is
  selected or when viewing saved reviews
- **1–5 star ratings** and freeform remarks
- **Duplicate protection** so the same release group cannot be
  reviewed twice
- **Edit and delete** existing reviews
- **Local persistence** via `localStorage` — reviews survive
  refreshes with no backend
- **Dark UI** by default, with a theme provider that also supports
  light and system preference

## Screens

- `/` — Home; jump to create or saved reviews
- `/create` — Search MusicBrainz, pick a release, rate and submit
- `/saved` — Browse saved reviews with cover art; edit or delete

## Stack

- **UI** — React 19, TypeScript
- **Routing** — React Router 8 (`createBrowserRouter`, nested
  routes, outlet context)
- **Styling** — Tailwind CSS 4, shadcn/ui (Base UI / nova), Geist
- **State** — Lifted review list in `App`, shared with
  `useReviewContext()`
- **Persistence** — `localStorage`
- **Data** — MusicBrainz WS/2, Cover Art Archive
- **Tooling** — Vite 8, Oxlint, Bun

## Architecture

Reviews live in `App` and are passed to child routes through React
Router outlet context. Pages read and write that list through
`useReviewContext()`. A `useEffect` on the create and saved pages
writes the latest list back to `localStorage` under the `reviews`
key.

```text
src/
  App.tsx                 # Review type, lifted state, theme + toaster
  reviews-context.ts      # Typed outlet-context hook
  pages/
    Home.tsx
    CreateReview.tsx      # Search, select, rate, persist
    SavedReviews.tsx      # List, edit, delete, cover art
  components/ui/          # shadcn primitives
```

Each review stores:

- `releaseGroupId` — MusicBrainz MBID
- `releaseGroupTitle` / `releaseGroupArtist`
- `rating` (1–5)
- `remarks`

## Setup

Needs [Bun](https://bun.sh/) (or npm/pnpm if you prefer).

```bash
bun install
bun run dev
```

Other scripts:

```bash
bun run build    # tsc -b && vite build
bun run preview  # serve the production build
bun run lint     # oxlint
```

The app talks to public MusicBrainz and Cover Art Archive endpoints
from the browser. No API keys. MusicBrainz asks that clients identify
themselves; if you hit rate limits, add a User-Agent on a proxy or
wait and retry.

## Notes

- Data never leaves the browser except the two public music APIs.
- Clearing site data wipes reviews.
- Cover art is best-effort; some release groups have none.

## License

Private project — not licensed for redistribution unless you add a
license.
