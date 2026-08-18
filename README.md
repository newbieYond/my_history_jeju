# 성호 · 세인의 제주 여행 가이드

2026년 10월 30일부터 11월 5일까지, 6박 7일 제주 여행을 위한 반응형 웹 가이드입니다.

## 주요 화면

- 홈과 7일 일정 요약
- Day 1~7 날짜별 약도와 추천 흐름
- 관광지·식당·카페 후보 및 Google Maps 연결
- 제주 전체 장소 약도와 우도 확대 약도
- 예비 장소 표시 토글

## 로컬 실행

Node.js 22 이상과 pnpm 10을 사용합니다.

```bash
pnpm install
pnpm dev
```

프로덕션 빌드 확인:

```bash
pnpm build
```

## 배포

[GitHub Pages에서 보기](https://newbieyond.github.io/my_history_jeju/)

`main` 브랜치에 변경사항이 올라오면 GitHub Actions가 정적 사이트를 빌드하고 GitHub Pages에 자동으로 배포합니다.
