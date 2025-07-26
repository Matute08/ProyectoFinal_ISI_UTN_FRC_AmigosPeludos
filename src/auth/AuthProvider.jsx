import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { getUserMail, postNuevoUsuario } from "../api/userApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        setUser(user);
        localStorage.setItem("userData", JSON.stringify({ email: user.email }));
    };

    const register = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        setUser(user);
        localStorage.setItem("userData", JSON.stringify({ email: user.email }));

        return userCredential;
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        setUser(user);
        localStorage.setItem("userData", JSON.stringify({ email: user.email }));

        try {
            const res = await getUserMail(user.email);
            const usuarioExistente = res.data;
        } catch (error) {
            if (error?.response?.status === 404) {
                const nuevoUsuario = {
                    nombre: user.displayName || "Sin nombre",
                    mail: user.email,
                    telefono: "",
                    rolId: 2,
                };
                await postNuevoUsuario(nuevoUsuario);
            } else {
                console.error("❌ Error inesperado al verificar usuario:", error);
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.clear();
        setUser(null);
    };

    // RESTABLECER CONTRASEÑA
    const resetPassword = (email) => sendPasswordResetEmail(auth, email);

    // ELIMINAR USUARIO


const deleteAccount = async (password) => {
  const currentUser = auth.currentUser;
  if (!currentUser || !password) return { success: false, error: "Credenciales faltantes" };

  try {
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
    localStorage.clear();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};



    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                resetPassword,
                deleteAccount,
                logout,
                loginWithGoogle,
                isAuthenticated: !!user,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
