import { gsap } from 'gsap';

export function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;

  // Not first visit — vanish immediately, no animation
  if (sessionStorage.getItem('seen')) {
    el.style.display = 'none';
    document.body.classList.remove('is-loading');
    return;
  }

  // Respect reduced-motion: skip visual animation, just mark as seen
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.display = 'none';
    document.body.classList.remove('is-loading');
    sessionStorage.setItem('seen', '1');
    return;
  }

  document.body.classList.add('is-loading');

  // Safety net: keyboard nav must not be blocked past 2 s.
  // Total animation is ~1.9 s, so this only fires if something stalls.
  const a11yTimer = setTimeout(() => {
    document.body.classList.remove('is-loading');
  }, 2000);

  const countEl = el.querySelector('.preloader__count');
  const obj = { n: 0 };

  gsap.timeline({
    onComplete() {
      clearTimeout(a11yTimer);
      sessionStorage.setItem('seen', '1');
      el.style.display = 'none';
      document.body.classList.remove('is-loading');
    },
  })
    .to(obj, {
      n: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate() {
        if (countEl) {
          countEl.textContent = String(Math.round(obj.n)).padStart(3, '0');
        }
      },
    })
    .to(el, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut',
    });
}
