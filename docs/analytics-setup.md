# 2027 입시 사이트 GA4 연동

사이트: https://ipsi.k-bigdata.kr/  
GitHub 저장소: Hyeopgeon-Lee/k-bigdata-ipsi  
GA4 측정 ID: G-WN99333WLX (기존 입시·홍보 GA4 속성, ai.k-bigdata.kr과 공유)

학생용 포털 GA4(G-8PMMKFNRY7)와는 별도입니다. 입시 사이트의 모든 15개 HTML 페이지에서 공통 스크립트가 assets/js/analytics.js를 로드합니다. 정식 호스트 ipsi.k-bigdata.kr 외 환경은 추적하지 않습니다.

## 측정 이벤트

- page_view: 페이지 방문
- admissions_navigation: 내부 정보 페이지 이동
- admission_guide_click: 공식 모집요강·접수안내 클릭
- admission_apply_click: 진학어플라이 외부 링크 클릭 (**접수 완료가 아님**)
- department_website_click: 공식 학과 홈페이지 방문 링크 클릭
- major_finder_start / major_finder_complete: 학과찾기 사용
- faq_open: FAQ 펼치기

집계된 이벤트는 기존 홍보 사이트 GA4 속성에 합산됩니다. 입시 사이트만 분석하려면 GA4에서 호스트 이름 ipsi.k-bigdata.kr로 필터링하세요. 원서접수 전환을 보려면 GA4 관리자에서 admission_apply_click을 주요 이벤트로 지정합니다. click_area, destination_page를 상세 분석하려면 GA4 맞춤 정의에서 이벤트 범위 측정기준으로 등록합니다.

## 개인정보 보호

- 방문자가 통계 수집에 동의한 후에만 Google Analytics 스크립트를 로드합니다. 거부해도 사이트 이용에 제한이 없습니다.
- 선택은 브라우저에 저장되며 푸터의 '방문 통계 설정'에서 변경할 수 있습니다.
- 쿼리스트링·해시·검색어·학과찾기 답변·이름·연락처 등은 이벤트에 포함하지 않습니다.
- URL에는 사전 정의된 UTM 캠페인 식별자 중 허용된 형식의 값만 남깁니다. 외부 리퍼러는 사이트 origin만 전달합니다.
- Google Signals, 광고 개인화 신호 및 중복 자동 page_view를 비활성화했습니다.
- 운영자는 개인정보 처리방침에 분석 목적과 Google Analytics 사용을 안내하고 보유기간을 검토해야 합니다.

## 점검

1. GA4 실시간 보고서를 엽니다.
2. 브라우저 새 시크릿 창에서 https://ipsi.k-bigdata.kr/ 접속 후 '통계 수집 동의'를 선택합니다.
3. 사이트 페이지와 진학어플라이 이동 링크를 눌러 page_view, admission_apply_click 수집을 확인합니다.
4. 거부를 선택한 경우에는 새 GA4 태그 요청이 발생하지 않는지 개발자 도구 Network에서 확인합니다.
5. CI 테스트: node --check assets/js/analytics.js, node tests/verify-analytics.mjs, node tests/verify-admissions.mjs.

별도의 입시 GA4 웹 스트림이 필요하면 Analytics 관리자에서 새 스트림을 생성한 후 ID를 교체해야 합니다.
