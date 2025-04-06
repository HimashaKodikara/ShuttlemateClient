// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK4l2FVHEunbGonyoSN0aun5eTWMgPdPM",
  authDomain: "shuttlemate-9bedd.firebaseapp.com",
  projectId: "shuttlemate-9bedd",
  storageBucket: "shuttlemate-9bedd.appspot.com",
  messagingSenderId: "902062135902",
  appId: "1:902062135902:web:01f05bc700c2f7d262b2cf"
};

// Initialize Firebase once
const FIREBASE_APP = initializeApp(firebaseConfig);

// Get auth instance once
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Create Google provider
const googleProvider = new GoogleAuthProvider();

// Export everything
export { FIREBASE_APP, FIREBASE_AUTH, googleProvider };