/* ============================================================
   MOHAMMAD FAIZAN — PORTFOLIO SCRIPT
   Modules:
   1. Shared state (reduced motion)
   2. Mobile nav toggle
   3. Scroll reveal (IntersectionObserver)
   4. Hero terminal typewriter
   5. Avatar animation (rotating ring + float + pulse)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. SHARED STATE ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  function initNavToggle() {
    const navtoggle = document.getElementById('navtoggle');
    const navlinks = document.getElementById('navlinks');
    if (!navtoggle || !navlinks) return;

    navtoggle.addEventListener('click', () => {
      const open = navlinks.classList.toggle('open');
      navtoggle.setAttribute('aria-expanded', open);
    });

    navlinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navlinks.classList.remove('open');
        navtoggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ---------- 3. SCROLL REVEAL ---------- */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }


  /* ---------- 4. HERO TERMINAL TYPEWRITER ---------- */
  function initTypewriter() {
    const container = document.getElementById('typewriter');
    if (!container) return;

    const script = [
      { type: 'req', text: '$ curl https://api.faizan.dev/profile' },
      { type: 'pause' },
      { type: 'status', text: 'HTTP/1.1 200 OK' },
      {
        type: 'json',
        text:
`{
  "name": "Mohammad Faizan",
  "role": "Full-Stack Developer",
  "stack": ["Node.js", "Express", "MongoDB", "React"],
  "education": "B.Tech CSE, 2025",
  "location": "Telangana, India",
  "availability": "open to work"
}`,
      },
    ];

    if (reduceMotion) {
      container.innerHTML =
        '<span class="req">$ curl https://api.faizan.dev/profile</span><br><br>' +
        '<span class="status">HTTP/1.1 200 OK</span><br>' +
        `<pre>${script[3].text}</pre>`;
      return;
    }

    const speed = 18;
    const out = document.createElement('div');
    container.appendChild(out);
    let i = 0;

    function typeLine(text, className, done) {
      const el = document.createElement(className === 'json' ? 'pre' : 'span');
      if (className) el.className = className;
      out.appendChild(el);

      let j = 0;
      (function step() {
        if (j <= text.length) {
          el.textContent = text.slice(0, j);
          j++;
          setTimeout(step, speed);
        } else {
          out.appendChild(document.createElement('br'));
          if (className !== 'json') out.appendChild(document.createElement('br'));
          done();
        }
      })();
    }

    function next() {
      if (i >= script.length) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        out.appendChild(cursor);
        return;
      }
      const item = script[i];
      i++;

      if (item.type === 'pause') {
        setTimeout(next, 400);
      } else {
        const className = item.type === 'req' ? 'req' : item.type === 'status' ? 'status' : 'json';
        typeLine(item.text, className, next);
      }
    }

    next();
  }


  /* ---------- 5. AVATAR ANIMATION ---------- */
  // Three independent JS-driven motions on the avatar graphic:
  //   a) the dashed outer ring rotates continuously
  //   b) the whole avatar gently floats up and down
  //   c) the "available" status dot pulses its glow
  function initAvatarAnimation() {
    const orbit = document.querySelector('.avatar-orbit');
    const ring = document.querySelector('.avatar-ring');
    const statusDot = document.querySelector('.avatar-status .dot');
    if (!orbit || !ring) return;

    if (reduceMotion) {
      ring.style.setProperty('--ring-offset', '0');
      return;
    }

    let start = null;
    const ROTATE_PERIOD_MS = 14000;   // one full ring rotation
    const FLOAT_PERIOD_MS = 3200;     // one float up/down cycle
    const FLOAT_AMPLITUDE_PX = 7;
    const PULSE_PERIOD_MS = 2000;

    function frame(timestamp) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;

      // a) dashes travel continuously along the shape's edge
const offsetProgress = (elapsed % ROTATE_PERIOD_MS) / ROTATE_PERIOD_MS;
ring.style.setProperty('--ring-offset', `${-(offsetProgress * 480)}`);

      // b) gentle float via sine wave — moves the photo and ring together
      const floatPhase = (elapsed % FLOAT_PERIOD_MS) / FLOAT_PERIOD_MS;
      const floatY = Math.sin(floatPhase * Math.PI * 2) * FLOAT_AMPLITUDE_PX;
      orbit.style.transform = `translateY(${floatY.toFixed(2)}px)`;

      // c) status dot glow pulse
      if (statusDot) {
        const pulsePhase = (elapsed % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;
        const glow = 4 + Math.sin(pulsePhase * Math.PI * 2) * 4; // 0–8px range
        statusDot.style.boxShadow = `0 0 ${glow.toFixed(1)}px var(--status-ok)`;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }


  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initScrollReveal();
    initTypewriter();
    initAvatarAnimation();
  });
})();
