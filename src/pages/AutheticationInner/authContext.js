import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../AutheticationInner/firebase";

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
    const signup = (email, name, lastname, username, date, password, rol) => {
        createUserWithEmailAndPassword(auth, email, password);

    };

    //INICIAR SESION
    const login =  (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    //CERRAR SESION
    const logout = () => signOut(auth);

    //RESTABLECER CONTRASEÑA
    const resetPassword = (email) => {
        sendPasswordResetEmail(auth, email);
    };

    //si esta logueado, me devuelve el objeto entero con la infnormacion. Sino, me devuelve NULL
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
    });

    return (
        <authContext.Provider
            value={{ signup, login, user, logout, loading, resetPassword }}
        >
            {children}
        </authContext.Provider>
    );
}
