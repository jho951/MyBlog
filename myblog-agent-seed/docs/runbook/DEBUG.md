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

## 복구 절차

1. `src/pages/main.html`의 허브 섹션/inline script 변경분만 임시로 되돌려 렌더링 오류 범위를 분리합니다.
2. `src/style/style.css`의 `.hub*` 스타일과 홈 숨김 규칙을 순차적으로 비활성화해 레이아웃 깨짐 원인을 확인합니다.
3. 티스토리 실제 스킨 적용 환경에서 콘솔 로그와 링크 이동을 재확인하고, 수정 내용을 ADR/REQUIREMENTS에 반영합니다.
