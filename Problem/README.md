# @jho951/ui-components

React UI 컴포넌트 라이브러리입니다.

- 소비자(사용자) 관점의 **설치/사용** 가이드는 이 문서(README)를 기준으로 합니다.
- 개발/Storybook/브랜치 운영 규칙은 **CONTRIBUTING** 및 docs 문서를 참고하세요.

---

## 설치

```bash
pnpm add @jho951/ui-components
# 또는
npm i @jho951/ui-components
# 또는
yarn add @jho951/ui-components
```

> Peer Dependencies: `react`, `react-dom` (v18)

---

## 사용

### 기본 import

```tsx
import { /* ... */ } from "@jho951/ui-components";
```

### UI 컴포넌트 import

```tsx
import { Button, Card } from "@jho951/ui-components/ui";
```

### 스타일(CSS) import

필요 시 아래 CSS 엔트리들을 가져올 수 있습니다.

```ts
import "@jho951/ui-components/reset.css";
import "@jho951/ui-components/theme.css";
import "@jho951/ui-components/utils.css";
```

---

## 문서

- 개발/Storybook/기여 가이드: [CONTRIBUTING.md](./CONTRIBUTING.md)
- 브랜치 운영(dev → release/sync-main → main): [docs/BRANCHING.md](./docs/BRANCHING.md)
- 로컬 개발(설치/빌드/Storybook): [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

## 라이선스

- [LICENSE](./LICENSE)
