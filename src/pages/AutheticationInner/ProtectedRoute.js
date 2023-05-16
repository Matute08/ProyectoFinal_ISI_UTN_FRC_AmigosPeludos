import Landing from "../Landing";
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";


//se utiliza para proteger aquellas paginas que solo puede acceder un usuario en particular
export function ProtectedRoute({children}){
    const {user, loading} = useAuth()

    if (loading) {
        return <h1>cargando</h1>
    }
    if (!user) {
        return <Navigate to={Landing}></Navigate>
    }

    return <>{children}</>
}