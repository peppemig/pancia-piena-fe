import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: import.meta.env.VITE_GOOGLE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GOOGLE_SENDER_ID,
  appId: import.meta.env.VITE_GOOGLE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  const response = await signInWithPopup(auth, googleProvider);
  const user = response.user;
  console.log(user);
  // TODO: save user to external db
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  const user = response.user;
  console.log(user);
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const user = response.user;
  console.log(user);
  // TODO: save user to external db
};

const logOut = () => {
  signOut(auth);
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

export {
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logOut,
  sendPasswordReset,
};
