# The Messier Log

A single tracking page for all 110 objects in the Messier catalogue: which
ones you've photographed, and which ones are still waiting for a clear
night. Click any tile to see the full details for that object.

## View the live log [**here**](https://ardjanwestveer.github.io/messier-tracker/)

> **Disclaimer:** this site was built with Claude — I'm not
> claiming the code as entirely my own work. Feel free to fork it or
> build something similar for your own catalogue. The photos, however,
> are mine: please don't reuse or redistribute them without asking me
> first. Also, this is a work in progress — plenty of objects here are
> still unphotographed, and details may be incomplete or change as I go.

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
