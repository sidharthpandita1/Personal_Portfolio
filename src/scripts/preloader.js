import { gsap } from 'gsap';

/**
 * @param {() => void} onDone  Called once the overlay is gone and the site
 *                             is safe to make interactive (Lenis, cursor, etc.).
 *                             Fires immediately when the preloader is skipped
 *                             (repeat visit, reduced-motion, no element).
 */
export function initPreloader(onDone = () => {}) {
  const el = document.getElementById('preloader');
  if (!el) { onDone(); return; }

  // Repeat visit — hide instantly, hand off immediately
  if (sessionStorage.getItem('seen')) {
    el.style.display = 'none';
    document.body.classList.remove('is-loading');
    onDone();
    return;
  }

  // Reduced-motion — skip animation, hand off immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.display = 'none';
    document.body.classList.remove('is-loading');
    sessionStorage.setItem('seen', '1');
    onDone();
    return;
  }

  document.body.classList.add('is-loading');

  // Safety net: if the animation stalls past 2 s, unlock the page anyway.
  const a11yTimer = setTimeout(() => {
    document.body.classList.remove('is-loading');
    onDone();
  }, 2000);

  const countEl = el.querySelector('.preloader__count');
  const obj = { n: 0 };

  gsap.timeline({
    onComplete() {
      clearTimeout(a11yTimer);
      sessionStorage.setItem('seen', '1');
      el.style.display = 'none';
      document.body.classList.remove('is-loading');
      onDone(); // Lenis + cursor mount here, after overlay is gone
    },
  })
    .to(obj, {
      n: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate() {
        if (countEl) countEl.textContent = String(Math.round(obj.n)).padStart(3, '0');
      },
    })
    .to(el, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut',
    });
}
