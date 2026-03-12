# 메인 홈 랜딩 개선 반복 프롬프트

1. `docs/REQUIREMENTS.md`, `docs/IA.md`, `docs/WIREFRAME.md`를 읽고 현재 변경 범위를 다시 확인합니다.
2. `docs/decisions/001-home-landing-vanilla-js.md`를 읽고 바닐라 JS 렌더링/티스토리 공존 제약을 유지합니다.
3. `src/pages/main.html`의 `#ttHubLanding`, `#ttHubRecent`, `#ttHubConnect`와 하단 inline script를 중심으로 수정합니다.
4. `src/style/style.css`에서 `.hub*` 스타일만 우선 수정하고, 기존 티스토리 공통 레이아웃 영향 여부를 점검합니다.
5. 수정 후 `docs/runbook/DEBUG.md`의 홈 랜딩 점검 절차로 콘솔 오류/최신글 렌더링/링크 동작을 확인합니다.
