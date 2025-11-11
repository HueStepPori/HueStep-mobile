import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface DayMarble {
  date: string;
  colors: string[];
  steps: number;
  distance: number;
}

export interface CollectedColor {
  color: string;
  imageUrl: string;
}

export interface UserData {
  marbles: DayMarble[];
  collectedColors: CollectedColor[];
  todayColor?: {
    color: string;
    desc: string;
  };
  currentSteps?: number;
}

// 사용자 데이터 저장
export async function saveUserData(userId: string, data: UserData): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

// 사용자 데이터 로드
export async function loadUserData(userId: string): Promise<UserData | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }
  return null;
}

// 특정 날짜의 마블 업데이트
export async function updateMarble(userId: string, marble: DayMarble): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    const marbles = userData.marbles || [];
    
    // 기존 같은 날짜의 마블 제거하고 새로 추가
    const filteredMarbles = marbles.filter(m => m.date !== marble.date);
    const updatedMarbles = [...filteredMarbles, marble];
    
    await updateDoc(userRef, {
      marbles: updatedMarbles,
      updatedAt: Timestamp.now(),
    });
  } else {
    // 사용자 데이터가 없으면 새로 생성
    await setDoc(userRef, {
      marbles: [marble],
      collectedColors: [],
      updatedAt: Timestamp.now(),
    });
  }
}

// 수집한 색상 추가
export async function addCollectedColor(userId: string, color: CollectedColor): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    const collectedColors = userData.collectedColors || [];
    
    await updateDoc(userRef, {
      collectedColors: [...collectedColors, color],
      updatedAt: Timestamp.now(),
    });
  } else {
    await setDoc(userRef, {
      marbles: [],
      collectedColors: [color],
      updatedAt: Timestamp.now(),
    });
  }
}

// 수집한 색상 삭제
export async function removeCollectedColor(userId: string, index: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    const collectedColors = userData.collectedColors || [];
    const updatedColors = collectedColors.filter((_, i) => i !== index);
    
    await updateDoc(userRef, {
      collectedColors: updatedColors,
      updatedAt: Timestamp.now(),
    });
  }
}

// 수집한 색상 초기화
export async function clearCollectedColors(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    collectedColors: [],
    updatedAt: Timestamp.now(),
  });
}

