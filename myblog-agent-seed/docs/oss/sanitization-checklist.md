# Sanitization Checklist

## 1) 개인/조직 식별 정보

- `src/pages/main.html`의 아래 값 교체 확인
- `you@example.com`
- `https://github.com/<YOUR_GITHUB_ID>`
- `https://discord.gg/<YOUR_INVITE_CODE>`
- `data-blog-id=""`

## 2) 비밀정보 스캔

- API Key/Token/Private Key 문자열 점검
- `.env` 및 로컬 설정 파일 추적 여부 점검

예시:

```bash
rg -n --hidden --glob '!**/.git/**' \
'(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY|api[_-]?key\\s*=|token\\s*=|secret\\s*=)' .
```

## 3) 개발 환경 흔적 제거

- `.idea/`, `.vscode/`, `.DS_Store` 추적 여부 점검
- OS별 임시 파일 추적 여부 점검

## 4) 링크 유효성 점검

- README/문서 내 dead link 확인
- 플레이스홀더가 의도치 않게 운영 링크로 남지 않았는지 확인
