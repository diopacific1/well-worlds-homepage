import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Safely import the generated config if it exists (AI Studio environment)
const configModules = import.meta.glob('./firebase-applet-config.json', { eager: true });
const localConfig = configModules['./firebase-applet-config.json']?.default || {};

let app;
let db = null;
let auth = null;
let storage = null;

try {
  // Merge Vite environment variables (Vercel) with the local config (AI Studio)
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId || "(default)"
  };

  if (config.apiKey && config.apiKey !== 'undefined' && config.apiKey !== "your-api-key-here") {
    app = initializeApp(config);
    // Always use the configured database ID strictly from the config JSON or Environment
    const dbId = config.firestoreDatabaseId || "(default)";
    db = getFirestore(app, dbId);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("🔥 Firebase initialized successfully with database id:", config.firestoreDatabaseId || "(default)");
    console.log("📦 Active storage bucket config:", config.storageBucket);
  } else {
    console.warn("⚠️ Firebase is not configured! Please provide proper API keys via env variables like VITE_FIREBASE_API_KEY or via firebase-applet-config.json.");
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

export { db, auth, storage };

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

