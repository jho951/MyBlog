# 최신글 카드 스타일을 pagesNav 카드 스타일로 정렬

목표:
- 홈 최신글(`latest`) 카드의 시각 스타일을 `latest--pagesNav` 카드 스타일로 통일한다.

작업 지시:
- `src/pages/main.html`의 최신글 섹션에 `latest--pagesNav` 스타일 재사용용 클래스를 부여한다.
- 섹션 전체 레이아웃(폭/배경/여백)은 기존 latest 구성 유지가 우선이므로, 필요 시 ID 기반 리셋 스타일을 추가한다.
- `pages-nav.js` 동작 셀렉터(`#ttPagesNav`)와 충돌하지 않도록 확인한다.

검증 기준:
- 최신글 카드가 pagesNav 카드와 같은 카드 디자인을 보인다.
- 최신글 섹션은 기존 위치/흐름을 유지한다.
- pagesNav 섹션 렌더링/클릭 동작에 회귀가 없다.
