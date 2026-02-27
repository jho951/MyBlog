# Release Checklist

## A. 문서 준비

1. `README.md` 최신화
2. `CONTRIBUTING.md` 최신화
3. `docs/oss/*` 체크리스트 반영

## B. 라이선스/메타데이터

1. 루트 `LICENSE` 확인
2. `package.json`의 `"license": "Apache-2.0"` 확인
3. 저작권 고지/NOTICE 필요 여부 확인

## C. 공개 전 검증

1. 민감정보 스캔 실행
2. 개인 식별 링크/이메일/ID 교체 확인
3. 불필요 추적 파일 제거 확인

## D. GitHub 공개 절차

1. 변경 커밋/푸시
2. Repository Visibility를 `Public`으로 변경
3. 릴리스 태그 또는 릴리스 노트 작성

## E. 공개 후 점검

1. 라이선스 배지/표시 정상 노출 확인
2. 주요 문서 링크(README, CONTRIBUTING, DEBUG) 동작 확인
3. 이슈/PR 템플릿 기본 동작 확인
