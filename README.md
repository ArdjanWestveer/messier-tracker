# The Messier Log

A single tracking page for all 110 objects in the Messier catalogue: which
ones you've photographed, and which ones are still waiting for a clear
night. Click any tile to see the full details for that object.

No build step, no dependencies — it's plain HTML/CSS/JS, so it runs
straight from the file or from GitHub Pages.

## Try it locally

Just open `index.html` in a browser. Everything is self-contained (the
catalogue data is embedded in `js/data.js`), so no server is required.

## Add a photo you've taken

1. Drop the image file into `images/` (e.g. `images/m42.jpg`).
2. Open `js/data.js` and find that object's entry — they're in catalog
   order, so `M42` is the 42nd entry.
3. Fill it in:

```js
{
  "id": 42,
  "catalog": "M42",
  "commonName": "Orion Nebula",
  "type": "Emission nebula",
  "constellation": "Orion",
  "photographed": true,
  "image": "images/m42.jpg",
  "datePhotographed": "2026-01-14",
  "equipment": "80mm refractor, ZWO ASI2600MC, 2hr integration",
  "exposure": "48 x 150s",
  "notes": "First real test of the new guide scope. Core a little blown out — reshoot with shorter subs."
}
```

Only `photographed` and `image` control what shows on the card itself;
`datePhotographed`, `equipment`, `exposure`, and `notes` are optional and
only appear in the detail panel when filled in. Save the file, refresh the
page, and the progress bar and grid update automatically.

## Put it on GitHub

```bash
cd messier-tracker
git init
git add .
git commit -m "Start the Messier log"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then turn on **GitHub Pages** for the repo (Settings → Pages → Deploy from
branch → `main` / root), and the log will be live at
`https://<your-username>.github.io/<repo-name>/`.

## Project layout

```
index.html        the page itself
css/style.css      styling
js/data.js          the 110-object catalogue + your progress (edit this one)
js/app.js            rendering, filtering, sorting, the detail panel
images/               your photos go here
data/messier.json    same data as js/data.js, in plain JSON if you'd
                      rather script updates to it than hand-edit js/data.js
```

## Notes

- Filters at the top let you view everything, just what's captured, or
  just what's missing — plus filter by object type and sort by
  constellation or status, useful for planning what to chase next given
  what's up in a given season.
- The catalogue data (names, types, constellations) is standard reference
  astronomy data and shouldn't need touching — the only fields you'll
  edit are the per-object photo details.
