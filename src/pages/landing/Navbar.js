import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Collapse,
    Container,
    NavbarToggler,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import Scrollspy from "react-scrollspy";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext"; // Asegúrate que la ruta sea correcta
import logo from "../../assets/images/logo/LogoAP.png"; // Asegúrate que la ruta sea correcta
import userRandom from "../../assets/images/user/user-random.jpg"; // Asegúrate que la ruta sea correcta
import Loading from "../components/Loading"; // Asegúrate que la ruta sea correcta
import { getUserMail, getRol } from "../../services/userApi"; // Asegúrate que la ruta sea correcta
import { getFormulariosDuenoPosteo } from "../../services/FormApi"; // Asegúrate que la ruta sea correcta
import { getVeterinarias, getFundacion } from "../../services/commonApi"; // Asegúrate que la ruta sea correcta

const Navbar = ({ isHomePage, direction }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [dropdownState, setDropdownState] = useState({
        busqueda: false,
        servicios: false,
        profile: false,
    });
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [userData, setUserData] = useState(null);
    const [nombreRol, setNombreRol] = useState(null);
    const [notificaciones, setNotificaciones] = useState({
        adopciones: 0, // Notificaciones para "Formularios"
        veterinarias: 0, // Parte de "Solicitudes" (Admin)
        fundaciones: 0, // Parte de "Solicitudes" (Admin)
    });
    const [isLoading, setIsLoading] = useState(true); // Inicializa en true si cargas datos al inicio

    const busquedaRef = useRef(null);
    const serviciosRef = useRef(null);

    useOutsideClick(busquedaRef, () => {
        setDropdownState((prev) => ({ ...prev, busqueda: false }));
    });
    useOutsideClick(serviciosRef, () => {
        setDropdownState((prev) => ({ ...prev, servicios: false }));
    });

    const toggleDropdown = (key) =>
        setDropdownState((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    // Carga los datos del usuario si está logueado
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true); // Inicia carga
            const cachedUserData = localStorage.getItem("userData");
            if (user?.email) {
                try {
                    // Intenta obtener del localStorage primero para carga rápida
                    if (cachedUserData) {
                        const parsedData = JSON.parse(cachedUserData);
                        const response = await getUserMail(parsedData.email);
                        setUserData(response.data);

                        setIsLoading(false); // Termina carga
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [user?.email]); // Depende del email del usuario de useAuth

    // Carga los roles (esto podría hacerse una sola vez en un contexto si no cambian)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRol();
                setNombreRol(rolesData); // Asumiendo que getRol devuelve el objeto con { data: [...] }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    // Carga las notificaciones cuando userData esté disponible
    useEffect(() => {
        const fetchNotifications = async () => {
            // Solo ejecuta si tenemos ID y nombre del usuario (necesario para filtrar formularios)
            // y si el rol es Admin para buscar veterinarias/fundaciones pendientes
            if (!userData?.id || !userData?.nombreCompleto) {
                // Resetea notificaciones si no hay datos de usuario válidos
                setNotificaciones({
                    adopciones: 0,
                    veterinarias: 0,
                    fundaciones: 0,
                });
                return;
            }

            try {
                // Prepara las llamadas a la API
                const calls = [
                    getFormulariosDuenoPosteo(userData.id), // Formularios del dueño
                ];

                // Si es Admin, añade llamadas para veterinarias/fundaciones pendientes
                if (userData.rolId === 1) {
                    calls.push(getVeterinarias());
                    calls.push(getFundacion());
                } else {
                    // Si no es admin, añade promesas resueltas para mantener la estructura del Promise.all
                    calls.push(Promise.resolve({ data: [] })); // Simula respuesta vacía de veterinarias
                    calls.push(Promise.resolve({ data: [] })); // Simula respuesta vacía de fundaciones
                }

                // Ejecuta todas las llamadas en paralelo
                const [formulariosRes, veterinariasRes, fundacionesRes] =
                    await Promise.all(calls);

                // Calcula los contadores basados en las respuestas
                const adopcionesCount = formulariosRes.data.filter(
                    (form) =>
                        form.estadoFormularioId === 1 && // Asumiendo que 1 es 'pendiente'
                        form.nombreDueño === userData.nombreCompleto
                ).length;

                const veterinariasCount = veterinariasRes.data.filter(
                    (vet) => vet.estadoId === 1 // Asumiendo que 1 es 'pendiente'
                ).length;

                const fundacionesCount = fundacionesRes.data.filter(
                    (fund) => fund.estadoId === 1 // Asumiendo que 1 es 'pendiente'
                ).length;

                // Actualiza el estado de notificaciones
                setNotificaciones({
                    adopciones: adopcionesCount,
                    veterinarias: veterinariasCount,
                    fundaciones: fundacionesCount,
                });
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
                // Resetea en caso de error
                setNotificaciones({
                    adopciones: 0,
                    veterinarias: 0,
                    fundaciones: 0,
                });
            }
        };

        fetchNotifications();
    }, [userData]); // Depende de userData (específicamente id, nombreCompleto y rolId)

    // Calcula el total de notificaciones usando useMemo para eficiencia
    const totalNotificaciones = useMemo(
        () => {
            let total = notificaciones.adopciones; // Empieza con las adopciones del usuario
            // Si es admin, suma las pendientes de aprobación
            if (userData?.rolId === 1) {
                total +=
                    notificaciones.veterinarias + notificaciones.fundaciones;
            }
            return total;
        },
        [notificaciones, userData?.rolId] // Recalcula si cambian las notificaciones o el rol del usuario
    );

    // Muestra Loading mientras carga los datos iniciales del usuario
    if (isLoading && user) {
        return <Loading />;
    }

    return (
        // Aplica la clase navbar-color-home solo si isHomePage es true
        <nav
            className={`navbar navbar-expand-lg navbar-landing  ${
                isHomePage ? "navbar-color-home" : "navbar-color"
            }`}
            id="navbar"
        >
            <Container>
                <Link className="navbar-brand" to="/">
                    <img
                        src={logo}
                        alt="logo AdoptaPet"
                        height="90" // Ajusta según necesites
                        width="90" // Ajusta según necesites
                        className="card-logo card-logo-dark" // Revisa si necesitas clases diferentes para tema claro/oscuro
                    />
                </Link>

                <NavbarToggler
                    className="navbar-toggler py-0 fs-20 text-body"
                    onClick={() => setIsOpenMenu((prev) => !prev)}
                    aria-label="Toggle navigation"
                >
                    <i className="mdi mdi-menu"></i>
                </NavbarToggler>

                <Collapse
                    isOpen={isOpenMenu}
                    className="navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mx-auto mt-2 mt-lg-0 d-flex align-items-center ul-nav gap-3">
                        <li className="nav-item">
                            <NavLink href="/">Inicio</NavLink>
                        </li>

                        {/* Dropdown Mascotas */}
                        <li
                            className="nav-item dropdown position-relative"
                            ref={busquedaRef}
                        >
                            <span
                                className="nav-link dropdown-toggle"
                                role="button"
                                onClick={() => toggleDropdown("busqueda")}
                            >
                                Mascotas
                            </span>
                            {dropdownState.busqueda && (
                                <ul className="dropdown-menu show custom-dropdown">
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/mascotas-encontradas"
                                        >
                                            Encontradas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/mascotas-perdidas"
                                        >
                                            Perdidas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/mascotas-adopcion"
                                        >
                                            En Adopción
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Dropdown Servicios */}
                        <li
                            className="nav-item dropdown position-relative"
                            ref={serviciosRef}
                        >
                            <span
                                className="nav-link dropdown-toggle"
                                role="button"
                                onClick={() => toggleDropdown("servicios")}
                            >
                                Servicios
                            </span>
                            {dropdownState.servicios && (
                                <ul className="dropdown-menu show custom-dropdown">
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/paseadores"
                                        >
                                            Paseadores
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                           className="dropdown-item"
                                            to="/cuidadores"
                                        >
                                            Cuidadores
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/veterinarias"
                                        >
                                            Veterinarias
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                           className="dropdown-item"
                                            to="/fundaciones"
                                        >
                                            Fundaciones
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/preguntas-frecuentes"
                            >
                                Preguntas Frecuentes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/manualusuario">
                                Ayuda
                            </Link>
                        </li>
                    </ul>

                    {/* Botones Usuario / Invitado */}
                    <div className="button-navbar ms-auto mt-3 mt-lg-0">
                        {user ? (
                            <UserDropdown
                                user={user}
                                userData={userData}
                                nombreRol={nombreRol}
                                totalNotificaciones={totalNotificaciones}
                                notificacionesDetalladas={notificaciones}
                                isOpen={dropdownState.profile}
                                toggle={() => toggleDropdown("profile")}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <GuestButtons />
                        )}
                    </div>
                </Collapse>
            </Container>
        </nav>
    );
};

// --- Componente Auxiliar para Menús Desplegables del Navbar ---
const DropdownMenuItem = ({ label, isOpen, toggle, items }) => (
    <li className="nav-item dropdown">
        {" "}
        {/* Añade clase dropdown */}
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle
                className="nav-link dropdownmenu" // Usa nav-link para estilo consistente
                tag="a" // Usa 'a' en lugar de 'button' para estilo de navbar
                href="#" // href="#" para evitar navegación pero permitir toggle
                onClick={(e) => {
                    e.preventDefault();
                    toggle();
                }} // Previene navegación default
                caret
                role="button" // Rol para accesibilidad
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {label}
            </DropdownToggle>
            {/* Asegúrate que el DropdownMenu tenga los estilos correctos */}
            <DropdownMenu data-popper-placement="bottom-start">
                {items.map((item, index) => (
                    // Usa Link para rutas internas
                    <Link key={index} className="dropdown-item" to={item.href}>
                        {item.label}
                    </Link>
                    // Si son links externos o usan scrollspy, usa DropdownItem con NavLink/href
                    // <DropdownItem key={index}>
                    //     <NavLink href={item.href}>{item.label}</NavLink>
                    // </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    </li>
);

// --- Componente Auxiliar para el Desplegable del Usuario Logueado ---
const UserDropdown = ({
    user,
    userData,
    nombreRol,
    totalNotificaciones,
    notificacionesDetalladas, // <-- Recibe el desglose
    isOpen,
    toggle,
    onLogout,
}) => {
    // Calcula el contador para "Solicitudes" (solo relevante para Admin)
    const solicitudesCount = useMemo(() => {
        if (userData?.rolId !== 1) return 0;
        return (
            (notificacionesDetalladas?.veterinarias || 0) +
            (notificacionesDetalladas?.fundaciones || 0)
        );
    }, [userData?.rolId, notificacionesDetalladas]);

    return (
        <Dropdown
            isOpen={isOpen}
            toggle={toggle}
            className="ms-sm-3 header-item topbar-user" // Clases de tu plantilla
        >
            <DropdownToggle
                tag="button"
                className="btn rounded-pill"
                aria-expanded={isOpen}
            >
                {" "}
                {/* btn sin estilos extra, rounded-pill opcional */}
                <span className="d-flex align-items-center">
                    <img
                        className="rounded-circle header-profile-user" // Clase de tu plantilla
                        src={userData?.foto || userRandom} // Usa foto de perfil o la random
                        alt="Avatar"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = userRandom;
                        }} // Fallback si la foto falla
                    />
                    <span className="text-start ms-xl-2 d-none d-xl-inline-block">
                        {" "}
                        {/* Oculta en pantallas pequeñas si es necesario */}
                        <span className="ms-1 fw-medium user-name-text">
                            {" "}
                            {/* Clase de tu plantilla */}
                            {/* Intenta mostrar nombre, sino displayName, sino email */}
                            {userData?.nombreCompleto ||
                                user?.displayName ||
                                userData?.mail ||
                                user?.email}
                        </span>
                        {/* Muestra el rol si existe */}
                        {userData?.rolId && nombreRol?.data && (
                            <span className="d-block ms-1 fs-12 text-muted user-name-sub-text">
                                {" "}
                                {/* Clase de tu plantilla */}
                                {
                                    nombreRol.data.find(
                                        (rol) => rol.id === userData.rolId
                                    )?.nombre
                                }
                            </span>
                        )}
                    </span>
                    {/* Muestra el total de notificaciones si es mayor a 0 */}
                    {totalNotificaciones > 0 && (
                        <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle ms-n2">
                            {" "}
                            {/* Posicionamiento badge */}
                            {totalNotificaciones}
                            <span className="visually-hidden">
                                notificaciones sin leer
                            </span>{" "}
                            {/* Accesibilidad */}
                        </span>
                    )}
                </span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
                {" "}
                {/* Alineado a la derecha */}
                <DropdownItem header className="text-muted">
                    {" "}
                    {/* Cabecera opcional */}
                    ¡Hola,{" "}
                    {userData?.nombreCompleto ||
                        user?.displayName?.split(" ")[0] ||
                        "Usuario"}
                    !
                </DropdownItem>
                {/* Link al Perfil */}
                <DropdownItem
                    tag={Link}
                    to={`/perfil/${userData?.mail || user?.email}`}
                >
                    {" "}
                    {/* Usa tag={Link} para react-router */}
                    <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Perfil</span>
                </DropdownItem>
                {/* Link a Formularios con contador */}
                <DropdownItem tag={Link} to="/formularios">
                    <i className="mdi mdi-file-document-multiple-outline text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Formularios</span>
                    {notificacionesDetalladas?.adopciones > 0 && (
                        <span className="badge bg-primary rounded-pill float-end ms-2">
                            {" "}
                            {/* float-end para alinear badge */}
                            {notificacionesDetalladas.adopciones}
                        </span>
                    )}
                </DropdownItem>
                {/* Link a Solicitudes (Admin) con contador */}
                {userData?.rolId === 1 && ( // Condición para Admin
                    <DropdownItem tag={Link} to="/solicitudes">
                        <i className="mdi mdi-clipboard-check-outline text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Solicitudes</span>
                        {solicitudesCount > 0 && (
                            <span className="badge bg-warning text-dark rounded-pill float-end ms-2">
                                {" "}
                                {/* Color diferente opcional */}
                                {solicitudesCount}
                            </span>
                        )}
                    </DropdownItem>
                )}
                <div className="dropdown-divider"></div>
                {/* Botón Cerrar Sesión */}
                {/* Usa un button normal si solo ejecuta una acción */}
                <DropdownItem tag="button" onClick={onLogout} className="w-100">
                    <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle">Cerrar Sesión</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

// --- Componente Auxiliar para Botones de Invitado ---
const GuestButtons = () => (
    <div className="d-flex align-items-center">
        {" "}
        {/* Envuelve en flex para alinear */}
        <Link
            to="/iniciar-sesion"
            className="btn btn-link fw-medium text-decoration-none text-dark btn-login me-2" // Añade margen
        >
            Iniciar Sesión
        </Link>
        <Link to="/registrar" className="btn btn-secondary btn-register">
            Registrate
        </Link>
    </div>
);

function useOutsideClick(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler();
        };
        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
}

export default Navbar;
