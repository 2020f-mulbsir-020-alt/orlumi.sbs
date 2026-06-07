/**
 * Orlumi — Main Application
 * Initializes canvas effects and global behaviors
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    OrlumiEffects.initLanterns();
    OrlumiEffects.initConstellation();
    OrlumiEffects.initAurora();

    document.querySelectorAll('.crystal').forEach(crystal => {
      crystal.setAttribute('tabindex', '0');
    });

    document.querySelectorAll('.prism-item').forEach(item => {
      item.setAttribute('tabindex', '0');
    });
  });
})();
