// firebase.js - Simple version
const firebaseConfig = {
  apiKey: "AIzaSyDklykMWj771hC_wOE4f6c1B2RkCjUVwnY",
  authDomain: "onlyonce-f7f15.firebaseapp.com",
  projectId: "onlyonce-f7f15",
  storageBucket: "onlyonce-f7f15.firebasestorage.app",
  messagingSenderId: "715696627823",
  appId: "1:715696627823:web:74f965cdc4f94e4d346d9a",
  measurementId: "G-FCCKGBM1TP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Export as global variables
window.db = db;
window.storage = storage;
window.firebase = firebase;