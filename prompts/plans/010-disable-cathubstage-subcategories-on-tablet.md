# 태블릿 catHubStage 하위 카테고리 렌더링 비활성화

목표:
- 768~1024px 태블릿 구간에서 `catHubStage` 하위 카테고리 렌더링을 제거한다.

작업 지시:
- `src/style/style.css`의 태블릿 미디어쿼리에 `catHubStage` 내부 하위 카테고리 요소 숨김 규칙을 추가한다.

검증 기준:
- 태블릿에서 `catHubStage` 내 하위 카테고리 요소가 렌더링되지 않는다.
- `cat` 영역은 루트 중심으로 안정적으로 보인다.
