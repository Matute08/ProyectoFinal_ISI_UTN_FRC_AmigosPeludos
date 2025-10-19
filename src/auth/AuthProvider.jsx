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

    // Función utilitaria para limpiar el caché del usuario
    const clearUserCache = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUserData(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            
            if (!currentUser) {
                setUserData(null);
                localStorage.removeItem("userData");
            } else if (currentUser?.email) {
                // Solo cargar datos si no hay datos en localStorage (sesión persistente)
                // Esto evita cargar datos durante el proceso de login
                const cachedData = localStorage.getItem("userData");
                if (cachedData) {
                    try {
                        const parsedData = JSON.parse(cachedData);
                        setUserData(parsedData);
                    } catch (error) {
                        console.error("Error al parsear datos del usuario:", error);
                        localStorage.removeItem("userData");
                    }
                }
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Cargar datos del usuario cuando ya existe una sesión
    useEffect(() => {
        if (user && !userData && user?.email && typeof user.email === 'string') {
            const loadUserData = async () => {
                try {
                    const data = await getUserMail(user.email);
                    if (data) {
                        setUserData(data);
                        localStorage.setItem("userData", JSON.stringify(data));
                    }
                } catch (error) {
                    console.error("Error al cargar datos del usuario:", error);
                    // En caso de error, establecer datos básicos para evitar null
                    if (user?.email) {
                        const fallbackData = { 
                            id: null, 
                            email: user.email, 
                            nombreCompleto: user.displayName || "Usuario" 
                        };
                        setUserData(fallbackData);
                        localStorage.setItem("userData", JSON.stringify(fallbackData));
                    }
                }
            };
            // Pequeño delay para evitar cargar datos inmediatamente después del login
            const timer = setTimeout(loadUserData, 100);
            return () => clearTimeout(timer);
        }
    }, [user, userData]);

    const login = async (email, password) => {
        // Limpiar datos del usuario anterior antes de iniciar nueva sesión
        clearUserCache();
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUser(user);
        
        // No cargar datos del usuario inmediatamente después del login
        // Los datos se cargarán cuando el usuario navegue a otra página
        // Esto evita que se muestre la imagen del usuario en el navbar durante el modal de éxito
    };

    const register = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        setUser(user);
        
        // Esperar un poco para que el usuario se cree en la base de datos
        if (email && user?.email) {
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
        }

        return userCredential;
    };

    const loginWithGoogle = async () => {
        // Limpiar datos del usuario anterior antes de iniciar nueva sesión
        clearUserCache();
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        setUser(user);

        try {
            if (!user?.email) {
                throw new Error("Email del usuario no disponible");
            }
            const res = await getUserMail(user.email);
            const usuarioExistente = res.data;
            
            if (usuarioExistente) {
                setUserData(usuarioExistente);
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
                if (user?.email) {
                    const userData = await getUserMail(user.email);
                    if (userData) {
                        setUserData(userData);
                        localStorage.setItem("userData", JSON.stringify(userData));
                    } else {
                        const fallbackData = { email: user.email };
                        setUserData(fallbackData);
                        localStorage.setItem("userData", JSON.stringify(fallbackData));
                    }
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
                    if (user?.email) {
                        const userData = await getUserMail(user.email);
                        if (userData) {
                            setUserData(userData);
                            localStorage.setItem("userData", JSON.stringify(userData));
                        } else {
                            const fallbackData = { email: user.email };
                            setUserData(fallbackData);
                            localStorage.setItem("userData", JSON.stringify(fallbackData));
                        }
                    }
                } catch (getError) {
                    console.error("Error al obtener datos del usuario después de crear:", getError);
                    if (user?.email) {
                        const fallbackData = { email: user.email };
                        setUserData(fallbackData);
                        localStorage.setItem("userData", JSON.stringify(fallbackData));
                    }
                }
            } else {
                console.error("❌ Error inesperado al verificar usuario:", error);
                if (user?.email) {
                    const fallbackData = { email: user.email };
                    setUserData(fallbackData);
                    localStorage.setItem("userData", JSON.stringify(fallbackData));
                }
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
        
        // Guardar las credenciales de "recordarme" antes de limpiar
        const savedEmail = localStorage.getItem("loginEmail");
        const savedPassword = localStorage.getItem("loginPassword");
        const savedRemember = localStorage.getItem("loginRemember");
        
        // Limpiar específicamente todos los datos relacionados con el usuario actual
        // para evitar que se muestren datos del usuario anterior cuando otro usuario inicie sesión
        clearUserCache();
        
        // Limpiar cualquier otro dato que pueda estar relacionado con la sesión
        // Mantener solo las credenciales de "recordarme" si están configuradas
        const keysToKeep = [];
        if (savedRemember === "true" && savedEmail && savedPassword) {
            keysToKeep.push("loginEmail", "loginPassword", "loginRemember");
        }
        
        // Limpiar todo el localStorage excepto las credenciales de "recordarme"
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Restaurar las credenciales de "recordarme" si estaban guardadas
        if (savedRemember === "true" && savedEmail && savedPassword) {
            localStorage.setItem("loginEmail", savedEmail);
            localStorage.setItem("loginPassword", savedPassword);
            localStorage.setItem("loginRemember", savedRemember);
        }
        
        // Limpiar el estado local
        setUser(null);
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
    
    // Limpiar completamente el localStorage al eliminar la cuenta
    localStorage.clear();
    
        // Limpiar el estado local
        setUser(null);
        setUserData(null);
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
                loading,
                login,
                register,
                resetPassword,
                deleteAccount,
                logout,
                loginWithGoogle,
                clearUserCache,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
