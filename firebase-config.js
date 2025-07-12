import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfMFwvxJgm8Q0p1eFlDEcQ5Rv-k_t0u8o",
  authDomain: "budgetapp-ad5eb.firebaseapp.com",
  projectId: "budgetapp-ad5eb",
  storageBucket: "budgetapp-ad5eb.firebasestorage.app",
  messagingSenderId: "212280100131",
  appId: "1:212280100131:web:9d82c4359a7728cf937896",
  measurementId: "G-TZMDSN4QVV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };