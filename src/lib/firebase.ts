import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 설정값 (환경 변수에서 가져옴)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 보안을 위해 필수 환경변수가 있는지 확인합니다.
if (!firebaseConfig.apiKey) {
  console.warn("Firebase 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.");
}

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore(데이터베이스) 객체 내보내기
export const db = getFirestore(app);
