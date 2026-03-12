# 페이지 카드 제거 + 인라인 스크립트 분리 작업

목표:
- 홈의 페이지 카드(`ttPagesNav`) 기능/영역을 제거하고, `main.html` 하단 인라인 스크립트를 외부 JS로 분리한다.

작업 지시:
- `src/pages/main.html`에서 `ttPagesNav` 섹션과 `ttHiddenMenuPages` 블록을 삭제한다.
- `pages-nav.js` 로드 태그를 제거한다.
- 하단 인라인 카테고리 탭 스크립트를 `src/function/list-subcategory-tabs.js`로 분리한다.
- `main.html`은 새 JS를 `defer`로 로드한다.
- `src/function/boot-init.js`에서 pages-nav 초기화 호출을 제거한다.

검증 기준:
- 홈에서 페이지 카드 섹션이 렌더링되지 않는다.
- 콘솔 에러 없이 목록 카테고리/하위카테고리 탭 활성화가 동작한다.
- `main.html` 하단에 인라인 스크립트 블록이 남아있지 않다.
