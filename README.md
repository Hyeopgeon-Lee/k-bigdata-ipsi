# 2027 서울강서캠퍼스 입시 허브

한국폴리텍대학 서울강서캠퍼스 2년제학위과정의 6개 학과를 발견하고, 공식 학과 홈페이지·공식 모집요강·원서접수로 빠르게 이동하도록 만든 GitHub Pages 정적 사이트입니다.

## 서비스 구조

- 주요 화면: 메인, 학과소개, 학과찾기, 입시안내, FAQ
- 호환 화면: 기존 학과 상세, 비교, 성과, 입시결과 URL은 삭제하지 않고 공식 정보 또는 주요 화면으로 안내
- 이미지: `assets/images/`, 학과 이미지는 `assets/images/departments/`
- 디자인: 기존 `assets/css/common.css`와 입시 허브용 `assets/css/hub.css`
- 동작: `assets/js/common.js`의 데이터 로딩, Asia/Seoul 전형 상태, D-Day, 카드, 일정, FAQ, 학과찾기

## 데이터 운영

현재 `API_ENDPOINT`는 비어 있으며 `data/fallback.json`이 정상 데이터 소스입니다. 이 상태에서는 fallback 경고를 표시하지 않습니다. 향후 GAS URL을 설정하면 GAS API → localStorage 캐시 → fallback.json 순서로 동작합니다.

- 공식 학과 URL: `data/fallback.json > data.departments[].url`
- 입시 일정·원서접수·모집요강: `data.schedule[]`
- 다음 전형 확정 시 해당 일정과 `apply_url`을 갱신
- 확인되지 않은 수치나 성과는 게시하지 않음

Google Sheets/GAS 스키마와 배포 방법은 `docs/google-sheets-schema.md`, `gas/README.md`, `docs/deployment.md`를 참고하세요.

## 배포

GitHub Pages는 `main` 브랜치 루트에서 배포하며 커스텀 도메인은 `CNAME`의 `ipsi.k-bigdata.kr`을 사용합니다. 상대경로만 사용하므로 커스텀 도메인과 Project Pages 경로 양쪽에서 자산을 안전하게 불러옵니다.

인물 이미지는 교육 분야의 분위기를 표현한 AI 생성 홍보 비주얼이며 실제 재학생·시설 사진이 아닙니다.
