(() => {
  const preferenceKey = 'datavyx-clarity-consent';
  const banner = document.querySelector('#analytics-banner');
  const preferences = document.querySelector('#analytics-preferences');
  const allow = document.querySelector('#analytics-allow');
  const decline = document.querySelector('#analytics-decline');
  const status = document.querySelector('#analytics-status');
  if (!banner || !preferences || !allow || !decline || !status) return;

  let consent = null;
  let loaded = false;
  try { consent = localStorage.getItem(preferenceKey); } catch { /* Ask on each visit if storage is unavailable. */ }

  const start = () => {
    if (loaded) return;
    loaded = true;
    // Queue the consent signal before loading the official project tag.
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.clarity.ms/tag/zhvsyh2koe';
    tag.onerror = () => {
      status.textContent = 'Analytics could not load. You can continue using the website.';
      console.warn('Datavyx: Clarity could not load.');
    };
    document.head.appendChild(tag);
  };

  const choose = (value) => {
    consent = value;
    try { localStorage.setItem(preferenceKey, value); } catch { /* The choice still applies to this page. */ }
    banner.hidden = true;
    preferences.focus();
    if (value === 'granted') {
      start();
    } else if (loaded) {
      window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
      // Clear Clarity's first-party cookies, then unload the running recorder.
      ['_clck', '_clsk'].forEach((name) => {
        const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
        document.cookie = expired;
        document.cookie = `${expired}; Domain=${location.hostname}`;
        if (location.hostname.endsWith('.datavyx.com')) document.cookie = `${expired}; Domain=datavyx.com`;
      });
      location.reload();
    }
  };

  preferences.hidden = false;
  preferences.addEventListener('click', () => {
    banner.hidden = false;
    allow.focus();
  });
  allow.addEventListener('click', () => choose('granted'));
  decline.addEventListener('click', () => choose('denied'));
  banner.querySelector('a').addEventListener('click', () => {
    banner.hidden = true;
  });
  document.addEventListener('click', (event) => {
    if (consent !== 'granted') return;
    const target = event.target.closest('a, button');
    if (!target) return;
    let name;
    if (target.id === 'copy-mcp') name = 'copy_mcp_clicked';
    else if (target.matches('a[href="#connect"]')) name = 'connection_guide_clicked';
    else if (target.matches('.cta-action a[href^="mailto:"]')) name = 'connection_help_clicked';
    if (name) window.clarity('event', name);
  });

  if (consent === 'granted') start();
  else if (consent !== 'denied') banner.hidden = false;
})();
