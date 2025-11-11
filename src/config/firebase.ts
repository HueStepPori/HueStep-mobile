import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { debugFirebaseConfig } from '../utils/debugFirebase';

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 환경 변수 확인
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-api-key') {
  console.error('❌ Firebase 환경 변수가 설정되지 않았습니다!');
  console.error('프로젝트 루트에 .env 파일을 만들고 다음 형식으로 작성하세요:');
  console.error('VITE_FIREBASE_API_KEY=your-api-key');
  console.error('VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
  console.error('VITE_FIREBASE_PROJECT_ID=your-project-id');
  console.error('VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
  console.error('VITE_FIREBASE_MESSAGING_SENDER_ID=123456789');
  console.error('VITE_FIREBASE_APP_ID=your-app-id');
} else {
  // 개발 환경에서만 디버깅 정보 출력
  if (import.meta.env.DEV) {
    debugFirebaseConfig();
  }
}

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 및 Firestore 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

