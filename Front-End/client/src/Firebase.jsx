// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXX5bmRv5MjFsplWeZkonn5764IzmCHNE",
  authDomain: "message-79b8d.firebaseapp.com",
  projectId: "message-79b8d",
  storageBucket: "message-79b8d.firebasestorage.app",
  messagingSenderId: "91996925657",
  appId: "1:91996925657:web:9714884a6a5c224bac58c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup Auth and Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();
    return { user, token };
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};
