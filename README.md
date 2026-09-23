# Kyle Oberholzer — portfolio site

A plain HTML/CSS/JS site, no build step, no framework. Designed so that adding
a new portfolio piece each month is a two-file change: one image, one JSON entry.

## Structure

```
index.html                       Homepage — a curated selection of work
work.html                         Full portfolio — every item, always
conference/index.html             Unlisted outreach page — Katapult pieces only
portfolio-data.json               The list of every portfolio item (edit this monthly)
assets/
  css/style.css                   All styling
  js/main.js                      Renders the portfolio grid from portfolio-data.json
  images/
    site/                         Fixed site images: hero, portrait, about photo
    portfolio/                    One thumbnail per project
```

Every page renders from the same `portfolio-data.json` via the same
`assets/js/main.js`. Which items show where is controlled by the grid's
`data-scope` attribute: `data-scope="all"` (used on `work.html`) shows every
item regardless of flags; any other value, e.g. `data-scope="selected"`
(`index.html`'s homepage teaser) or `data-scope="katapult"`
(`conference/index.html`'s outreach page), shows only items where that exact
field is `true` in their JSON entry. To make a new curated page, add a new
boolean field to the items you want on it and point a grid's `data-scope` at
that field name — no JS changes needed.

**Ordering**: by default (`index.html` and `work.html`), items sort by the
view count parsed out of their `"note"` field — most-viewed first, items
with no recorded view count keep the JSON array's order and sort after
every item that does have one. A scope can override this with its own
manual order and its own hero card via two per-item fields named after the
scope: `"${scope}Order"` (a number — lower shows first) and
`"${scope}Featured"` (boolean — the one wide card for that grid). Both are
optional and independent of the shared `"featured"` flag, so a curated page
can have its own hero without changing the homepage's. See
`conference/index.html`'s `katapultOrder` / `katapultFeatured` fields for
an example.

## Previewing locally

Because the page loads `portfolio-data.json` with `fetch()`, opening
`index.html` directly by double-clicking it (a `file://` URL) will show an
empty grid — browsers block that for local files. Run a tiny local server
from this folder instead, then open the printed address:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Any static server works — `npx serve`, VS Code's "Live Server" extension, etc.)

## Adding a new portfolio item (monthly)

1. Add the new thumbnail to `assets/images/portfolio/`.
   Name it `project-name-short-description.jpg`, all lowercase, hyphens
   instead of spaces — e.g. `acme-fusion-reactor-teaser.jpg`.
2. Add one entry to `portfolio-data.json`:
   ```json
   {
     "title": "Project name — short description",
     "format": "Mini-documentary",
     "length": "4 min",
     "platform": "YouTube",
     "url": "https://youtu.be/xxxxxxxx",
     "image": "/assets/images/portfolio/project-name-short-description.jpg",
     "featured": false,
     "selected": false
   }
   ```
   `format` is a short label like `Mini-documentary`, `LinkedIn short`, or
   `Video podcast`. `length` is the actual runtime (`"2 min"`, `"30 min"`) —
   both render as text under the title, so use real figures, not estimates.
   An optional `"note"` field (e.g.
   `"50,000+ views"`) appends after the length if there's a standout stat
   worth surfacing.

   Set `"featured": true` on at most one item at a time — it renders as the
   larger, wide card at the top of the grid (on whichever page shows it).

   Set `"selected": true` if this item should also appear in the homepage's
   "Selected work" teaser, not just on `work.html`. Every item always shows
   on `work.html` regardless of this flag.
3. Preview locally (see above), then commit and push:
   ```bash
   git add .
   git commit -m "Add [project name] to portfolio"
   git push
   ```

If the site is hosted on GitHub Pages, the update goes live within a minute
or two of the push.

## Workflow

- Commit locally after every change. Push straight to `main` once Kyle
  says to go live — **no feature branches, no pull requests, by default.**
  GitHub Pages deploys `main` automatically within a minute or two of the
  push, so pushing is a deliberate, confirmed step, not a routine part of
  finishing a task.
- Only create a branch/PR when explicitly asked for one — e.g. to stage a
  bigger change and review its diff on GitHub before committing to it.

## Publishing

Live at [kyleoberholzer.com](https://kyleoberholzer.com), served by GitHub
Pages from the `main` branch (custom domain + DNS already configured via
the `CNAME` file in this repo). Pushing to `main` is the only step needed
to deploy — see "Workflow" above for how that push should happen.
