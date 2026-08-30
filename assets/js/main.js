'use strict';

function initNavigation() {
  const nav = document.getElementById('nav');
  const menuButton = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!nav || !menuButton || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initRevealAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .project-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    animatedElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  );

  animatedElements.forEach((element) => observer.observe(element));
}

function init() {
  initNavigation();
  initRevealAnimations();
}

init();
