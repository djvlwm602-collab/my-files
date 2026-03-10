/**
 * Role: 이미지 파일을 받아 public/images 폴더에 저장하는 업로드 API
 * Key Features: multipart/form-data 파싱, 이미지 파일 저장
 * Dependencies: fs, path (Node.js 내장)
 * Notes: Vercel 배포 환경에서는 파일 쓰기 불가 — 로컬 개발 전용
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 허용 확장자 검사 (보안)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 원본 파일명으로 public/images에 저장
    const savePath = path.join(process.cwd(), 'public', 'images', file.name);
    fs.writeFileSync(savePath, buffer);

    return NextResponse.json({ url: `/images/${file.name}` });
  } catch {
    return NextResponse.json({ error: '업로드에 실패했습니다.' }, { status: 500 });
  }
}
