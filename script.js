/* ============================================
   NISHTHA JAIN — PORTFOLIO JS
   ============================================ */

// ─── HERO: SHOW IMMEDIATELY (no wait for scroll) ──
// Elements start opacity:0 via CSS; we flip them right away for the hero
function revealHero() {
  document.querySelectorAll('.hero .reveal, .hero .reveal-delay').forEach(el => {
    el.classList.add('visible');
  });
}
// Run now (script is at end of body, DOM is ready)
revealHero();

// ─── NAV SCROLL EFFECT ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── HAMBURGER MENU ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ─── SCROLL REVEAL (for everything outside hero) ──
const revealEls = document.querySelectorAll('.reveal:not(.visible), .reveal-delay:not(.visible)');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -30px 0px'
  });
  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: just show everything
  document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
    el.classList.add('visible');
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--terracotta)';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
}

// ─── CONTACT FORM ─────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.style.display = 'none';
      success.style.display = 'block';
      contactForm.reset();
    }, 1200);
  });
}

// ─── SMOOTH SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ─── STAGGER GRID ITEMS ───────────────────────
[
  '.achievements-grid .ach-card',
  '.extras-grid .extra-item',
  '.projects-grid .project-card',
  '.skills-grid .skill-group',
].forEach(selector => {
  document.querySelectorAll(selector).forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });
});

/* ─── PHONE SLIDESHOW ────────────────────────── */
const slideshows = {};

function initSlideshow(id) {
  const container = document.getElementById(id);
  if (!container) return;

  const slides = container.querySelectorAll('.slide');
  const dotsContainer = document.getElementById(id.replace('Slideshow', 'Dots'));
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  slideshows[id] = {
    current: 0,
    total: slides.length,
    slides,
    dots,
    timer: null,
    paused: false
  };

  // Auto-play every 3s
  startTimer(id);

  // Pause on hover over the phone mockup
  const wrap = container.closest('.phone-mockup-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => { slideshows[id].paused = true; clearInterval(slideshows[id].timer); });
    wrap.addEventListener('mouseleave', () => { slideshows[id].paused = false; startTimer(id); });
  }
}

function startTimer(id) {
  clearInterval(slideshows[id].timer);
  slideshows[id].timer = setInterval(() => {
    if (!slideshows[id].paused) changeSlide(id, 1);
  }, 3000);
}

function goToSlide(id, index) {
  const s = slideshows[id];
  if (!s) return;

  s.slides[s.current].classList.remove('active');
  if (s.dots[s.current]) s.dots[s.current].classList.remove('active');

  s.current = (index + s.total) % s.total;

  s.slides[s.current].classList.add('active');
  if (s.dots[s.current]) s.dots[s.current].classList.add('active');

  // Reset timer on manual nav
  startTimer(id);
}

function changeSlide(id, direction) {
  const s = slideshows[id];
  if (!s) return;
  goToSlide(id, s.current + direction);
}

// Init all slideshows on page
initSlideshow('healthSlideshow');
