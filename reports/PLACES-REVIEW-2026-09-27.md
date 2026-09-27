# 새 장소 검토 · 2026-09-27

## 반영

| 장소 | 장소 목록 | 일정 판단 |
| --- | --- | --- |
| 번네식당 | Day 5 예비 식당 | 용머리해안·사계해안과 가까워 그날 점심으로 바꾸기 쉽다. 현재 Day 5 미영이네식당과 Day 6 네거리식당, Day 2 맛나식당을 고려해 확정 식사는 유지한다. 번네를 고르면 다른 갈치 식사 한 끼를 줄인다. |
| 점점 | Day 1 예비 카페 | 닭머르해안길과 묶기 좋다. 도착일에 차 인수가 빠르고 시간이 남을 때만 아이스크림 하나를 나눠 먹는다. 김녕과 함덕 저녁은 우선한다. |
| 카멜커피 제주점 · 픽업카페 행원점 | 전체 장소 지도 후보 | 같은 행원해변 권역의 커피·빵 조합이다. 도착일에는 동쪽으로 우회하고, 다음 날은 우도 일정, 셋째 날은 비자림 이동이 있어 고정 일정에 추가하지 않는다. 근처를 다시 지날 때 함께 들른다. |

## 확인한 정보

- 번네식당의 순살갈치조림과 안덕면 산방로 16 위치: [펀제주 번네식당](https://funjeju.com/food/545). 사용자가 준 [Google Maps 링크](https://maps.app.goo.gl/FqxHUnFfk7svuAh97)를 장소에 보존했다.
- 점점의 닭머르 인근 위치와 초당옥수수 아이스크림: [한국관광공사 관광정보](https://ktourmap.com/spotDetails.jsp?contentId=2899491). 7,500원은 [오늘제주 메뉴](https://onuljeju.com/place/cmp00hrhg0dngf2kfsrhz4xzw)에서 2026-09-27 확인했지만 바뀔 수 있어 사이트 일정 문구에는 고정 가격을 싣지 않았다. 사용자가 준 [Google Maps 링크](https://maps.app.goo.gl/zGUpF69T12YJYV1HA)를 장소에 보존했다.
- 카멜커피 제주점의 위치: [카멜커피 공식 매장 안내](https://www.cmlandco.kr/Location/). 행원해변에서 빵과 커피를 함께 즐기는 정보: [비짓제주 카멜커피 제주점](https://www.visitjeju.net/kr/detail/view?contentsid=CNTS_300000000013305).
- 픽업카페 행원점의 해맞이해안로 617-4 B동 위치: [식품 인허가 기반 빵집 정보](https://bakery.happynowinfo.com/b/bakery-6510000-121-2025-00002/pigeobkapehaengweonjeom-jeju-jeju-si/). 빵을 카멜커피에서 먹는 조합은 사용자가 알려준 내용이다.

운영시간과 가격은 방문 전에 다시 확인한다.

## QA

- `pnpm_config_verify_deps_before_run=false pnpm build` 통과. 현재 설치된 pnpm 11이 기존 의존성 폴더를 자동 재설치하려는 동작만 건너뛰고, 프로젝트의 `tsc --noEmit && vite build` 스크립트를 그대로 실행했다.
- 모바일 미리보기(너비 약 583px): 전체 장소 132곳, 네 곳의 마커와 Google Maps 링크, Day 1 점점·Day 5 번네식당 예비 카드, 지도 150% 확대를 확인했다.
- 기존 일정과 CSS는 변경하지 않았다. 데스크톱 크기에서는 데이터만 바뀌며, 현재 미리보기 도구가 화면 너비 전환을 지원하지 않아 별도 화면 검증은 수행하지 못했다.
