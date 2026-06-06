import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let db = null;
let auth = null;
let storage = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined' && firebaseConfig.apiKey !== "your-api-key-here") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } else {
    console.warn("⚠️ Firebase is not configured! Please provide proper API keys via environment variables.");
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

export { db, auth, storage };