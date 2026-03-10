# Humanoid Robot Landing Page & Admin Implementation Plan

Toss 스타일의 깔끔하고 프리미엄한 디자인을 갖춘 휴머노이드 로봇 랜딩 페이지와 관리자 페이지를 구축합니다.

## 확정된 주요 결정사항

> [!IMPORTANT]
> - **디자인 컨셉**: Toss Team 페이지 참고 — 어두운 배경, 선명한 타이포그래피, 부드러운 그라데이션, 미세 애니메이션
> - **이미지**: `public/images/img01.png` ~ `img04.png` 사용
> - **데이터 저장**: `data/content.json` 파일 기반 (Vercel KV 불필요, 별도 DB 없음)
> - **AI API**: OpenRouter API (claude-opus-4-6 모델) 사용
> - **어드민 인증**: 미구현 (추후 필요 시 추가)

---

## 기반 기술

- **프레임워크**: Next.js 16 (App Router)
- **스타일링**: Vanilla CSS (CSS Modules) + `globals.css` 전역 디자인 토큰
- **폰트**: Google Fonts — Pretendard (한글) + 영문 Sans-serif
- **환경변수**: `.env.local` — `OPENROUTER_API_KEY`

---

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터)
│   ├── globals.css             # 전역 CSS 변수 (Toss 컬러 팔레트, 타이포)
│   ├── page.tsx                # 랜딩 페이지
│   ├── page.module.css         # 랜딩 페이지 스타일
│   ├── admin/
│   │   ├── page.tsx            # 어드민 대시보드
│   │   └── admin.module.css    # 어드민 스타일
│   └── api/
│       └── content/
│           └── route.ts        # 컨텐츠 CRUD API (data/content.json 읽기/쓰기)
├── lib/
│   └── openrouter.ts           # OpenRouter API 연동 모듈
data/
└── content.json                # 어드민에서 수정된 텍스트/이미지 경로 저장
```

---

## 구성 요소별 상세

### [디자인 시스템] `globals.css`
- Toss 스타일 CSS 변수 정의
  - 배경: `#0A0A0A` (거의 검정)
  - 주 색상: `#FFFFFF`, 포인트: `#3182F6` (Toss Blue)
  - 그라데이션: `linear-gradient(135deg, #3182F6, #7C3AED)`
- 기본 타이포그래피 스케일 및 spacing 설정

### [랜딩 페이지] `app/page.tsx`
- **Hero 섹션**: 전체 화면, 로봇 이미지(img01) 배경, 카피라이팅
- **서비스 소개 섹션**: 3단 카드 (모닝콜, 가사 케어, 댄스타임)
- **요금제 섹션**: 플랜 카드 (Toss 카드 스타일)
- **컨텐츠 로드**: `/api/content`에서 텍스트/이미지 경로 fetch

### [어드민 페이지] `app/admin/page.tsx`
- 텍스트 항목 인라인 편집 UI
- 이미지 경로 수정 인터페이스
- AI 프롬프트 수정 영역 (OpenRouter 연동)
- 저장 시 `/api/content` POST 호출 → `data/content.json` 업데이트

### [컨텐츠 API] `app/api/content/route.ts`
- `GET /api/content` → `data/content.json` 읽기
- `POST /api/content` → `data/content.json` 덮어쓰기
- Vercel 배포 시 주의: Serverless 환경에서 파일 쓰기 불가 → 로컬 개발용, 배포 시 Vercel KV로 전환 필요

### [AI 연동] `lib/openrouter.ts`
- `OPENROUTER_API_KEY` 환경변수로 인증
- claude-opus-4-6 모델 호출
- 어드민에서 커스텀 프롬프트 입력 → AI 응답 반환

---

## data/content.json 구조 (예시)

```json
{
  "hero": {
    "title": "완벽하지만 눈치 없는 가사도우미",
    "subtitle": "당신의 집을 완벽하게 청소합니다. 타이밍은 보장 못 합니다.",
    "imageUrl": "/images/img01.png"
  },
  "services": [
    { "id": "morning", "title": "모닝콜", "description": "..." },
    { "id": "care", "title": "가사 케어", "description": "..." },
    { "id": "dance", "title": "댄스타임", "description": "..." }
  ],
  "aiPrompt": "당신은 서투른 가사도우미 로봇입니다..."
}
```

---

## 검증 계획

### 자동화 테스트
- `npm run dev` — 로컬 동작 확인
- `npm run build` — 빌드 오류 없는지 확인

### 수동 검증
- Toss 스타일 디자인 가이드 적용 여부 확인 (어두운 배경, 그라데이션, 타이포)
- 어드민 수정 → 랜딩 페이지 즉시 반영 확인
- `/api/content` GET/POST 정상 동작 확인
- OpenRouter AI 프롬프트 호출 및 응답 확인
- Vercel 배포 후 외부 접근 테스트

### 배포 시 주의사항
- `.env.local`의 `OPENROUTER_API_KEY`를 Vercel 환경변수에 등록
- `data/content.json` 파일 쓰기는 로컬 전용 — 배포 환경에서는 Vercel KV 전환 검토
