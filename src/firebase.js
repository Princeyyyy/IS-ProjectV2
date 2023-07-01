import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDebPzRutuQgQDbfyPg14FdYmEqXSzH1Rs",
//   authDomain: "urban-insight-data-platform.firebaseapp.com",
//   projectId: "urban-insight-data-platform",
//   storageBucket: "urban-insight-data-platform.appspot.com",
//   messagingSenderId: "491695139833",
//   appId: "1:491695139833:web:9c0d9d07173dfb470a2b28",
//   measurementId: "G-TC3D4DFBS7"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCTsMucIabJMMdcYbOhCHkWPPIKTYThOt0",
  authDomain: "skillconnect-f6945.firebaseapp.com",
  projectId: "skillconnect-f6945",
  storageBucket: "skillconnect-f6945.appspot.com",
  messagingSenderId: "870154096961",
  appId: "1:870154096961:web:18e2b3544a1bdb1699d1c0",
  measurementId: "G-168XKN6ECS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
