/* GA4 for ipsi.k-bigdata.kr: opt-in analytics, no applicant PII. */
(() => {
  'use strict';
  const ID = 'G-WN99333WLX'; // existing admissions/marketing GA4 property
  const HOST = 'ipsi.k-bigdata.kr';
  const STORAGE_KEY = 'ipsi-ga4-consent-v1';
  if (location.hostname.toLowerCase() !== HOST) return;

  let enabled = false;
  let started = false;
  let notice = null;
  const readConsent = () => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  };
  const writeConsent = value => {
    try { localStorage.setItem(STORAGE_KEY, value); }
    catch (_) { /* Private-mode storage is optional. */ }
  };
  function pagePath(pathname) {
    if (pathname === '/' || pathname === '/index.html') return '/';
    if (/^\/(?:[a-z0-9-]+\/){1,3}(?:index\.html)?$/i.test(pathname)) {
      return pathname.replace(/index\.html$/i, '');
    }
    return '/other';
  }
  function pageLocation() {
    const url = new URL(location.href);
    const query = new URLSearchParams();
    // Allow only campaign identifiers; never forward arbitrary URL parameters.
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9_-]{1,64}$/i.test(value)) query.set(key, value);
    }
    return location.origin + pagePath(location.pathname) +
      (query.size ? '?' + query.toString() : '');
  }
  function referrerOrigin(value) {
    if (!value) return '';
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.hostname.toLowerCase() === HOST
        ? url.origin + pagePath(url.pathname) : url.origin;
    } catch (_) { return ''; }
  }
  function event(name, params = {}) {
    if (enabled && typeof window.gtag === 'function') {
      window.gtag('event', name, { send_to: ID, ...params });
    }
  }
  function activate() {
    if (!enabled || started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: pageLocation(),
      page_referrer: referrerOrigin(document.referrer),
      page_title: document.title
    });
    event('page_view', {
      page_location: pageLocation(),
      page_referrer: referrerOrigin(document.referrer),
      page_title: document.title
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(script);
  }
  function clearCookies() {
    const names = document.cookie.split(';')
      .map(part => part.trim().split('=')[0])
      .filter(name => name === '_ga' || name.startsWith('_ga_'));
    names.forEach(name => {
      ['', 'ipsi.k-bigdata.kr', '.k-bigdata.kr'].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function choose(value) {
    const previous = enabled;
    enabled = value === 'accepted';
    writeConsent(value);
    notice?.remove();
    notice = null;
    if (enabled) activate();
    if (!enabled && previous) {
      clearCookies();
      location.reload(); // unload already injected Google tag
    }
  }
  function openSettings() {
    if (notice) return;
    notice = document.createElement('aside');
    notice.className = 'ipsi-analytics-choice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-label', '방문 통계 수집 동의');
    notice.innerHTML =
      '<strong>방문 통계 안내</strong>' +
      '<p>사이트 개선을 위해 Google Analytics로 방문 페이지와 입시안내·원서접수 링크 클릭을 집계합니다. 거부해도 사이트를 이용할 수 있습니다.</p>' +
      '<div class="ipsi-analytics-actions"><a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noopener noreferrer">Google 개인정보처리방침</a>' +
      '<button type="button" data-choice="declined">거부</button>' +
      '<button type="button" data-choice="accepted" class="primary">통계 수집 동의</button></div>';
    notice.addEventListener('click', click => {
      const chosen = click.target.closest?.('[data-choice]')?.dataset.choice;
      if (chosen) choose(chosen);
    });
    document.body.appendChild(notice);
  }
  function init() {
    const style = document.createElement('style');
    style.textContent =
      '.ipsi-analytics-choice{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:10000;width:min(640px,calc(100% - 32px));padding:18px 20px;border:1px solid #bad0e3;border-radius:14px;background:#fff;color:#142a40;box-shadow:0 12px 40px #0c253f77;font:14px/1.55 system-ui,sans-serif}' +
      '.ipsi-analytics-choice strong{font-size:16px}.ipsi-analytics-choice p{margin:7px 0 14px}.ipsi-analytics-actions{display:flex;justify-content:flex-end;align-items:center;gap:9px;flex-wrap:wrap}.ipsi-analytics-actions a{margin-right:auto;color:#125b9b;text-decoration:underline}.ipsi-analytics-actions button{font:inherit;cursor:pointer;padding:8px 12px;border-radius:8px;border:1px solid #9db6cb;color:#18364b;background:#fff}.ipsi-analytics-actions button.primary{border-color:#1567a8;background:#1567a8;color:white}.ipsi-analytics-preferences{margin:8px 0 0;padding:3px 0;font:inherit;font-size:12px;color:inherit;text-decoration:underline;background:transparent;border:0;cursor:pointer}' +
      '@media(max-width:760px){.ipsi-analytics-choice{bottom:calc(75px + env(safe-area-inset-bottom,0px));padding:14px 15px}.ipsi-analytics-actions a{width:100%}}';
    document.head.appendChild(style);
    const footer = document.querySelector('footer .container') || document.querySelector('footer');
    if (footer) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ipsi-analytics-preferences';
      button.textContent = '방문 통계 설정';
      button.addEventListener('click', openSettings);
      footer.appendChild(button);
    }
    enabled = readConsent() === 'accepted';
    if (enabled) activate();
    else if (!readConsent()) openSettings();
  }

  // Detect the last finder answer without recording answers or recommendations.
  document.addEventListener('click', click => {
    if (!enabled) return;
    const node = click.target;
    const option = node?.closest?.('[data-finder] .option');
    if (!option) return;
    const width = option.closest('[data-finder]')?.querySelector('.progress span')?.style.width;
    if (width === '20%') event('major_finder_start');
    if (width === '100%') event('major_finder_complete');
  }, true);

  document.addEventListener('click', click => {
    if (!enabled) return;
    const target = click.target;
    if (typeof target?.closest !== 'function') return;
    const faq = target.closest('.accordion > button');
    if (faq?.getAttribute('aria-expanded') === 'true') event('faq_open');
    const link = target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); }
    catch (_) { return; }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
    const area = link.closest('.mobile-nav') ? 'mobile' :
      link.closest('.admission-alert') ? 'notice' :
      link.closest('header') ? 'header' :
      link.closest('footer') ? 'footer' : 'content';
    const params = { click_area: area };
    if (url.hostname === 'apply.jinhakapply.com') {
      event('admission_apply_click', params);
    } else if (link.hasAttribute('data-apply') || link.hasAttribute('data-guide') ||
      (url.hostname === 'www.kopo.ac.kr' && ['321', '1714'].includes(url.searchParams.get('menu')))) {
      event('admission_guide_click', params);
    } else if (link.matches('.dept-card') ||
      (url.hostname === 'www.kopo.ac.kr' && url.searchParams.get('menu') === '1547')) {
      event('department_website_click', params);
    } else if (url.origin === location.origin) {
      const destination = pagePath(url.pathname);
      if (destination !== pagePath(location.pathname) && destination !== '/other') {
        event('admissions_navigation', { destination_page: destination, ...params });
      }
    }
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
