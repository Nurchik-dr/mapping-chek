import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOJpROntYSXGfuESXOBROD7Bwxlv1wzQ8",
  authDomain: "mapping-797ba.firebaseapp.com",
  projectId: "mapping-797ba",
  storageBucket: "mapping-797ba.firebasestorage.app",
  messagingSenderId: "420860996467",
  appId: "1:420860996467:web:0ad8c7c2001536ce9af306",
  measurementId: "G-KH4R0XWGBS"
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);
