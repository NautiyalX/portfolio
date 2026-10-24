/* ============================================================
   ADARSH NAUTIYAL — PORTFOLIO JAVASCRIPT
   ============================================================ */

'use strict';

// ============================================================
// THEME TOGGLE (Dark / Light)
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-moon';
  } else {
    themeIcon.className = 'fas fa-sun';
  }
}

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scroll-progress-bar');

window.addEventListener('scroll', updateScrollProgress, { passive: true });

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

// ============================================================
// NAVBAR — Scroll effect + Active link
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  updateScrollProgress();

  // Navbar shadow on scroll
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  // Back to top visibility
  const backToTop = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

// ============================================================
// MOBILE HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

hamburger.addEventListener('click', toggleMobileMenu);
navOverlay.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function toggleMobileMenu() {
  const isOpen = navLinksEl.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  navLinksEl.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// TYPED TEXT ANIMATION (Hero)
// ============================================================
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Technology Solutions',
  'Data Science & AI',
  'Client Communication',
  'Business Development',
  'Collaborative Problem Solver',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      typingTimeout = setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingTimeout = setTimeout(typeEffect, 400);
      return;
    }
  }

  const speed = isDeleting ? 50 : 90;
  typingTimeout = setTimeout(typeEffect, speed);
}

// Start after page loads
setTimeout(typeEffect, 1000);

// ============================================================
// ANIMATED COUNTERS (Hero Stats)
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1500;
    const start = performance.now();

    function updateCounter(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      counter.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger skill bar animations when skill panel is visible
        if (entry.target.closest('#skills')) {
          animateSkillBars(entry.target);
        }

        // Trigger grade bar animations
        if (entry.target.classList.contains('edu-card')) {
          animateGradeBars(entry.target);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter observer (hero section)
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ============================================================
// SKILL BAR ANIMATIONS
// ============================================================
function animateSkillBars(container) {
  const bars = container.querySelectorAll('.skill-bar');
  bars.forEach((bar, i) => {
    setTimeout(() => {
      bar.classList.add('animated');
    }, i * 80);
  });
}

// Also animate when tab switches
function animateAllVisibleSkillBars() {
  const activePanel = document.querySelector('.skill-panel.active');
  if (activePanel) {
    const bars = activePanel.querySelectorAll('.skill-bar');
    bars.forEach((bar, i) => {
      bar.style.width = '0%';
      setTimeout(() => {
        bar.classList.add('animated');
      }, i * 80 + 50);
    });
  }
}

// ============================================================
// GRADE BAR ANIMATIONS
// ============================================================
function animateGradeBars(container) {
  const bars = container.querySelectorAll('.grade-bar');
  bars.forEach((bar, i) => {
    setTimeout(() => {
      bar.classList.add('animated');
    }, i * 150);
  });
}

// Observe edu cards
document.querySelectorAll('.edu-card').forEach(card => {
  const gradeObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateGradeBars(entries[0].target);
        gradeObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  gradeObserver.observe(card);
});

// ============================================================
// SKILLS TABS
// ============================================================
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skill-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetPanel = tab.getAttribute('data-tab');

    // Update tabs
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update panels
    skillPanels.forEach(panel => {
      panel.classList.remove('active');
      // Reset bars for re-animation
      panel.querySelectorAll('.skill-bar').forEach(bar => {
        bar.classList.remove('animated');
        bar.style.width = '0%';
      });
    });

    const activePanel = document.getElementById('panel-' + targetPanel);
    if (activePanel) {
      activePanel.classList.add('active');
      // Animate bars with slight delay
      setTimeout(() => animateAllVisibleSkillBars(), 50);

      // Re-reveal skill cards in new panel
      activePanel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 10);
      });
    }
  });
});

// ============================================================
// BACK TO TOP
// ============================================================
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('form-submit-btn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    submitForm();
  }
});

function validateForm() {
  let valid = true;

  const name = document.getElementById('form-name');
  const email = document.getElementById('form-email');
  const subject = document.getElementById('form-subject');
  const message = document.getElementById('form-message');

  clearErrors();

  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('error-name', 'Please enter your full name.');
    name.classList.add('error');
    valid = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError('error-email', 'Please enter a valid email address.');
    email.classList.add('error');
    valid = false;
  }

  if (!subject.value.trim() || subject.value.trim().length < 3) {
    showError('error-subject', 'Please enter a subject.');
    subject.classList.add('error');
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    showError('error-message', 'Message must be at least 10 characters.');
    message.classList.add('error');
    valid = false;
  }

  return valid;
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
  formSuccess.classList.remove('show');
}

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}

async function submitForm() {
  const originalText = submitBtn.innerHTML;
  const formFailure = document.getElementById('form-failure');

  // Replace YOUR_FORM_ID with the form ID from your Formspree dashboard.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  formFailure.textContent = '';
  formSuccess.classList.remove('show');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok) {
      const details = result.errors
        ? result.errors.map(error => error.message).join(' ')
        : 'Unable to send your message. Please try again.';
      throw new Error(details);
    }

    contactForm.reset();
    formSuccess.classList.add('show');
  } catch (error) {
    formFailure.textContent =
      error.message || 'Something went wrong. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ============================================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// TILT EFFECT ON PROJECT CARDS
// ============================================================
document.querySelectorAll('.project-card, .skill-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 4;
    const tiltY = ((cx - x) / cx) * 4;
    card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ============================================================
// INITIAL SKILL BARS ANIMATION (first visible panel)
// ============================================================
const skillsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(animateAllVisibleSkillBars, 300);
      skillsObserver.disconnect();
    }
  },
  { threshold: 0.2 }
);
const skillsSection = document.querySelector('#skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// ============================================================
// CUSTOM CURSOR GLOW (subtle, optional)
// ============================================================
const cursorGlow = document.createElement('div');
cursorGlow.id = 'cursor-glow';
cursorGlow.style.cssText = `
  position: fixed;
  pointer-events: none;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: left 0.1s ease, top 0.1s ease;
  display: none;
`;
document.body.appendChild(cursorGlow);

// Only show on desktop
if (window.innerWidth > 768) {
  cursorGlow.style.display = 'block';
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ============================================================
// NAVBAR CLOSE ON RESIZE
// ============================================================
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
    if (window.innerWidth > 768) {
      cursorGlow.style.display = 'block';
    }
  } else {
    cursorGlow.style.display = 'none';
  }
});

// ============================================================
// MARK BODY AS LOADED
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  // Initial scroll check
  onScroll();
});

// Run initial scroll state
onScroll();

console.log(
  '%c✨ Adarsh Nautiyal Portfolio',
  'font-size:18px; font-weight:bold; color:#38BDF8; background:#0F172A; padding:10px 20px; border-radius:8px;'
);
console.log(
  '%cBuilt with ❤️ using HTML, CSS, JavaScript',
  'color:#94A3B8; font-size:12px;'
);
