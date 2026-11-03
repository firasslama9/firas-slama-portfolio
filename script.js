const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Count the homepage metrics once, when the strip enters the viewport.
const counters = document.querySelectorAll('.count-up[data-count]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatCounter = (element, value) => {
  const pad = Number(element.dataset.pad || 0);
  const suffix = element.dataset.suffix || '';
  element.textContent = String(value).padStart(pad, '0') + suffix;
};

const showFinalCounter = element => {
  formatCounter(element, Number(element.dataset.count));
};

const animateCounter = element => {
  const target = Number(element.dataset.count);
  const duration = 1150;
  let startTime = null;

  const tick = timestamp => {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    formatCounter(element, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (reduceMotion || !('IntersectionObserver' in window)) {
  counters.forEach(showFinalCounter);
} else {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.55 });

  counters.forEach(counter => counterObserver.observe(counter));
}
