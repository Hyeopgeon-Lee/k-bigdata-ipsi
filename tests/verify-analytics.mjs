import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const file = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const pages = [
  'index.html','departments/index.html','admission/index.html','find/index.html','faq/index.html',
  'departments/bigdata/index.html','departments/content/index.html','departments/health/index.html',
  'departments/security/index.html','departments/jewelry/index.html','departments/fashion/index.html',
  'compare/index.html','results/index.html','outcomes/index.html','404.html'
];
const js = file('assets/js/analytics.js');
const shared = file('assets/js/common.js');
assert(shared.includes("location.hostname !== 'ipsi.k-bigdata.kr'"));
assert(shared.includes("assets/js/analytics.js?v=20261113-ga4"));
assert(js.includes("const ID = 'G-WN99333WLX'"));
assert(js.includes("send_page_view: false"));
assert(js.includes("if (!enabled || started) return"));
assert(js.includes("enabled = readConsent() === 'accepted'"));
assert(js.includes("else if (!readConsent()) openSettings()"));
assert(js.includes("referrerOrigin(document.referrer)"));
for (const name of ['page_view','admission_apply_click','admission_guide_click',
 'department_website_click','admissions_navigation','major_finder_start','major_finder_complete','faq_open']) {
  assert(js.includes("'" + name + "'"), 'missing event: ' + name);
}
for (const path of pages) {
  const html = file(path);
  assert(html.includes('common.js?v=20261113-ga4'), path + ': shared script must be cache-busted');
  assert(!html.includes('common.js?v=20261102-clean4'), path + ': stale script version');
}
console.log('PASS GA4 consent, host restriction, 8 events, all 15 site pages');
