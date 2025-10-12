// firebase.js - Updated for GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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