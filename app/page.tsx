"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

type Place = { name: string; kind: "spot" | "food" | "cafe" | "stay"; note: string; x: number; y: number; rainy?: boolean };
type Day = {
  date: string; weekday: string; eyebrow: string; title: string; summary: string; accent: string;
  schedule: { time: string; title: string; note: string; rainy?: boolean }[]; places: Place[]; tip: string;
};

const days: Day[] = [
  {
    date: "10.30", weekday: "금", eyebrow: "HELLO, JEJU", title: "제주에 닿는 날",
    summary: "공항에서 김녕으로. 첫날은 바다 냄새와 따뜻한 저녁만으로 충분해요.", accent: "#d67b4b",
    schedule: [
      { time: "14:20", title: "김포공항 출발", note: "제주항공 7C155" },
      { time: "15:35", title: "제주공항 도착", note: "수하물 수령 후 렌터카 셔틀" },
      { time: "해 지기 전", title: "닭머르 짧은 산책", note: "16:50 전 차량 인수 시 15~20분만" },
      { time: "18:40", title: "김녕에서 저녁", note: "식사 또는 포장 후 숙소에서 쉬기", rainy: true },
    ],
    places: [
      { name: "제주공항", kind: "spot", note: "여행의 시작", x: 27, y: 33 },
      { name: "닭머르해안길", kind: "spot", note: "억새와 해안 정자", x: 45, y: 27 },
      { name: "김녕해수욕장", kind: "spot", note: "첫 저녁의 바다", x: 63, y: 25 },
      { name: "오드랑베이커리", kind: "food", note: "마농바게트 포장", x: 50, y: 25, rainy: true },
      { name: "델문도", kind: "cafe", note: "함덕 바다 앞 카페", x: 48, y: 29, rainy: true },
    ], tip: "차량 인수가 늦어지면 닭머르는 Day 3 오전으로 미뤄요. 어두운 김녕 해안 산책은 생략해도 괜찮아요.",
  },
  {
    date: "10.31", weekday: "토", eyebrow: "ISLAND IN AN ISLAND", title: "우도에서 느리게",
    summary: "전기자전거로 해안을 달리고, 땅콩 아이스크림 앞에서는 충분히 쉬어가기.", accent: "#4f8d89",
    schedule: [
      { time: "07:40", title: "성산항으로 출발", note: "신분증 챙기기 · 렌터카는 항구에" },
      { time: "09:00", title: "우도행 배", note: "실제 운항 시간은 당일 확인" },
      { time: "오전~오후", title: "우도 해안 한 바퀴", note: "하고수동 · 검멀레 · 서빈백사" },
      { time: "15시 전후", title: "성산으로 귀도", note: "여유가 남으면 성산일출봉 무료 산책" },
    ],
    places: [
      { name: "우도 도착항", kind: "spot", note: "전기자전거를 빌리고 섬 한 바퀴 시작", x: 23, y: 63 },
      { name: "하고수동해수욕장", kind: "spot", note: "밝은 모래와 얕은 바다", x: 69, y: 35 },
      { name: "블랑로쉐", kind: "cafe", note: "땅콩 아이스크림 고정 휴식", x: 73, y: 41, rainy: true },
      { name: "검멀레해변", kind: "spot", note: "검은 모래와 우도봉 절벽", x: 72, y: 67 },
      { name: "서빈백사", kind: "spot", note: "귀항 전 쉬기 좋은 흰 해변", x: 29, y: 37 },
      { name: "우도 해물라면", kind: "food", note: "섬 안에서 가볍게 고르는 점심", x: 52, y: 55, rainy: true },
    ], tip: "바람이 세거나 비가 오면 전기자전거 대신 순환버스. 결항이면 비자림 → 세화 → 빛의 벙커로 바꿔요.",
  },
  {
    date: "11.01", weekday: "일", eyebrow: "FOREST TO SOUTH", title: "숲에서 쇠소깍까지",
    summary: "비자림의 고요를 걷고 남쪽 해안도로를 따라 중문으로 숙소를 옮겨요.", accent: "#6b8062",
    schedule: [
      { time: "09:00", title: "체크아웃", note: "닭머르 미방문 시 먼저 들르기" },
      { time: "10:25", title: "비자림 A코스", note: "평탄한 숲길 약 1시간", rainy: true },
      { time: "12:00", title: "표선에서 점심", note: "가시식당 또는 나목도식당", rainy: true },
      { time: "14:30", title: "쇠소깍", note: "테우·조각배 체험 시간 넉넉히" },
      { time: "18:00", title: "매일올레시장", note: "딱새우회 · 땅콩만두 · 막걸리", rainy: true },
    ],
    places: [
      { name: "비자림", kind: "spot", note: "평탄한 A코스 중심", x: 72, y: 36, rainy: true },
      { name: "가시식당", kind: "food", note: "두루치기 · 몸국", x: 68, y: 65, rainy: true },
      { name: "나목도식당", kind: "food", note: "흑돼지 생고기 · 두루치기", x: 65, y: 67, rainy: true },
      { name: "쇠소깍", kind: "spot", note: "배 체험 60~90분", x: 59, y: 80 },
      { name: "매일올레시장", kind: "food", note: "저녁과 포장", x: 48, y: 81, rainy: true },
    ], tip: "표선~남원은 드라이브 자체를 즐기고 정차는 한 번만. 쇠소깍 체험 시간은 지켜요.",
  },
  {
    date: "11.02", weekday: "월", eyebrow: "MOUNTAIN WEATHER", title: "한라산 자락의 하루",
    summary: "시야가 좋으면 1100고지로, 안개가 내려앉으면 따뜻한 실내와 카페로.", accent: "#7b7167",
    schedule: [
      { time: "느긋한 아침", title: "보말칼국수", note: "든든히 먹고 산길로", rainy: true },
      { time: "오전", title: "1100고지 또는 숲", note: "날씨를 보고 한 곳만 제대로" },
      { time: "오후", title: "천왕사 또는 카페", note: "체력과 시야에 따라 선택" },
      { time: "악천후", title: "본태박물관·서귀포", note: "월요일 운영 여부 재확인", rainy: true },
    ],
    places: [
      { name: "1100고지", kind: "spot", note: "시야·도로 상태 좋을 때만", x: 48, y: 53 },
      { name: "서귀포자연휴양림", kind: "spot", note: "숲 산책 한 곳만", x: 40, y: 64 },
      { name: "천왕사", kind: "spot", note: "조용한 선택 경유지", x: 42, y: 47 },
      { name: "파파스브로트", kind: "cafe", note: "중산간 브런치 회복 지점", x: 39, y: 51, rainy: true },
      { name: "본태박물관", kind: "spot", note: "비·안개 시 실내 대안", x: 31, y: 62, rainy: true },
      { name: "중문수두리보말칼국수", kind: "food", note: "아침 식사 후보", x: 35, y: 76, rainy: true },
    ], tip: "짙은 안개·호우·도로 통제 시 1100도로는 바로 취소. 주차장이 가득 차도 갓길 대기는 하지 않아요.",
  },
  {
    date: "11.03", weekday: "화", eyebrow: "TEA & SUNSET", title: "차밭에서 서쪽 바다로",
    summary: "말차 디저트로 시작해 사계, 신창, 협재로 이어지는 긴 해안 드라이브.", accent: "#a16d42",
    schedule: [
      { time: "08:30", title: "중문 출발", note: "긴 운전일이라 조금 일찍" },
      { time: "09:10", title: "오설록 티뮤지엄", note: "차밭 · 전시 · 말차 디저트", rainy: true },
      { time: "11:10", title: "사계해안·송악산", note: "평탄한 전망 구간 30~40분" },
      { time: "14:20", title: "신창 해안도로", note: "마음에 드는 곳 한 번만 정차" },
      { time: "15:30 이후", title: "협재·금능", note: "날씨가 좋으면 일몰까지" },
    ],
    places: [
      { name: "오설록 티뮤지엄", kind: "spot", note: "이번 여행의 고정 코어", x: 25, y: 52, rainy: true },
      { name: "송악산", kind: "spot", note: "전망 좋은 짧은 구간", x: 18, y: 77 },
      { name: "산방식당", kind: "food", note: "밀냉면 · 수육", x: 18, y: 69, rainy: true },
      { name: "미영이네식당", kind: "food", note: "고등어회 메인 식사", x: 12, y: 72, rainy: true },
      { name: "신창풍차해안", kind: "spot", note: "해안도로 드라이브", x: 9, y: 51 },
      { name: "협재·금능", kind: "spot", note: "카페 또는 선택 일몰", x: 16, y: 37 },
      { name: "잔물결 협재점", kind: "cafe", note: "돌집과 핸드드립", x: 18, y: 39, rainy: true },
    ], tip: "일몰을 보면 야간 운전, 편안한 저녁을 원하면 16시대에 출발. 송악산과 수월봉을 모두 걷지는 않아요.",
  },
  {
    date: "11.04", weekday: "수", eyebrow: "SWEET SLOW DAY", title: "감귤빛 완충일",
    summary: "직접 딴 감귤 한 봉지와 서귀포의 느린 오후. 놓친 일정이 있다면 오늘 한 곳만.", accent: "#df7e36",
    schedule: [
      { time: "오전", title: "감귤 따기", note: "후기 좋은 농장에서 30~60분" },
      { time: "점심", title: "서귀포 향토식", note: "네거리식당 등 가볍게", rainy: true },
      { time: "오후", title: "이중섭거리·카페", note: "혹은 숙소에서 푹 쉬기", rainy: true },
      { time: "해 질 무렵", title: "천지연·새연교", note: "체력이 남을 때만" },
    ],
    places: [
      { name: "감귤 체험농장", kind: "spot", note: "농장은 예약 후 업데이트", x: 46, y: 71 },
      { name: "이중섭거리", kind: "spot", note: "느린 도심 산책", x: 49, y: 82, rainy: true },
      { name: "유동커피", kind: "cafe", note: "테이크아웃도 좋은 커피", x: 51, y: 81, rainy: true },
      { name: "사이서가", kind: "cafe", note: "조용한 카페와 서점", x: 47, y: 80, rainy: true },
      { name: "네거리식당", kind: "food", note: "갈치국 · 갈치구이", x: 52, y: 79, rainy: true },
      { name: "새연교", kind: "spot", note: "바람 약할 때 해질녘 산책", x: 45, y: 86 },
    ], tip: "감귤 따기 외에는 욕심내지 않는 날. 앞선 날 놓친 코어가 있다면 오후 일정과 바꿔요.",
  },
  {
    date: "11.05", weekday: "목", eyebrow: "ONE LAST VIEW", title: "폭포를 보고, 집으로",
    summary: "천제연의 물소리를 마지막으로 듣고 천천히 공항으로 돌아가는 날.", accent: "#6d8990",
    schedule: [
      { time: "오전", title: "체크아웃", note: "짐을 싣고 천제연으로" },
      { time: "오전~점심", title: "천제연폭포", note: "제1·제2폭포까지만 짧게" },
      { time: "16:40 전후", title: "중문 출발", note: "교통과 주유 시간을 넉넉히" },
      { time: "18:40까지", title: "렌터카 반납", note: "공항 셔틀 이동" },
      { time: "21:10", title: "제주공항 출발", note: "이스타항공 ZE278" },
    ],
    places: [
      { name: "천제연폭포", kind: "spot", note: "제1·제2폭포까지만", x: 34, y: 78 },
      { name: "자매국수", kind: "food", note: "공항권 고기국수", x: 28, y: 31, rainy: true },
      { name: "우진해장국", kind: "food", note: "대기 20분 이내일 때만", x: 26, y: 33, rainy: true },
      { name: "아베베베이커리", kind: "food", note: "마지막 크림빵 포장", x: 29, y: 35, rainy: true },
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
  ["제주공항", "제주공항", "닭머르해안길", "김녕해수욕장"],
  ["우도 도착항", "우도 도착항", "하고수동해수욕장", "우도 도착항"],
  ["비자림", "비자림", "가시식당", "쇠소깍", "매일올레시장"],
  ["중문수두리보말칼국수", "1100고지", "천왕사", "본태박물관"],
  ["오설록 티뮤지엄", "오설록 티뮤지엄", "송악산", "신창풍차해안", "협재·금능"],
  ["감귤 체험농장", "네거리식당", "이중섭거리", "새연교"],
  ["천제연폭포", "천제연폭포", "천제연폭포", "제주공항", "제주공항"],
];

const revealMap=(target:HTMLElement|null)=>requestAnimationFrame(()=>target?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}));
const focusMarker=(viewport:HTMLDivElement|null,marker:HTMLElement|null)=>requestAnimationFrame(()=>{if(!viewport||!marker)return;const viewportRect=viewport.getBoundingClientRect();const markerRect=marker.getBoundingClientRect();viewport.scrollTo({left:viewport.scrollLeft+markerRect.left-viewportRect.left+markerRect.width/2-viewport.clientWidth/2,top:viewport.scrollTop+markerRect.top-viewportRect.top+markerRect.height/2-viewport.clientHeight/2,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});

function useMapZoom(){
  const [zoom,setZoom]=useState(1);
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
  return {zoom,viewportRef,changeZoom,onPointerDown,onPointerMove,onPointerUp:stopDrag,onPointerCancel:stopDrag,consumeDrag};
}

function MapZoomControls({zoom,onChange}:{zoom:number;onChange:(zoom:number)=>void}){
  return <div className="map-zoom-controls" aria-label="지도 확대 및 축소"><button type="button" onClick={()=>onChange(zoom-.5)} disabled={zoom<=1} aria-label="지도 축소">−</button><button type="button" className="zoom-value" onClick={()=>onChange(1)} disabled={zoom===1} aria-label={`현재 ${Math.round(zoom*100)}%, 원래 크기로`}>{Math.round(zoom*100)}%</button><button type="button" onClick={()=>onChange(zoom+.5)} disabled={zoom>=3} aria-label="지도 확대">+</button></div>;
}

function JejuMap({ day, selected, onSelect, mapRef }: { day: Day; selected: Place; onSelect: (place: Place) => void; mapRef: RefObject<HTMLDivElement|null> }) {
  const isUdo = day.date === "10.31";
  const mapZoom=useMapZoom();
  useEffect(()=>{focusMarker(mapZoom.viewportRef.current,mapZoom.viewportRef.current?.querySelector<HTMLElement>(".map-pin.active")??null);},[selected,mapZoom.zoom]);
  return <div className="map-card" aria-label={`${day.title} 약도`} ref={mapRef}>
    <div className="map-head"><div><span className="map-kicker">TODAY&apos;S MAP</span><strong>{day.date} 약도</strong></div><div className="map-legend"><span>● 장소</span><span>● 맛</span></div></div>
    <div className="map-stage-shell"><div className={`map-stage ${isUdo?"udo-map":""} ${mapZoom.zoom>1?"zoomed":""}`} ref={mapZoom.viewportRef} onPointerDown={mapZoom.onPointerDown} onPointerMove={mapZoom.onPointerMove} onPointerUp={mapZoom.onPointerUp} onPointerCancel={mapZoom.onPointerCancel}>
      <div className="map-scroll-space" style={{width:`${mapZoom.zoom*100}%`,height:`${mapZoom.zoom*100}%`}}><div className="map-zoom-canvas" style={{width:`${100/mapZoom.zoom}%`,height:`${100/mapZoom.zoom}%`,transform:`scale(${mapZoom.zoom})`,"--map-marker-scale":1/mapZoom.zoom} as CSSProperties}>
        <img className="map-background" src={assetUrl(isUdo?"udo-map-detail-v1.webp":"jeju-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>
        {day.places.map((place,index) => <button key={place.name} className={`map-pin pin-${place.kind} ${selected===place?"active":""}`} style={{left:`${place.x}%`,top:`${place.y}%`,animationDelay:`${index*60}ms`}} onClick={()=>{if(!mapZoom.consumeDrag())onSelect(place);}} aria-label={`${place.name} 정보 보기`} aria-pressed={selected===place}><span>{kindIcon[place.kind]}</span></button>)}
      </div></div>
    </div><MapZoomControls zoom={mapZoom.zoom} onChange={mapZoom.changeZoom}/></div>{selected&&<div className="map-popover map-popover-detail" role="status"><span className={`place-kind kind-${selected.kind}`}>{kindLabel[selected.kind]}</span><strong>{selected.name}</strong><p>{selected.note}</p><a href={mapUrl(selected.name)} target="_blank" rel="noreferrer">Google Maps에서 보기 ↗</a></div>}<p className="map-caption">마커를 누르면 장소 정보가 보여요 · 확대 후 PC에서는 휠·끌기, 모바일에서는 끌기로 지도를 이동할 수 있어요</p>
  </div>;
}

type IndexedPlace = Place & { dayIndex: number };
const allPlaces: IndexedPlace[] = days.flatMap((item,dayIndex)=>item.places.map(place=>({...place,dayIndex})));
type ReservePlace = Place & { reserve: true };
const reservePlaces: ReservePlace[] = [
  { name:"성산일출봉", kind:"spot", note:"우도 귀도 후 시간이 남을 때", x:84, y:49, reserve:true },
  { name:"세화해변", kind:"spot", note:"동쪽 해안의 가벼운 산책 후보", x:79, y:29, reserve:true },
  { name:"빛의 벙커", kind:"spot", note:"우도 결항·비 오는 날 실내 대안", x:80, y:52, rainy:true, reserve:true },
  { name:"표선해수욕장", kind:"spot", note:"남쪽 이동 중 한 번 쉬어가기", x:69, y:68, reserve:true },
  { name:"남원큰엉해안경승지", kind:"spot", note:"남원 해안 산책 대안", x:61, y:76, reserve:true },
  { name:"사계해안", kind:"spot", note:"송악산 전후 짧은 해안 정차", x:20, y:72, reserve:true },
  { name:"수월봉", kind:"spot", note:"서쪽 일정에 여유가 있을 때", x:10, y:55, reserve:true },
  { name:"천지연폭포", kind:"spot", note:"완충일 해 질 무렵 선택지", x:47, y:83, reserve:true },
  { name:"카멜리아힐", kind:"spot", note:"비가 약할 때 정원 산책 후보", x:29, y:65, rainy:true, reserve:true },
  { name:"제주도립미술관", kind:"spot", note:"공항권의 차분한 실내 대안", x:34, y:42, rainy:true, reserve:true },
];
type OverviewPlace = IndexedPlace | ReservePlace;

function AllPlacesMap(){
  const [selected,setSelected]=useState<OverviewPlace>(allPlaces[0]);
  const [showReserve,setShowReserve]=useState(false);
  const [showIndex,setShowIndex]=useState(false);
  const mapZoom=useMapZoom();
  const mainland: OverviewPlace[] = [...allPlaces.filter(place=>place.dayIndex!==1),...(showReserve?reservePlaces:[])];
  const udo=allPlaces.filter(place=>place.dayIndex===1);
  const visiblePlaces: OverviewPlace[] = showReserve?[...allPlaces,...reservePlaces]:allPlaces;
  const isReserve=(place:OverviewPlace):place is ReservePlace=>"reserve" in place;
  useEffect(()=>{focusMarker(mapZoom.viewportRef.current,mapZoom.viewportRef.current?.querySelector<HTMLElement>(".all-map-pin.active")??null);},[selected,mapZoom.zoom]);
  const toggleReserve=()=>setShowReserve(current=>{if(current&&isReserve(selected))setSelected(allPlaces[0]);return !current;});
  const selectAndReveal=(place:OverviewPlace)=>{setSelected(place);revealMap(mapZoom.viewportRef.current);};
  const pin=(place:OverviewPlace,compact=false)=><button key={`${isReserve(place)?"reserve":place.dayIndex}-${place.name}`} className={`map-pin all-map-pin pin-${place.kind} ${isReserve(place)?"reserve":""} ${selected===place?"active":""} ${compact?"compact":""}`} style={{left:`${place.x}%`,top:`${place.y}%`}} onMouseMove={()=>setSelected(place)} onFocus={()=>setSelected(place)} onClick={()=>{if(!mapZoom.consumeDrag())setSelected(place);}} aria-label={`${place.name} 정보 보기`} aria-pressed={selected===place}><span>{isReserve(place)?"+":kindIcon[place.kind]}</span><em>{place.name}</em></button>;
  return <section className="all-map-wrap">
    <div className="all-map-head"><div><span>JEJU AT A GLANCE</span><h2>{visiblePlaces.length}개의 장소를 한 장에</h2></div><div className="all-map-actions"><div className="all-map-legend"><span><i className="legend-spot"/>가볼 곳</span><span><i className="legend-food"/>먹을 곳</span><span><i className="legend-cafe"/>카페</span>{showReserve&&<span><i className="legend-reserve"/>예비</span>}</div><button className={`reserve-toggle ${showReserve?"on":""}`} type="button" role="switch" aria-checked={showReserve} onClick={toggleReserve}><span><i/></span>예비 장소 {showReserve?"숨기기":"보기"}<b>{reservePlaces.length}</b></button></div></div>
    <div className="map-stage-shell all-map-stage-shell"><div className={`map-stage all-map-stage ${mapZoom.zoom>1?"zoomed":""}`} ref={mapZoom.viewportRef} onPointerDown={mapZoom.onPointerDown} onPointerMove={mapZoom.onPointerMove} onPointerUp={mapZoom.onPointerUp} onPointerCancel={mapZoom.onPointerCancel}><div className="map-scroll-space" style={{width:`${mapZoom.zoom*100}%`,height:`${mapZoom.zoom*100}%`}}><div className="map-zoom-canvas" style={{width:`${100/mapZoom.zoom}%`,height:`${100/mapZoom.zoom}%`,transform:`scale(${mapZoom.zoom})`,"--map-marker-scale":1/mapZoom.zoom} as CSSProperties}><img className="map-background" src={assetUrl("jeju-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>{mainland.map(place=>pin(place))}
        <div className="udo-inset"><div className="udo-inset-title"><strong>우도</strong><span>확대 약도</span></div><img src={assetUrl("udo-map-detail-v1.webp")} alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async"/>{udo.map(place=>pin(place,true))}</div>
      </div></div></div><MapZoomControls zoom={mapZoom.zoom} onChange={mapZoom.changeZoom}/></div>
    <div className="map-popover map-popover-detail" role="status"><span className={`place-kind kind-${selected.kind}`}>{isReserve(selected)?"예비 장소":`DAY ${selected.dayIndex+1}`} · {kindLabel[selected.kind]}</span><strong>{selected.name}</strong><p>{selected.note}</p><a href={mapUrl(selected.name)} target="_blank" rel="noreferrer">Google Maps에서 보기 ↗</a></div>
    <p className="map-caption">마커에 마우스를 올리거나 누르면 장소 정보가 보여요 · 확대 후 PC에서는 휠·끌기, 모바일에서는 끌기로 지도를 이동할 수 있어요</p>
    <button className="index-toggle" type="button" aria-expanded={showIndex} aria-controls="all-place-index" onClick={()=>setShowIndex(current=>!current)}><span>장소 목록 {visiblePlaces.length}개</span><b>{showIndex?"접기 ↑":"펼쳐보기 ↓"}</b></button>
    <div id="all-place-index" className={`all-place-index ${showIndex?"open":""}`}>{visiblePlaces.map(place=><article key={`${isReserve(place)?"reserve":place.dayIndex}-${place.name}`} className={`all-place-card ${isReserve(place)?"reserve":""} ${selected===place?"selected":""}`} role="button" tabIndex={0} onMouseMove={()=>setSelected(place)} onFocus={()=>setSelected(place)} onClick={()=>selectAndReveal(place)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();selectAndReveal(place);}}}><span className={`choice-icon kind-${place.kind}`}>{isReserve(place)?"+":kindIcon[place.kind]}</span><div><small>{isReserve(place)?"예비":`DAY ${place.dayIndex+1}`} · {kindLabel[place.kind]} {place.rainy&&<span className="rain-label" title="비 오는 날에도 좋아요">☂</span>}</small><strong>{place.name}</strong><p>{place.note}</p></div><a className="external" href={mapUrl(place.name)} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`}>↗</a></article>)}</div>
  </section>;
}

function Countdown(){ const [count,setCount]=useState<number|null>(null); useEffect(()=>{const start=new Date("2026-10-30T00:00:00+09:00");setCount(Math.max(0,Math.ceil((start.getTime()-Date.now())/86400000)));},[]); return <span>{count===null?"곧 출발":count===0?"오늘 출발!":`${count}번 자면 출발`}</span>; }

export default function Home(){
  const [activeDay,setActiveDay]=useState(0); const [view,setView]=useState<"home"|"summary"|"places"|"day">("home"); const day=useMemo(()=>days[activeDay],[activeDay]);
  const [selectedPlace,setSelectedPlace]=useState<Place>(days[0].places[0]);
  const [selectedScheduleIndex,setSelectedScheduleIndex]=useState<number|null>(null);
  const dayMapRef=useRef<HTMLDivElement>(null);
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
    {view==="places"&&<><section className="places-intro"><div><span>ALL PLACES</span><h1>제주에서<br/>만날 모든 곳</h1><p>날짜 구분 없이 제주 전체 약도에서 여행 후보지를 한눈에 확인해요.</p></div><div className="places-stats"><strong>{allPlaces.length}</strong><span>개의 장소</span><small>7 DAYS · ONE MAP</small></div></section><section className="all-places section-shell"><AllPlacesMap/></section></>}
    {view==="day"&&<section className={`detail-section ${activeDay===1?"udo-day":""}`} id="day-detail" style={{"--active-accent":day.accent} as React.CSSProperties}><div className="section-shell"><div className="detail-title"><div><span>DAY {activeDay+1}</span><small>{day.date} · {day.weekday}요일</small></div><p>{day.eyebrow}</p><h2>{day.title}</h2><p className="detail-summary">{day.summary}</p></div>
      <div className="detail-grid"><JejuMap day={day} selected={selectedPlace} onSelect={selectPlace} mapRef={dayMapRef}/><div className="plan-panel"><div className="panel-title"><span>추천 흐름</span><small>시간은 가볍게 참고만</small></div><div className="schedule-list">{day.schedule.map((item,index)=>{const linkedPlace=day.places.find(place=>place.name===schedulePlaceNames[activeDay][index])??day.places[0];const selectSchedule=()=>{setSelectedScheduleIndex(index);setSelectedPlace(linkedPlace);};const selectScheduleAndReveal=()=>{selectSchedule();revealMap(dayMapRef.current);};return <article key={`${item.time}-${item.title}`} className={selectedScheduleIndex===index?"selected":""} role="button" tabIndex={0} onMouseMove={selectSchedule} onFocus={selectSchedule} onClick={selectScheduleAndReveal} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();selectScheduleAndReveal();}}}><time>{item.time}</time><div><strong>{item.title}</strong><p>{item.note}</p></div>{item.rainy&&<span className="rain-dot" title="비 오는 날에도 좋아요" aria-label="비 오는 날에도 좋아요">☂</span>}</article>})}</div><div className="today-tip"><span>작은 약속</span><p>{day.tip}</p></div></div></div>
      <div className="choices-section"><div className="choices-head"><h3>오늘, 어디로 갈까?</h3><p>카드를 누르면 지도에서 확인하고, 화살표로 길찾기를 열어요.</p></div><div className="choice-grid">{day.places.map(place=><article key={place.name} className={`choice-card ${selectedPlace===place?"selected":""}`} role="button" tabIndex={0} onClick={()=>selectPlaceAndReveal(place)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();selectPlaceAndReveal(place);}}}><span className={`choice-icon kind-${place.kind}`}>{kindIcon[place.kind]}</span><div><small>{kindLabel[place.kind]} {place.rainy&&<span className="rain-label" title="비 오는 날에도 좋아요">☂</span>}</small><strong>{place.name}</strong><p>{place.note}</p></div><a className="external" href={mapUrl(place.name)} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()} aria-label={`${place.name} Google Maps에서 보기`}>↗</a></article>)}</div></div>
      <div className="day-pager"><button disabled={activeDay===0} onClick={()=>moveToDay(activeDay-1)}>← 이전 날</button><span>{activeDay+1} / 7</span><button disabled={activeDay===days.length-1} onClick={()=>moveToDay(activeDay+1)}>다음 날 →</button></div>
    </div></section>}
    <footer><div className="footer-tangerine">●</div><p>잘 먹고, 천천히 걷고, 오래 기억하기.</p><strong>성호 · 세인의 가을 제주</strong><small>2026. 10. 30 — 11. 05</small></footer>
  </main>;
}
