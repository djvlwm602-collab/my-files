/**
 * Role: 랜딩 페이지 컨텐츠를 data/content.json에서 읽고 쓰는 API 엔드포인트
 * Key Features: GET (읽기), POST (저장)
 * Dependencies: fs, path (Node.js 내장)
 * Notes: Vercel 배포 환경에서는 파일 쓰기가 불가 — 로컬 개발 전용
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 프로젝트 루트의 data/content.json 절대 경로
const DATA_PATH = path.join(process.cwd(), 'data', 'content.json');

/** 컨텐츠 데이터 조회 */
export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(
      { error: '데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

/** 컨텐츠 데이터 저장 (전체 덮어쓰기) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: '저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
