import { useState, useEffect, useRef, useCallback } from 'react';
import { StepCounter, getTodaySteps, saveTodaySteps } from '../utils/stepCounter';

interface UseStepCounterOptions {
  autoStart?: boolean;
  updateInterval?: number; // 업데이트 간격 (ms)
}

/**
 * 만보기 데이터를 관리하는 커스텀 훅
 */
export function useStepCounter(options: UseStepCounterOptions = {}) {
  const { autoStart = false, updateInterval = 1000 } = options;
  
  const [steps, setSteps] = useState<number>(getTodaySteps());
  const [isCounting, setIsCounting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const stepCounterRef = useRef<StepCounter | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 초기화
  useEffect(() => {
    stepCounterRef.current = new StepCounter();
    setSteps(getTodaySteps());

    if (autoStart) {
      startCounting();
    }

    return () => {
      if (stepCounterRef.current) {
        stepCounterRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart]);

  // 걸음 수 업데이트
  useEffect(() => {
    if (isCounting) {
      intervalRef.current = setInterval(() => {
        if (stepCounterRef.current) {
          const currentSteps = stepCounterRef.current.getSteps();
          setSteps(currentSteps);
        }
      }, updateInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCounting, updateInterval]);

  /**
   * 만보기 시작
   */
  const startCounting = useCallback(async () => {
    if (!stepCounterRef.current) return;

    try {
      const started = await stepCounterRef.current.start();
      if (started) {
        setIsCounting(true);
        setError(null);
      } else {
        setError('DeviceMotion 권한이 필요합니다.');
      }
    } catch (err) {
      setError('만보기를 시작할 수 없습니다.');
      console.error('Failed to start step counter:', err);
    }
  }, []);

  /**
   * 만보기 중지
   */
  const stopCounting = useCallback(() => {
    if (stepCounterRef.current) {
      stepCounterRef.current.stop();
    }
    setIsCounting(false);
  }, []);

  /**
   * 걸음 수 수동 설정
   */
  const setStepsManually = useCallback((newSteps: number) => {
    if (stepCounterRef.current) {
      stepCounterRef.current.setSteps(newSteps);
    }
    setSteps(newSteps);
    saveTodaySteps(newSteps);
  }, []);

  /**
   * 걸음 수 증가
   */
  const incrementSteps = useCallback((amount: number = 1) => {
    if (stepCounterRef.current) {
      stepCounterRef.current.increment(amount);
      setSteps(stepCounterRef.current.getSteps());
    }
  }, []);

  /**
   * 걸음 수 리셋
   */
  const resetSteps = useCallback(() => {
    if (stepCounterRef.current) {
      stepCounterRef.current.reset();
    }
    setSteps(0);
  }, []);

  /**
   * 거리 계산 (km)
   */
  const distance = steps * 0.0007; // 1걸음 = 0.7m

  return {
    steps,
    distance: Number(distance.toFixed(1)),
    isCounting,
    error,
    startCounting,
    stopCounting,
    setStepsManually,
    incrementSteps,
    resetSteps,
  };
}

