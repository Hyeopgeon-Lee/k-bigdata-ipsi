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

## 2027 수시2차 운영(2026.11.10 정정)

- 공식 모집요강: https://www.kopo.ac.kr/kangseo/content.do?menu=321 (2027학년도 PDF 6–7쪽)
- 수시2차 접수 2026.11.11 ~ 11.27 23:59, 서류제출 11.30 17:00, 면접 12.02, 최초합격 발표 12.17, 최초등록 12.17~23, 충원합격 등록 12.30까지, 수시 합격자 최종등록 2027.02.04~12.
- 2027학년도 수시2차 모집인원(정원 내·외 합산)은 6개 학과 총 76명입니다: 빅데이터SW 11, 디지털콘텐츠 12, 보건의료정보 5, 사이버보안 7, 주얼리디자인 22, 패션디자인 19. 2026-11-10 학과 제공 정정 자료(정시 모집인원 제외) 기준이며, 원서접수 일정과 지원자격은 캠퍼스 공식 입학안내에서 확인합니다.
- 수시2차 진학어플라이 전용 원서접수 주소: https://apply.jinhakapply.com/Notice/5041045/A (`schedule[SUSI2].apply_url`). 접수 기간에만 `원서접수 바로가기`로 표시하며, 접수 전·종료 후와 다른 전형에는 확인되지 않은 링크를 재사용하지 않습니다.
- 전형 일정 및 정량 정보: `data/fallback.json`을 우선 수정합니다. `docs/sample-data/04_admission_schedule.csv`는 GAS 예시로, JSON의 추가 필드(서류제출 마감, 충원, 모집인원)는 별도로 관리합니다.
- 날짜 카운트다운: Asia/Seoul 달력 날짜 기준. 휴대기기 타임존이 달라도 한국 기준 날짜로 표시.
- 배포 전 검토 체크리스트: `docs/reviews/2027-susi2-ux-review.md`.
