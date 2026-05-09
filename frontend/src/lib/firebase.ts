import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const googleProvider = new GoogleAuthProvider();

export async function initFirebase(): Promise<{ auth: Auth | null, db: Firestore | null }> {
  if (app) return { auth, db };

  try {
    // Try to get config from backend
    const response = await fetch("/api/config");
    const { firebase: config } = await response.json();

    if (config && config.apiKey) {
      app = initializeApp(config);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("✅ Firebase initialized from remote config");
    } else {
      console.warn("⚠️ Remote Firebase config missing. Using local env.");
      const localConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };
      
      if (localConfig.apiKey) {
        app = initializeApp(localConfig);
        auth = getAuth(app);
        db = getFirestore(app);
      }
    }
  } catch (error) {
    console.error("❌ Failed to fetch remote config:", error);
  }

  return { auth, db };
}

export function getAuthInstance() { return auth; }
export function getDbInstance() { return db; }

export { auth, db };
export const signInWithGoogle = () => auth ? signInWithPopup(auth, googleProvider) : Promise.reject("Auth not ready");
export const logout = () => auth ? auth.signOut() : Promise.resolve();
