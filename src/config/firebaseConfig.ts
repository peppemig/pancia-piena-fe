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
import usersService from "@/api/usersService";

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
  const { user } = await signInWithPopup(auth, googleProvider);
  await usersService.createUserWithGoogle(user);
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
  surname: string
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await usersService.createUserWithEmail(user, name, surname);
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
  auth,
};
