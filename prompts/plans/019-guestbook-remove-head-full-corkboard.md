# guestbook 헤더 제거 + 전체 코르크 보드화

목표:
- guestbook 상단 안내 영역(`guestbook-head`)을 제거한다.
- 코르크 보드 텍스처를 섹션 전체(`page-wrap`)에 적용해 단일 보드 레이어로 보이게 한다.

작업 지시:
- `src/pages/main.html`의 `<s_guest>` 영역에서 `guestbook-head` 마크업을 삭제한다.
- `src/style/style.css`의 `#pageGuestbook` 블록에서 코르크 배경 타깃을 `.tt-guestbook__panel`에서 `.page-wrap`으로 옮긴다.
- 내부 패널은 투명 컨테이너로 단순화하고, 댓글 보드/입력 카드 가독성은 유지한다.

검증 기준:
- guestbook 상단에 `GUESTBOOK` 안내 블록이 보이지 않는다.
- 코르크 보드 질감이 guestbook 전체 폭에서 일관되게 보인다.
- 모바일/태블릿/PC에서 댓글 읽기/작성 레이아웃이 깨지지 않는다.
