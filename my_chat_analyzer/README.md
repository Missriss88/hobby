# 카카오톡 대화 분석기 Pro

AI 기반 카카오톡 대화 분석 플랫폼입니다. 대화 내용을 업로드하면 관계와 감정을 심층 분석합니다.

## 기술 스택

**Frontend**
- React 18 + TypeScript
- Vite (빌드 도구)
- Zustand (상태 관리)
- Recharts (차트)
- Framer Motion (애니메이션)
- CSS Modules

**Backend**
- FastAPI
- Google Gemini AI

## 시작하기

### 1. 백엔드 설정

```bash
# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일 생성)
GEMINI_API_KEY=your_api_key_here

# 서버 실행
uvicorn main:app --reload
```

### 2. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 3. 접속

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 주요 기능

- 📊 **대화 통계** - 메시지 수, 응답 시간, 이모티콘 사용량
- 💭 **감정 분석** - 호감도 점수, 감정 흐름 그래프
- 🎯 **핵심 순간** - 중요 대화, 갈등, 화해 순간 자동 감지
- 📈 **관계 예측** - 관계 발전 방향 예측
- 💡 **AI 조언** - 맞춤형 관계 발전 조언

## 프로젝트 구조

```
my_chat_analyzer/
├── main.py              # FastAPI 백엔드
├── requirements.txt     # Python 의존성
├── frontend/            # React 프론트엔드
│   ├── src/
│   │   ├── components/  # 재사용 컴포넌트
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── stores/      # Zustand 스토어
│   │   ├── services/    # API 서비스
│   │   └── types/       # TypeScript 타입
│   └── package.json
├── templates/           # 기존 HTML 템플릿 (백업)
└── static/              # 기존 정적 파일 (백업)
```
