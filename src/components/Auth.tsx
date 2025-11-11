import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signup, login, loginWithGoogle } = useAuth();

  // 비밀번호 유효성 검사
  const validatePassword = (pwd: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (pwd.length < 12) errors.push('12자 이상');
    if (!/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd)) errors.push('대소문자(a-z, A-Z)');
    if (!/\d/.test(pwd)) errors.push('숫자(0-9)');
    if (!/[!@#%$*]/.test(pwd)) errors.push('특수문자(!, @, #, %, $, *)');
    return { valid: errors.length === 0, errors };
  };

  // 비밀번호 강도
  const getPasswordStrength = (pwd: string) => {
    const { errors } = validatePassword(pwd);
    const completed = 4 - errors.length;
    if (completed === 0) return { level: 0, bgColor: 'bg-gray-300', textColor: 'text-gray-600', text: '약함' };
    if (completed === 1) return { level: 1, bgColor: 'bg-red-400', textColor: 'text-red-600', text: '약함' };
    if (completed === 2) return { level: 2, bgColor: 'bg-yellow-400', textColor: 'text-yellow-600', text: '중간' };
    if (completed === 3) return { level: 3, bgColor: 'bg-blue-400', textColor: 'text-blue-600', text: '강함' };
    return { level: 4, bgColor: 'bg-green-400', textColor: 'text-green-600', text: '매우 강함' };
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }
    const { valid, errors } = validatePassword(password);
    if (!valid) {
      toast.error(`비밀번호 요구사항: ${errors.join(', ')}`);
      return;
    }
    try {
      setLoading(true);
      await signup(email, password);
      toast.success('회원가입이 완료되었습니다!');
    } catch (error: any) {
      toast.error(error.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('로그인되었습니다!');
    } catch (error: any) {
      toast.error(error.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('로그인되었습니다!');
    } catch (error: any) {
      toast.error(error.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-4" />
          <CardTitle className="text-2xl">HueColor</CardTitle>
          <CardDescription>컬러 워크를 시작하세요</CardDescription>
          <div className="h-4" />
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* 탭 버튼 - 스타일링 */}
            <TabsList className="grid w-auto grid-cols-2 mx-auto gap-2 bg-transparent p-0">
              <TabsTrigger
                value="login"
                style={{
                  backgroundColor: activeTab === 'login' ? '#d1d5db' : '#ffffff',
                  color: '#374151',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  transition: 'all 200ms',
                  cursor: 'pointer'
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#d1d5db';
                }}
              >
                로그인
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                style={{
                  backgroundColor: activeTab === 'signup' ? '#d1d5db' : '#ffffff',
                  color: '#374151',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  transition: 'all 200ms',
                  cursor: 'pointer'
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#d1d5db';
                }}
              >
                회원가입
              </TabsTrigger>
            </TabsList>

            {/* 로그인 탭 */}
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">이메일</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  로그인
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">또는</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full hover:bg-gray-50 active:scale-95 transition-transform"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google로 로그인
              </Button>

              <div className="h-4" />
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />

                  {/* 강도 바 - 입력 시에만 표시 */}
                  {password && (
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">비밀번호 강도</span>
                        <span className={`text-xs font-semibold ${getPasswordStrength(password).textColor}`}>
                          {getPasswordStrength(password).text}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrength(password).bgColor} transition-all duration-300`}
                          style={{ width: `${(getPasswordStrength(password).level / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="h-3" />

                  {/* 요구사항 체크리스트 */}
                  <div className="p-3 space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${password.length >= 12 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{password.length >= 12 ? '✓' : '○'}</span>
                      <span>12자 이상이어야 합니다</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'}</span>
                      <span>대문자와 소문자(a-z 및 A-Z)를 포함해야 합니다</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{/\d/.test(password) ? '✓' : '○'}</span>
                      <span>숫자(0-9)를 포함해야 합니다</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[!@#%$*]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{/[!@#%$*]/.test(password) ? '✓' : '○'}</span>
                      <span>특수 문자(!, @, #, %, $, *)를 포함해야 합니다</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  회원가입
                </Button>

                {/* 회원가입 버튼 아래 여백 */}
                <div className="h-3" />
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
