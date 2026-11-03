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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Count all five headline figures from zero when the statistics strip enters view.
const counters = document.querySelectorAll('.count-up[data-count]');
const counterStrip = document.querySelector('.proof-strip');

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
  const duration = 1650;
  let startTime = null;
  element.classList.remove('is-counting');
  void element.offsetWidth;
  element.classList.add('is-counting');

  const tick = timestamp => {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    formatCounter(element, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
    else {
      showFinalCounter(element);
      element.classList.remove('is-counting');
    }
  };

  requestAnimationFrame(tick);
};

if (reduceMotion) {
  counters.forEach(showFinalCounter);
} else if (counterStrip && counters.length && 'IntersectionObserver' in window) {
  counters.forEach(counter => formatCounter(counter, 0));
  let countersStarted = false;
  const counterObserver = new IntersectionObserver(entries => {
    if (!countersStarted && entries.some(entry => entry.isIntersecting)) {
      countersStarted = true;
      counters.forEach((counter, index) => {
        window.setTimeout(() => animateCounter(counter), index * 110);
      });
      counterObserver.disconnect();
    }
  }, { threshold: 0.12, rootMargin: '0px 0px 80px 0px' });
  counterObserver.observe(counterStrip);
} else {
  counters.forEach(showFinalCounter);
}

// Reveal the About delivery path and Toolkit cards as they enter the viewport.
const revealItems = document.querySelectorAll('.delivery-step, .tool-card');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px 40px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
}
