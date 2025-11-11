import { useState, useEffect } from 'react';
import { TodayColor } from './components/TodayColor';
import { ColorWalk } from './components/ColorWalk';
import { MarbleView } from './components/MarbleView';
import { ColorCalendar } from './components/ColorCalendar';
import { WeeklyReport } from './components/WeeklyReport';
import { PaletteShare } from './components/PaletteShare';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { isSimilarColor } from './utils/colorUtils';
import { getRecommendedColor, allColors } from './utils/weatherColorRecommendation';
import { useAuth } from './contexts/AuthContext';
import { 
  loadUserData, 
  saveUserData, 
  updateMarble, 
  addCollectedColor, 
  removeCollectedColor,
  clearCollectedColors,
  DayMarble,
  CollectedColor
} from './services/firestoreService';

type View = 'home' | 'walk' | 'calendar' | 'report' | 'marble' | 'share';
export default function App() {
  const { currentUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [todayColor, setTodayColor] = useState(allColors[0]);
  const [todayColorName, setTodayColorName] = useState(allColors[0].desc);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [collectedColors, setCollectedColors] = useState<CollectedColor[]>([]);
  const [marbles, setMarbles] = useState<DayMarble[]>([]);
  const [walkStarted, setWalkStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 사용자 데이터 로드
  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser.uid)
        .then((data) => {
          if (data) {
            setMarbles(data.marbles || []);
            setCollectedColors(data.collectedColors || []);
            if (data.currentSteps) {
              setCurrentSteps(data.currentSteps);
            }
            if (data.todayColor) {
              setTodayColor({ color: data.todayColor.color, name: data.todayColor.name, desc: data.todayColor.desc });
              setTodayColorName(data.todayColor.desc);
            }
          } else {
            // 데이터가 없으면 빈 배열로 시작
            setMarbles([]);
            setCollectedColors([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('데이터 로드 실패:', error);
          toast.error('데이터를 불러오는데 실패했습니다');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // 오늘의 색상 추천 - 계절/날씨/시간 기반
  useEffect(() => {
    const recommendedColor = getRecommendedColor();
    setTodayColor(recommendedColor);
    setTodayColorName(recommendedColor.desc);
  }, []);

  // 걸음 수 시뮬레이션
  useEffect(() => {
    if (walkStarted && currentView === 'walk') {
      const interval = setInterval(() => {
        setCurrentSteps(prev => prev + Math.floor(Math.random() * 15) + 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [walkStarted, currentView]);

  const handleStartWalk = () => {
    setWalkStarted(true);
    setCurrentView('walk');
    toast.success('컬러 워크를 시작합니다!');
  };

  const handleColorNameChange = (name: string) => {
    setTodayColorName(name);
  };

  const handleStepsIncrement = () => {
    setCurrentSteps(prev => prev + 1);
  };

  const handleColorCollected = async (color: string, imageUrl: string) => {
    const newColor: CollectedColor = { color, imageUrl };
    setCollectedColors(prev => [...prev, newColor]);
    
    if (currentUser) {
      try {
        await addCollectedColor(currentUser.uid, newColor);
      } catch (error) {
        console.error('색상 저장 실패:', error);
        toast.error('색상 저장에 실패했습니다');
      }
    }
    
    toast.success('색상이 추가되었습니다!', {
      description: color,
    });
  };

  const handleColorDeleted = async (index: number) => {
    const deletedColor = collectedColors[index];
    setCollectedColors(prev => prev.filter((_, i) => i !== index));
    
    if (currentUser) {
      try {
        await removeCollectedColor(currentUser.uid, index);
      } catch (error) {
        console.error('색상 삭제 실패:', error);
        toast.error('색상 삭제에 실패했습니다');
      }
    }
    
    toast.success('색상이 삭제되었습니다!', {
      description: deletedColor.color,
    });
  };

  const handleFinishWalk = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newMarble: DayMarble = {
      date: today,
      colors: collectedColors.map(c => c.color),
      steps: currentSteps,
      distance: +(currentSteps * 0.0007).toFixed(1),
    };

    // 기존 오늘 데이터가 있으면 업데이트, 없으면 추가
    setMarbles(prev => {
      const filtered = prev.filter(m => m.date !== today);
      return [...filtered, newMarble];
    });

    // Firestore에 저장
    if (currentUser) {
      try {
        await updateMarble(currentUser.uid, newMarble);
        // 전체 사용자 데이터도 저장 (상태 동기화)
        await saveUserData(currentUser.uid, {
          marbles: [...marbles.filter(m => m.date !== today), newMarble],
          collectedColors,
          currentSteps,
          todayColor: { color: todayColor.color, name: todayColor.name, desc: todayColorName },
        });
      } catch (error) {
        console.error('데이터 저장 실패:', error);
        toast.error('데이터 저장에 실패했습니다');
      }
    }

    setCurrentView('marble');
  };

  const handleContinueFromMarble = () => {
    setCurrentView('calendar');
  };

  const handleSharePalette = () => {
    setCurrentView('share');
  };

  const handleCloseShare = () => {
    setCurrentView('marble');
  };

  const handleResetWalk = async () => {
    setCollectedColors([]);
    setWalkStarted(false);
    
    if (currentUser) {
      try {
        await clearCollectedColors(currentUser.uid);
      } catch (error) {
        console.error('색상 초기화 실패:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMarbles([]);
      setCollectedColors([]);
      setCurrentSteps(0);
      setCurrentView('home');
      toast.success('로그아웃되었습니다');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다');
    }
  };

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!currentUser) {
    return (
      <>
        <Toaster />
        <Auth />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <Toaster />

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
              <h1 className="text-gray-800">HueStep</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main>
        {currentView === 'home' && (
          <TodayColor
            color={todayColor.color}
            colorName={todayColorName}
            steps={currentSteps}
            onStartWalk={handleStartWalk}
            onColorNameChange={handleColorNameChange}
            onStepsIncrement={handleStepsIncrement}
          />
        )}

        {currentView === 'walk' && (
          <ColorWalk
            todayColor={todayColor.color}
            todayColorName={todayColorName}
            collectedColors={collectedColors}
            onColorCollected={handleColorCollected}
            onColorDeleted={handleColorDeleted}
            onFinish={handleFinishWalk}
          />
        )}

        {currentView === 'marble' && (
          <MarbleView
            colors={collectedColors.map(c => c.color)}
            steps={currentSteps}
            distance={+(currentSteps * 0.0007).toFixed(1)}
            date={new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            onContinue={handleContinueFromMarble}
            onShare={handleSharePalette}
          />
        )}

        {currentView === 'calendar' && (
          <ColorCalendar marbles={marbles} />
        )}

        {currentView === 'report' && (
          <WeeklyReport marbles={marbles} todayColor={todayColor.color} />
        )}
      </main>

      {/* 팔레트 공유 모달 */}
      {currentView === 'share' && collectedColors.length > 0 && (
        <PaletteShare
          colors={collectedColors}
          date={new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          onClose={handleCloseShare}
        />
      )}

      {/* 하단 네비게이션 */}
      {currentView !== 'marble' && currentView !== 'share' && (
        <Navbar 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
}
