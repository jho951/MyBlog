# catStack 비대칭 배너 전체 클릭 라우팅

목표:
- 홈 `catStack` 비대칭 배너에서 카드 어느 영역을 클릭해도 해당 카테고리 페이지로 이동하게 한다.
- 키보드 접근(Enter/Space)도 동일하게 동작하게 한다.

작업 지시:
- `src/style/style.css`에서 데스크톱 구간 `catStackHero`의 `pointer-events`가 차단되지 않도록 보정한다.
- `src/function/ui-features.js`에 `catStackItem` 전체 클릭/키보드 라우팅 초기화를 추가한다.
- 내부 앵커(`.catStackHero[href]`) 직접 클릭은 기본 동작을 유지한다.

검증 기준:
- 1024px+에서 `catStack` 각 카드의 여백/내부 영역 클릭이 모두 카테고리 페이지로 이동한다.
- 탭 포커스 후 Enter/Space 입력으로도 동일 경로로 이동한다.
- 기존 모바일 `catHub--mobile` 동작에는 영향이 없다.
