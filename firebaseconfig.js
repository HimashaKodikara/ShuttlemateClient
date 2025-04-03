// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK4l2FVHEunbGonyoSN0aun5eTWMgPdPM",
  authDomain: "shuttlemate-9bedd.firebaseapp.com",
  projectId: "shuttlemate-9bedd",
  storageBucket: "shuttlemate-9bedd.appspot.com",
  messagingSenderId: "902062135902",
  appId: "1:902062135902:web:01f05bc700c2f7d262b2cf"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);