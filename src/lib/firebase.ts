import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdctZUNJNEJnXTlPSjfinfjlD-HdbMRGQ",
  authDomain: "moodofnits.firebaseapp.com",
  projectId: "moodofnits",
  storageBucket: "moodofnits.firebasestorage.app",
  messagingSenderId: "350921602759",
  appId: "1:350921602759:web:5a59c5cddbc21610f070e2",
  measurementId: "G-7T6Z767WZ1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error: unknown) => {
  if (error instanceof Error) {
    console.error("Failed to set persistence:", error.message);
  } else {
    console.error("An unknown error occurred.");
  }
});

export { app, auth };
