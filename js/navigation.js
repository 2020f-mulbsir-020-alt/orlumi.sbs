/**
 * Orlumi — Prism Navigation
 * Floating prism that splits into light fragments for navigation
 */

(function () {
  'use strict';

  const nav = document.querySelector('.prism-nav');
  const trigger = document.querySelector('.prism-trigger');
  const fragments = document.getElementById('nav-fragments');

  if (!nav || !trigger || !fragments) return;

  let isOpen = false;

  function createBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'nav-fragment-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove());
  }

  function openNav() {
    isOpen = true;
    nav.classList.add('open');
    fragments.removeAttribute('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');

    requestAnimationFrame(() => {
      fragments.classList.add('open');
    });

    const rect = trigger.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function closeNav() {
    isOpen = false;
    nav.classList.remove('open');
    fragments.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');

    setTimeout(() => {
      if (!isOpen) fragments.setAttribute('hidden', '');
    }, 500);
  }

  function toggleNav() {
    isOpen ? closeNav() : openNav();
  }

  trigger.addEventListener('click', toggleNav);

  fragments.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });

  fragments.addEventListener('click', (e) => {
    if (e.target === fragments) closeNav();
  });
})();
