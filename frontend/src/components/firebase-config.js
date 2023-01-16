// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIFmCojoSqRR1Y04Zw50L6B04KigzFkmM",
  authDomain: "telescopebooking-e8833.firebaseapp.com",
  projectId: "telescopebooking-e8833",
  storageBucket: "telescopebooking-e8833.appspot.com",
  messagingSenderId: "525927003665",
  appId: "1:525927003665:web:4a84a4ea36a0d3c63523b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);