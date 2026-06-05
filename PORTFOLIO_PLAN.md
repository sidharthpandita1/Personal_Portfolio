# Portfolio Site — Build Plan

A minimal-modern, awwwards-style portfolio. You'll feed this whole file to Claude Code on the first run as the project brief, then work through it phase by phase.

---

## 1. Stack (locked in)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 4.x** (static output) | Lets Codrops snippets paste in unchanged; ships zero JS by default |
| Styling | **SCSS modules** | Matches Codrops snippet conventions |
| Animation engine | **GSAP + ScrollTrigger + SplitText** | All free as of 2024; awwwards standard |
| Smooth scroll | **Lenis** | The de-facto choice; integrates cleanly with ScrollTrigger |
| WebGL | **Three.js** | Only used for the image-distortion effect |
| Language | **JavaScript** (TS later) | Less friction with Codrops snippets |
| Deploy | **Vercel or Netlify** (static) | Either works; decide at the end |

---

## 2. Pages

1. **Home** — hero, intro, featured work teaser, marquee, contact CTA
2. **About** — long-form bio, philosophy, skills, horizontal-scroll timeline
3. **Work** — index of case studies (image grid with WebGL hover distortion)
4. **Work/[slug]** — case study template (hero, content blocks, next-project link)

All content is placeholder/dummy for now — real content goes in later.

---

## 3. Awwwards features in scope

- Custom cursor (dot that scales on interactive elements)
- Page transitions (Astro View Transitions + GSAP overlay)
- Horizontal scroll section (on About + optionally on a Home section)
- Marquee / infinite text scroll
- Preloader / intro animation (counter + reveal)
- WebGL image hover distortion (on Work grid)

---

## 4. Target folder structure

```
portfolio/
├── public/
│   ├── fonts/
│   ├── images/
│   └── shaders/                  # GLSL files for distortion effect
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Cursor.astro
│   │   ├── motion/               # reusable animation components
│   │   │   ├── Preloader.astro
│   │   │   ├── Marquee.astro
│   │   │   ├── HorizontalScroll.astro
│   │   │   ├── PageTransition.astro
│   │   │   └── WebGLImage.astro
│   │   └── sections/             # page-level sections (Hero, About, etc.)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── work/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   ├── content/
│   │   └── work/                 # case studies as .md files
│   ├── scripts/
│   │   ├── lenis.js              # smooth scroll singleton
│   │   ├── cursor.js
│   │   ├── preloader.js
│   │   ├── transitions.js
│   │   └── webgl/
│   │       └── imageDistortion.js
│   └── styles/
│       ├── _tokens.scss          # colors, type scale, spacing
│       ├── _mixins.scss
│       ├── _reset.scss
│       └── global.scss
├── astro.config.mjs
├── CLAUDE.md                     # project rules — keep updated
└── package.json
```

---

## 5. Phases (work through in order)

### Phase 1 — Bootstrap (15 min)

```bash
npm create astro@latest portfolio -- --template minimal --no-install --no-git --typescript strict
cd portfolio
npm install
npm install gsap lenis three
npm install -D sass
```

Then:
- Set up `src/styles/_tokens.scss` with color, type, spacing scale
- Set up `src/layouts/BaseLayout.astro` with global SCSS import
- Enable Astro View Transitions in `BaseLayout.astro`
- Create empty placeholder pages so routing works

**Acceptance:** `npm run dev`, you see all four routes return a blank page with a header.

### Phase 2 — Foundation (smooth scroll + cursor + preloader)

Build these three in this order. They're foundational — every other animation depends on them being correct.

1. **Lenis smooth scroll** — singleton in `src/scripts/lenis.js`, mounted in `BaseLayout.astro`. Must call `ScrollTrigger.update` on Lenis tick and `ScrollTrigger.refresh()` after every page transition.
2. **Custom cursor** — `Cursor.astro` component. Hide on touch devices. Scales on `[data-cursor="grow"]` elements.
3. **Preloader** — `Preloader.astro`. Show on first visit only (sessionStorage flag). Counter 0–100 + reveal.

**Acceptance:** Reload the site → preloader runs → smooth scroll works → cursor visible and reacts to a test button.

### Phase 3 — Pages with dummy content

Build the four pages with placeholder copy and stock images (use Unsplash or solid-color blocks).

- Home: hero headline, intro paragraph, 3 featured project cards, marquee strip, contact link
- About: bio + horizontal-scroll timeline (placeholder for now, animation comes in Phase 4)
- Work index: grid of 6 dummy projects with placeholder images
- Work/[slug]: one example case study at `/work/example-project`

**Acceptance:** All pages reachable, layout looks like the target aesthetic (minimal, generous whitespace, one sans-serif type family), no animations beyond the foundation.

### Phase 4 — Awwwards features (one at a time, in this order)

Add each, test it, commit, move on. Don't stack incomplete features.

1. **Marquee** — pure CSS or GSAP-based, on Home
2. **Page transitions** — overlay panel using Astro's `astro:before-preparation` + `astro:after-swap` events
3. **Horizontal scroll** — About timeline using ScrollTrigger pinning
4. **WebGL image distortion** — on Work index grid (start with the [`hover-effect`](https://github.com/robin-dela/hover-effect) approach since it's lighter than rolling Three.js from scratch; this gets you a working WebGL hover with zero Three.js knowledge needed)
5. **Split-text reveals** — wherever headings need entrance animation

For each feature, expect the workflow described in Section 6 (Codrops snippet integration).

### Phase 5 — Polish + deploy

- Image optimization (use Astro's `<Image />`)
- Font loading (`font-display: swap`, preload critical weights)
- Lighthouse target: Performance 90+, Accessibility 95+
- `prefers-reduced-motion` fallbacks on every animation
- Deploy: `npx vercel` or push to a Netlify-connected repo

---

## 6. How to paste Codrops snippets (workflow)

This is the workflow you'll repeat often:

1. Find the snippet on Codrops, copy the codepen / demo link or paste the raw HTML/CSS/JS into the Claude Code chat
2. Tell Claude Code: *"Adapt this Codrops snippet into our project as `<ComponentName>`. Follow CLAUDE.md rules."*
3. Claude Code should:
   - Create a new file under `src/components/motion/` or `src/components/sections/`
   - Move CSS into a co-located `.scss` file (SCSS module)
   - Wrap JS in `<script>` at the bottom of the `.astro` file, or extract to `src/scripts/` if reusable
   - Ensure animations register with the global Lenis instance (use `ScrollTrigger.refresh()` on mount)
   - Add cleanup for Astro page transitions (`astro:before-preparation` event)
4. Verify it works on hot reload, then commit

---

## 7. Acceptance checklist (whole project)

- [ ] Lighthouse Performance ≥ 90 on Home and Work pages
- [ ] No layout shift during preloader → site reveal
- [ ] Smooth scroll feels right on trackpad AND mouse wheel (Lenis options tuned)
- [ ] Cursor doesn't show on touch devices
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Page transitions don't break ScrollTrigger (test by navigating away from a pinned section and back)
- [ ] Bundle size: under 200KB JS gzipped on first paint
- [ ] Works in Safari (Lenis sometimes needs tuning here)

---

## 8. First message to send Claude Code

After you've cloned an empty repo and dropped `CLAUDE.md` and this `PORTFOLIO_PLAN.md` into the root, open Claude Code and send:

> Read `CLAUDE.md` and `PORTFOLIO_PLAN.md`. Then execute Phase 1 (Bootstrap). Stop after Phase 1 and show me `npm run dev` is working before moving on.

Work through phases one at a time. Don't let Claude Code skip ahead.
