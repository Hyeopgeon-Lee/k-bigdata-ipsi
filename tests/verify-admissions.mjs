import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(file('data/fallback.json')).data;
const second = data.schedule.find(r => r.round_id === 'SUSI2');
assert(second, '수시2차 일정이 있어야 합니다');
assert.equal(data.departments.length, 6);
assert.equal(data.departments.reduce((sum, d) => sum + d.susi2_seats, 0), 30);
assert.equal(second.application_start.slice(0, 10), '2026-11-11');
assert.equal(second.application_end, '2026-11-27T23:59:00+09:00');
assert.equal(second.documents_deadline, '2026-11-30T17:00:00+09:00');
assert.equal(second.interview_date, '2026-12-02');
assert.equal(second.result_date, '2026-12-17');
assert.equal(second.registration_end, '2026-12-23');
assert.equal(second.final_registration_end, '2027-02-12');
assert.equal(second.seats_total, 30);
assert.equal(second.apply_url, '', '검증 안 된 수시2차 직접 접수 링크를 표시하면 안 됩니다');
assert(!JSON.stringify(data).includes('5041044/A'), '수시1차 전용 직접 접수 URL이 남아 있습니다');

const home = file('index.html');
assert(home.includes('수시2차 모집'));
assert(!home.includes('수시1차 모집'));
assert(home.includes('11.30(월)'));
assert(home.includes('12.02(수)'));
assert(home.includes('data-admission-schedule'));
assert(file('admission/index.html').includes('공식 인터넷원서접수 안내'));

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
