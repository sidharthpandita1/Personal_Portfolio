import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let ctx = null;

export function initHorizontalScroll() {
  if (ctx) return; // guard against double-init

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const section = document.querySelector('[data-horizontal-scroll]');
  if (!section) return;

  const track = section.querySelector('[data-timeline-track]');
  if (!track) return;

  // Let GSAP own the movement; disable native overflow scroll.
  track.style.overflow = 'visible';
  track.style.cursor = 'default';

  ctx = gsap.context(() => {
    gsap.to(track, {
      x: () => -(track.scrollWidth - section.clientWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - section.clientWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }, section);
}

export function destroyHorizontalScroll() {
  if (!ctx) return;
  ctx.revert();
  ctx = null;

  const track = document.querySelector('[data-timeline-track]');
  if (track) {
    track.style.overflow = '';
    track.style.cursor = '';
  }
}
