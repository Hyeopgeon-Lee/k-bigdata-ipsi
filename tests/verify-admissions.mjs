import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(file('data/fallback.json')).data;
const second = data.schedule.find(r => r.round_id === 'SUSI2');
assert(second, '수시2차 일정이 있어야 합니다');
assert.equal(data.departments.length, 6);
assert.equal(data.departments.reduce((sum, d) => sum + d.susi2_seats, 0), 93);
assert.equal(second.application_start.slice(0, 10), '2026-11-11');
assert.equal(second.application_end, '2026-11-27T23:59:00+09:00');
assert.equal(second.documents_deadline, '2026-11-30T17:00:00+09:00');
assert.equal(second.interview_date, '2026-12-02');
assert.equal(second.result_date, '2026-12-17');
assert.equal(second.registration_end, '2026-12-23');
assert.equal(second.final_registration_end, '2027-02-12');
assert.equal(second.seats_total, 93);
assert.deepEqual(Object.fromEntries(data.departments.map(d=>[d.id,d.susi2_seats])), {BIGDATA:14,CONTENT:17,HEALTH:8,SECURITY:11,JEWELRY:22,FASHION:21});
assert.equal(second.seats_basis,'정원 내·외 합산');
assert.equal(second.apply_url, '', '검증 안 된 수시2차 직접 접수 링크를 표시하면 안 됩니다');
assert(!JSON.stringify(data).includes('5041044/A'), '수시1차 전용 직접 접수 URL이 남아 있습니다');

const home = file('index.html');
assert(home.includes('수시2차 모집'));
assert(!home.includes('수시1차 모집'));
assert(home.includes('11.30(월)'));
assert(home.includes('12.02(수)'));
assert(home.includes('data-admission-schedule'));
assert(file('admission/index.html').includes('공식 인터넷원서접수 안내'));
// Keep applicant-facing copy positive without changing the published dates or quota.
for (const path of ['index.html','departments/index.html','admission/index.html','assets/js/common.js','data/fallback.json']) {
  const content=file(path);
  for (const phrase of ['등록 미달','미충원','변경 모집인원','변경 모집','변경 인원']) {
    assert(!content.includes(phrase), `${path} contains negative admission marketing copy: ${phrase}`);
  }
}
assert(data.faq.some(item=>item.q==='수시2차 모집인원은 몇 명인가요? (정원 내·외 합산)'));
assert(data.departments.every(item=>Number.isInteger(item.susi2_seats)));
assert(file('index.html').includes('총 93명의 신입생'));
// Test every public-facing page and rendering source for enrollment-shortfall framing.
for (const path of ['index.html','departments/index.html','admission/index.html','find/index.html','faq/index.html','assets/js/common.js','data/fallback.json']) {
  const content=file(path);
  assert(!/변경\s*(?:모집|인원)|등록\s*미달|미충원|모집\s*저조/u.test(content), `${path}: prohibited negative recruitment language`);
}
assert.equal(data.departments.find(d=>d.id==='BIGDATA')?.susi2_seats,14);
assert.equal(second.seats_total,93);

const js = file('assets/js/common.js');
const context = {document:{documentElement:{dataset:{root:'./'}},addEventListener(){}},Intl,Date,console};
vm.createContext(context);
vm.runInContext(js, context, {filename:'common.js'});
assert.equal(context.getDDay(second,new Date('2026-11-02T08:30:00+09:00')), '접수 D-9');
assert.equal(context.getRoundState(second,new Date('2026-11-10T23:59:00+09:00')), 'UPCOMING');
assert.equal(context.getRoundState(second,new Date('2026-11-11T00:01:00+09:00')), 'OPEN');
assert.equal(context.getDDay(second,new Date('2026-11-27T20:00:00+09:00')), '오늘 23:59 마감');
assert.equal(context.getRoundState(second,new Date('2026-11-28T00:00:00+09:00')), 'CLOSED');
const november = context.getActiveRound(data.schedule, new Date('2026-11-02T08:30:00+09:00'));
assert.equal(november.round_id, 'SUSI2');

console.log('PASS 2027 수시2차 데이터·CTA·SEO·서울 기준 D-Day');


const css = file('assets/css/hub.css');
function relativeLuminance(hex){
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
    .map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
}
function contrastRatio(colorA,colorB){
  const [low,high]=[relativeLuminance(colorA),relativeLuminance(colorB)].sort((a,b)=>a-b);
  return (high+0.05)/(low+0.05);
}
assert(contrastRatio('#d9eafc','#102a43')>=4.5,'일정 영역의 보조 텍스트 대비가 부족합니다');
assert(contrastRatio('#d9eafc','#071f35')>=4.5,'푸터 보조 텍스트 대비가 부족합니다');
assert(css.includes('.schedule-band .eyebrow,.schedule-band .source,'));
assert(css.includes('.footer .source{color:#d9eafc}'));
assert(css.includes('.hero-copy{order:0}'),'모바일에서는 제목이 이미지보다 먼저 보여야 합니다');
assert(css.includes('.hero-visual{order:1}'));
assert(css.includes('.page-hero-visual{display:none}'),'모바일 정보 페이지의 긴 장식 이미지를 줄이세요');
assert(css.includes('.mobile-nav a[aria-current="page"]'));
assert(js.includes('setupNavigationReadability()'));
console.log('PASS contrast, reading order, mobile navigation readability');


assert.equal(context.formatDate('2026-11-27T23:59:00+09:00',true),'2026.11.27 23:59','마감 날짜와 시간이 공백으로 분리돼야 합니다');
assert.equal(context.formatDateRange('2026-11-11T00:00:00+09:00','2026-11-27T23:59:00+09:00',true),'2026.11.11 ~ 11.27 23:59','같은 해의 날짜 범위는 짧게 표시해야 합니다');
assert(css.includes('.hero-visual{display:none}'),'모바일 첫 화면에서 모집 일정보다 장식 이미지가 먼저 표시되면 안 됩니다');
assert(css.includes('.admission-alert [data-dday]{display:inline}'),'모바일에서도 접수 D-Day를 표시해야 합니다');
assert(css.lastIndexOf('.admission-alert [data-dday]{display:inline}')>css.lastIndexOf('.admission-alert [data-dday]{display:none}'));
assert(css.includes('.mobile-nav a{white-space:nowrap'),'모바일 하단 탐색 문구 줄바꿈을 방지해야 합니다');

class FixedDate extends Date {
  constructor(...args){super(...(args.length?args:['2026-11-02T08:30:00+09:00']));}
  static now(){return Date.parse('2026-11-02T08:30:00+09:00');}
}
context.Date=FixedDate;
const compactLink={
  textContent:'',href:'',attributes:{},
  closest(){return {className:'mobile-nav'};},
  setAttribute(key,value){this.attributes[key]=value;}
};
const normalLink={
  textContent:'',href:'',attributes:{},
  closest(){return null;},
  setAttribute(key,value){this.attributes[key]=value;}
};
context.document.querySelectorAll=selector=>selector==='[data-apply]'?[compactLink,normalLink]:[];
vm.runInContext('SITE = '+JSON.stringify({data}),context);
vm.runInContext('renderAdmissionState()',context);
assert.equal(compactLink.textContent,'접수안내','접수 시작 전 모바일 하단 메뉴에 긴 문구를 표시하면 안 됩니다');
assert.equal(normalLink.textContent,'공식 원서접수 안내 ↗');
assert.equal(compactLink.href,data.links.application_guide);
assert(compactLink.attributes['aria-label'].includes('수시2차'));
console.log('PASS mobile CTA, deadline formatting, visible countdown, compact navigation');
