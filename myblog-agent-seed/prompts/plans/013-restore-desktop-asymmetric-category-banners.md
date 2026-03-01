# PC 비대칭 카테고리 배너 복구

목표:
- PC(1024px+)에서 카테고리 영역이 `catStack` 비대칭 배너 레이아웃으로 노출되게 복구한다.
- 태블릿(768~1024px)에서는 `catHub--mobile` 스택형 노출을 유지한다.

작업 지시:
- `src/style/style.css`의 하단 오버라이드에서 viewport 분기 규칙을 점검한다.
- `@media (min-width: 768px)`에서 적용된 `catHub--mobile`/`catStack` 표시 규칙이 PC에서 재역전되도록 `@media (min-width: 1024px)` 보정 규칙을 추가한다.
- 기존 catStack 데스크톱 비대칭 카드 크기/간격 규칙은 유지한다.

검증 기준:
- 768~1023px에서 `catHub--mobile`은 보이고 `catStack`은 숨겨진다.
- 1024px+에서 `catHub--mobile`은 숨겨지고 `catStack`은 보인다.
- 1024px+에서 `catStackItem--cs/dev/eng/ts` 비대칭 높이/배치가 유지된다.
