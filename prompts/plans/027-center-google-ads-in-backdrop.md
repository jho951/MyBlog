# Plan 027: Home Revenue Section Alignment

## 목표

홈 상단 광고를 `pageHome` 시작 지점의 별도 section으로 옮기고, 헤더와 겹치지 않게 가로 중앙 정렬과 안정적인 최소 높이를 유지한다. 광고 위치는 JS가 아니라 마크업/CSS 기준으로 유지한다.

## 작업 체크리스트

- `src/pages/main.html`의 `#pageHome` 시작 지점에 `[##_revenue_list_upper_##]` 광고 section 마크업을 정리한다.
- `src/style/style.css`에서 헤더 비충돌 여백, 광고 슬롯 중앙 정렬 및 최소 높이 규칙을 추가한다.
- `src/function/content-effects.js`에는 죽은 `backdrop` 광고 제어 코드를 남기지 않는다.
- `docs/REQUIREMENTS.md`, `docs/decisions/`, `docs/runbook/DEBUG.md`를 함께 갱신한다.

## 검증 포인트

- 홈에서 `home-revenue-section` 광고가 중앙 정렬되는지 확인
- 광고 스크립트 응답 전에도 슬롯 높이가 급격히 줄지 않는지 확인
- 광고가 헤더와 겹치지 않고 충분히 아래에서 시작하는지 확인
