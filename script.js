/* ═══════════════════════════════════════════════════════════════════
   DIVYA — PORTFOLIO  |  script.js
   Particles · Cursor · Typing · Scroll Reveal · Skill Bars · Navbar
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. CUSTOM CURSOR ──────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring animation
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .skill-card, .project-card, .profile-card, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'rgba(34,211,238,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(34,211,238,0.5)';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ─── 2. ANIMATED PARTICLE CANVAS ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  // Colours for particles
  const COLOURS = ['rgba(34,211,238,', 'rgba(167,139,250,', 'rgba(61,220,132,', 'rgba(251,146,60,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle factory
  function createParticle() {
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.5,
      dx:    (Math.random() - 0.5) * 0.35,
      dy:    (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      colour
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  // Draw connection lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    particles.forEach(p => {
      // Pulse opacity
      p.pulse += 0.02;
      const a = p.alpha + Math.sin(p.pulse) * 0.1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.colour + Math.max(0, Math.min(1, a)) + ')';
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;
    });

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ─── 3. NAVBAR ─────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll → add 'scrolled' class
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
    toggleBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Highlight active nav link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }
})();


/* ─── 4. TYPING EFFECT ──────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Android Developer',
    'DSA Learner',
    'Future Software Engineer',
    'AI Enthusiast',
    'Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let pause      = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; isDeleting = true; }, 1800);
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }

    if (!pause) {
      const speed = isDeleting ? 50 : 90;
      setTimeout(type, speed);
    }
  }
  setTimeout(type, 600);
})();


/* ─── 5. SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─── 6. ANIMATED SKILL BARS ────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar   = entry.target;
      const width = bar.getAttribute('data-width') || '0';
      // Short delay for stagger effect
      setTimeout(() => { bar.style.width = width + '%'; }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ─── 7. CONTACT FORM ───────────────────────────────────────────── */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      shake(submitBtn);
      return;
    }
    if (!isValidEmail(email)) {
      shake(form.email);
      return;
    }

    // Simulate sending
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    submitBtn.disabled  = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled  = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  // Inject shake keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── 8. BACK TO TOP BUTTON ─────────────────────────────────────── */
function toggleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── 9. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = document.querySelector('.navbar').offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── 10. NAVBAR SCROLL + BACK-TO-TOP INIT ──────────────────────── */
// Run once on load in case page is already scrolled
(function () {
  const navbar = document.getElementById('navbar');
  if (navbar && window.scrollY > 50) navbar.classList.add('scrolled');
  toggleBackToTop();
})();


/* ─── 11. PROJECT CARD TILT EFFECT (subtle 3D on hover) ─────────── */
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) * 5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─── 12. SKILL CARD GLOW ON HOVER ──────────────────────────────── */
(function initSkillGlow() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });
})();


/* ─── 13. ACTIVE SECTION HIGHLIGHT ON SCROLL ─────────────────────── */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) {
      current = sec.id;
    }
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });


/* ─── 14. PROFILE CARD GLOW ─────────────────────────────────────── */
(function initProfileGlow() {
  const colourMap = {
    github:     '240,246,252',
    leetcode:   '251,161,80',
    codeforces: '30,128,255',
    linkedin:   '10,102,194',
  };

  document.querySelectorAll('.profile-card').forEach(card => {
    const platform = card.getAttribute('data-platform');
    const clr      = colourMap[platform] || '34,211,238';
    const glow     = card.querySelector('.profile-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(${clr},0.12) 0%, transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (glow) glow.style.background = '';
    });
  });
})();


/* ─── 15. LOADING — hide body flash ─────────────────────────────── */
// Everything is CSS-driven, no JS loading screen needed.
// Reveal animations handle the entrance experience.

console.log('%c✨ Divya\'s Portfolio | Built with ❤️ & lots of ☕', 'color:#22d3ee;font-size:14px;font-weight:bold;');
