/**
 * Orlumi — Canvas Effects Engine
 * Particles, lanterns, constellations, aurora, ripples
 */

const OrlumiEffects = (function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Light Door Particles ---- */
  function initLightDoorParticles() {
    const canvas = document.querySelector('.light-door__particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animating = false;
    let animationId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles(count) {
      particles = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 200 + 50;
        particles.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          targetX: centerX + (Math.random() - 0.5) * 300,
          targetY: centerY + (Math.random() - 0.5) * 100,
          size: Math.random() * 2 + 0.5,
          opacity: 0,
          speed: Math.random() * 0.02 + 0.005,
          color: Math.random() > 0.5 ? '#F8F7F2' : '#E7B7D8'
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;
        p.opacity = Math.min(p.opacity + 0.01, 0.8);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (animating) {
        animationId = requestAnimationFrame(draw);
      }
    }

    function start() {
      if (prefersReducedMotion) return;
      resize();
      createParticles(120);
      animating = true;
      draw();
    }

    function stop() {
      animating = false;
      if (animationId) cancelAnimationFrame(animationId);
    }

    window.addEventListener('resize', resize);

    return { start, stop, canvas };
  }

  /* ---- Reflection Pool Ripples ---- */
  function initPoolRipples(pool) {
    const canvas = pool.querySelector('.pool__ripple-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let ripples = [];

    function resize() {
      const rect = pool.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resize();
    window.addEventListener('resize', resize);

    function addRipple(x, y) {
      ripples.push({ x, y, radius: 0, maxRadius: 80, opacity: 0.6 });
      pool.classList.add('revealed');

      setTimeout(() => pool.classList.remove('revealed'), 4000);
    }

    pool.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    });

    pool.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      addRipple(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples = ripples.filter(r => {
        r.radius += 2;
        r.opacity -= 0.008;

        if (r.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(248, 247, 242, ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(185, 217, 255, ${r.opacity * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ---- Floating Lanterns ---- */
  function initLanterns() {
    const canvas = document.querySelector('.lanterns-canvas');
    const detail = document.getElementById('lantern-detail');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let lanterns = [];
    let mouseX = 0;
    let mouseY = 0;
    let hoveredLantern = null;

    const stories = [
      { type: 'Story', title: 'First Light', text: 'In the beginning, there was only darkness — and then, a single beam decided to exist.' },
      { type: 'Discovery', title: 'Prismatic Dawn', text: 'They found that white light contains every color, waiting patiently to be revealed.' },
      { type: 'Experience', title: 'Walking Through Glow', text: 'To move through light is to move through time itself — each step a different hour.' },
      { type: 'Idea', title: 'Architecture of Radiance', text: 'What if buildings were made not of stone, but of pure, sculpted illumination?' },
      { type: 'Story', title: 'The Mirror Room', text: 'Infinite reflections taught her that identity is light bounced back upon itself.' },
      { type: 'Discovery', title: 'Shadow\'s Purpose', text: 'Without darkness, light has no meaning — they are partners in the dance of visibility.' },
      { type: 'Experience', title: 'Aurora Memory', text: 'She once stood beneath ribbons of color moving across the sky and forgot to breathe.' },
      { type: 'Idea', title: 'Liquid Light', text: 'Perhaps light could flow like water — pooling, rippling, reflecting the heavens.' },
      { type: 'Story', title: 'The Lantern Keeper', text: 'He tended hundreds of floating lights, each one holding a fragment of human wonder.' },
      { type: 'Discovery', title: 'Color Temperature', text: 'Warm light heals; cool light clarifies — the spectrum carries emotion in its wavelength.' }
    ];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createLanterns(count) {
      lanterns = [];
      for (let i = 0; i < count; i++) {
        lanterns.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.1,
          size: Math.random() * 6 + 3,
          glow: Math.random() * 0.3 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          story: stories[i % stories.length]
        });
      }
    }

    resize();
    createLanterns(prefersReducedMotion ? 30 : 80);

    window.addEventListener('resize', () => {
      resize();
      createLanterns(prefersReducedMotion ? 30 : 80);
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
    });

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 18, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hoveredLantern = null;

      lanterns.forEach(l => {
        const dx = mouseX - l.x;
        const dy = mouseY - l.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 60) {
          l.vx += dx * 0.0003;
          l.vy += dy * 0.0003;
          if (dist < 30) hoveredLantern = l;
        }

        l.x += l.vx;
        l.y += l.vy;
        l.pulse += 0.02;

        if (l.x < 0) l.x = canvas.width;
        if (l.x > canvas.width) l.x = 0;
        if (l.y < 0) l.y = canvas.height;
        if (l.y > canvas.height) l.y = 0;

        l.vx *= 0.99;
        l.vy *= 0.99;

        const brightness = l.glow + Math.sin(l.pulse) * 0.15;
        const gradient = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 4);
        gradient.addColorStop(0, `rgba(248, 247, 242, ${brightness})`);
        gradient.addColorStop(0.3, `rgba(231, 183, 216, ${brightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(185, 217, 255, 0)');

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 247, 242, ${brightness + 0.3})`;
        ctx.fill();
      });

      if (detail) {
        if (hoveredLantern) {
          detail.hidden = false;
          detail.querySelector('.lantern-detail__type').textContent = hoveredLantern.story.type;
          detail.querySelector('.lantern-detail__title').textContent = hoveredLantern.story.title;
          detail.querySelector('.lantern-detail__text').textContent = hoveredLantern.story.text;
        } else {
          detail.hidden = true;
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ---- Constellation of Voices ---- */
  function initConstellation() {
    const canvas = document.querySelector('.constellation-canvas');
    const container = document.getElementById('constellation-voices');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let connections = [];
    let hoveredStar = null;

    const voices = [
      { text: 'Light does not simply illuminate — it transforms the very nature of what it touches.', author: 'Elena Voss, Light Architect' },
      { text: 'In Orlumi, I found that reflection is not duplication, but revelation.', author: 'Marcus Chen, Visual Philosopher' },
      { text: 'Every color carries a temperature, an emotion, a memory waiting to be felt.', author: 'Aria Nakamura, Chromatic Artist' },
      { text: 'The shadow gallery taught me that absence can be more eloquent than presence.', author: 'David Okonkwo, Exhibition Designer' },
      { text: 'Walking through the prism corridor felt like being parsed into pure experience.', author: 'Sofia Lindström, Spatial Poet' },
      { text: 'Orlumi is not a place you visit — it is a wavelength you inhabit.', author: 'James Whitfield, Atmospheric Composer' }
    ];

    let quoteEl = container.querySelector('.constellation-quote');
    if (!quoteEl) {
      quoteEl = document.createElement('div');
      quoteEl.className = 'constellation-quote';
      quoteEl.innerHTML = '<p class="constellation-quote__text"></p><span class="constellation-quote__author"></span>';
      container.appendChild(quoteEl);
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createStars() {
      stars = [];
      const count = prefersReducedMotion ? 40 : 80;

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          voice: voices[i % voices.length],
          constellation: Math.floor(i / (count / voices.length))
        });
      }

      connections = [];
      stars.forEach((s, i) => {
        stars.forEach((s2, j) => {
          if (i >= j) return;
          if (s.constellation === s2.constellation) {
            const dx = s.x - s2.x;
            const dy = s.y - s2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              connections.push({ from: s, to: s2, opacity: 0 });
            }
          }
        });
      });
    }

    resize();
    createStars();
    window.addEventListener('resize', () => { resize(); createStars(); });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      hoveredStar = null;
      stars.forEach(s => {
        const dx = mx - s.x;
        const dy = my - s.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) hoveredStar = s;
      });
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      connections.forEach(c => {
        const targetOpacity = (hoveredStar && (hoveredStar === c.from || hoveredStar === c.to)) ? 0.4 :
          (c.from.constellation === (hoveredStar?.constellation ?? -1)) ? 0.2 : 0.05;
        c.opacity += (targetOpacity - c.opacity) * 0.05;

        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.lineTo(c.to.x, c.to.y);
        ctx.strokeStyle = `rgba(185, 217, 255, ${c.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      stars.forEach(s => {
        s.pulse += 0.02;
        const brightness = s.opacity + Math.sin(s.pulse) * 0.2;
        const isHovered = hoveredStar === s;

        ctx.beginPath();
        ctx.arc(s.x, s.y, isHovered ? s.size * 3 : s.size, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, isHovered ? s.size * 3 : s.size);
        grad.addColorStop(0, `rgba(248, 247, 242, ${brightness + (isHovered ? 0.4 : 0)})`);
        grad.addColorStop(1, `rgba(231, 183, 216, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      if (hoveredStar) {
        quoteEl.classList.add('visible');
        quoteEl.querySelector('.constellation-quote__text').textContent = `"${hoveredStar.voice.text}"`;
        quoteEl.querySelector('.constellation-quote__author').textContent = hoveredStar.voice.author;
      } else {
        quoteEl.classList.remove('visible');
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ---- Aurora Dome ---- */
  function initAurora() {
    const canvas = document.querySelector('.aurora-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;
    let projectionIndex = 0;
    const projections = document.querySelectorAll('.projection');

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function cycleProjections() {
      projections.forEach((p, i) => {
        p.classList.toggle('projection--active', i === projectionIndex);
      });
      projectionIndex = (projectionIndex + 1) % projections.length;
    }

    if (!prefersReducedMotion) {
      setInterval(cycleProjections, 6000);
    }

    function drawAurora() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = [
        { r: 231, g: 183, b: 216 },
        { r: 185, g: 217, b: 255 },
        { r: 196, g: 181, b: 232 },
        { r: 168, g: 216, b: 185 }
      ];

      for (let band = 0; band < 4; band++) {
        const color = colors[band];
        ctx.beginPath();

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height * 0.3 +
            Math.sin(x * 0.005 + time * 0.5 + band * 1.5) * 40 +
            Math.sin(x * 0.002 + time * 0.3 + band) * 60 +
            band * 30;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const alpha = 0.15 - band * 0.03;
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();
      }

      time += prefersReducedMotion ? 0 : 0.01;
      requestAnimationFrame(drawAurora);
    }

    drawAurora();
  }

  return {
    initLightDoorParticles,
    initPoolRipples,
    initLanterns,
    initConstellation,
    initAurora
  };
})();
