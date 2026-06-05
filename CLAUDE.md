# CLAUDE.md

Project rules for any Claude Code session in this repo. Read this first before doing anything else.

---

## Stack (do not change without asking)

- **Astro 4.x**, static output, JavaScript (TS is a future migration)
- **SCSS modules** for styling
- **GSAP** (+ ScrollTrigger, SplitText) for animation
- **Lenis** for smooth scroll
- **Three.js** for WebGL effects (used sparingly)

Do **not** install: Tailwind, React, Vue, Solid, Motion (framer-motion), Locomotive Scroll, additional state libraries, or any UI kit. If you think you need one, ask first.

---

## File & naming conventions

- Components: `PascalCase.astro` in `src/components/`
- Scripts: `camelCase.js` in `src/scripts/`
- Styles: `_partial.scss` for partials, `Component.module.scss` for component-scoped
- Routes: lowercase kebab-case folders in `src/pages/`
- Co-locate `.astro` and `.module.scss` when possible

---

## Animation conventions

- **One Lenis instance** for the whole app. Initialize in `BaseLayout.astro` via `src/scripts/lenis.js`. Never create a second one.
- **Always** wire ScrollTrigger to Lenis:
  ```js
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **Cleanup matters.** Astro uses View Transitions. Every animation script must:
  - Listen for `astro:before-preparation` and kill GSAP tweens / ScrollTriggers
  - Re-init on `astro:after-swap`
  - Or use `gsap.context()` and dispose on unmount
- **`prefers-reduced-motion`** — every animation must have a fallback. Use:
  ```js
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ```
- **Don't use `requestAnimationFrame` directly** if GSAP's ticker can do the job — keeps everything synced.

---

## Codrops snippet adaptation rules

When the user pastes a Codrops snippet:

1. **Don't paste it verbatim** into a single file. Split into structure (`.astro`), styles (`.module.scss`), and logic (`<script>` or extracted `src/scripts/` file).
2. **Convert CSS variables** to match `src/styles/_tokens.scss`. Don't introduce new global tokens silently — ask if a new token is needed.
3. **Replace any duplicate smooth-scroll setup** in the snippet with our existing Lenis singleton.
4. **Replace any duplicate GSAP imports** — we already import GSAP once in `BaseLayout.astro`.
5. **Wrap event listeners** so they get torn down on page transition.
6. **Test on a non-snippet page** — make sure adding the snippet didn't break ScrollTrigger elsewhere (call `ScrollTrigger.refresh()` after mount).
7. **Comment the top of the file** with the Codrops source URL for future reference.

---

## Performance rules

- Lazy-load Three.js (`import('three')`) on pages that need it, not globally
- Use Astro's `<Image />` component for everything — never raw `<img>` with remote URLs
- Preload only critical fonts; use `font-display: swap`
- Keep first-paint JS under 100KB gzipped if possible
- No inline `<style>` blocks in `.astro` files larger than 30 lines — extract to `.module.scss`

---

## Accessibility (non-negotiable)

- Every interactive element keyboard-reachable
- Cursor effect must not steal focus from the real cursor — hide custom cursor on touch and on `prefers-reduced-motion`
- Preloader must not block keyboard nav for more than 2 seconds
- Marquee must pause on hover/focus
- Color contrast AA minimum

---

## What to do when stuck

- If a Codrops snippet conflicts with existing code, **stop and surface the conflict** in chat — don't silently overwrite working code
- If you need to install a new dependency, **ask first** with a one-line justification
- If a feature would push first-paint JS over 200KB, **flag it** and propose a lazy-load approach
- Never disable `prefers-reduced-motion` checks to "make the demo look better"

---

## Commands

```bash
npm run dev       # local dev with HMR
npm run build     # production build
npm run preview   # preview the production build
```

---

## Current phase

Update this line at the end of each phase so future sessions know where to resume:

> **Current phase:** Current phase: Phase 1 + Lenis foundation complete. Next: Cursor + Preloader
