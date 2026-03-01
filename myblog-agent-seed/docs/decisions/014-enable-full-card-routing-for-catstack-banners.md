# ADR 014: catStack 비대칭 배너 전체 영역 라우팅 보장

- 상태: 승인
- 날짜: 2026-03-01

## 배경

- 홈 비대칭 카테고리 배너(`catStack`)는 시각적으로 카드 전체가 클릭 가능해 보이지만, 일부 오버라이드에서 링크 클릭이 차단될 수 있었다.
- 특히 데스크톱 구간에서 `.catStackHero { pointer-events: none; }` 규칙이 남아 있으면 라우팅이 동작하지 않는다.

## 결정

- 데스크톱(1024px+)에서 `#pageHome .catStackHero`의 `pointer-events`를 명시적으로 복구한다.
- `ui-features.js`에 `initCatStackBannerRouting()`을 추가해 `catStackItem` 카드 전체 클릭/키보드(Enter/Space) 시 내부 링크로 이동하도록 보강한다.

## 결과

- 비대칭 카테고리 배너는 카드 어느 영역을 눌러도 해당 카테고리 페이지로 이동한다.
- 링크 오버레이/여백 구간으로 인한 클릭 누락 가능성이 줄어든다.
