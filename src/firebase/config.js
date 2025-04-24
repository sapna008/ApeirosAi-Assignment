import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmxz7hK58DMwYn6P1tc5c2wUDdanJYvvY",
  authDomain: "company-assignment-174f3.firebaseapp.com",
  projectId: "company-assignment-174f3",
  storageBucket: "company-assignment-174f3.firebasestorage.app",
  messagingSenderId: "1078948701455",
  appId: "1:1078948701455:web:36f3392317cc056d438a7a",
  databaseURL: "https://company-assignment-174f3-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };