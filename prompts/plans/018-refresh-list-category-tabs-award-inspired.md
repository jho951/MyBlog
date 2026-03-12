# 목록 카테고리 탭 UI 리프레시 (수상작 레퍼런스 기반)

목표:
- `pageList`의 루트/하위 카테고리 탭 디자인을 최신 수상작 트렌드 감성으로 개선한다.
- 선택 상태/위계가 즉시 보이도록 활성 칩 대비를 강화한다.

작업 지시:
- `src/style/style.css`의 `#pageList .list-header`, `.list-category-tab`, `.list-subcategory-shell`, `.list-subcategory-tab` 구간을 리디자인한다.
- 레이어드 글래스 패널, 강조된 active state, hover 피드백을 일관된 디자인 언어로 맞춘다.
- 기존 HTML/JS 구조(`ttListCategoryTabs`, `ttListSubcategoryTabs`)는 유지한다.

검증 기준:
- 루트/하위 탭의 활성 상태가 비활성 상태와 명확히 구분된다.
- 모바일 가로 스크롤 탭 사용성이 유지된다.
- 768px+/1024px+ 반응형에서도 간격/크기 균형이 유지된다.
