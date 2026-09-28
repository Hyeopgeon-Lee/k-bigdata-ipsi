# 배포 가이드

## GitHub Pages

저장소 Settings → Pages에서 Source를 Deploy from a branch, Branch를 main / (root)로 선택합니다. 주소는 https://ipsi.k-bigdata.kr/ 입니다. CNAME은 만들지 않습니다. 모든 경로는 Project Pages 하위 경로에서 동작하도록 상대경로로 작성되어 있습니다.

## Google Sheets와 GAS

`google-sheets-schema.md`와 sample-data를 사용해 13개 시트를 만든 뒤 `gas/Code.gs`를 연결된 Apps Script 프로젝트에 복사합니다. 웹 앱 새 배포 → 본인으로 실행 → 모든 사용자 접근으로 설정하고 /exec URL을 `assets/js/common.js`의 `API_ENDPOINT`에 입력합니다. 배포 전 개인정보와 비밀키가 없는지 확인합니다.

## 점검

메인과 14개 URL, 404, 모바일/데스크톱, 외부 링크, 브라우저 콘솔을 확인합니다. GAS URL을 일부러 잘못 지정하거나 비워 fallback.json 동작도 확인합니다.