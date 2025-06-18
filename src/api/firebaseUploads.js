import { storage } from "../auth/firebase";

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

// Función genérica para subir archivos
async function uploadFile(file, folder) {
    const storageRef = ref(storage, `${folder}/${v4()}`);
    const metadata = {
        contentType: file.type // esto extrae el tipo correcto del archivo (ej: image/jpeg)
    };
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
}

export const uploadFilesPetsFound = async (file) => {
    const storageRef = ref(storage, `petsFound/${v4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const uploadFilesPetsLost = async (file) => {
    const storageRef = ref(storage, `petsLost/${v4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const uploadFilesPetsAdopt = async (file) => {
    const storageRef = ref(storage, `petsAdopt/${v4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};
export const uploadFilesVeterinaria = async (file) => {
    const storageRef = ref(storage, `veterinaria/${v4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};
export const subirQRUsuario = async (dataUrlBase64, nombreArchivo) => {
  const blob = await (await fetch(dataUrlBase64)).blob();
  const archivo = new File([blob], nombreArchivo, { type: "image/png" });
  return await uploadFilePetsUser(archivo);
};
// Eliminar archivo del almacenamiento de Firebase
export async function deleteFileStorage(fileUrlOrPath) {
  try {
    let path = fileUrlOrPath;

    // Si es una URL, extraer el path de descarga
    if (fileUrlOrPath.includes("firebasestorage.googleapis.com")) {
      const decodedUrl = decodeURIComponent(new URL(fileUrlOrPath).pathname);
      path = decodedUrl.split("/o/")[1].split("?")[0]; // Ej: 'petsUser/uuid.jpg'
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Error al eliminar imagen de Firebase:", error.message);
    throw error;
  }
}


export const uploadFilePetsUser = (file) => uploadFile(file, "petsUser");

export const uploadFilesPaseador = (file) => uploadFile(file, "paseador");
export const uploadFilesCuidador = (file) => uploadFile(file, "cuidador");

export const uploadFileUser = (file) => uploadFile(file, "avatarUser");

//export const uploadQrUsuario = (file) => uploadFile(file, "qrUsuarios");

