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
  copyStatus.textContent = 'Copy this address into your client’s MCP settings.';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(endpoint.value);
      copyStatus.textContent = 'Server URL copied. Paste it into your client’s MCP settings.';
    } catch {
      endpoint.focus();
      endpoint.select();
      copyStatus.textContent = 'Could not copy automatically. The address is selected; copy it manually.';
    }
  });
}

const promptCopyStatus = document.querySelector('#prompt-copy-status');

if (promptCopyStatus) {
  document.querySelectorAll('[data-copy-prompt]').forEach((button) => {
    const prompt = document.getElementById(button.dataset.copyPrompt);
    if (!prompt) return;

    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(prompt.textContent);
        promptCopyStatus.textContent = 'Prompt copied. Paste it into your chat.';
      } catch {
        promptCopyStatus.textContent = 'Could not copy automatically. Select the prompt text and copy it manually.';
      }
    });
  });
}
