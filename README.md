# Electron Weddings — Website

A wedding photography site: `index.html` (hero, about, filterable
portfolio preview with lightbox, services/pricing, testimonials carousel,
an Instagram follow section, and a contact form that opens the visitor's
email client — no backend required) plus `gallery.html`, a full gallery
that pages through every photo in `images/web/`.

## The full gallery (`gallery.html`)

`js/gallery-data.js` holds `GALLERY_IMAGES`, a flat array of every
filename in `images/web/`. `js/gallery.js` renders them 24 at a time with
a "Load More" button, and drives a lightbox with prev/next arrows and a
counter that can page through the *entire* set regardless of how many
are currently loaded on screen.

When you add or remove photos in `images/web/`, regenerate the list:

```bash
cd images/web && python3 -c "import json,os; print('const GALLERY_IMAGES = ' + json.dumps(sorted(f for f in os.listdir('.') if f.lower().endswith('.jpg'))) + ';')" > ../../js/gallery-data.js
```

(then re-add the `const GALLERY_IMAGES = [...]` file header/comment, or
just prepend `const GALLERY_IMAGES = ` manually — the one-liner above
overwrites the file with just the array declaration).

## Watermark removal

A number of the delivered photos had an "Electron Kinghoms Imagery" logo
watermarked into the bottom-left corner. These were detected with OpenCV
template matching (the logo as a template, searched across scales in the
bottom-left corner of each photo) and removed with `cv2.inpaint` where
found — the 20 affected files in `images/web/` were fixed in place. The
originals in `images/` (outside `web/`) were left untouched. If new
watermarked photos are added later, re-run the same detect-and-inpaint
approach (search this repo's history for the script, or ask Claude to
redo it) rather than re-touching every file by hand.

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Photos

The site now uses your real photos from `images/`. Because the originals are
full-resolution camera files (some 20–36MB each), a `images/web/` folder
holds web-optimized copies — resized to a 1800px longest edge and
compressed with macOS `sips` — that `index.html` actually references. The
originals in `images/` are untouched.

To swap in a different photo anywhere on the site:

1. Drop the new original into `images/`.
2. Generate a web-sized copy:
   ```bash
   sips -Z 1800 -s format jpeg -s formatOptions 72 "images/your-photo.jpg" --out "images/web/your-photo.jpg"
   ```
3. Update the matching `<img src="images/web/...">` in `index.html`.

Section by section:

- **Hero / About / Featured spotlight** — each is a single large `<img>`
  near the top of `index.html` (search for `hero-media`, `about-image`,
  `spotlight`).
- **Portfolio** — inside `<section class="portfolio">`, each
  `<figure class="gallery-item" data-cat="...">` has a category
  (`ceremony`, `portraits`, `details`, `reception`) used by the filter
  buttons — keep or change `data-cat` to match the photo.
- **Instagram strip** — six tiles in `<section class="instagram">` that
  link out to `https://www.instagram.com/electronweddings` (Instagram
  doesn't allow free live-feed embedding, so this is a manually curated
  "best of" grid rather than a real-time feed).

If you add many more photos to the portfolio, consider batch-resizing with
the same `sips` command in a loop rather than one at a time.

## Editing copy

- Bio, stats, and pricing are placeholder text in `index.html` — search for
  "Hi, I'm behind the lens" and the `.price-card` blocks to edit.
- Contact email defaults to `bookelectronweddings@gmail.com` — update it in
  both `index.html` (`.contact-alt` link) and `js/main.js` (the `mailto:`
  line) if that's not your real address.

## Deploying

This is a fully static site (no build step). You can deploy it as-is to
GitHub Pages, Netlify, Vercel, or any static host — just upload the whole
folder.
