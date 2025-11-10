// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOGugSxgmW1NzBoe60lJy9O9t4F1qXRfI",
  authDomain: "dearmaria-d89c2.firebaseapp.com",
  projectId: "dearmaria-d89c2",
  storageBucket: "dearmaria-d89c2.firebasestorage.app",
  messagingSenderId: "771471447123",
  appId: "1:771471447123:web:ee394b6d0643022653a2a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
