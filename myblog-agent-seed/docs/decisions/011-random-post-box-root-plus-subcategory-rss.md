# ADR 011: random-post-box RSS 수집 범위를 루트+하위 카테고리로 확장

- 상태: 승인
- 날짜: 2026-03-01

## 배경

- 홈 `random-post-box`는 루트 카테고리 RSS 1개만 조회해 랜덤 글 후보를 만들고 있었다.
- 요구사항은 루트 기준 4개 카테고리(`computerscience`, `development`, `engineering`, `troubleshooting`)에서 찾되, 하위 카테고리 글도 포함하는 것이다.
- 운영 데이터에 `engineering/enginnering`, `troubleshooting/trubleshooting` 같은 슬러그 혼용이 있어 단일 경로 의존 시 누락 위험이 있다.

## 결정

- `random-post-box`는 루트 4개 카테고리에 대해서만 동작한다.
- 각 루트는 `root RSS + 하위 카테고리 RSS`를 모두 조회하고, 결과 링크를 중복 제거해 병합한다.
- `engineering/enginnering`, `troubleshooting/trubleshooting` 경로를 모두 후보로 조회해 기존 데이터 호환성을 유지한다.

## 결과

- 랜덤 이동 시 루트 카테고리의 하위 주제 글까지 포함되어 탐색 다양성이 증가한다.
- 슬러그 혼용 환경에서도 RSS 수집 누락 가능성이 줄어든다.
