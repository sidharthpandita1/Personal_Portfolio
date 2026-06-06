import { gsap } from 'gsap';

let coverResolve = null;

function el() {
  return document.getElementById('page-transition');
}

/**
 * Slide overlay in from the bottom. Returns a Promise that resolves when
 * the overlay fully covers the viewport — safe to swap DOM at that point.
 */
export function playTransitionIn() {
  const overlay = el();
  if (!overlay) return Promise.resolve();

  return new Promise(resolve => {
    coverResolve = resolve;
    gsap.timeline({ onComplete: () => coverResolve?.() })
      .set(overlay, { yPercent: 100 })
      .to(overlay, { yPercent: 0, duration: 0.65, ease: 'power3.inOut' });
  });
}

/**
 * Slide overlay out to the top, then reset for the next transition.
 */
export function playTransitionOut() {
  const overlay = el();
  if (!overlay) return;

  gsap.timeline({
    onComplete() { gsap.set(overlay, { yPercent: 100 }); },
  }).to(overlay, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' });
}
