# 디버그 런북

## 로컬 재현 절차

1. 프로젝트 루트에서 정적 서버를 실행합니다. 예: `python3 -m http.server 4173`
2. 브라우저에서 `http://localhost:4173/src/pages/main.html`를 엽니다.
3. 티스토리 치환자(`[##_..._##]`)는 로컬에서 실제 값으로 치환되지 않으므로 문자열 그대로 보여도 정상입니다.
4. 홈 랜딩 허브 섹션(`ttHubLanding`, `ttHubRecent`, `ttHubConnect`)이 렌더링되는지 확인합니다.

## 확인할 로그

- 브라우저 콘솔 에러:
  - `Unexpected token` (inline script 문법 오류)
  - `Cannot read properties of null` (DOM selector 대상 누락)
- 홈 `rp4` 카드 시각 확인:
  - 카드 배경/테두리/그림자가 보이지 않고, 아이콘(`.rp4-icon`)만 3D 형태로 렌더링되는지 확인
- 홈 `rp4` 랜덤 이동 수집 확인:
  - 개발자도구 Network에서 `/category/{root}/rss` 및 `/category/{root}/{sub}/rss` 요청이 함께 발생하는지 확인
  - 루트 기준은 `computerscience`, `development`, `engineering`, `troubleshooting` 4개만 사용하는지 확인
- 홈 카테고리 레이아웃 분기 확인:
  - 768~1023px에서는 `catHub--mobile`만 보이고 `catStack`은 숨김인지 확인
  - 1024px+에서는 `catHub--mobile`이 숨겨지고 `catStack` 비대칭 배너가 노출되는지 확인
- guestbook 레이아웃/입력 흐름 확인:
  - guestbook 상단 `guestbook-head` 안내 블록이 노출되지 않는지 확인
  - `#pageGuestbook .page-wrap` 전체가 코르크 보드 질감(브라운 텍스처 + 인셋 그림자)으로 렌더링되는지 확인
  - 모바일/태블릿에서는 입력 폼이 sticky가 아니고, 스크롤/키보드 입력 시 가려지지 않는지 확인
  - 1024px+에서는 입력 폼이 sticky 동작을 유지하는지 확인
- catStack 라우팅 확인:
  - 1024px+에서 각 `catStackItem` 카드의 여백 포함 아무 영역 클릭 시 카테고리 페이지로 이동하는지 확인
  - 키보드 포커스 후 Enter/Space 입력으로도 동일 이동이 되는지 확인
- 목록 카테고리 탭 UI 확인:
  - `pageList`에서 루트 탭 active 상태(고대비 배경 + 인디케이터)가 명확히 보이는지 확인
  - 하위 카테고리 쉘/탭이 루트 탭과 동일한 시각 언어로 표시되는지 확인
  - 모바일에서 루트/하위 탭 가로 스크롤이 끊김 없이 동작하는지 확인
- 목록 검색 기능 확인:
  - 검색 입력(`ttListSearchInput`)에 키워드 입력 시 카드가 즉시 필터링되는지 확인
  - 지우기 버튼(`ttListSearchClear`) 클릭 시 전체 목록으로 복귀하는지 확인
  - 메타 텍스트(`ttListSearchMeta`)가 결과 개수로 갱신되는지 확인
- 목록 컨트롤 구조 확인:
  - `list-toolbar`(뷰 토글/검색 버튼)와 `list-layout`(sidebar/content) 블록이 모두 렌더링되는지 확인
  - 1024px+에서 `list-sidebar`와 `list-content`가 2컬럼으로 병렬 배치되는지 확인
  - 모바일에서는 툴바 이후 사이드 트리/콘텐츠가 단일 세로 흐름으로 노출되는지 확인
- 목록 사이드 트리 확인:
  - 상단에는 `뷰 토글 + 검색 버튼`만 보이고 루트 탭은 좌측 사이드에 노출되는지 확인
  - 루트/하위 탭이 세로 트리 노드 형태로 렌더링되는지 확인
  - 루트 행 우측 화살표 버튼 클릭 시 하위 탭이 루트 아래에서 드롭다운/접기 되는지 확인
  - 활성 루트는 초기 로드 시 자동으로 펼쳐지는지 확인
  - 서브카테고리 페이지에서는 드롭다운에 활성 서브카테고리 1개만 노출되는지 확인
  - 1024px+에서 사이드바가 sticky로 유지되는지 확인
  - `list-title`이 `list-header` 상단(좌측)에 노출되고, 본문 영역에 중복 타이틀이 없는지 확인
  - 툴바 배경 없이 `검색 아이콘(좌) + 뷰 토글(우)` 순서로 우측 정렬되는지 확인
  - 검색 아이콘 클릭 시 입력창이 툴바 내부에서 우측으로 슬라이드 확장/축소되는지 확인
- 홈 최신글 렌더링:
  - `#ttLatestTrack .latest-slide`가 비어 있으면 `Recent Posts`에 fallback 문구가 표시되는지 확인
- 링크 동작:
  - `/category`, `/guestbook`, `#ttSubscribePromo`, 외부 GitHub/메일 링크 이동 확인

## 자주 발생하는 장애

- 증상: `Recent Posts`가 비어 있음
  - 원인: 티스토리 최신글 치환자 블록이 로컬에서 렌더링되지 않거나 `.latest-slide` 구조가 변경됨
  - 조치: fallback 문구 확인 후 `collectRecentPosts()` selector를 현재 마크업 기준으로 수정
- 증상: 대표 콘텐츠 탭 전환이 동작하지 않음
  - 원인: `data-feature-tab` / `data-feature-panel` 속성 불일치
  - 조치: inline script의 `featuredGroups.key`와 생성된 DOM id를 함께 점검
- 증상: 홈에 예전 장식 섹션이 다시 노출됨
  - 원인: `#pageHome` 내부 클래스명 변경으로 CSS 숨김 selector 미스매치
  - 조치: `src/style/style.css`의 홈 숨김 규칙 selector를 실제 DOM 기준으로 갱신
- 증상: `Engineering`/`TroubleShooting` 랜덤 카드에서 글이 잘 수집되지 않음
  - 원인: 카테고리 슬러그가 `engineering`/`troubleshooting`와 `enginnering`/`trubleshooting` 중 한쪽만 존재
  - 조치: `src/function/random-post-box.js`의 `ROOT_CATEGORIES[*].paths`에 두 경로가 모두 포함됐는지 확인
- 증상: PC에서 카테고리 배너가 비대칭 `catStack` 대신 모바일 스택형으로 보임
  - 원인: `@media (min-width: 768px)`의 표시 규칙이 1024px+에서도 재정의되지 않음
  - 조치: `src/style/style.css`에서 `@media (min-width: 1024px)`에 `catHub--mobile: none`, `catStack: grid` 보정 규칙을 확인
- 증상: guestbook 모바일에서 작성 폼이 화면을 과도하게 가리거나 입력 중 점프함
  - 원인: 입력 폼 `position: sticky`가 모바일까지 동일 적용됨
  - 조치: `#pageGuestbook .tt-comment-cont > form`의 브레이크포인트별 `position`(`static`/`sticky`) 설정을 확인
- 증상: catStack 비대칭 배너를 눌러도 카테고리 페이지로 이동하지 않음
  - 원인: 데스크톱 오버라이드에서 `.catStackHero`의 `pointer-events`가 `none`으로 남아 있거나 카드 전체 라우팅 핸들러가 바인딩되지 않음
  - 조치: `#pageHome .catStackHero { pointer-events: auto !important; }` 및 `initCatStackBannerRouting()` 초기화 호출 여부를 확인
- 증상: Engineering/Troubleshooting 카드 클릭 시 잘못된 카테고리(또는 404)로 이동함
  - 원인: 링크 슬러그가 `enginnering`/`trubleshooting` 오타로 남아 있음
  - 조치: `src/pages/main.html`의 카테고리 링크/`data-list`/`data-rss`가 `engineering`/`troubleshooting`인지 확인
- 증상: 목록 탭 활성 상태가 구분되지 않거나 대비가 약함
  - 원인: `#pageList` 탭 리디자인 규칙이 다른 전역 스타일에 의해 덮임
  - 조치: `src/style/style.css`의 `#pageList .list-category-tab[aria-current=\"page\"]`, `.list-subcategory-tab[aria-current=\"page\"]` 우선순위를 확인
- 증상: guestbook에서 코르크 배경이 일부 패널에만 보임
  - 원인: 코르크 배경 타깃이 `.tt-guestbook__panel`로 남아 있음
  - 조치: `#pageGuestbook .page-wrap`에 코르크 배경이 적용되어 있고 `.tt-guestbook__panel`은 투명 컨테이너인지 확인
- 증상: 목록 검색 입력이 보여도 필터가 동작하지 않음
  - 원인: `list-search-filter.js` 로드 누락 또는 `#pageList` 마크업 id 불일치
  - 조치: `main.html`의 스크립트 로드와 `ttListSearch*` id 존재 여부를 확인
- 증상: 데스크톱에서 목록 컨트롤 레이아웃이 깨져 탭이 겹침
  - 원인: `list-layout` 2컬럼 규칙이 다른 미디어쿼리에 덮여 사이드/콘텐츠 폭 계산이 충돌
  - 조치: `@media (min-width: 768px/1024px)`의 `list-layout`, `list-sidebar`, `list-content` 규칙 우선순위를 확인
- 증상: 상단에 검색 입력이 항상 보여 요구한 툴바 형태가 아님
  - 원인: `ttListSearchPanel`의 `is-open` 클래스 상태와 CSS 전환 규칙이 불일치
  - 조치: `list-search-filter.js`의 `setSearchPanel()` 클래스 토글과 `style.css`의 `.list-search-panel.is-open` 규칙을 함께 확인
- 증상: 목록 타이틀이 상단/본문에 중복 노출됨
  - 원인: `list-title`을 헤더로 옮긴 뒤 본문의 기존 타이틀 노드가 제거되지 않음
  - 조치: `main.html`의 `list-content` 내부 타이틀 제거 여부를 확인
- 증상: 루트 화살표를 눌러도 하위 카테고리 드롭다운이 열리지 않음
  - 원인: `list-subcategory-tabs.js`의 트리 재구성 또는 `list-category-expand` 클릭 바인딩 실패
  - 조치: `ttListCategoryTabs` 내부에 `list-category-node/expand`가 생성됐는지, `aria-expanded` 값이 토글되는지 확인
- 증상: 서브카테고리 페이지에서 비활성 서브카테고리까지 함께 노출됨
  - 원인: `createSubcategoryList()`의 `activeOnly` 조건 분기 누락 또는 `activeSubSlug` 파싱 실패
  - 조치: `list-subcategory-tabs.js`에서 `activeSlug===rootSlug && activeSubSlug` 조건과 `continue` 분기 적용 여부를 확인

## 복구 절차

1. `src/pages/main.html`의 허브 섹션/inline script 변경분만 임시로 되돌려 렌더링 오류 범위를 분리합니다.
2. `src/style/style.css`의 `.hub*` 스타일과 홈 숨김 규칙을 순차적으로 비활성화해 레이아웃 깨짐 원인을 확인합니다.
3. 티스토리 실제 스킨 적용 환경에서 콘솔 로그와 링크 이동을 재확인하고, 수정 내용을 ADR/REQUIREMENTS에 반영합니다.
