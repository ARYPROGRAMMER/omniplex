import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyBlj_8E3GQwQfBmBmsL4dsQNow2XyImmlY",
  authDomain: "fir-omniplex.firebaseapp.com",
  projectId: "fir-omniplex",
  storageBucket: "fir-omniplex.firebasestorage.app",
  messagingSenderId: "1050851550977",
  appId: "1:1050851550977:web:8cf5dbd20f2ce2580b1d00",
  measurementId: "G-JFK60ZH0X1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
  return app;
};
