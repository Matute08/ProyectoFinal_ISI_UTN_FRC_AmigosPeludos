import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    confirmPasswordReset,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { sendCustomPasswordResetEmail } from "./firebaseConfig";
import { getUserMail, postNuevoUsuario } from "../api/userApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            
            if (!currentUser) {
                setUserData(null);
                localStorage.removeItem("userData");
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Cargar datos del usuario cuando ya existe una sesión
    useEffect(() => {
        if (user && !userData) {
            const loadUserData = async () => {
                try {
                    const data = await getUserMail(user.email);
                    if (data) {
                        setUserData(data);
                        localStorage.setItem("userData", JSON.stringify(data));
                    }
                } catch (error) {
                    console.error("Error al cargar datos del usuario:", error);
                }
            };
            loadUserData();
        }
    }, [user, userData]);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUser(user);
    };

    const register = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        setUser(user);
        
        // Esperar un poco para que el usuario se cree en la base de datos
        setTimeout(async () => {
            try {
                const userData = await getUserMail(email);
                if (userData) {
                    setUserData(userData);
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario después del registro:", error);
            }
        }, 1000);

        return userCredential;
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        setUser(user);

        try {
            const res = await getUserMail(user.email);
            const usuarioExistente = res.data;
            
            if (usuarioExistente) {
                localStorage.setItem("userData", JSON.stringify(usuarioExistente));
            } else {
                // Si no existe, crear el usuario
                const nuevoUsuario = {
                    nombre: user.displayName || "Sin nombre",
                    mail: user.email,
                    telefono: "",
                    rolId: 2,
                };
                await postNuevoUsuario(nuevoUsuario);
                
                // Obtener los datos del usuario recién creado
                const userData = await getUserMail(user.email);
                if (userData) {
                    localStorage.setItem("userData", JSON.stringify(userData));
                } else {
                    localStorage.setItem("userData", JSON.stringify({ email: user.email }));
                }
            }
        } catch (error) {
            if (error?.response?.status === 404) {
                // Si no existe, crear el usuario
                const nuevoUsuario = {
                    nombre: user.displayName || "Sin nombre",
                    mail: user.email,
                    telefono: "",
                    rolId: 2,
                };
                await postNuevoUsuario(nuevoUsuario);
                
                // Obtener los datos del usuario recién creado
                try {
                    const userData = await getUserMail(user.email);
                    if (userData) {
                        localStorage.setItem("userData", JSON.stringify(userData));
                    } else {
                        localStorage.setItem("userData", JSON.stringify({ email: user.email }));
                    }
                } catch (getError) {
                    console.error("Error al obtener datos del usuario después de crear:", getError);
                    localStorage.setItem("userData", JSON.stringify({ email: user.email }));
                }
            } else {
                console.error("❌ Error inesperado al verificar usuario:", error);
                localStorage.setItem("userData", JSON.stringify({ email: user.email }));
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.clear();
        setUser(null);
        setUserData(null);
    };

    // RESTABLECER CONTRASEÑA
    const resetPassword = async (email) => {
        const result = await sendCustomPasswordResetEmail(email);
        if (!result.success) {
            throw result.error;
        }
        return result;
    };

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
                userData,
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
