# random-post-box RSS 루트+하위카테고리 확장

목표:
- `random-post-box`의 RSS 수집 기준을 루트 4개 카테고리(`computerscience`, `development`, `engineering`, `troubleshooting`)로 고정한다.
- 각 루트의 하위 카테고리 RSS를 함께 수집해 랜덤 이동 후보에 포함한다.

작업 지시:
- `src/function/random-post-box.js`에서 루트 카테고리별 하위 카테고리 맵을 정의한다.
- 클릭 시 루트 RSS와 하위 카테고리 RSS를 모두 조회하고, 중복 제거 후 후보 링크를 병합한다.
- `engineering/enginnering`, `troubleshooting/trubleshooting` 슬러그 혼용을 고려한 경로 후보를 함께 처리한다.

검증 기준:
- 카드 클릭 시 RSS 요청 대상에 루트 + 하위 카테고리 경로가 포함된다.
- 결과 링크가 중복 없이 병합된다.
- 수집 실패 시 기존 경고 메시지와 목록 페이지 fallback 동작은 유지된다.
