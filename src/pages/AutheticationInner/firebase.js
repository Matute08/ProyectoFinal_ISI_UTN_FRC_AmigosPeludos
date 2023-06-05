// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";


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
export const storage = getStorage(firebaseApp)


export async function uploadFileUser(file) {
    const storageRef =  ref(storage, `avatarUser/${v4()}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
}
export async function uploadFilePetsUser(file) {
    const storageRef =  ref(storage, `petsUser/${v4()}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
}