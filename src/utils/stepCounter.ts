/**
 * 만보기 데이터를 받아오는 유틸리티
 * 여러 방법을 지원: DeviceMotion API, 수동 입력, 로컬 스토리지
 */

export interface StepData {
  steps: number;
  distance: number; // km
  timestamp: number;
}

// 로컬 스토리지 키
const STORAGE_KEY = 'huecolor_steps';
const DAILY_STORAGE_KEY = 'huecolor_daily_steps';

/**
 * 오늘 날짜의 키 생성
 */
function getTodayKey(): string {
  return `${DAILY_STORAGE_KEY}_${new Date().toISOString().split('T')[0]}`;
}

/**
 * 로컬 스토리지에서 오늘의 걸음 수 가져오기
 */
export function getTodaySteps(): number {
  try {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(todayKey);
    if (stored) {
      const data: StepData = JSON.parse(stored);
      // 오늘 날짜인지 확인
      const today = new Date().toISOString().split('T')[0];
      const storedDate = new Date(data.timestamp).toISOString().split('T')[0];
      if (storedDate === today) {
        return data.steps;
      }
    }
  } catch (error) {
    console.error('Failed to get today steps:', error);
  }
  return 0;
}

/**
 * 오늘의 걸음 수 저장
 */
export function saveTodaySteps(steps: number, distance?: number): void {
  try {
    const todayKey = getTodayKey();
    const data: StepData = {
      steps,
      distance: distance ?? steps * 0.0007, // 기본 계산: 1걸음 = 0.7m
      timestamp: Date.now(),
    };
    localStorage.setItem(todayKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save today steps:', error);
  }
}

/**
 * DeviceMotion API를 사용한 걸음 수 추정
 * 주의: 정확도가 낮을 수 있으며, 사용자 권한이 필요합니다.
 */
export class StepCounter {
  private stepCount: number = 0;
  private lastAcceleration: number = 0;
  private threshold: number = 0.5; // 가속도 임계값
  private lastStepTime: number = 0;
  private minStepInterval: number = 300; // 최소 걸음 간격 (ms)

  constructor() {
    this.stepCount = getTodaySteps();
  }

  /**
   * DeviceMotion 이벤트 리스너 시작
   */
  start(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof DeviceMotionEvent === 'undefined' || 
          typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
        // iOS 13+ 권한 요청
        (DeviceMotionEvent as any)
          .requestPermission()
          .then((permission: string) => {
            if (permission === 'granted') {
              this.setupListener();
              resolve(true);
            } else {
              console.warn('DeviceMotion permission denied');
              resolve(false);
            }
          })
          .catch(() => {
            // 권한 요청이 지원되지 않으면 바로 시작
            this.setupListener();
            resolve(true);
          });
      } else {
        this.setupListener();
        resolve(true);
      }
    });
  }

  private setupListener(): void {
    window.addEventListener('devicemotion', this.handleMotion.bind(this));
  }

  private handleMotion(event: DeviceMotionEvent): void {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    const acceleration = Math.sqrt(x! * x! + y! * y! + z! * z!);
    const delta = Math.abs(acceleration - this.lastAcceleration);

    const now = Date.now();

    // 걸음 감지: 가속도 변화가 임계값을 넘고, 최소 간격을 지켰을 때
    if (delta > this.threshold && now - this.lastStepTime > this.minStepInterval) {
      this.stepCount++;
      this.lastStepTime = now;
      saveTodaySteps(this.stepCount);
    }

    this.lastAcceleration = acceleration;
  }

  /**
   * 현재 걸음 수 가져오기
   */
  getSteps(): number {
    return this.stepCount;
  }

  /**
   * 걸음 수 설정 (수동 입력)
   */
  setSteps(steps: number): void {
    this.stepCount = steps;
    saveTodaySteps(steps);
  }

  /**
   * 걸음 수 증가
   */
  increment(amount: number = 1): void {
    this.stepCount += amount;
    saveTodaySteps(this.stepCount);
  }

  /**
   * 리스너 정리
   */
  stop(): void {
    window.removeEventListener('devicemotion', this.handleMotion.bind(this));
  }

  /**
   * 리셋 (오늘의 걸음 수 초기화)
   */
  reset(): void {
    this.stepCount = 0;
    saveTodaySteps(0);
  }
}

/**
 * 외부 API 연동 예시 (Google Fit, Apple HealthKit 등)
 * 실제 사용 시 API 키와 인증이 필요합니다.
 */

// Google Fit API 예시 (실제 사용 시 설정 필요)
export async function fetchStepsFromGoogleFit(): Promise<number> {
  // TODO: Google Fit API 연동
  // 1. OAuth 인증
  // 2. API 호출
  // 3. 데이터 파싱
  throw new Error('Google Fit API integration not implemented');
}

// Apple HealthKit 예시 (PWA/모바일 앱 필요)
export async function fetchStepsFromHealthKit(): Promise<number> {
  // TODO: HealthKit 연동
  // iOS에서는 네이티브 앱이 필요합니다.
  throw new Error('HealthKit integration requires native app');
}

/**
 * 수동으로 걸음 수 입력받기
 */
export function setManualSteps(steps: number): void {
  saveTodaySteps(steps);
}

