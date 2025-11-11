import { Button } from './ui/button';

export interface UserData {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  provider: 'google' | 'kakao' | 'naver';
}

interface LoginScreenProps {
  onLogin: (provider: 'google' | 'kakao' | 'naver', userData: UserData) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const mockUsers: Record<string, UserData> = {
      google: {
        id: 'google_123',
        name: '김하늘',
        email: 'user@gmail.com',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        provider: 'google'
      },
      kakao: {
        id: 'kakao_123',
        name: '이컬러',
        email: 'user@kakao.com',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        provider: 'kakao'
      },
      naver: {
        id: 'naver_123',
        name: '박색감',
        email: 'user@naver.com',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        provider: 'naver'
      }
    };

    setTimeout(() => {
      onLogin(provider, mockUsers[provider]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-6 py-8">
      {/* 로고 */}
      <div className="mb-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-2xl" />
      </div>

      {/* 제목 */}
      <h1 className="text-5xl font-bold text-gray-900 mb-3">HueStep</h1>

      {/* 부제목 */}
      <p className="text-center text-gray-600 text-lg mb-12 max-w-sm">
        걷기와 색상으로 만드는<br />
        나만의 건강 루틴
      </p>

      {/* 카드 */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        {/* 설명 텍스트 */}
        <p className="text-center text-gray-700 font-semibold mb-8 text-lg">
          소셜 계정으로 시작하기
        </p>

        {/* Google 버튼 */}
        <button
          onClick={() => handleSocialLogin('google')}
          className="w-full h-16 bg-white border-2 border-gray-300 rounded-2xl flex items-center justify-center gap-3 mb-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="font-semibold text-gray-800 text-lg">Google</span>
        </button>

        {/* Kakao 버튼 */}
        <button
          onClick={() => handleSocialLogin('kakao')}
          className="w-full h-16 bg-[#FEE500] border-2 border-[#FEE500] rounded-2xl flex items-center justify-center gap-3 mb-4 hover:bg-[#FDD835] active:bg-[#FCC800] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 3C6.5 3 2 6.58 2 11c0 2.84 1.87 5.33 4.68 6.77-.2.73-.76 2.8-.87 3.25-.13.54.2.53.42.39.18-.12 2.94-1.96 3.41-2.28.78.11 1.58.17 2.36.17 5.5 0 10-3.58 10-8s-4.5-8-10-8z" />
          </svg>
          <span className="font-semibold text-black text-lg">Kakao</span>
        </button>

        {/* Naver 버튼 */}
        <button
          onClick={() => handleSocialLogin('naver')}
          className="w-full h-16 bg-[#03C75A] border-2 border-[#03C75A] rounded-2xl flex items-center justify-center gap-3 hover:bg-[#02B350] active:bg-[#02A84E] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          <span className="font-semibold text-white text-lg">Naver</span>
        </button>
      </div>

      {/* 약관 */}
      <p className="text-center text-gray-500 text-sm mt-8 max-w-sm">
        로그인하면 서비스 이용약관 및<br />
        개인정보 처리방침에 동의합니다
      </p>
    </div>
  );
}
