import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { initFirebase } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 AuthContext: Initializing...");
    
    // Safety timeout: never stay in loading state more than 5 seconds
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("🔐 AuthContext: Loading timed out after 5s. Forcing loading=false.");
        setLoading(false);
      }
    }, 5000);

    const init = async () => {
      try {
        console.log("🔐 AuthContext: Calling initFirebase...");
        const { auth: initializedAuth, db: initializedDb } = await initFirebase();
        console.log("🔐 AuthContext: initFirebase completed. Auth exists:", !!initializedAuth);
        
        if (!initializedAuth) {
          console.warn("🔐 AuthContext: No auth instance found. Ending loading.");
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }

        console.log("🔐 AuthContext: Setting up onAuthStateChanged...");
        const unsubscribe = onAuthStateChanged(initializedAuth, async (firebaseUser) => {
          console.log("🔐 AuthContext: Auth state changed. User:", firebaseUser?.uid || "null");
          
          if (firebaseUser && initializedDb) {
            try {
              const userRef = doc(initializedDb, "users", firebaseUser.uid);
              const userDoc = await getDoc(userRef);

              if (!userDoc.exists()) {
                await setDoc(userRef, {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  createdAt: serverTimestamp(),
                });
              }
            } catch (err) {
              console.warn("🔐 AuthContext: Firestore sync failed:", err);
            }
          }
          setUser(firebaseUser);
          setLoading(false);
          clearTimeout(timeoutId);
        });

        return unsubscribe;
      } catch (error) {
        console.error("🔐 AuthContext: Fatal error in init:", error);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    const cleanupPromise = init();
    return () => {
      clearTimeout(timeoutId);
      cleanupPromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') unsubscribe();
      });
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
