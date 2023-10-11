import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    deleteUser,
} from "firebase/auth";
import { auth } from "./Firebase";
import { getUserMail } from "./api";

//-------------------------------------------
export const authContext = createContext();
export const useAuth = () => {
    const context = useContext(authContext);

    return context;
};
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Comprobar si hay datos de usuario en caché
    const cachedUser = localStorage.getItem("userData");

    // Función para guardar datos de usuario en caché
    const cacheUser = (userData) => {
        localStorage.setItem("userData", JSON.stringify(userData));
    };

    //REGISTRAR
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //INICIAR SESION CON MAIL
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Usuario autenticado:", user);

                // Guardar usuario en caché al iniciar sesión
                cacheUser(user);
                return user;
            })
            .catch((error) => {
                console.error("Error de inicio de sesión:", error);
                throw error;
            });
    };

    //INICIAR SESION CON GOOGLE
    const registerWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    //CERRAR SESION
    const logout = () => {

        signOut(auth);
        // eliminar datos de caché
        localStorage.removeItem("userData");
    };

    // RESTABLECER CONTRASEÑA
const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};


    //ELIMINAR USUARIO
    const deleteAccount = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                await user.getIdToken(true);
                await user.delete();
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        }

        user.delete();
        // deleteUser();
    };

    //si está logueado, me devuelve el objeto entero con la información. Sino, me devuelve NULL
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Guardar usuario en caché al iniciar sesión
                cacheUser(currentUser);

                // Actualizar el estado con el usuario
                setUser(currentUser);
                setLoading(false);
            } else {
                // Si no hay usuario, eliminar datos de caché
                localStorage.removeItem("userData");

                setUser(null);
            }
        });

        // Si hay datos de usuario en caché, utilizarlos al cargar la aplicación
        if (cachedUser) {
            const cachedUserData = JSON.parse(cachedUser);
            setUser(cachedUserData);
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
