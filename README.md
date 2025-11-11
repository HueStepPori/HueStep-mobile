# 기술 스택 정리

## 프론트엔드

### 핵심 프레임워크
- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite 6.3.5** - 빌드 도구 및 개발 서버

### UI 라이브러리
- **Radix UI** - 접근성 있는 UI 컴포넌트
  - `@radix-ui/react-*` 패키지들 (Dialog, Dropdown, Tabs 등)
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Lucide React** - 아이콘 라이브러리
- **Sonner** - 토스트 알림 라이브러리

### 폼 관리
- **React Hook Form 7.55.0** - 폼 상태 관리 및 유효성 검사

### 기타 UI 라이브러리
- **Recharts 2.15.2** - 차트 라이브러리
- **React Day Picker 8.10.1** - 날짜 선택기
- **Motion** - 애니메이션 라이브러리
- **HTML2Canvas** - HTML을 이미지로 변환

## 백엔드 & 인증

### Firebase (BaaS - Backend as a Service)
- **Firebase Authentication**
  - 이메일/비밀번호 인증
  - Google 소셜 로그인
  - 인증 상태 관리 (onAuthStateChanged)

- **Cloud Firestore**
  - NoSQL 데이터베이스
  - 실시간 데이터 동기화
  - 사용자별 데이터 저장 및 조회
  - 보안 규칙으로 데이터 접근 제어

### Firebase SDK
```bash
firebase 7.0.0
```

## 상태 관리

### React Context API
- **AuthContext** - 인증 상태 전역 관리
  - 현재 사용자 정보
  - 로그인/로그아웃 함수
  - 로딩 상태

### 로컬 상태 관리
- **React Hooks**
  - `useState` - 컴포넌트 상태 관리
  - `useEffect` - 사이드 이펙트 처리
  - `useContext` - Context 사용

## 데이터 구조

### Firestore 컬렉션
```
users/{userId}
  - marbles: DayMarble[]      // 캘린더 데이터
  - collectedColors: CollectedColor[]  // 수집한 색상
  - currentSteps: number       // 현재 걸음 수
  - todayColor: { color, desc } // 오늘의 색상
  - updatedAt: Timestamp       // 마지막 업데이트 시간
```

### 타입 정의
```typescript
interface DayMarble {
  date: string;
  colors: string[];
  steps: number;
  distance: number;
}

interface CollectedColor {
  color: string;
  imageUrl: string;
}
```

## 보안

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // 인증된 사용자만 자신의 데이터에 접근 가능
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 개발 도구

### 빌드 & 개발
- **Vite** - 빠른 개발 서버 및 빌드
- **SWC** - 빠른 TypeScript/JavaScript 컴파일러

### 환경 변수
- **Vite 환경 변수** - `.env` 파일 사용
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - 등등...

## 아키텍처 패턴

### 폴더 구조
```
src/
├── components/        # UI 컴포넌트
│   ├── Auth.tsx      # 로그인/회원가입
│   └── ui/           # 재사용 가능한 UI 컴포넌트
├── contexts/         # React Context
│   └── AuthContext.tsx
├── config/           # 설정 파일
│   └── firebase.ts
├── services/         # 비즈니스 로직
│   └── firestoreService.ts
└── utils/            # 유틸리티 함수
```

### 주요 패턴
1. **Context API 패턴** - 인증 상태 전역 관리
2. **Service Layer 패턴** - Firestore 작업 분리
3. **Custom Hooks** - 재사용 가능한 로직 추상화
4. **Component Composition** - 작은 컴포넌트 조합

## 주요 기능 구현

### 인증 플로우
1. 사용자 로그인/회원가입 → Firebase Authentication
2. 인증 상태 변경 감지 → `onAuthStateChanged`
3. 사용자별 데이터 로드 → Firestore `loadUserData`
4. 데이터 변경 시 자동 저장 → Firestore `saveUserData`

### 데이터 동기화
- **로컬 상태** ↔ **Firestore** 양방향 동기화
- 실시간 업데이트 (필요 시 `onSnapshot` 사용 가능)
- 오프라인 지원 (Firestore 기본 기능)

## 배포 준비

### 환경 변수 관리
- 개발: `.env` 파일
- 프로덕션: 배포 플랫폼 환경 변수 설정

### 보안 고려사항
- ✅ API 키는 클라이언트에 노출되지만 Firestore 보안 규칙으로 보호
- ✅ 사용자는 자신의 데이터만 접근 가능
- ✅ 인증되지 않은 사용자는 앱 사용 불가

## 성능 최적화

- **Vite** - 빠른 HMR (Hot Module Replacement)
- **SWC** - 빠른 컴파일
- **Firestore 인덱싱** - 자동 인덱스 관리
- **코드 스플리팅** - 필요 시 적용 가능

