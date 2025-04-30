// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios de Firebase que necesites en tu app
export const auth = getAuth(app);
export const storage = getStorage(app);

// Función genérica para subir archivos
async function uploadFile(file, folder) {
    const storageRef = ref(storage, `${folder}/${v4()}`);
    const metadata = {
        contentType: file.type // esto extrae el tipo correcto del archivo (ej: image/jpeg)
    };
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
}

// Funciones específicas para subir archivos
export const uploadFileUser = (file) => uploadFile(file, "avatarUser");
export const uploadFilePetsUser = (file) => uploadFile(file, "petsUser");
export const uploadFileFundaciones = (file) => uploadFile(file, "fundaciones");
export const uploadFilesPetsLost = (file) => uploadFile(file, "petsLost");
export const uploadFilesPaseador = (file) => uploadFile(file, "paseador");
export const uploadFilesCuidador = (file) => uploadFile(file, "cuidador");
export const uploadQrUsuario = (file) => uploadFile(file, "qrUsuarios");

// Eliminar archivo del almacenamiento
export async function deleteFileStorage(filePath) {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
}


