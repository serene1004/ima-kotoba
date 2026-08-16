# いまことば (Ima Kotoba)

> 지금의 마음을 일본어로 기록해요.

짧은 일본어 한두 문장으로 그 순간의 감정과 생각을 남기는 개인 기록 서비스입니다. 긴 일기 대신 생각나는 순간 가볍게 한마디를 남기고, 오늘의 흐름과 이번 주의 감정을 돌아볼 수 있습니다.

## 주요 기능

- 로그인 없이 사용하는 체험 모드
  - 사용자 이름을 하루·나츠·아키·후유 중 하나로 표시
  - 기록은 현재 브라우저의 Local Storage에만 저장
- Google OAuth 로그인과 Supabase 기반 개인 기록 저장
- 오늘의 기록 작성과 감정 선택, 선택 한국어 의미 작성
- 기록 삭제 확인 다이얼로그와 성공 toast
- 내 정보 화면의 주간 기록 수·감정 통계 차트
- 오늘 기록과 지난 기록의 내부 스크롤 목록
- 반응형 레이아웃과 키보드 접근 가능한 계정 메뉴·확인 다이얼로그

## 기술 구성

- React + TypeScript + Vite
- React Router
- Supabase Auth + Postgres + Row Level Security
- Chart.js + react-chartjs-2
- Lucide React
- pnpm
- ESLint (Airbnb 기반)
- Vercel SPA rewrite: `vercel.json`

## 프로젝트 구조

```text
src/
  components/
    charts/       # 주간·감정 차트
    journal/      # 저널 공용 UI
    ui/           # 다이얼로그, toast, 아이콘
  features/
    journal/      # 저널 상태·Supabase 연동
  pages/          # 로그인, 홈, 작성, 내 정보 화면
  data/           # 감정 목록
  lib/            # Supabase 클라이언트
  types/          # 공용 타입
```

## 실행

```bash
pnpm install
pnpm dev
```

개발 서버는 `http://localhost:9050`에서 실행됩니다.

```bash
pnpm run lint
pnpm run build
```

## 환경 변수

`.env.example`을 참고해 프로젝트 루트에 `.env.local` 파일을 만듭니다.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`VITE_SUPABASE_PUBLISHABLE_KEY`는 브라우저에 노출되는 publishable key입니다. 서비스 역할 키(`service_role`)는 절대 클라이언트 환경 변수에 넣지 않습니다.

## Supabase 설정

1. Supabase 프로젝트를 만들고 [supabase/schema.sql](supabase/schema.sql)을 SQL Editor에서 실행합니다.
2. Authentication → Providers에서 Google을 활성화하고 Google Client ID·Secret을 입력합니다.
3. Authentication → URL Configuration에 로컬 개발 URL을 등록합니다.

   ```text
   Site URL
   http://localhost:9050

   Redirect URLs
   http://localhost:9050/**
   ```

4. Google Cloud OAuth 클라이언트 설정에 아래 값을 등록합니다.

   ```text
   Authorized JavaScript origins
   http://localhost:9050

   Authorized redirect URIs
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

현재 스키마는 사용자가 자신의 기록만 조회·생성·삭제할 수 있도록 RLS 정책을 설정합니다.

## Vercel 배포

GitHub 저장소를 Vercel에 Import하여 배포합니다. 이 프로젝트는 pnpm을 사용하므로 다음 설정을 확인합니다.

```text
Framework Preset: Vite
Install Command: pnpm install
Build Command: pnpm run build
Output Directory: dist
```

Vercel의 **Settings → Environment Variables**에서 아래 환경 변수를 `Production` 및 `Preview` 환경에 등록합니다. 값은 로컬 `.env.local`과 동일한 Supabase 프로젝트의 공개 연결 정보입니다.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`VITE_`로 시작하는 값은 브라우저 번들에 포함됩니다. publishable key 이외의 비밀값, 특히 `service_role` 키는 등록하거나 배포하면 안 됩니다.

배포 주소가 `https://your-project.vercel.app`일 때 Google 로그인이 동작하도록 다음 주소도 추가합니다.

```text
Supabase → Authentication → URL Configuration
Site URL
https://your-project.vercel.app

Redirect URLs
https://your-project.vercel.app/**

Google Cloud OAuth client → Authorized JavaScript origins
https://your-project.vercel.app

Google Cloud OAuth client → Authorized redirect URIs
https://your-project-ref.supabase.co/auth/v1/callback
```

Google Cloud의 redirect URI는 Vercel 앱 주소가 아니라 Supabase callback URL입니다. 로컬 개발을 계속하려면 기존 `http://localhost:9050` origin과 redirect URL도 유지합니다.

## 라우트

- `/login` — 체험 모드 시작 또는 Google 로그인
- `/` — 오늘의 기록
- `/write` — 기록 작성
- `/profile` — 주간 통계와 지난 기록

## 다음 구현 방향

- 날짜별 캘린더와 월별 회고
- 기록 검색과 자주 쓴 단어
