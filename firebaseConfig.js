// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Autentikaatio
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeQ2r-iPXs7Sk6kkWj6N_iPwNmr9ThFcg",
  authDomain: "book-club-fa8b0.firebaseapp.com",
  databaseURL: "https://book-club-fa8b0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "book-club-fa8b0",
  storageBucket: "book-club-fa8b0.appspot.com",
  messagingSenderId: "88171435517",
  appId: "1:88171435517:web:2c940176de3a70a62f7594"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Autentikaatio
const auth = getAuth(app);