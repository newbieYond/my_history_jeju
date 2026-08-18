import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "우리의 가을 제주 | 성호 · 세인", description: "성호와 세인의 2026년 가을 제주 6박 7일 여행 가이드" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body>{children}</body></html>;}
