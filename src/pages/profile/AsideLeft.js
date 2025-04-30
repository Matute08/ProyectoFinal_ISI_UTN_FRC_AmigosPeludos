// AsideLeft.js (Refactorizado para recibir userData como prop)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Table, CardBody, Col } from "reactstrap";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2"; // Importar Swal para usarlo en el catch de handleDeleteUser

// Componentes y Assets
import UiContent from "../../assets/scss/components/Common/UiContent";
import avatar1 from "../../assets/images/user/user-random.jpg";
import Loading from "../components/Loading"; // Podría necesitarse para cargar roles
import Modal from "../components/Modal";

// Servicios API (solo los necesarios aquí)
import { updateUser, getRol } from "../../services/userApi";

// Mapeo de claves internas a nombres para mostrar
const keyMap = {
    nombreCompleto: "Nombre Completo",
    mail: "Correo Electrónico",
    celular: "Número de Celular",
    generoUsuario: "Género",
    provincia: "Provincia",
    ciudadUsuario: "Ciudad",
    barrioUsuario: "Barrio",
    // 'calle' ahora es 'direccionCompleta' que viene del padre
    direccionCompleta: "Dirección",
};

// Claves a excluir de la tabla de detalles
const excludedKeys = [
    "id",
    "foto",
    "tipoAutenticacionId",
    "tieneMascota",
    "rolId",
    "password",
    "mailVerificado",
    "habilitada",
    "generoId",
    "fechaNacimiento",
    "cuentaVerificada",
    "codigoPostal",
    "username",
    "barrioId",
    "nroCalle", // nroCalle y calle original ya no existen si se combinaron en el padre
    "calle", // Excluir la 'calle' original si aún existiera
    "rolUsuario",
    "qr",
    "esPaseador",
    "esCuidador",
    "esVeterinaria",
    "esFundacion",
];

// Componente recibe userData como prop
const AsideLeft = ({ userData }) => {
    const { handleSweetAlertDeleteUser } = Modal();
    const { deleteAccount } = useAuth();
    // Estado local solo para roles y su carga/error
    const [nombreRol, setNombreRol] = useState(null);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [errorRoles, setErrorRoles] = useState(null);

    // Efecto para cargar los roles (esto sigue siendo específico de AsideLeft)
    useEffect(() => {
        const fetchRol = async () => {
            setIsLoadingRoles(true);
            setErrorRoles(null);
            try {
                const rolesResponse = await getRol();
                // Asumiendo que devuelve { data: [...] }
                setNombreRol(rolesResponse?.data);
            } catch (err) {
                console.error("Error al cargar roles:", err);
                setErrorRoles("Error al cargar información de roles.");
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchRol();
    }, []); // Dependencia vacía para ejecutar solo una vez al montar

    // Función para manejar la eliminación de la cuenta
    const handleDeleteUser = async () => {
        // No necesita cargar userData, ya lo tiene como prop
        if (!userData?.id) {
            console.error("No hay ID de usuario para eliminar/actualizar.");
            Swal.fire(
                "Error",
                "No se pudo obtener la información del usuario para esta acción.",
                "error"
            );
            return { success: false, error: "ID de usuario no disponible" };
        }

        try {
            const deleteResponse = await deleteAccount();

            if (deleteResponse?.success) {
                console.log(
                    "Cuenta eliminada exitosamente (auth), marcando como inhabilitada..."
                );
                const updatedUserData = { ...userData, habilitada: false };
                await updateUser(userData.id, updatedUserData);
                // Aquí podrías querer limpiar localStorage y redirigir
                // Ejemplo: localStorage.clear(); window.location.href = '/login';
                return deleteResponse.success;
            } else {
                throw new Error(
                    deleteResponse?.error?.message ||
                        "Falló la eliminación de la cuenta"
                );
            }
        } catch (error) {
            console.error("Error en handleDeleteUser:", error);
            Swal.fire(
                "Error",
                `No se pudo eliminar la cuenta: ${error.message}`,
                "error"
            );
            return { success: false, error: error };
        }
    };

    // --- Renderizado ---

    // Si userData no existe (el padre aún no lo ha pasado o hubo un error allí),
    // no renderizar nada o un mensaje/placeholder.
    // El padre (Profile) ya maneja el estado de carga principal y el error fatal.
    if (!userData) {
        return (
            <Col xxl={3} lg={4} md={12}>
                {/* Puedes poner un placeholder o simplemente null */}
                <Card className="mt-n5 placeholder-glow">
                    <CardBody className="p-4">
                        <div className="text-center">
                            <div
                                className="rounded-circle bg-secondary mx-auto mb-4 placeholder"
                                style={{ width: "100px", height: "100px" }}
                            ></div>
                            <div className="placeholder w-75 mb-1"></div>
                            <div className="placeholder w-50"></div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="placeholder-glow">
                    <CardBody className="p-3">
                        <div className="placeholder w-100 my-2"></div>
                        <div className="placeholder w-100 my-2"></div>
                        <div className="placeholder w-100 my-2"></div>
                    </CardBody>
                </Card>
            </Col>
        );
    }

    // Encontrar el nombre del rol (puede estar cargando o tener error)
    let userRoleName = "Cargando rol...";
    if (!isLoadingRoles) {
        if (errorRoles) {
            userRoleName = "Error al cargar rol";
        } else if (nombreRol && userData.rolId) {
            userRoleName =
                nombreRol.find((rol) => rol.id === userData.rolId)?.nombre ||
                "Rol no definido";
        } else {
            userRoleName = "Rol no definido";
        }
    }

    return (
        <>
            <UiContent />
            <Col xxl={3} lg={4} md={12}>
                {/* Tarjeta de Avatar e Info Básica */}
                <Card className="mt-n5">
                    <CardBody className="p-4">
                        <div className="text-center">
                            <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                                <img
                                    src={userData.foto || avatar1}
                                    alt="Foto de perfil"
                                    className="img-thumbnail rounded-circle"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <h5 className="fs-16 mb-1">
                                {userData.nombreCompleto ||
                                    "Nombre no disponible"}
                            </h5>
                            {/* Mostrar estado de carga/error del rol */}
                            <p
                                className={`text-muted mb-0 ${
                                    errorRoles ? "text-danger" : ""
                                }`}
                            >
                                {userRoleName}
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* Tarjeta de Datos Personales */}
                <Card>
                    <CardBody className="p-3">
                        <h5 className="card-title mb-3 text-center">
                            Datos Personales
                        </h5>
                        <div className="table-responsive">
                            <Table borderless className="mb-0">
                                <tbody>
                                    {Object.entries(userData)
                                        .filter(
                                            ([key]) =>
                                                !excludedKeys.includes(key) &&
                                                userData[key] !== null &&
                                                userData[key] !== ""
                                        )
                                        .map(([key, value]) => {
                                            const displayKey =
                                                keyMap[key] || key;
                                            return (
                                                <tr key={key}>
                                                    <td className="fw-medium py-2">
                                                        {displayKey}:
                                                    </td>
                                                    <td className="text-muted py-2">
                                                        {String(value)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-center gap-2 m-3">
                            
                            {/* Botón Modificar Perfil (Link) */}
                            <Link
                                className="btn btn-success d-inline-flex align-items-center" 
                                to={"/modificar-perfil"}
                                role="button" // Añadir role para accesibilidad
                                style={{
                                    "--bs-btn-padding-y": ".4rem",
                                    "--bs-btn-padding-x": ".75rem",
                                    "--bs-btn-font-size": ".9rem",
                                }} // Ajuste opcional de tamaño
                            >
                                {/* Icono SVG */}
                                <svg
                                    viewBox="0 0 490 490"
                                    width="16"
                                    height="16"
                                    fill="#ffffff"
                                    className="me-1"
                                >
                                    {" "}
                                    
                                    <g transform="translate(0,490) scale(0.1,-0.1)">
                                        <path d="M4107 4670 c-32 -12 -77 -32 -100 -47 -23 -14 -181 -164 -352 -334 l-310 -309 318 -317 318 -318 313 315 c293 295 315 320 352 394 38 79 39 82 39 190 -1 91 -5 121 -23 166 -44 111 -142 209 -252 252 -81 31 -226 35 -303 8z" />
                                        <path d="M2442 3077 c-424 -424 -772 -777 -772 -782 0 -13 612 -625 625 -625 3 0 1555 1542 1555 1555 0 13 -612 625 -625 625 -6 0 -358 -348 -783 -773z" />
                                        <path d="M743 3765 c-124 -34 -213 -108 -270 -223 l-38 -76 0 -1360 0 -1361 23 -58 c34 -82 125 -178 211 -220 l66 -32 1366 0 1365 0 76 38 c121 59 204 167 228 296 6 34 10 387 10 953 l0 900 -29 29 c-38 37 -82 39 -116 4 l-25 -24 0 -904 c0 -991 2 -965 -60 -1039 -16 -20 -53 -48 -82 -62 l-52 -26 -1305 0 c-908 0 -1318 3 -1345 11 -53 15 -138 100 -154 155 -9 32 -12 350 -12 1345 l0 1304 24 51 c13 28 41 65 62 82 78 65 36 62 1034 62 l907 0 27 26 c35 36 34 77 -3 115 l-29 29 -914 -1 c-754 0 -922 -3 -965 -14z" />
                                        <path d="M1432 1773 c-73 -208 -133 -386 -132 -396 0 -25 54 -77 79 -77 16 0 759 255 768 264 1 1 -129 133 -290 294 l-292 292 -133 -377z" />
                                    </g>
                                </svg>
                                {/* Texto del Botón */}
                                Modificar Perfil
                            </Link>

                            {/* Botón Eliminar Perfil */}
                            <button
                                type="button"
                                className="btn btn-danger d-inline-flex align-items-center" 
                                onClick={() =>
                                    handleSweetAlertDeleteUser(handleDeleteUser)
                                }
                                style={{
                                    "--bs-btn-padding-y": ".4rem",
                                    "--bs-btn-padding-x": ".75rem",
                                    "--bs-btn-font-size": ".9rem",
                                }} // Ajuste opcional de tamaño
                            >
                                {/* Icono SVG */}
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="me-1"
                                >
                                    {" "}
                                    
                                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                                </svg>
                                {/* Texto del Botón */}
                                Eliminar Perfil
                            </button>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default AsideLeft;
