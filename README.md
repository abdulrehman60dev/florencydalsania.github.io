# Florency Dalsania — Portfolio

A single-page, zero-build personal portfolio. Pure HTML/CSS/JS, hosted free on GitHub Pages.

## Folder structure

```
florency-portfolio/
├── index.html      # all content + markup
├── styles.css      # design system, themes, layout, motion
├── script.js       # theme toggle, nav, mobile menu, scroll reveal, magnetic buttons
├── README.md
├── cv/
│   └── CV.pdf      # ← drop the CV here (exact filename: CV.pdf)
└── assets/
    ├── profile.jpg            # portrait for the About section (included, 800×800)
    ├── illus-csr.svg          # original vector artwork used as card/education covers
    ├── illus-interior.svg     #   (these are the fallbacks — drop a photo with the
    ├── illus-campus.svg       #    matching .jpg name below and it replaces the artwork)
    ├── illus-marwadi.svg
    ├── project-csr.jpg        # ← optional HD photo, 16:10
    ├── project-bemor.jpg      # ← optional HD photo, 16:10 (interior / furniture work)
    ├── project-degree.jpg     # ← optional HD photo, 16:10 (degree project)
    ├── uni-gloucestershire.jpg# ← optional HD campus photo, 16:10 (must be licensed/own photo)
    ├── uni-marwadi.jpg        # ← optional HD campus photo, 16:10
    └── og-image.jpg           # ← social share image (1200×630)
```

**Images:** every image slot has an original SVG illustration as its fallback, so the site looks
finished with no photos at all. To use a real photo, just add the `.jpg` with the exact name above —
no code change needed. Only use photos you own or have a licence for (university press/media pages
usually offer approved campus images).

All paths are relative, so the site works at `https://username.github.io/` **and** at
`https://username.github.io/repo-name/` without changes.

## Content sources

Everything on the page comes from Florency's LinkedIn profile (extracted 15 Sep 2026):
headline, both roles with their bullet points, both degrees (incl. CGPA and modules), the CSR
research project, and the skills list. A few skill chips (Client Consultation, Vendor
Coordination, Teamwork, Attention to Detail, Data Analysis) are taken verbatim from the
experience/education/project text rather than the Skills section — remove any you'd rather not show.

The About paragraph was written from those verified facts only; LinkedIn's own "About" text
could not be retrieved. Replace it with her real summary if she has one.

## Placeholders to fill (search `PLACEHOLDER` in index.html)

| # | Where | What to do |
|---|-------|-----------|
| 1 | `cv/CV.pdf` | Add the CV PDF with this exact name. |
| 2 | `assets/profile.jpg` | ✅ Included (800×800, taken from LinkedIn). Replace with a higher-resolution photo if she has one. |
| 3 | `assets/project-*.jpg`, `assets/uni-*.jpg` | Optional HD photos (see tree above). Vector illustrations show until then. |
| 4 | `assets/og-image.jpg` | Social preview image (1200×630). |
| 5 | `<meta property="og:url">` | Replace `https://USERNAME.github.io/` with the live URL. |
| 6 | Contact section | Replace `EMAIL@PLACEHOLDER.com` (appears twice) with the real email. |
| 7 | Contact section | Replace `https://github.com/USERNAME` with the real GitHub profile, or delete that `<li>`. |
| 8 | Projects → CSR modal | Add a link to a thesis summary / PDF when available (comment marks the spot). |
| 9 | Projects → Degree modal | Optionally add 2–3 named degree projects with images. |
| 10 | About | Optionally replace the About copy with LinkedIn's own summary. |

Nothing else is invented: no certifications, awards or languages are shown because none were
listed on the profile.

## Deploying to GitHub Pages

### (a) Personal site — `username.github.io`

1. On GitHub, create a **public** repository named exactly `username.github.io`
   (replace `username` with the GitHub username).
2. Put `index.html`, `styles.css`, `script.js`, `cv/` and `assets/` at the repo **root** and push:
   ```bash
   cd florency-portfolio
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```
3. GitHub Pages is enabled automatically for this repo name. After a minute the site is live at
   `https://username.github.io/`. (If not: **Settings → Pages → Source: Deploy from a branch →
   `main` / `/(root)` → Save**.)

### (b) Project repo — served from `main` / `(root)`

1. Create a public repo, e.g. `portfolio`.
2. Push the same files to the repo root (same commands as above, with the new remote URL).
3. Go to **Settings → Pages**. Under **Build and deployment** choose
   **Source: Deploy from a branch**, then **Branch: `main`**, **Folder: `/(root)`**, and **Save**.
4. Wait ~1 minute; the site is live at `https://username.github.io/portfolio/`.
   Because every path in the site is relative, nothing needs to change for the sub-path.

### Updating

Edit the files, commit, push — Pages redeploys automatically in under a minute.
Hard-refresh (Cmd/Ctrl + Shift + R) if you still see the old version.

## Notes

- Projects: clicking a card opens an accessible summary dialog (focus-trapped, Esc / backdrop / × to close).
- Themes: light/dark toggle in the header; follows the OS preference until a choice is made,
  then persists in `localStorage`.
- Accessibility: semantic landmarks, skip link, keyboard-operable menu (Esc closes), visible
  focus rings, AA contrast in both themes, `prefers-reduced-motion` honoured.
- Performance: no libraries; only Google Fonts are loaded externally; images are lazy-loaded.
