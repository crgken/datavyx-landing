document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

const copyButton = document.querySelector('#copy-mcp');
const endpoint = document.querySelector('#mcp-url');
const copyStatus = document.querySelector('#copy-status');

if (copyButton && endpoint && copyStatus) {
  copyButton.hidden = false;
  copyStatus.textContent = '';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(endpoint.value);
      copyStatus.textContent = 'Copied';
    } catch {
      endpoint.focus();
      endpoint.select();
      copyStatus.textContent = 'Copy unavailable. Copy the selected URL manually.';
    }
  });
}

const setupFrame = document.querySelector('.setup-frame');

if (setupFrame && 'ResizeObserver' in window) {
  const walkthrough = setupFrame.querySelector('iframe');
  const fitWalkthrough = () => {
    const scale = Math.min(1, setupFrame.clientWidth / walkthrough.offsetWidth);
    setupFrame.style.setProperty('--setup-scale', String(scale));
  };

  setupFrame.setAttribute('data-fitted', '');
  fitWalkthrough();
  new ResizeObserver(fitWalkthrough).observe(setupFrame);
}
