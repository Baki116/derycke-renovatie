/**
 * Beweging — subtiel en zonder poespas.
 * - zachte scroll (Lenis), enkel met muis/trackpad en zonder "beperk beweging"
 * - secties verschijnen bij het scrollen (data-reveal / data-reveal-groep)
 * - voortgangslijn bij "Zo verloopt uw project" (data-voortgang)
 * Alles valt terug op een statische pagina zonder JavaScript of met prefers-reduced-motion.
 */
import Lenis from 'lenis';

const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

// ── Zachte scroll ───────────────────────────────────────────
let lenis: Lenis | null = null;
if (!rustig && window.matchMedia('(pointer: fine)').matches) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -96 } });
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  // Overlays (menu, assistent) blokkeren het scrollen van de pagina
  new MutationObserver(() => {
    if (root.hasAttribute('data-scroll-stop')) lenis!.stop();
    else lenis!.start();
  }).observe(root, { attributes: true, attributeFilter: ['data-scroll-stop'] });
}

// ── Verschijnen bij scrollen ────────────────────────────────
const groepen = document.querySelectorAll<HTMLElement>('[data-reveal-groep]');
groepen.forEach((g) => {
  [...g.children].forEach((kind, i) => {
    (kind as HTMLElement).setAttribute('data-reveal', '');
    (kind as HTMLElement).style.setProperty('--i', String(Math.min(i, 8)));
  });
});

const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (rustig || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-zichtbaar'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-zichtbaar');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

// ── Voortgangslijn ──────────────────────────────────────────
const voortgang = document.querySelectorAll<HTMLElement>('[data-voortgang]');
if (voortgang.length) {
  let gepland = false;
  const meet = () => {
    gepland = false;
    const h = window.innerHeight;
    voortgang.forEach((el) => {
      const r = el.getBoundingClientRect();
      // 0 wanneer de bovenkant op 75 % van het scherm staat, 1 wanneer de onderkant op 45 % staat
      const start = h * 0.75;
      const einde = h * 0.45;
      const p = (start - r.top) / (r.height + start - einde);
      el.style.setProperty('--voortgang', String(Math.max(0, Math.min(1, p))));
    });
  };
  const plan = () => {
    if (!gepland) {
      gepland = true;
      requestAnimationFrame(meet);
    }
  };
  if (rustig) voortgang.forEach((el) => el.style.setProperty('--voortgang', '1'));
  else {
    meet();
    window.addEventListener('scroll', plan, { passive: true });
    window.addEventListener('resize', plan);
  }
}

export {};
