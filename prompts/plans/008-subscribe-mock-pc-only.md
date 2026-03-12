# 구독 mock PC 전용 노출

목표:
- `subscribePromo__mock`를 모바일/태블릿에서 숨기고 PC에서만 보이게 한다.

작업 지시:
- `src/style/style.css`의 mock 숨김 미디어쿼리를 `max-width: 1024px`로 조정한다.

검증 기준:
- 모바일(<=767px): mock 숨김
- 태블릿(768~1024px): mock 숨김
- PC(>=1025px): mock 표시
