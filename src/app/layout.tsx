/**
 * Role: 앱 전체 루트 레이아웃 — 폰트, 메타데이터, 전역 스타일 적용
 * Key Features: Pretendard 한글 폰트, 다크 테마, SEO 메타데이터
 * Dependencies: globals.css (Pretendard CDN 포함)
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '휴머노이드 가사도우미 | 청소 고민? 이자뿌쓰요~',
  description: '월 99만원으로 누리는 완벽한 가사 서비스. 눈치는 없지만 진심인 휴머노이드.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
