// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDklykMWj771hC_wOE4f6c1B2RkCjUVwnY",
  authDomain: "onlyonce-f7f15.firebaseapp.com",
  projectId: "onlyonce-f7f15",
  storageBucket: "onlyonce-f7f15.firebasestorage.app",
  messagingSenderId: "715696627823",
  appId: "1:715696627823:web:74f965cdc4f94e4d346d9a",
  measurementId: "G-FCCKGBM1TP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  db, 
  storage, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection, 
  ref, 
  uploadBytes, 
  getDownloadURL 
};