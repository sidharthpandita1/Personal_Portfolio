import { gsap } from 'gsap';

let xTo, yTo, scaleTo;
const listeners = [];

function on(el, event, fn) {
  el.addEventListener(event, fn);
  listeners.push({ el, event, fn });
}

export function initCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  gsap.set(cursor, { opacity: 1, scale: 1, x: -100, y: -100 });

  xTo    = gsap.quickTo(cursor, 'x',     { duration: 0.5,  ease: 'power3' });
  yTo    = gsap.quickTo(cursor, 'y',     { duration: 0.5,  ease: 'power3' });
  scaleTo = gsap.quickTo(cursor, 'scale', { duration: 0.35, ease: 'power2.out' });

  on(document, 'mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  document.querySelectorAll('[data-cursor="grow"]').forEach((el) => {
    on(el, 'mouseenter', () => scaleTo(3.5));
    on(el, 'mouseleave', () => scaleTo(1));
  });
}

export function destroyCursor() {
  listeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
  listeners.length = 0;

  const cursor = document.getElementById('cursor');
  if (cursor) {
    gsap.killTweensOf(cursor);
    gsap.set(cursor, { opacity: 0, scale: 1 });
  }
}
