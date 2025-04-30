import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./Firebase";

//-------------------------------------------
export const authContext = createContext();

export const useAuth = () => useContext(authContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para manejar el caché del usuario
    const cacheUser = (userData) => {
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    };

    // REGISTRAR
    const signup = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    // INICIAR SESIÓN CON MAIL
    const login = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            cacheUser(user);
            return user;
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
            throw error;
        }
    };

    // INICIAR SESIÓN CON GOOGLE
    const registerWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    // CERRAR SESIÓN
    const logout = () => {
        signOut(auth);
        cacheUser(null);
    };

    // RESTABLECER CONTRASEÑA
    const resetPassword = (email) => sendPasswordResetEmail(auth, email);

    // ELIMINAR USUARIO
    const deleteAccount = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                await currentUser.delete();
                cacheUser(null);
                return { success: true };
            } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
                return { success: false, error };
            }
        }
    };

    // Manejo del estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                cacheUser(currentUser);
                setUser(currentUser);
            } else {
                cacheUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        // Cargar usuario desde caché al iniciar
        const cachedUser = localStorage.getItem("userData");
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    return (
        <authContext.Provider
            value={{
                signup,
                login,
                user,
                logout,
                loading,
                resetPassword,
                registerWithGoogle,
                deleteAccount,
            }}
        >
            {children}
        </authContext.Provider>
    );
}