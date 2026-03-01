# 목록 페이지: 좌측 트리 탭 + 미니멀 상단 툴바

목표:
- 카테고리 탭을 좌측 사이드 트리 노드 UI로 재배치한다.
- 상단 헤더에는 뷰 토글과 검색 버튼만 남긴다.

작업 지시:
- `src/pages/main.html`에서 `list-header`를 툴바+검색패널 구조로 단순화한다.
- 루트/하위 카테고리 탭(`ttListCategoryTabs`, `ttListSubcategoryShell`)은 `list-sidebar`로 이동한다.
- `src/style/style.css`에서 `list-layout`(sidebar/content)와 트리 노드 스타일을 정의한다.
- `src/function/list-search-filter.js`는 검색 버튼 토글 패널 구조에 맞게 동작을 보강한다.

검증 기준:
- 상단에는 뷰 토글과 검색 버튼만 노출된다.
- 좌측 사이드에서 루트/하위 카테고리 탭이 트리 형태로 동작한다.
- 검색 버튼으로 패널이 열리고, 입력 즉시 목록 필터가 적용된다.
