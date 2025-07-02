// firebaseConfig.ts (or firebase.js)
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDK4l2FVHEunbGonyoSN0aun5eTWMgPdPM",
  authDomain: "shuttlemate-9bedd.firebaseapp.com",
  projectId: "shuttlemate-9bedd",
  storageBucket: "shuttlemate-9bedd.appspot.com",
  messagingSenderId: "902062135902",
  appId: "1:902062135902:web:01f05bc700c2f7d262b2cf"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { FIREBASE_APP, FIREBASE_AUTH, googleProvider };
