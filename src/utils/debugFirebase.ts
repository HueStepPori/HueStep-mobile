// Firebase 디버깅 유틸리티
// 브라우저 콘솔에서 사용할 수 있는 디버깅 함수들

export function debugFirebaseConfig() {
  console.group('🔍 Firebase 설정 확인');
  
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  console.log('✅ 환경 변수 상태:');
  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      // 민감한 정보는 일부만 표시
      if (key === 'apiKey') {
        console.log(`  ${key}: ${value.substring(0, 10)}... (설정됨)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    } else {
      console.error(`  ❌ ${key}: 설정되지 않음`);
    }
  });

  console.log('\n🌐 현재 도메인 정보:');
  console.log(`  hostname: ${window.location.hostname}`);
  console.log(`  origin: ${window.location.origin}`);
  console.log(`  full URL: ${window.location.href}`);

  console.log('\n📋 Firebase Console에 추가해야 할 도메인:');
  console.log(`  ${window.location.hostname}`);

  console.groupEnd();
  
  return {
    config,
    domain: window.location.hostname,
    origin: window.location.origin,
  };
}

// 브라우저 콘솔에서 직접 사용할 수 있도록 전역에 등록
if (typeof window !== 'undefined') {
  (window as any).debugFirebase = debugFirebaseConfig;
}

