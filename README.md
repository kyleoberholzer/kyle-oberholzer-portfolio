# Kyle Oberholzer — portfolio site

A plain HTML/CSS/JS site, no build step, no framework. Designed so that adding
a new portfolio piece each month is a two-file change: one image, one JSON entry.

## Structure

```
index.html                       Homepage — a curated selection of work
work.html                         Full portfolio — every item, always
portfolio-data.json               The list of every portfolio item (edit this monthly)
assets/
  css/style.css                   All styling
  js/main.js                      Renders the portfolio grid from portfolio-data.json
  images/
    site/                         Fixed site images: hero, portrait, about photo
    portfolio/                    One thumbnail per project
```

Both pages render from the same `portfolio-data.json` via the same
`assets/js/main.js`. Which items show where is controlled by the grid's
`data-scope` attribute: `index.html`'s grid is `data-scope="selected"` (only
items with `"selected": true`), `work.html`'s grid is `data-scope="all"`
(every item, regardless of the flag).

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
     "image": "assets/images/portfolio/project-name-short-description.jpg",
     "featured": false,
     "selected": false
   }
   ```
   `format` is a short label like `Mini-documentary`, `LinkedIn short`, or
   `Video podcast`. `length` is the actual runtime (`"2 min"`, `"30 min"`) —
   both render on the card and as a duration badge on the thumbnail, so use
   real figures, not estimates. An optional `"note"` field (e.g.
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

## Before going fully live

- Not yet pushed to GitHub — working locally until the content and copy are
  settled. See "Publishing" below when ready.
- Add a `CNAME` file (just the domain name, one line) once you're ready to
  point your custom domain at GitHub Pages, and update the DNS records at
  your registrar accordingly.

## Publishing (when ready)

This repo is git-initialized locally but has no remote yet. To publish:

```bash
gh repo create kyleoberholzer/kyle-oberholzer-portfolio --public --source=. --remote=origin --push
```

Then enable GitHub Pages (Settings → Pages → Deploy from branch → `main` /
`root`) so it goes live at `kyleoberholzer.github.io/kyle-oberholzer-portfolio`.
