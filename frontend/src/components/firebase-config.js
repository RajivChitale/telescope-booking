// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD49EZfKpy-3ciQbF99_2AaQ-WhB2VgWWk",
  authDomain: "telescope-booking-4cb6e.firebaseapp.com",
  projectId: "telescope-booking-4cb6e",
  storageBucket: "telescope-booking-4cb6e.appspot.com",
  messagingSenderId: "1086295564984",
  appId: "1:1086295564984:web:4c71e3efeee10456b74a4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);