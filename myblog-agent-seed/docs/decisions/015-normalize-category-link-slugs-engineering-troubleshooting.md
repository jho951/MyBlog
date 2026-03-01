# ADR 015: 카테고리 링크 슬러그를 engineering/troubleshooting으로 정규화

- 상태: 승인
- 날짜: 2026-03-01

## 배경

- 홈 `cat` 영역 링크 일부가 오타 슬러그(`enginnering`, `trubleshooting`)를 사용하고 있었다.
- 사용자 요구사항은 `Engineering`, `Troubleshooting` 페이지로 정확히 이동하는 것이다.

## 결정

- `main.html`의 카테고리 링크를 `engineering`, `troubleshooting` 정식 슬러그로 통일한다.
- 동일 섹션(`catHub`, `catStack`, `rp4`)의 관련 `href`, `data-list`, `data-rss` 값을 함께 정리한다.

## 결과

- `cat` 비대칭 배너 및 관련 진입 링크가 올바른 카테고리 페이지로 이동한다.
- 오타 슬러그로 인한 라우팅 실패/404 가능성을 줄인다.
