# guestbook 코르크 보드 + 헤더 투명 처리

목표:
- guestbook 페이지를 코르크 보드 분위기로 리디자인한다.
- `GUESTBOOK` 안내 영역(제목/설명/칩)의 배경은 투명하게 유지한다.

작업 지시:
- `src/style/style.css`의 `#pageGuestbook` 전용 블록에서 보드 패널(`.tt-guestbook__panel`)에 텍스처 배경을 적용한다.
- `guestbook-head`의 `background`, `border`, `box-shadow`를 제거한다.
- 칩/내부 카드는 헤더 투명 콘셉트를 해치지 않도록 반투명 톤으로 조정한다.

검증 기준:
- guestbook 패널이 브라운 계열 코르크 보드 질감으로 보인다.
- 상단 안내 영역은 박스 배경 없이 투명 레이어로 표시된다.
- 모바일/태블릿/PC에서 텍스트 가독성과 여백이 유지된다.
