// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAhPb1c3gWjDNeWxN2-1e3TD04Vkej5wk",
    authDomain: "amigospeludos-a7049.firebaseapp.com",
    projectId: "amigospeludos-a7049",
    storageBucket: "amigospeludos-a7049.appspot.com",
    messagingSenderId: "927442582764",
    appId: "1:927442582764:web:ccbb8ef8f438c9bc1b39c9",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);


