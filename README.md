# 2027 서울강서캠퍼스 2년제학위과정 입학안내

학과 탐색 → 비교 → 성과 → 입시 확인 → 원서접수 흐름을 제공하는 GitHub Pages용 정적 사이트입니다. Vanilla HTML/CSS/JS, Google Sheets CMS, Apps Script 읽기 API와 정적 fallback으로 구성됩니다.

## 화면

메인, 학과 목록, 6개 학과 상세, 학과찾기, 비교, 성과, 입시안내, 입시결과, FAQ까지 14개 화면입니다.

## 운영

- 로컬에서는 정적 서버로 저장소 루트를 엽니다. 파일을 직접 열면 fetch 보안 정책 때문에 fallback 로딩이 제한될 수 있습니다.
- GitHub Pages는 main/(root)에서 배포합니다. 세부 단계는 docs/deployment.md를 참고합니다.
- Sheets는 docs/google-sheets-schema.md의 13개 시트와 sample-data로 만듭니다. GAS 배포 후 assets/js/common.js의 API_ENDPOINT만 변경합니다.
- 공식 학과 URL은 02_departments.official_url, 원서접수 URL은 04_admission_schedule.apply_url에서 관리합니다.
- 수시2차/정시는 확정된 apply_url만 넣습니다. 빈 값이면 공식 인터넷 원서접수 안내로 연결됩니다.
- 다음 학년도에는 admission_year, 일정, 모집요강 URL, 전형별 apply_url, 입시결과, data_version을 갱신합니다. 코드는 다시 개발하지 않아도 됩니다.
- 장애 시 GAS → localStorage → data/fallback.json → 정적 HTML 순서로 안내가 유지됩니다.
- 이미지 교체 시 assets/images 또는 공식 사용 허가된 URL을 쓰고 alt를 작성하세요. placeholder.svg는 교체 위치 표시용입니다.
- 커스텀 도메인 적용 시 CNAME을 추가하고 fallback의 base_site_url, canonical, sitemap, robots를 함께 변경합니다.

## 문제 해결

데이터가 안 보이면 GAS 접근 권한, /exec URL, 시트명과 첫 행 컬럼을 확인합니다. 오래된 정보면 localStorage의 kopo.cms를 지우고 data_version을 올립니다. Project Pages에서 자원이 404면 루트 절대경로(/assets)를 사용하지 않았는지 확인합니다.

공식 정보: [2027 모집요강](https://www.kopo.ac.kr/kangseo/content.do?menu=321), [인터넷 원서접수 안내](https://www.kopo.ac.kr/kangseo/content.do?menu=1714).

## 2026 입시 홍보 디자인 리뉴얼

- 공통 홍보 이미지: `assets/images/hero-main.webp`, `section-find-major.webp`, `section-outcomes.webp`, `banner-apply-cta.webp`
- 학과별 이미지: `assets/images/departments/dept-*.webp`
- 모든 인물 이미지는 교육 분야와 분위기를 표현한 AI 생성 홍보 비주얼이며 실제 재학생·시설 사진이 아닙니다.
- Hero 이미지는 우선 로딩하고, 나머지 이미지는 지연 로딩과 고정 비율을 사용합니다.
- 디자인 토큰과 공통 컴포넌트는 `assets/css/common.css`에서 관리합니다.
