# 카테고리 링크 슬러그 정규화

목표:
- 홈 `cat` 영역 링크가 `engineering`, `troubleshooting` 정식 슬러그로 이동하도록 통일한다.

작업 지시:
- `src/pages/main.html`에서 `enginnering`, `trubleshooting` 오타 슬러그를 검색한다.
- `catHub`, `catStack`, `rp4`의 `href`, `data-list`, `data-rss`를 정식 슬러그로 교체한다.
- 기존 라우팅 보강 코드(`catStack` 전체 클릭)와 충돌이 없는지 확인한다.

검증 기준:
- `main.html`에 `/category/enginnering`, `/category/trubleshooting` 문자열이 남지 않는다.
- cat 배너 클릭 시 `/category/engineering`, `/category/troubleshooting`로 이동한다.
