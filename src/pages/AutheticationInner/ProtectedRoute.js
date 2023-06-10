import Landing from "../landing/Index";
import { useAuth } from "../../services/AuthContext";
import { Navigate } from "react-router-dom";


//se utiliza para proteger aquellas paginas que solo puede acceder un usuario en particular
export function ProtectedRoute({children}){
    const {user, loading} = useAuth()

    if (loading) {
        return <></>
    }
    if (!user) {
        return <Navigate to={Landing}></Navigate>
    }

    return <>{children}</>
}