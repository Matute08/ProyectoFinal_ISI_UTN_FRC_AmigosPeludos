import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../AutheticationInner/firebase";


export const authContext = createContext()

export const useAuth = () => {
    const context = useContext(authContext)

    return context;
}


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const signup = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password)

    const login = async (email, password) =>
        signInWithEmailAndPassword(auth, email, password)

    const logout = () => signOut(auth);


    //si esta logueado, me devuelve el objeto entero con la infnormacion. Sino, me devuelve NULL
    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false)
        })
    })

    return (
        <authContext.Provider value={{ signup, login, user, logout, loading }}>
            {children}
        </authContext.Provider>
    );
}