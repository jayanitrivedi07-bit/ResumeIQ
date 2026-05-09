import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
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
    const init = async () => {
      const { auth: initializedAuth, db: initializedDb } = await initFirebase();
      
      if (!initializedAuth) {
        setLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(initializedAuth, async (firebaseUser) => {
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
            console.warn("Firestore user sync failed:", err);
          }
        }
        setUser(firebaseUser);
        setLoading(false);
      });

      return unsubscribe;
    };

    const cleanupPromise = init();
    return () => {
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
