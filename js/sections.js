/**
 * Orlumi — Section Interactions
 * Light Door scroll, Spectrum Chamber, Shadow Gallery, Ascension
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Light Door Scroll Experience ---- */
  function initLightDoor() {
    const section = document.getElementById('light-door');
    if (!section) return;

    const beam = section.querySelector('.light-door__beam');
    const doorway = section.querySelector('.light-door__doorway');
    const darkness = section.querySelector('.light-door__darkness');
    const logo = section.querySelector('.light-door__logo');
    const particles = section.querySelector('.light-door__particles');
    const letters = section.querySelectorAll('.logo-letter');
    const tagline = section.querySelector('.light-door__tagline');
    const scrollHint = section.querySelector('.scroll-hint');

    let particleEngine = null;

    function update() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));

      const beamWidth = 4 + progress * (window.innerWidth * 0.6);
      if (beam) beam.style.width = beamWidth + 'px';

      if (doorway) doorway.style.opacity = progress > 0.3 ? Math.min(1, (progress - 0.3) * 2) : 0;
      if (darkness) darkness.style.opacity = Math.max(0, 1 - progress * 1.5);

      if (progress > 0.5) {
        if (logo) logo.style.opacity = Math.min(1, (progress - 0.5) * 3);
        if (particles) particles.style.opacity = Math.min(1, (progress - 0.5) * 3);

        if (progress > 0.6 && !particleEngine) {
          particleEngine = OrlumiEffects.initLightDoorParticles();
          if (particleEngine) particleEngine.start();
        }

        const letterProgress = (progress - 0.6) / 0.3;
        letters.forEach((letter, i) => {
          if (letterProgress > i / letters.length) {
            letter.classList.add('visible');
          }
        });

        if (progress > 0.85 && tagline) tagline.classList.add('visible');
      }

      if (scrollHint) {
        scrollHint.classList.toggle('hidden', progress > 0.15);
      }

      if (progress >= 0.95) {
        if (beam) beam.style.position = 'absolute';
        if (doorway) doorway.style.position = 'absolute';
        if (darkness) darkness.style.position = 'absolute';
        if (logo) logo.style.position = 'absolute';
        if (particles) particles.style.position = 'absolute';
      }
    }

    if (prefersReducedMotion) {
      if (beam) beam.style.width = '40vw';
      if (doorway) doorway.style.opacity = '1';
      if (darkness) darkness.style.opacity = '0';
      if (logo) logo.style.opacity = '1';
      letters.forEach(l => l.classList.add('visible'));
      if (tagline) tagline.classList.add('visible');
      if (scrollHint) scrollHint.classList.add('hidden');
      section.style.height = '100vh';
      section.style.minHeight = '100vh';
      return;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Spectrum Chamber ---- */
  function initSpectrumChamber() {
    const chamber = document.querySelector('.chamber');
    if (!chamber) return;

    const zones = chamber.querySelectorAll('.spectrum-zone');
    const section = document.querySelector('.section--spectrum-chamber');

    zones.forEach(zone => {
      zone.addEventListener('click', () => {
        zones.forEach(z => {
          z.classList.remove('active');
          z.setAttribute('aria-selected', 'false');
        });
        zone.classList.add('active');
        zone.setAttribute('aria-selected', 'true');

        const color = zone.dataset.color;
        if (section && color) {
          section.style.setProperty('--chamber-color', color + '33');
          section.style.background = `radial-gradient(ellipse at center, ${color}15 0%, #1a1a1a 70%)`;
        }
      });
    });
  }

  /* ---- Shadow Gallery ---- */
  function initShadowGallery() {
    const objects = document.querySelectorAll('.shadow-object');

    objects.forEach(obj => {
      obj.setAttribute('tabindex', '0');

      function reveal() {
        objects.forEach(o => o.classList.remove('active'));
        obj.classList.add('active');
      }

      obj.addEventListener('mouseenter', reveal);
      obj.addEventListener('focus', reveal);
    });
  }

  /* ---- Light Ascension ---- */
  function initAscension() {
    const section = document.querySelector('.section--light-ascension');
    const enterBtn = document.getElementById('enter-orlumi');
    if (!section || !enterBtn) return;

    enterBtn.addEventListener('mouseenter', () => {
      section.classList.add('illuminated');
    });

    enterBtn.addEventListener('mouseleave', () => {
      section.classList.remove('illuminated');
    });

    enterBtn.addEventListener('focus', () => {
      section.classList.add('illuminated');
    });

    enterBtn.addEventListener('blur', () => {
      section.classList.remove('illuminated');
    });

    enterBtn.addEventListener('click', () => {
      section.classList.add('illuminated');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Reflection Pools ---- */
  function initPools() {
    document.querySelectorAll('.pool').forEach(pool => {
      OrlumiEffects.initPoolRipples(pool);
    });
  }

  /* ---- Intersection Observer for section reveals ---- */
  function initSectionReveals() {
    const headers = document.querySelectorAll('.section-header');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2 });

    headers.forEach(header => {
      header.style.opacity = '0';
      header.style.transform = 'translateY(30px)';
      header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(header);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLightDoor();
    initSpectrumChamber();
    initShadowGallery();
    initAscension();
    initPools();
    initSectionReveals();
  });
})();
