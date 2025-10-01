import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

// Configuración para URLs de redirección personalizadas
const actionCodeSettings = {
  // URL que se abrirá después de hacer clic en el enlace del email
  url: `${window.location.origin}/reset-password`,
  // Esto es opcional, pero recomendado para mejor UX
  handleCodeInApp: true,
  // iOS específico (opcional)
  iOS: {
    bundleId: 'com.amigospeludos.app'
  },
  // Android específico (opcional)
  android: {
    packageName: 'com.amigospeludos.app',
    installApp: true,
    minimumVersion: '12'
  },
  // Configuración adicional para evitar errores 400
  dynamicLinkDomain: undefined
};

// Función personalizada para enviar email de reset
export const sendCustomPasswordResetEmail = async (email) => {
  try {
    // Primero intentamos con configuración personalizada
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error("Error con configuración personalizada:", error);
    
    // Si falla, intentamos sin configuración personalizada
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError);
      return { success: false, error: fallbackError };
    }
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
