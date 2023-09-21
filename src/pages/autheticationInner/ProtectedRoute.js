import { useAuth } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserMail } from "../../services/api";
import Loading from "../components/Loading";

//se utiliza para proteger aquellas páginas que solo puede acceder un usuario en particular
export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Verificar si el usuario está autenticado en el localStorage
                const cachedUser = localStorage.getItem("userData");
                if (cachedUser) {
                    // Si hay datos en el localStorage, el usuario está autenticado
                    setIsLoading(false);
                } else {
                    // Si no hay datos en el localStorage, redirige a la página de inicio de sesión
                    navigate("/iniciar-sesion");
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
                // Agregar un registro de error más detallado
                console.error("Error en fetchUser:", error);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading || isLoading) {
        return <Loading />; // Muestra un indicador de carga mientras se verifica la autenticación
    }

    return <>{children}</>;
}
