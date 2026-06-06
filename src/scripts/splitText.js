import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

let ctx = null;

export function initSplitText() {
  if (ctx) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('[data-split-reveal]');
  if (!els.length) return;

  ctx = gsap.context(() => {
    els.forEach(el => {
      const isHero = el.dataset.splitReveal === 'hero';
      const split = new SplitText(el, { type: 'lines' });

      gsap.fromTo(
        split.lines,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.09,
          delay: isHero ? 0.15 : 0,
          scrollTrigger: {
            trigger: el,
            // Hero headings are already in view — 'top bottom' fires on refresh.
            start: isHero ? 'top bottom' : 'top 88%',
            once: true,
          },
        }
      );
    });
  });
}

export function destroySplitText() {
  if (!ctx) return;
  ctx.revert();
  ctx = null;
}
