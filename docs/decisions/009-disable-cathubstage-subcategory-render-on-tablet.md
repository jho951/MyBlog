# ADR 009: 태블릿에서 catHubStage 하위 카테고리 렌더링 비활성화

- 상태: 승인
- 날짜: 2026-02-28

## 배경

- 768~1024px 태블릿 구간에서 `cat` 영역 레이아웃이 불안정해 보이는 이슈가 있었다.
- 특히 `catHubStage` 하위 카테고리 렌더링이 화면 구성에 영향을 주었다.

## 결정

- 태블릿 구간(768~1024px)에서 `catHubStage` 내부 하위 카테고리 관련 요소 렌더링을 강제로 비활성화한다.
- 대상: `.catSubGrid`, `.catHubSubWrap`, `.catSubCard`, `.catSubBody`, `.catSubVisual`

## 결과

- 태블릿에서 `catHubStage` 하위 카테고리 렌더링이 제거되어 `cat` 영역이 단순화된다.
- 루트 카테고리 중심 노출 정책과 일관성을 유지한다.
