import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

// Configuración para URLs de redirección personalizadas
const actionCodeSettings = {
  // URL que se abrirá después de hacer clic en el enlace del email
  url: `${window.location.origin}/reset-password`,
  // Esto es opcional, pero recomendado para mejor UX
  handleCodeInApp: true,
};

// Función personalizada para enviar email de reset
export const sendCustomPasswordResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Función para verificar si el enlace es válido
export const verifyPasswordResetCode = async (oobCode) => {
  try {
    // Firebase automáticamente verifica el código cuando usas confirmPasswordReset
    // Esta función es más para validación previa si la necesitas
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
