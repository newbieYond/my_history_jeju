"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import placesJson from "../data/places.json";

type Place = { name: string; kind: "spot" | "food" | "cafe" | "stay"; note: string; x: number; y: number; rainy?: boolean };
type StoredPlace = { id: number; name: string; tags: string[]; category: Place["kind"]; googleMapsUrl: string; latitude: number | null; longitude: number | null; address: string | null; description: string; isRainyDayFriendly: boolean; isReserve: boolean; mapPosition: { x: number; y: number }; seonghoOpinion: string; seinOpinion: string; seonghoRating: number | null; seinRating: number | null };
type Coordinates = { latitude: number; longitude: number };
type Day = {
  date: string; weekday: string; eyebrow: string; title: string; summary: string; accent: string;
  schedule: { time: string; title: string; note: string; rainy?: boolean }[]; places: Place[]; tip: string;
};

const days: Day[] = [
  {
    date: "10.30", weekday: "금", eyebrow: "HELLO, JEJU", title: "제주에 닿는 날",
    summary: "김녕의 첫 바다를 보고, 함덕의 따뜻한 저녁과 밤 산책으로 제주에 천천히 닿는 날.", accent: "#d67b4b",
    schedule: [
      { time: "14:20", title: "김포공항 출발", note: "제주항공 7C155" },
      { time: "15:35", title: "제주공항 도착", note: "수하물 수령 후 렌터카 셔틀" },
      { time: "시간이 남으면", title: "닭머르 짧은 산책", note: "차량 인수가 빠를 때만 15~20분" },
      { time: "해 질 무렵", title: "김녕해수욕장", note: "첫날의 핵심 풍경 · 오래 머물지 않아도 충분해요" },
      { time: "저녁", title: "함덕에서 저녁과 빵", note: "문개항아리 · 오드랑베이커리 포장", rainy: true },
      { time: "밤", title: "델문도 산책", note: "함덕 바다 앞에서 커피 한 잔과 밤바다" },
    ],
    places: [
      { name: "제주공항", kind: "spot", note: "여행의 시작", x: 27, y: 33 },
      { name: "김녕해수욕장", kind: "spot", note: "첫 저녁의 바다", x: 63, y: 25 },
      { name: "문개항아리 함덕점", kind: "food", note: "문어 · 해물라면으로 시작하는 첫 저녁", x: 50, y: 28, rainy: true },
      { name: "오드랑베이커리", kind: "food", note: "다음 날 아침용 마농바게트 포장", x: 50, y: 25, rainy: true },
      { name: "델문도", kind: "cafe", note: "함덕 바다 앞 밤 카페", x: 48, y: 29, rainy: true },
      { name: "닭머르해안길", kind: "spot", note: "시간 여유 시 들르는 억새 해안 산책", x: 45, y: 27 },
    ], tip: "첫날은 김녕 바다와 여유 있는 숙소 도착이 우선이에요. 차량 인수가 늦으면 닭머르는 미련 없이 건너뛰어요.",
  },
  {
    date: "10.31", weekday: "토", eyebrow: "ISLAND IN AN ISLAND", title: "우도에서 느리게",
    summary: "성산의 예약 아침과 우도의 해물라면, 세 개의 바다를 한 방향으로 즐기는 날.", accent: "#4f8d89",
    schedule: [
      { time: "08:30", title: "맛나식당 아침", note: "예약 시간에 맞춰 식사 · 다음 배편을 여유 있게 선택", rainy: true },
      { time: "오전", title: "우도행 배", note: "신분증 챙기기 · 실제 운항은 당일 확인" },
      { time: "점심", title: "하고수동과 문개 우도", note: "밝은 바다를 보고 해물라면 · 블랑로쉐에서 디저트" },
      { time: "오후", title: "검멀레 · 서빈백사", note: "한 방향으로 천천히 섬을 한 바퀴" },
      { time: "귀항 후", title: "성산 또는 섭지코지", note: "시간과 체력이 남을 때만 한 곳 선택" },
    ],
    places: [
      { name: "맛나식당", kind: "food", note: "우도에 들어가기 전 예약 아침 식사", x: 86, y: 41, rainy: true },
      { name: "우도 도착항", kind: "spot", note: "전기자전거를 빌리고 섬 한 바퀴 시작", x: 23, y: 63 },
      { name: "하고수동해수욕장", kind: "spot", note: "밝은 모래와 얕은 바다", x: 69, y: 35 },
      { name: "문개 우도", kind: "food", note: "하고수동 바다를 보며 먹는 해물라면", x: 64, y: 38, rainy: true },
      { name: "블랑로쉐", kind: "cafe", note: "땅콩 아이스크림 또는 크림라떼", x: 73, y: 41, rainy: true },
      { name: "검멀레해변", kind: "spot", note: "검은 모래와 우도봉 절벽", x: 72, y: 67 },
      { name: "서빈백사", kind: "spot", note: "귀항 전 쉬기 좋은 흰 해변", x: 29, y: 37 },
    ], tip: "맛나식당은 성산에서, 문개 우도는 섬 안에서 먹어요. 결항이면 비자림 → 세화 → 카페한라산 → 섭지코지로 바로 전환해요.",
  },
  {
    date: "11.01", weekday: "일", eyebrow: "FOREST TO SOUTH", title: "숲에서 쇠소깍까지",
    summary: "비자림의 고요에서 시작해 남원 해안과 쇠소깍을 지나 중문으로 내려가는 날.", accent: "#6b8062",
    schedule: [
      { time: "09:00", title: "체크아웃", note: "비자림으로 바로 이동" },
      { time: "10:25", title: "비자림 A코스", note: "평탄한 숲길 약 1시간", rainy: true },
      { time: "12:00", title: "가시식당 점심", note: "두루치기 · 몸국 · 순대국수 · 대기는 1시간까지", rainy: true },
      { time: "오후", title: "남원큰엉해안경승지", note: "절벽과 바다를 잇는 짧은 산책" },
      { time: "14:30", title: "쇠소깍", note: "체험 예약 시 60~90분 · 미예약이면 풍경 중심" },
      { time: "18:00", title: "매일올레시장", note: "딱새우회 · 땅콩만두 · 막걸리", rainy: true },
    ],
    places: [
      { name: "비자림", kind: "spot", note: "평탄한 A코스 중심", x: 72, y: 36, rainy: true },
      { name: "가시식당", kind: "food", note: "두루치기 · 몸국 · 순대국수 1순위", x: 68, y: 65, rainy: true },
      { name: "당케올레국수", kind: "food", note: "보말칼국수 · 고기국수 대안", x: 64, y: 70, rainy: true },
      { name: "남원큰엉해안경승지", kind: "spot", note: "표선에서 쇠소깍으로 내려가는 해안 산책", x: 61, y: 76 },
      { name: "쇠소깍", kind: "spot", note: "배 체험 60~90분", x: 59, y: 80 },
      { name: "매일올레시장", kind: "food", note: "저녁과 포장", x: 48, y: 81, rainy: true },
    ], tip: "섭지코지를 전날 못 갔다면 이 날 오전에 넣고, 남원큰엉 또는 쇠소깍 체험 시간을 줄여요.",
  },
  {
    date: "11.02", weekday: "월", eyebrow: "MOUNTAIN WEATHER", title: "한라산 자락의 하루",
    summary: "시야가 좋으면 1100고지와 천왕사 진입길을, 흐리면 중문의 따뜻한 실내를 즐기는 날.", accent: "#7b7167",
    schedule: [
      { time: "느긋한 아침", title: "보말칼국수", note: "든든히 먹고 산길로", rainy: true },
      { time: "오전", title: "1100고지", note: "시야와 도로 상태가 좋을 때만" },
      { time: "오후", title: "천왕사 진입길", note: "절보다 들어가는 산길의 분위기를 즐기기" },
      { time: "늦은 점심", title: "고집돌우럭", note: "관광지형 한상차림 · 예약 권장", rainy: true },
      { time: "악천후", title: "본태박물관", note: "안개·비가 짙을 때 바로 전환", rainy: true },
    ],
    places: [
      { name: "1100고지", kind: "spot", note: "시야·도로 상태 좋을 때만", x: 48, y: 53 },
      { name: "천왕사", kind: "spot", note: "조용한 선택 경유지", x: 42, y: 47 },
      { name: "중문수두리보말칼국수", kind: "food", note: "보말칼국수 · 보말죽 아침 후보", x: 35, y: 76, rainy: true },
      { name: "고집돌우럭 중문점", kind: "food", note: "예약하고 즐기는 우럭조림 한상", x: 34, y: 74, rainy: true },
      { name: "본태박물관", kind: "spot", note: "비·안개 시 실내 대안", x: 31, y: 62, rainy: true },
    ], tip: "짙은 안개·호우·도로 통제 시 1100도로는 바로 취소. 주차장이 가득 차도 갓길 대기는 하지 않아요.",
  },
  {
    date: "11.03", weekday: "화", eyebrow: "TEA & SUNSET", title: "차밭에서 서쪽 바다로",
    summary: "오설록의 차밭에서 용머리와 송악산을 지나 수월봉 해안절벽, 신창의 노을까지.", accent: "#a16d42",
    schedule: [
      { time: "08:30", title: "중문 출발", note: "긴 운전일이라 조금 일찍" },
      { time: "09:10", title: "오설록 티뮤지엄", note: "차밭 · 전시 · 말차 디저트", rainy: true },
      { time: "11:10", title: "용머리해안", note: "물때·기상에 따라 입장 가능할 때 30~40분" },
      { time: "점심~오후", title: "사계해안·송악산", note: "메인 식사 후 짧은 둘레길 · 용머리 통제 시 이 구간을 넉넉히" },
      { time: "오후", title: "수월봉 해안절벽", note: "이번 서부 일정의 고정 풍경" },
      { time: "해 질 무렵", title: "신창풍차해안", note: "테이크타임 커피와 함께 노을" },
    ],
    places: [
      { name: "오설록 티뮤지엄", kind: "spot", note: "이번 여행의 고정 코어", x: 25, y: 52, rainy: true },
      { name: "용머리해안", kind: "spot", note: "물때가 맞을 때만 걷는 필수 코스", x: 27, y: 73 },
      { name: "사계해안", kind: "spot", note: "산방산과 바다를 잇는 해안 정차", x: 20, y: 72 },
      { name: "송악산", kind: "spot", note: "올레길 10코스의 짧은 전망 구간", x: 18, y: 77 },
      { name: "미영이네식당", kind: "food", note: "고등어회와 탕으로 즐기는 메인 식사", x: 12, y: 72, rainy: true },
      { name: "한라전복 (모슬포)", kind: "food", note: "미영이네 대기·휴무 시 전복 식사 대안", x: 19, y: 72, rainy: true },
      { name: "수월봉", kind: "spot", note: "서부 해안절벽을 보는 고정 코스", x: 10, y: 55 },
      { name: "신창풍차해안", kind: "spot", note: "노을을 위한 해안도로", x: 9, y: 51 },
      { name: "테이크타임 커피로스터스", kind: "cafe", note: "신창에서 쉬어가는 커피와 노을", x: 11, y: 50, rainy: true },
    ], tip: "수월봉을 고정하고 금오름은 예비로 둬요. 용머리해안이 통제되면 사계해안·송악산에서 더 오래 쉬어요.",
  },
  {
    date: "11.04", weekday: "수", eyebrow: "SWEET SLOW DAY", title: "감귤빛 완충일",
    summary: "직접 딴 감귤 한 봉지와 이중섭거리, 폭포와 다리의 밤 산책으로 채우는 서귀포.", accent: "#df7e36",
    schedule: [
      { time: "오전", title: "감귤 따기", note: "후기 좋은 농장에서 30~60분" },
      { time: "점심", title: "네거리식당", note: "갈치국 · 갈치구이로 이른 점심", rainy: true },
      { time: "오후", title: "이중섭거리와 유동커피", note: "골목 산책 · 기념품 · 커피 한 잔", rainy: true },
      { time: "해 질 무렵", title: "천지연·새연교", note: "폭포에서 다리까지 천천히 걷기" },
      { time: "저녁", title: "토평골 또는 포장", note: "오는정김밥은 예약 가능할 때만", rainy: true },
    ],
    places: [
      { name: "감귤 체험농장", kind: "spot", note: "농장은 예약 후 업데이트", x: 46, y: 71 },
      { name: "네거리식당", kind: "food", note: "갈치국 · 갈치구이 이른 점심", x: 52, y: 79, rainy: true },
      { name: "오는정김밥", kind: "food", note: "예약 성공 시 포장 · 실패하면 바로 대안으로", x: 52, y: 70, rainy: true },
      { name: "이중섭거리", kind: "spot", note: "카페를 곁들이는 필수 도심 산책", x: 49, y: 82, rainy: true },
      { name: "유동커피", kind: "cafe", note: "테이크아웃도 좋은 커피", x: 51, y: 81, rainy: true },
      { name: "천지연폭포", kind: "spot", note: "해 질 무렵에 걷기 좋은 폭포", x: 47, y: 83 },
      { name: "새연교", kind: "spot", note: "바람 약할 때 해질녘 산책", x: 45, y: 86 },
      { name: "토평골", kind: "food", note: "서귀포에서 즐기는 제주식 저녁 후보", x: 54, y: 67, rainy: true },
    ], tip: "감귤 따기와 이중섭거리는 고정이에요. 오는정김밥은 예약에 시간을 과하게 쓰지 않고, 실패하면 바로 다음 일정으로 넘어가요.",
  },
  {
    date: "11.05", weekday: "목", eyebrow: "ONE LAST VIEW", title: "폭포를 보고, 집으로",
    summary: "천제연의 물소리를 마지막으로 듣고, 공항권 식사와 선물을 챙겨 집으로 돌아가는 날.", accent: "#6d8990",
    schedule: [
      { time: "오전", title: "체크아웃", note: "짐을 싣고 천제연으로" },
      { time: "오전~점심", title: "천제연폭포", note: "제1·제2폭포까지만 짧고 선명하게" },
      { time: "점심", title: "공항권 식사", note: "우진해장국 1순위 · 대기와 반납 시각을 함께 판단", rainy: true },
      { time: "오후", title: "동문시장 선물", note: "공항 도착이 충분히 빠를 때만 짧게" },
      { time: "16:40 전후", title: "렌터카 반납 이동", note: "교통과 주유 시간을 넉넉히" },
      { time: "18:40까지", title: "렌터카 반납", note: "공항 셔틀 이동" },
      { time: "21:10", title: "제주공항 출발", note: "이스타항공 ZE278" },
    ],
    places: [
      { name: "천제연폭포", kind: "spot", note: "제1·제2폭포까지만", x: 34, y: 78 },
      { name: "우진해장국", kind: "food", note: "고사리육개장 1순위 · 1시간 대기까지 가능", x: 26, y: 33, rainy: true },
      { name: "제주미담", kind: "food", note: "우진 대기가 반납 시각을 침범할 때의 대안", x: 48, y: 33, rainy: true },
      { name: "태광식당", kind: "food", note: "공항권 한식 대안", x: 47, y: 31, rainy: true },
      { name: "자매국수", kind: "food", note: "공항권 고기국수 대안", x: 28, y: 31, rainy: true },
      { name: "동문시장", kind: "spot", note: "시간이 충분할 때만 선물 구매", x: 48, y: 31, rainy: true },
      { name: "아베베베이커리 제주", kind: "food", note: "마지막 빵 선물 후보", x: 29, y: 35, rainy: true },
      { name: "제주공항", kind: "spot", note: "21:10 출발", x: 25, y: 29 },
    ], tip: "18:40 렌터카 업체 도착이 최우선. 공항권 식당 대기가 길거나 시내가 막히면 바로 반납으로 전환해요.",
  },
];

const helpLinks = [
  ["☀️", "제주 날씨", "https://www.weather.go.kr/w/index.do"], ["⛴️", "우도 배편", "https://udoship.com/"],
  ["🌿", "비짓제주", "https://www.visitjeju.net/"], ["⛰️", "한라산 통제", "https://visithalla.jeju.go.kr/main/main.do"],
];
const kindLabel = { spot: "가볼 곳", food: "먹을 곳", cafe: "카페", stay: "숙소" };
const kindIcon = { spot: "✦", food: "●", cafe: "♥", stay: "⌂" };
const mapUrl = (name: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " 제주")}`;
const assetUrl = (name: string) => `${import.meta.env.BASE_URL}${name}`;
const schedulePlaceNames = [
  ["제주공항", "제주공항", "닭머르해안길", "김녕해수욕장", "문개항아리 함덕점", "델문도"],
  ["맛나식당", "우도 도착항", "문개 우도", "검멀레해변", "성산일출봉"],
  ["비자림", "비자림", "가시식당", "남원큰엉해안경승지", "쇠소깍", "매일올레시장"],
  ["중문수두리보말칼국수", "1100고지", "천왕사", "고집돌우럭 중문점", "본태박물관"],
  ["오설록 티뮤지엄", "오설록 티뮤지엄", "용머리해안", "송악산", "수월봉", "신창풍차해안"],
  ["감귤 체험농장", "네거리식당", "이중섭거리", "천지연폭포", "토평골"],
  ["천제연폭포", "천제연폭포", "우진해장국", "동문시장", "제주공항", "제주공항", "제주공항"],
];

const revealMap=(target:HTMLElement|null)=>requestAnimationFrame(()=>target?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}));
const focusMarker=(viewport:HTMLDivElement|null,marker:HTMLElement|null)=>requestAnimationFrame(()=>{if(!viewport||!marker)return;const viewportRect=viewport.getBoundingClientRect();const markerRect=marker.getBoundingClientRect();viewport.scrollTo({left:viewport.scrollLeft+markerRect.left-viewportRect.left+markerRect.width/2-viewport.clientWidth/2,top:viewport.scrollTop+markerRect.top-viewportRect.top+markerRect.height/2-viewport.clientHeight/2,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});

function useMapZoom(){
  const [zoom,setZoom]=useState(1);
  const [viewportVersion,setViewportVersion]=useState(0);
  const viewportRef=useRef<HTMLDivElement>(null);
  const dragRef=useRef({active:false,moved:false,x:0,y:0,left:0,top:0});
  const changeZoom=(next:number)=>{
    const target=Math.max(1,Math.min(3,next));
    const viewport=viewportRef.current;
    const centerX=viewport?(viewport.scrollLeft+viewport.clientWidth/2)/viewport.scrollWidth:.5;
    const centerY=viewport?(viewport.scrollTop+viewport.clientHeight/2)/viewport.scrollHeight:.5;
    setZoom(target);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const current=viewportRef.current;if(!current)return;current.scrollLeft=centerX*current.scrollWidth-current.clientWidth/2;current.scrollTop=centerY*current.scrollHeight-current.clientHeight/2;}));
  };
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{if(zoom===1||event.button!==0)return;const viewport=viewportRef.current;if(!viewport)return;dragRef.current={active:true,moved:false,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};};
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{const viewport=viewportRef.current;const drag=dragRef.current;if(!viewport||!drag.active)return;const deltaX=event.clientX-drag.x;const deltaY=event.clientY-drag.y;if(!drag.moved&&Math.hypot(deltaX,deltaY)<8)return;if(!drag.moved)event.currentTarget.setPointerCapture(event.pointerId);drag.moved=true;viewport.scrollLeft=drag.left-deltaX;viewport.scrollTop=drag.top-deltaY;};
  const stopDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{const moved=dragRef.current.moved;dragRef.current.active=false;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(moved)window.setTimeout(()=>{dragRef.current.moved=false;},0);};
  const consumeDrag=()=>{const moved=dragRef.current.moved;dragRef.current.moved=false;return moved;};
  useEffect(()=>{const viewport=viewportRef.current;if(!viewport||zoom===1)return;const onWheel=(event:WheelEvent)=>{if(event.ctrlKey)return;event.preventDefault();event.stopPropagation();viewport.scrollBy({left:event.deltaX+(event.shiftKey?event.deltaY:0),top:event.shiftKey?0:event.deltaY});};viewport.addEventListener("wheel",onWheel,{passive:false});return()=>viewport.removeEventListener("wheel",onWheel);},[zoom]);
  useEffect(()=>{const viewport=viewportRef.current;if(!viewport)return;const updateViewport=()=>setViewportVersion(version=>version+1);viewport.addEventListener("scroll",updateViewport,{passive:true});return()=>viewport.removeEventListener("scroll",updateViewport);},[]);
  return {zoom,viewportRef,viewportVersion,changeZoom,onPointerDown,onPointerMove,onPointerUp:stopDrag,onPointerCancel:stopDrag,consumeDrag};
}

function MapZoomControls({zoom,onChange}:{zoom:number;onChange:(zoom:number)=>void}){
  return <div className="map-zoom-controls" aria-label="지도 확대 및 축소"><button type="button" onClick={()=>onChange(zoom-.5)} disabled={zoom<=1} aria-label="지도 축소">−</button><button type="button" className="zoom-value" onClick={()=>onChange(1)} disabled={zoom===1} aria-label={`현재 ${Math.round(zoom*100)}%, 원래 크기로`}>{Math.round(zoom*100)}%</button><button type="button" onClick={()=>onChange(zoom+.5)} disabled={zoom>=3} aria-label="지도 확대">+</button></div>;
}

function PlaceFeedback({name}:{name:string}){
  const place=storedPlaces.find(item=>item.name===name);
  if(!place)return null;
  const opinions=[
    {person:"성호",rating:place.seonghoRating,opinion:place.seonghoOpinion},
    {person:"세인",rating:place.seinRating,opinion:place.seinOpinion},
  ];
  return <div className="place-feedback" role="group" aria-label={`${name}의 평점과 평가`}><div className="place-feedback-heading"><span>우리의 평점 · 평가</span><small>5점 만점</small></div>{opinions.map(({person,rating,opinion})=><div className="place-feedback-person" key={person}><div><b>{person}</b><span className={rating===null||rating===0?"unrated":""}>{rating===null||rating===0?"평점 전":`★ ${rating.toFixed(1)} / 5`}</span></div><p>{opinion.trim()||"아직 평가를 남기지 않았어요."}</p></div>)}</div>;
}

function MapPlaceDetails({name,kind,label,note,href,visible,onVisibilityChange}:{name:string;kind:Place["kind"];label:string;note:string;href:string;visible:boolean;onVisibilityChange:(visible:boolean)=>void}){
  const toggleRef=useRef<HTMLButtonElement>(null);
  const toggle=()=>{onVisibilityChange(!visible);requestAnimationFrame(()=>toggleRef.current?.focus());};
  return visible?<div className="map-popover map-popover-detail" role="status"><div className="map-popover-heading"><span className={`place-kind kind-${kind}`}>{label}</span><button ref={toggleRef} type="button" className="map-detail-hide" onClick={toggle} aria-label={`${name} 상세 숨기기`}>숨기기</button></div><strong>{name}</strong><p>{note}</p><PlaceFeedback name={name}/><a className="map-google-link" href={href} target="_blank" rel="noreferrer">Google Maps 링크 ↗</a></div>:<button ref={toggleRef} type="button" className="map-detail-reopen" onClick={toggle} aria-label={`${name} 상세 보기`}>상세 보기 ↑</button>;
}

function JejuMap({ day, dayIndex, selected, onSelect, mapRef }: { day: Day; dayIndex: number; selected: Place; onSelect: (place: Place) => void; mapRef: RefObject<HTMLDivElement|null> }) {
  const isUdo = day.date === "10.31";
  const [showDetails,setShowDetails]=useState(true);
  const mapZoom=useMapZoom();
  const places: OverviewPlace[] = [...allPlaces.filter(place=>place.tags.includes(`day${dayIndex+1}`)),...reservePlaces.filter(place=>place.tags.includes(`day${dayIndex+1}`))];
  const isReserve=(place:OverviewPlace):place is ReservePlace=>"reserve" in place;
  useEffect(()=>{focusMarker(mapZoom.viewportRef.current,mapZoom.viewportRef.current?.querySelector<HTMLElement>(".map-pin.active")??null);},[selected,mapZoom.zoom]);
  useEffect(()=>{setShowDetails(true);},[selected]);
  return <div className="map-card" aria-label={`${day.title} 약도`} ref={mapRef}>
    <div className="map-head"><div><span className="map-kicker">TODAY&apos;S MAP</span><strong>{day.date} 약도</strong></div><div className="map-legend"><span>● 장소</span><span>● 맛</span></div></div>
    <div className="map-stage-shell"><div className={`map-stage ${isUdo?"udo-map":""} ${mapZoom.zoom>1?"zoomed":""}`} ref={mapZoom.viewportRef} onPointerDown={mapZoom.onPointerDown} onPointerMove={mapZoom.onPointerMove} onPointerUp={mapZoom.onPointerUp} onPointerCancel={mapZoom.onPointerCancel}>
      <div className="map-scroll-space" style={{width:`${mapZoom.zoom*100}%`,height:`${mapZoom.zoom*100}%`}}><div className="map-zoom-canvas" style={{width:`${100/mapZoom.zoom}%`,height:`${100/mapZoom.zoom}%`,transform:`scale(${mapZoom.zoom})`,"--map-marker-scale":1/mapZoom.zoom} as CSSProperties}>
        <img className="map-background" src={assetUrl(isUdo?"udo-map-detail-v1.webp":"jeju-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>
        {places.map((place,index) => <button key={place.id} className={`map-pin pin-${place.kind} ${isReserve(place)?"reserve":""} ${selected.name===place.name?"active":""}`} style={{left:`${place.x}%`,top:`${place.y}%`,animationDelay:`${index*60}ms`}} onClick={()=>{if(!mapZoom.consumeDrag()){onSelect(place);setShowDetails(true);}}} onDoubleClick={event=>{event.preventDefault();window.open(place.googleMapsUrl,"_blank","noopener,noreferrer");}} aria-label={`${place.name} 정보 보기`} aria-pressed={selected.name===place.name}><span>{isReserve(place)?"+":kindIcon[place.kind]}</span><em className="marker-name">{place.name}</em></button>)}
      </div></div>
    </div><MapPlaceDetails name={selected.name} kind={selected.kind} label={kindLabel[selected.kind]} note={selected.note} href={googleMapsUrlForPlace(selected.name)} visible={showDetails} onVisibilityChange={setShowDetails}/><MapZoomControls zoom={mapZoom.zoom} onChange={mapZoom.changeZoom}/></div><p className="map-caption">마커를 누르면 장소 정보가 보여요 · 링크로 Google Maps 장소 정보를 열 수 있어요.</p>
  </div>;
}

type IndexedPlace = Place & StoredPlace & { dayIndex: number };
const storedPlaces = placesJson as StoredPlace[];
const normalizePlace=(place:StoredPlace):IndexedPlace=>({...place,kind:place.category,note:place.description,x:place.mapPosition.x,y:place.mapPosition.y,rainy:place.isRainyDayFriendly,dayIndex:Number(place.tags.find(tag=>/^day\d+$/.test(tag))?.slice(3)??1)-1});
const allPlaces: IndexedPlace[] = storedPlaces.filter(place=>!place.isReserve).map(normalizePlace);
type ReservePlace = IndexedPlace & { reserve: true };
const reservePlaces: ReservePlace[] = storedPlaces.filter(place=>place.isReserve).map(place=>({...normalizePlace(place),reserve:true}));
type OverviewPlace = IndexedPlace | ReservePlace;
const googleMapsUrlForPlace = (name: string) => storedPlaces.find(place=>place.name===name)?.googleMapsUrl??mapUrl(name);
const udoInsetSafePositions: Record<string,{x:number;y:number}> = {
  "종달리엔": { x: 76, y: 46 },
  "소금바치 순이네": { x: 84, y: 56 },
  "목화식당휴게소": { x: 93, y: 46 },
};

function AllPlacesMap(){
  const [selected,setSelected]=useState<OverviewPlace>(allPlaces[0]);
  const [showDetails,setShowDetails]=useState(true);
  const [showIndex,setShowIndex]=useState(false);
  const [visiblePlaceIds,setVisiblePlaceIds]=useState<number[]>([...allPlaces,...reservePlaces].map(place=>place.id));
  const mapZoom=useMapZoom();
  const mainland: OverviewPlace[] = [...allPlaces.filter(place=>place.dayIndex!==1),...reservePlaces];
  const udo=allPlaces.filter(place=>place.dayIndex===1);
  const mapPlaces: OverviewPlace[] = [...allPlaces,...reservePlaces];
  const visiblePlaces=mapPlaces.filter(place=>visiblePlaceIds.includes(place.id));
  const isReserve=(place:OverviewPlace):place is ReservePlace=>"reserve" in place;
  useEffect(()=>{focusMarker(mapZoom.viewportRef.current,mapZoom.viewportRef.current?.querySelector<HTMLElement>(".all-map-pin.active")??null);},[selected,mapZoom.zoom]);
  useEffect(()=>{setShowDetails(true);},[selected]);
  useEffect(()=>{const viewport=mapZoom.viewportRef.current;if(!viewport)return;const updateVisiblePlaces=()=>{const viewportRect=viewport.getBoundingClientRect();const next=[...viewport.querySelectorAll<HTMLElement>("[data-place-id]")].filter(marker=>{const rect=marker.getBoundingClientRect();return rect.right>=viewportRect.left&&rect.left<=viewportRect.right&&rect.bottom>=viewportRect.top&&rect.top<=viewportRect.bottom;}).map(marker=>Number(marker.dataset.placeId));setVisiblePlaceIds(current=>current.length===next.length&&current.every(id=>next.includes(id))?current:next);};updateVisiblePlaces();const observer=new ResizeObserver(updateVisiblePlaces);observer.observe(viewport);return()=>observer.disconnect();},[mapZoom.zoom,mapZoom.viewportVersion]);
  const selectAndReveal=(place:OverviewPlace)=>{setSelected(place);setShowDetails(true);revealMap(mapZoom.viewportRef.current);};
  const pin=(place:OverviewPlace,compact=false)=>{const position=!compact?udoInsetSafePositions[place.name]??place:place;return <button key={`${isReserve(place)?"reserve":place.dayIndex}-${place.name}`} data-place-id={place.id} className={`map-pin all-map-pin pin-${place.kind} ${isReserve(place)?"reserve":""} ${selected===place?"active":""} ${compact?"compact":""}`} style={{left:`${position.x}%`,top:`${position.y}%`}} onFocus={()=>{setSelected(place);setShowDetails(true);}} onClick={()=>{if(!mapZoom.consumeDrag()){setSelected(place);setShowDetails(true);}}} onDoubleClick={event=>{event.preventDefault();window.open(place.googleMapsUrl,"_blank","noopener,noreferrer");}} aria-label={`${place.name} 정보 보기`} aria-pressed={selected===place}><span>{isReserve(place)?"+":kindIcon[place.kind]}</span><em className="marker-name">{place.name}</em></button>;};
  return <section className="all-map-wrap">
    <div className="all-map-head"><div><span>JEJU AT A GLANCE</span><h2>{visiblePlaces.length}개의 장소를 한 장에</h2></div><div className="all-map-actions"><div className="all-map-legend"><span><i className="legend-spot"/>가볼 곳</span><span><i className="legend-food"/>먹을 곳</span><span><i className="legend-cafe"/>카페</span><span><i className="legend-reserve"/>예비</span></div></div></div>
    <div className="map-stage-shell all-map-stage-shell"><div className={`map-stage all-map-stage ${mapZoom.zoom>1?"zoomed":""}`} ref={mapZoom.viewportRef} onPointerDown={mapZoom.onPointerDown} onPointerMove={mapZoom.onPointerMove} onPointerUp={mapZoom.onPointerUp} onPointerCancel={mapZoom.onPointerCancel}><div className="map-scroll-space" style={{width:`${mapZoom.zoom*100}%`,height:`${mapZoom.zoom*100}%`}}><div className="map-zoom-canvas" style={{width:`${100/mapZoom.zoom}%`,height:`${100/mapZoom.zoom}%`,transform:`scale(${mapZoom.zoom})`,"--map-marker-scale":1/mapZoom.zoom} as CSSProperties}><img className="map-background" src={assetUrl("jeju-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>{mainland.map(place=>pin(place))}
        <div className="udo-inset"><div className="udo-inset-title"><strong>우도</strong><span>확대 약도</span></div><img src={assetUrl("udo-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>{udo.map(place=>pin(place,true))}</div>
      </div></div></div><MapPlaceDetails name={selected.name} kind={selected.kind} label={`${isReserve(selected)?"예비 장소":`DAY ${selected.dayIndex+1}`} · ${kindLabel[selected.kind]}`} note={selected.note} href={selected.googleMapsUrl} visible={showDetails} onVisibilityChange={setShowDetails}/><MapZoomControls zoom={mapZoom.zoom} onChange={mapZoom.changeZoom}/></div>
    <p className="map-caption">처음에는 전체 장소가 보여요 · 확대하거나 지도를 이동하면 현재 지도 영역의 장소만 아래 목록에 표시돼요</p>
    <button className="index-toggle" type="button" aria-expanded={showIndex} aria-controls="all-place-index" onClick={()=>setShowIndex(current=>!current)}><span>현재 지도 영역 장소 {visiblePlaces.length}개</span><b>{showIndex?"접기 ↑":"펼쳐보기 ↓"}</b></button>
    <div id="all-place-index" className={`all-place-index ${showIndex?"open":""}`}>{visiblePlaces.map(place=><article key={`${isReserve(place)?"reserve":place.dayIndex}-${place.name}`} className={`all-place-card ${isReserve(place)?"reserve":""} ${selected===place?"selected":""}`} role="button" tabIndex={0} onFocus={()=>{setSelected(place);setShowDetails(true);}} onClick={()=>selectAndReveal(place)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();selectAndReveal(place);}}}><span className={`choice-icon kind-${place.kind}`}>{isReserve(place)?"+":kindIcon[place.kind]}</span><div><small>{isReserve(place)?"예비":`DAY ${place.dayIndex+1}`} · {kindLabel[place.kind]} {place.rainy&&<span className="rain-label" title="비 오는 날에도 좋아요">☂</span>}</small><strong>{place.name}</strong><p>{place.note}</p></div><a className="external" href={place.googleMapsUrl} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`}>↗</a><PlaceFeedback name={place.name}/></article>)}</div>
  </section>;
}

const defaultLocation: Coordinates = { latitude: 33.5070711, longitude: 126.4916441 };
const radians=(value:number)=>value*Math.PI/180;
const distanceInKm=(from:Coordinates,to:Pick<StoredPlace,"latitude"|"longitude">)=>{if(to.latitude===null||to.longitude===null)return null;const dLat=radians(to.latitude-from.latitude);const dLng=radians(to.longitude-from.longitude);const a=Math.sin(dLat/2)**2+Math.cos(radians(from.latitude))*Math.cos(radians(to.latitude))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));};
const isInJeju=(location:Coordinates)=>location.latitude>=33.05&&location.latitude<=33.65&&location.longitude>=126.05&&location.longitude<=127.05;
const isInUdo=(location:Coordinates)=>location.latitude>=33.48&&location.latitude<=33.54&&location.longitude>=126.86&&location.longitude<=126.98;
const projectLocation=(location:Coordinates,places:StoredPlace[])=>{
  const known=places.filter((place):place is StoredPlace & {latitude:number;longitude:number}=>place.latitude!==null&&place.longitude!==null);
  if(!known.length)return {x:50,y:50};
  const weighted=known.map(place=>({place,distance:Math.max(distanceInKm(location,place)??1,0.1)}));
  const total=weighted.reduce((sum,item)=>sum+1/item.distance**2,0);
  return {x:weighted.reduce((sum,item)=>sum+item.place.mapPosition.x/item.distance**2,0)/total,y:weighted.reduce((sum,item)=>sum+item.place.mapPosition.y/item.distance**2,0)/total};
};

function NearbyPlaces(){
  const [requestedLocation,setRequestedLocation]=useState<Coordinates|null>(null);
  const [message,setMessage]=useState("현재 위치를 확인해 제주 안의 가까운 장소를 보여드릴게요.");
  const [selected,setSelected]=useState<StoredPlace>(allPlaces[0]);
  const mapZoom=useMapZoom();
  const isUdoLocation=requestedLocation!==null&&isInUdo(requestedLocation);
  const useDefaultLocation=requestedLocation===null||!isInJeju(requestedLocation);
  const location=useDefaultLocation?defaultLocation:requestedLocation;
  const mappedPlaces=useMemo(()=>allPlaces.filter(place=>isUdoLocation?place.tags.includes("day2"):!place.tags.includes("day2")),[isUdoLocation]);
  const userMapPosition=useMemo(()=>projectLocation(location,mappedPlaces),[location,mappedPlaces]);
  const [visibleBounds,setVisibleBounds]=useState({left:0,right:100,top:0,bottom:100});
  useEffect(()=>{const viewport=mapZoom.viewportRef.current;if(!viewport)return;const updateBounds=()=>setVisibleBounds({left:viewport.scrollLeft/viewport.scrollWidth*100,right:(viewport.scrollLeft+viewport.clientWidth)/viewport.scrollWidth*100,top:viewport.scrollTop/viewport.scrollHeight*100,bottom:(viewport.scrollTop+viewport.clientHeight)/viewport.scrollHeight*100});updateBounds();const observer=new ResizeObserver(updateBounds);observer.observe(viewport);return()=>observer.disconnect();},[mapZoom.zoom,mapZoom.viewportVersion]);
  const visiblePlaces=useMemo(()=>mappedPlaces.filter(place=>place.x>=visibleBounds.left&&place.x<=visibleBounds.right&&place.y>=visibleBounds.top&&place.y<=visibleBounds.bottom).map(place=>({place,distance:distanceInKm(location,place)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)),[location,mappedPlaces,visibleBounds]);
  useEffect(()=>{if(!visiblePlaces.some(item=>item.place.id===selected.id)&&visiblePlaces[0])setSelected(visiblePlaces[0].place);},[selected.id,visiblePlaces]);
  useEffect(()=>{mapZoom.changeZoom(1.5);requestAnimationFrame(()=>requestAnimationFrame(()=>focusMarker(mapZoom.viewportRef.current,mapZoom.viewportRef.current?.querySelector<HTMLElement>(".current-location-pin")??null)));},[location.latitude,location.longitude,isUdoLocation]);
  const findNearby=()=>undefined;
  const mapLabel=isUdoLocation?"우도":"제주";
  return <section className="nearby-section section-shell"><div className="nearby-intro"><span>NEARBY JEJU</span><h1>지금, 가까운 곳</h1><p>{message}</p><button type="button" onClick={findNearby}>⌖ 현재 위치 다시 찾기</button></div><div className="nearby-map-wrap"><div className="nearby-map-head"><div><span>VISIBLE ON MAP</span><strong>{mapLabel} 지도 안 {visiblePlaces.length}곳</strong></div><small>지도를 움직이면 목록도 바뀌어요</small></div><div className="map-stage-shell"><div className={`map-stage nearby-map-stage ${isUdoLocation?"udo-map":""} ${mapZoom.zoom>1?"zoomed":""}`} ref={mapZoom.viewportRef} onPointerDown={mapZoom.onPointerDown} onPointerMove={mapZoom.onPointerMove} onPointerUp={mapZoom.onPointerUp} onPointerCancel={mapZoom.onPointerCancel}><div className="map-scroll-space" style={{width:`${mapZoom.zoom*100}%`,height:`${mapZoom.zoom*100}%`}}><div className="map-zoom-canvas" style={{width:`${100/mapZoom.zoom}%`,height:`${100/mapZoom.zoom}%`,transform:`scale(${mapZoom.zoom})`,"--map-marker-scale":1/mapZoom.zoom} as CSSProperties}><img className="map-background" src={assetUrl(isUdoLocation?"udo-map-detail-v1.webp":"jeju-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>{mappedPlaces.map(place=><button key={place.id} type="button" className={`map-pin pin-${place.kind} ${selected.id===place.id?"active":""}`} style={{left:`${place.x}%`,top:`${place.y}%`}} onClick={()=>{if(!mapZoom.consumeDrag())setSelected(place);}} aria-label={`${place.name} 정보 보기`} aria-pressed={selected.id===place.id}><span>{kindIcon[place.kind]}</span></button>)}<span className="current-location-pin" style={{left:`${userMapPosition.x}%`,top:`${userMapPosition.y}%`}} aria-label={useDefaultLocation?"기본 위치 제주공항":"현재 위치"}><i>⌖</i></span></div></div></div><div className="map-popover map-popover-detail" role="status"><span className="place-kind">{useDefaultLocation?"기본 위치 · 제주공항":"현재 위치"}</span><strong>{selected.name}</strong><p>{selected.description}</p><a href={selected.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps에서 보기 ↗</a></div><MapZoomControls zoom={mapZoom.zoom} onChange={mapZoom.changeZoom}/></div><p className="map-caption">마커를 누르면 장소를 고를 수 있어요 · 확대하거나 이동하면 현재 보이는 지도 안의 장소만 아래에 표시돼요</p></div><p className="nearby-count">현재 지도 영역에 {visiblePlaces.length}개의 장소가 있어요.</p><div className="nearby-grid">{visiblePlaces.map(({place,distance})=><article key={place.id} className={`nearby-card ${selected.id===place.id?"selected":""}`} role="button" tabIndex={0} onClick={()=>setSelected(place)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setSelected(place);}}}><span className={`choice-icon kind-${place.category}`}>{kindIcon[place.category]}</span><div><small>{place.tags.filter(tag=>tag.startsWith("day")).map(tag=>tag.toUpperCase()).join(" · ")} · {kindLabel[place.category]}</small><strong>{place.name}</strong><p>{place.description}</p>{distance!==null&&<em>{distance < 1 ? `${Math.round(distance*1000)}m` : `${distance.toFixed(1)}km`}</em>}</div><a className="external" href={place.googleMapsUrl} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`}>↗</a></article>)}</div></section>;
}

function Countdown(){ const [count,setCount]=useState<number|null>(null); useEffect(()=>{const start=new Date("2026-10-30T00:00:00+09:00");setCount(Math.max(0,Math.ceil((start.getTime()-Date.now())/86400000)));},[]); return <span>{count===null?"곧 출발":count===0?"오늘 출발!":`${count}번 자면 출발`}</span>; }

export default function Home(){
  const [activeDay,setActiveDay]=useState(0); const [view,setView]=useState<"home"|"summary"|"places"|"day">("home"); const day=useMemo(()=>days[activeDay],[activeDay]);
  const [selectedPlace,setSelectedPlace]=useState<Place>(days[0].places[0]);
  const [selectedScheduleIndex,setSelectedScheduleIndex]=useState<number|null>(null);
  const dayMapRef=useRef<HTMLDivElement>(null);
  const dayReserves=reservePlaces.filter(place=>place.tags.includes(`day${activeDay+1}`)&&!day.places.some(item=>item.name===place.name));
  useEffect(()=>{setSelectedPlace(day.places[0]);setSelectedScheduleIndex(null);},[day]);
  const selectPlace=(place:Place)=>{setSelectedPlace(place);setSelectedScheduleIndex(null);};
  const selectPlaceAndReveal=(place:Place)=>{selectPlace(place);revealMap(dayMapRef.current);};
  const navigate=(next:"home"|"summary"|"places")=>{setView(next);window.scrollTo({top:0,behavior:"smooth"});};
  const moveToDay=(index:number)=>{setActiveDay(index);setView("day");window.scrollTo({top:0,behavior:"smooth"});};
  return <main>
    <header className="site-header">
      <button className="brand" onClick={()=>navigate("home")} aria-label="홈으로"><span className="brand-mark">귤</span><span>성호 <i>·</i> 세인의 제주</span></button>
      <nav className="main-nav" aria-label="주요 화면"><button className={view==="home"?"active":""} onClick={()=>navigate("home")}><span>⌂</span> 홈</button><button className={view==="summary"?"active":""} onClick={()=>navigate("summary")}><span>☷</span> Summary</button><button className={view==="places"?"active":""} onClick={()=>navigate("places")}><span>⌖</span> 모든 장소</button></nav>
      <nav className="day-nav" aria-label="날짜별 일정">{days.map((item,index)=><button key={item.date} className={view==="day"&&activeDay===index?"active":""} onClick={()=>moveToDay(index)}><small>DAY {index+1}</small><span>{item.date}</span></button>)}</nav>
    </header>
    {view==="home"&&<><section className="hero"><div className="hero-copy"><div className="date-pill">2026. 10. 30 — 11. 05 <span>6박 7일</span></div><p className="hero-script">우리의 가을 제주</p><h1>바다와 숲 사이,<br/><em>둘이 걷는 일주일</em></h1><p className="hero-sub">조금 느리게 달리고, 맛있는 건 꼭 챙겨 먹고.<br/>성호와 세인이 기다려온 가을 끝의 제주 여행.</p><div className="hero-actions"><button onClick={()=>moveToDay(0)}>첫날 일정 보기 <span>→</span></button><button className="text-button" onClick={()=>navigate("summary")}>7일 한눈에</button></div><div className="countdown"><span className="spark">✦</span><Countdown/><small>김포 → 제주</small></div></div>
      <div className="hero-art" aria-label="억새와 돌담, 감귤, 한라산이 있는 가을 제주 일러스트"><img src={assetUrl("jeju-hero-v1.webp")} alt="따뜻한 가을빛 아래 한라산과 제주 바다, 억새, 돌담, 감귤이 펼쳐진 일러스트" width={1536} height={1024} fetchPriority="high" decoding="async"/><p>천천히, 제주답게</p></div>
    </section>
    <section className="quick-strip" aria-label="여행 핵심 정보"><div><span>✈</span><p><small>FLIGHT</small>김포 14:20 → 제주 15:35</p></div><div><span>⌂</span><p><small>STAY</small>김녕·구좌 2박 → 중문 4박</p></div><div><span>☘</span><p><small>PACE</small>하루 핵심 경험 1~2개</p></div><div><span>♡</span><p><small>MOOD</small>바다 · 숲 · 산책 · 향토음식</p></div></section></>}
    {view==="summary"&&<><section className="summary-intro"><span>TRIP AT A GLANCE</span><h1>우리의 일주일,<br/>한눈에 보기</h1><p>일정의 대표 장면을 먼저 보고, 마음이 가는 날을 골라보세요.</p></section><section className="overview section-shell" id="overview"><div className="section-heading"><div><span className="section-number">01</span><p>OUR SEVEN DAYS</p></div><h2>일곱 장면으로<br/>미리 보는 제주</h2><p>매일 하나의 좋은 장면만 기억해도 충분한 여행.<br/>카드를 눌러 그날의 자세한 선택지를 확인해요.</p></div>
      <div className="day-grid">{days.map((item,index)=><button key={item.date} className="day-card" onClick={()=>moveToDay(index)} style={{"--day-accent":item.accent} as React.CSSProperties}><div className="day-card-top"><span>DAY {index+1}</span><small>{item.date} {item.weekday}</small></div><div className={`day-icon icon-${index+1}`}><span>{["✈","⛴","♧","⌁","茶","●","≈"][index]}</span></div><strong>{item.title}</strong><p>{item.summary}</p><span className="card-arrow">자세히 보기 →</span></button>)}</div>
    </section><section className="help-section section-shell"><div className="help-copy"><span className="section-number">02</span><p>ON THE ROAD</p><h2>여행 중<br/>필요한 것들</h2><p>출발 전과 당일에 다시 확인해야 할 공식 정보들을 한곳에 모았어요.</p></div><div className="help-links">{helpLinks.map(([icon,label,href])=><a key={label} href={href} target="_blank" rel="noreferrer"><span>{icon}</span><strong>{label}</strong><small>바로 확인하기 ↗</small></a>)}</div></section></>}
    {view==="places"&&<><section className="places-intro"><div><span>ALL PLACES</span><h1>제주에서<br/>만날 모든 곳</h1><p>날짜 구분 없이 제주 전체 약도에서 여행 후보지를 한눈에 확인해요.</p></div><div className="places-stats"><strong>{allPlaces.length+reservePlaces.length}</strong><span>개의 장소</span><small>7 DAYS · ONE MAP</small></div></section><section className="all-places section-shell"><AllPlacesMap/></section></>}
    {view==="day"&&<section className={`detail-section ${activeDay===1?"udo-day":""}`} id="day-detail" style={{"--active-accent":day.accent} as React.CSSProperties}><div className="section-shell"><div className="detail-title"><div><span>DAY {activeDay+1}</span><small>{day.date} · {day.weekday}요일</small></div><p>{day.eyebrow}</p><h2>{day.title}</h2><p className="detail-summary">{day.summary}</p></div>
      <div className="detail-grid"><JejuMap day={day} dayIndex={activeDay} selected={selectedPlace} onSelect={selectPlace} mapRef={dayMapRef}/><div className="plan-panel"><div className="panel-title"><span>추천 흐름</span><small>시간은 가볍게 참고만</small></div><div className="schedule-list">{day.schedule.map((item,index)=>{const linkedPlace=day.places.find(place=>place.name===schedulePlaceNames[activeDay][index])??day.places[0];const selectSchedule=()=>{setSelectedScheduleIndex(index);setSelectedPlace(linkedPlace);};const selectScheduleAndReveal=()=>{selectSchedule();revealMap(dayMapRef.current);};return <article key={`${item.time}-${item.title}`} className={selectedScheduleIndex===index?"selected":""} role="button" tabIndex={0} onFocus={selectSchedule} onClick={selectScheduleAndReveal} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();selectScheduleAndReveal();}}}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.note}</p></div>{item.rainy&&<span className="rain-dot" title="비 오는 날에도 좋아요" aria-label="비 오는 날에도 좋아요">☂</span>}</article>})}</div><div className="today-tip"><span>작은 약속</span><p>{day.tip}</p></div></div></div>
      <div className="choices-section"><div className="choices-head"><h3>오늘, 어디로 갈까?</h3><p>카드를 누르면 지도에서 확인하고, ↗ 버튼으로 Google Maps를 열어요.</p></div><div className="choice-grid">{day.places.map(place=><article key={place.name} className={`choice-card ${selectedPlace===place?"selected":""}`} role="button" tabIndex={0} onClick={()=>selectPlaceAndReveal(place)} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==="Enter"||event.key===" "){event.preventDefault();selectPlaceAndReveal(place);}}}><span className={`choice-icon kind-${place.kind}`}>{kindIcon[place.kind]}</span><div><small>{kindLabel[place.kind]} {place.rainy&&<span className="rain-label" title="비 오는 날에도 좋아요">☂</span>}</small><strong>{place.name}</strong><p>{place.note}</p></div><a className="external" href={googleMapsUrlForPlace(place.name)} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`} title="Google Maps에서 보기">↗</a><PlaceFeedback name={place.name}/></article>)}</div></div>
      {dayReserves.length>0&&<div className="choices-section reserve-choices"><div className="choices-head"><h3>일정 근처 예비 후보 <small>{dayReserves.length}곳</small></h3><p>동선이 꼬이거나 기다림이 길 때, 오늘의 권역 안에서만 골라보세요.</p></div><div className="choice-grid">{dayReserves.map(place=><article key={place.id} className={`choice-card reserve ${selectedPlace.name===place.name?"selected":""}`} role="button" tabIndex={0} onClick={()=>selectPlaceAndReveal(place)} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==="Enter"||event.key===" "){event.preventDefault();selectPlaceAndReveal(place);}}}><span className={`choice-icon kind-${place.kind}`}>+</span><div><small>예비 · {kindLabel[place.kind]} {place.rainy&&<span className="rain-label" title="비 오는 날에도 좋아요">☂</span>}</small><strong>{place.name}</strong><p>{place.note||"Google 지도에 저장한 일정 인근 후보"}</p></div><a className="external" href={place.googleMapsUrl} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`} title="Google Maps에서 보기">↗</a><PlaceFeedback name={place.name}/></article>)}</div></div>}
      <div className="day-pager"><button disabled={activeDay===0} onClick={()=>moveToDay(activeDay-1)}>← 이전 날</button><span>{activeDay+1} / 7</span><button disabled={activeDay===days.length-1} onClick={()=>moveToDay(activeDay+1)}>다음 날 →</button></div>
    </div></section>}
    <footer><div className="footer-tangerine">●</div><p>잘 먹고, 천천히 걷고, 오래 기억하기.</p><strong>성호 · 세인의 가을 제주</strong><small>2026. 10. 30 — 11. 05</small></footer>
  </main>;
}
