import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ResumeVersion, ResumeAnalysis } from "../types";

export function saveResumeVersion(
  userId: string, 
  fileName: string, 
  resumeText: string, 
  analysis: ResumeAnalysis,
  targetJob?: string
) {
  const resumesRef = collection(db, "users", userId, "resumes");
  return addDoc(resumesRef, {
    userId,
    fileName,
    resumeText,
    analysis,
    targetJob: targetJob || "",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToResumeVersions(userId: string, callback: (versions: ResumeVersion[]) => void) {
  const resumesRef = collection(db, "users", userId, "resumes");
  const q = query(resumesRef);

  return onSnapshot(q, (snapshot) => {
    const versions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ResumeVersion[];
    callback(versions);
  });
}

export function deleteResumeVersion(userId: string, resumeId: string) {
  const resumeRef = doc(db, "users", userId, "resumes", resumeId);
  return deleteDoc(resumeRef);
}
