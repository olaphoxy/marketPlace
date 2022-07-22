// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ_pxe1JggEdOBqDMGuqBgm1wtigfcdS8",
  authDomain: "house-marketplace-app-325a4.firebaseapp.com",
  projectId: "house-marketplace-app-325a4",
  storageBucket: "house-marketplace-app-325a4.appspot.com",
  messagingSenderId: "9950474032",
  appId: "1:9950474032:web:e156a0ee5de04d2638a2f5",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
