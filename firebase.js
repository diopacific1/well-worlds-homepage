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
  // Strictly use the provisioned applet config to prevent mismatch with any injected environment variables.
  const config = {
    apiKey: firebaseAppletConfig.apiKey,
    authDomain: firebaseAppletConfig.authDomain,
    projectId: firebaseAppletConfig.projectId,
    storageBucket: firebaseAppletConfig.storageBucket,
    messagingSenderId: firebaseAppletConfig.messagingSenderId,
    appId: firebaseAppletConfig.appId,
    firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId
  };

  if (config.apiKey && config.apiKey !== 'undefined' && config.apiKey !== "your-api-key-here") {
    app = initializeApp(config);
    // Always use the configured database ID strictly from the config JSON
    const dbId = firebaseAppletConfig.firestoreDatabaseId || "(default)";
    db = getFirestore(app, dbId);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("🔥 Firebase initialized successfully with database id:", config.firestoreDatabaseId || "(default)");
    console.log("📦 Active storage bucket config:", config.storageBucket);
  } else {
    console.warn("⚠️ Firebase is not configured! Please provide proper API keys via env or firebase-applet-config.json.");
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

