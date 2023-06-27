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
import { getUserMail } from "./Api";

//-------------------------------------------
export const authContext = createContext();
export const useAuth = () => {
    const context = useContext(authContext);

    return context;
};
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //REGISTRAR
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //INICIAR SESION CON MAIL
    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    //INICIAR SESION CON GOOGLE
    const registerWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    //CERRAR SESION
    const logout = () => signOut(auth);

    //RESTABLECER CONTRASEÑA
    const resetPassword = (email) => {
        sendPasswordResetEmail(auth, email);
    };
    //ELIMINAR USUARIO
    const deleteAccount = async() => {
        const user = auth.currentUser
        
        if (user) {
            try {
                await user.getIdToken(true)
                await user.delete();
                return{success: true}
            } catch (error) {
                return {success: false, error}
            }
        }
        
        user.delete()
        // deleteUser();
    };

    //si esta logueado, me devuelve el objeto entero con la infnormacion. Sino, me devuelve NULL
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                setUser(null);
            }
        });
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
