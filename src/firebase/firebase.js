import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_L_cKBJOfWnuc8-Uq__GCi9B9ARnTz2M",
  authDomain: "chat-app-f4d4c.firebaseapp.com",
  projectId: "chat-app-f4d4c",
  storageBucket: "chat-app-f4d4c.appspot.com",
  messagingSenderId: "429612053937",
  appId: "1:429612053937:web:7dbfa220b50c9110ddf990",
  measurementId: "G-5GWKQ4LNBX",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
export const goolgeProvider = new GoogleAuthProvider();

// const analytics = getAnalytics(app);
