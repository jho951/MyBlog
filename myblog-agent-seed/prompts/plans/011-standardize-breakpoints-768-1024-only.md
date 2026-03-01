# 브레이크포인트 768/1024 표준화

목표:
- CSS 반응형 기준을 `min-width: 768px`, `min-width: 1024px`만 사용하도록 통일한다.

작업 지시:
- `src/style/style.css`에서 `max-width` 기반 미디어쿼리를 제거/변환한다.
- `min-width: 1025px`은 `min-width: 1024px`로 통일한다.
- `min-width + max-width` 조합 구간은 단일 `min-width` 기준으로 재정렬한다.

검증 기준:
- `@media (max-width: ...)`가 0개다.
- `@media (min-width: 1025px)`가 0개다.
- 브레이크포인트는 768/1024 구간만 남는다.
