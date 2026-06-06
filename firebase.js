import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseAppletConfig from "./firebase-applet-config.json";

let app;
let db = null;
let auth = null;
let storage = null;

try {
  // Prefer the provisioned firebase applet config if available
  const config = firebaseAppletConfig.apiKey && firebaseAppletConfig.apiKey !== "your-api-key-here"
    ? firebaseAppletConfig
    : {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };

  if (config.apiKey && config.apiKey !== 'undefined' && config.apiKey !== "your-api-key-here") {
    app = initializeApp(config);
    // CRITICAL: Must use firestoreDatabaseId if specified to connect to correct database instance in AI Studio sandbox
    db = getFirestore(app, config.firestoreDatabaseId || "(default)");
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("🔥 Firebase initialized successfully with database id:", config.firestoreDatabaseId || "(default)");
  } else {
    console.warn("⚠️ Firebase is not configured! Please provide proper API keys via env or firebase-applet-config.json.");
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

export { db, auth, storage };
