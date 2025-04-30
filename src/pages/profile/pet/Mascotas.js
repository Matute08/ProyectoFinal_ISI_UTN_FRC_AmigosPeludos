// Mascotas.js (Refactorizado)

import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Alert,
    Spinner,
    Button,
} from "reactstrap";
import { Link } from "react-router-dom";

// Componentes y Servicios
// import { useAuth } from "../../../services/AuthContext"; // user no se usaba
import ConsultarMascota from "../pet/consultPet/ConsultPet"; // Vista de detalle
import { deleteFileStorage } from "../../../services/Firebase";
import Modal from "../../components/Modal"; // Hook para confirmación
import Loading from "../../components/Loading"; // Componente Loading
import { getUserMail, updateUser } from "../../../services/userApi";
import { getMascotasUsuario, deletePet } from "../../../services/PetsApi";

// Define una ruta real a una imagen placeholder en tu proyecto
const placeholderPetImage = "/images/placeholder-pet.png";

const Mascota = () => {
    // const { user } = useAuth(); // user no se estaba utilizando
    const { handleSweetAlertDeletePet } = Modal();

    // Estados del componente
    const [userData, setUserData] = useState(null); // Datos del usuario logueado
    const [userPets, setUserPets] = useState([]); // Mascotas del usuario
    const [petToConsultId, setPetToConsultId] = useState(0); // ID de la mascota a consultar (0 = ninguna)
    const [isLoading, setIsLoading] = useState(true); // Estado de carga general
    const [error, setError] = useState(null); // Estado de error general

    // Cargar datos del usuario
    const fetchUserData = useCallback(async () => {
        // No reiniciar carga aquí si ya se están cargando mascotas
        // setIsLoading(true); // <- Evitar reiniciar si se llama después
        setError(null);
        try {
            const cachedUserData = localStorage.getItem("userData");
            if (!cachedUserData)
                throw new Error("No hay sesión de usuario activa.");
            const dataLocalStorage = JSON.parse(cachedUserData);
            const userEmail = dataLocalStorage?.email;
            if (!userEmail)
                throw new Error("No se pudo obtener el email del usuario.");

            const response = await getUserMail(userEmail);
            if (!response?.data)
                throw new Error(
                    "Respuesta inválida al obtener datos del usuario."
                );
            setUserData(response.data);
            return response.data; // Devolver datos para el siguiente fetch
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.message || "Error al cargar datos del usuario.");
            setIsLoading(false); // Detener carga si falla aquí
            return null; // Indicar fallo
        }
    }, []);

    // Cargar mascotas del usuario (depende de userData)
    const fetchPets = useCallback(async (userId) => {
        if (!userId) return; // No hacer nada si no hay ID
        // setIsLoading(true); // La carga general ya está activa
        // setError(null); // No limpiar error general necesariamente
        try {
            const mascotasResponse = await getMascotasUsuario(userId);
            if (mascotasResponse?.data) {
                setUserPets(mascotasResponse.data);
            } else {
                console.warn(
                    "La respuesta de getMascotasUsuario no contiene 'data'.",
                    mascotasResponse
                );
                setUserPets([]);
            }
        } catch (err) {
            console.error("Error fetching mascotas:", err);
            setError(err.message || "Error al cargar las mascotas.");
            setUserPets([]);
        } finally {
            setIsLoading(false); // Marcar fin de carga aquí (cubre user y pets)
        }
    }, []);

    // Efecto para orquestar la carga inicial
    useEffect(() => {
        setIsLoading(true); // Iniciar carga general
        fetchUserData().then((fetchedUser) => {
            if (fetchedUser?.id) {
                fetchPets(fetchedUser.id); // Cargar mascotas si se obtuvo el ID de usuario
            } else {
                setIsLoading(false); // Detener carga si no se pudo obtener el usuario
            }
        });
    }, [fetchUserData, fetchPets]); // Dependencias correctas

    // --- Manejadores de Acciones ---

    // Mostrar componente de consulta
    const handleShowConsultComponent = (id) => {
        setPetToConsultId(id);
    };

    // Ocultar componente de consulta
    const handleCancelConsult = () => {
        setPetToConsultId(0);
    };

    // --- Lógica de Eliminación ---

    // Función que ejecuta la lógica de borrado en API y Storage
    const handleDeletePetApi = async (id, fotoUrl) => {
        if (!userData?.id) {
            console.error("Falta ID de usuario para actualizar tieneMascota");
            return false; // No continuar sin ID de usuario
        }
        // Verificar si es la última mascota ANTES de intentar borrar
        const isLastPet = userPets.length === 1;
        console.log(
            `Intentando borrar mascota ${id}. ¿Es la última? ${isLastPet}`
        );

        try {
            // 1. Borrar mascota de la BD
            await deletePet(id);
            console.log(`Mascota ${id} borrada de la BD.`);

            // 2. Actualizar 'tieneMascota' del usuario SI era la última
            if (isLastPet) {
                console.log(
                    `Actualizando usuario ${userData.id}, estableciendo tieneMascota a false.`
                );
                await updateUser(userData.id, { tieneMascota: false }); // Enviar solo el campo a cambiar
                console.log(`Usuario ${userData.id} actualizado.`);
            }

            // 3. Borrar foto de Firebase Storage si existe URL
            if (fotoUrl) {
                console.log(`Intentando borrar foto: ${fotoUrl}`);
                await deleteFileStorage(fotoUrl);
                console.log(`Foto ${fotoUrl} borrada de Storage.`);
            } else {
                console.log("No había URL de foto para borrar.");
            }

            return true; // Éxito general
        } catch (error) {
            console.error("Error en handleDeletePetApi:", error);
            // Aquí podrías diferenciar errores (borrado mascota, actualización usuario, borrado foto)
            alert(`Error al eliminar: ${error.message || "Error desconocido"}`); // Mostrar error al usuario
            return false; // Indicar fallo
        }
    };

    // Callback que se ejecuta DESPUÉS de la confirmación del usuario
    const handleDeleteConfirmed = async (id, fotoUrl) => {
        console.log(`Confirmado borrado para ID: ${id}`);
        const isLastPetBeforeDelete = userPets.length === 1; // Saber si era la última antes de la API call
        const success = await handleDeletePetApi(id, fotoUrl);

        if (success) {
            // Actualizar estado local de mascotas
            setUserPets((currentPets) =>
                currentPets.filter((pet) => pet.id !== id)
            );
            // Actualizar estado local de usuario si era la última mascota
            if (isLastPetBeforeDelete) {
                setUserData((currentUser) => ({
                    ...currentUser,
                    tieneMascota: false,
                }));
            }
            console.log(`Estado local actualizado tras borrar mascota ${id}.`);
            // Opcional: Notificación de éxito
        }
        // El manejo de errores ya se hace en handleDeletePetApi con un alert
        return success;
    };

    // Función que llama al modal de confirmación
    const handleDeleteButtonClick = (nombre, id, fotoUrl) => {
        console.log(`Iniciando borrado para: ${nombre} (ID: ${id})`);
        // Pasar la función que se ejecutará si el usuario confirma
        handleSweetAlertDeletePet(nombre, id, fotoUrl, () =>
            handleDeleteConfirmed(id, fotoUrl)
        );
    };

    // --- Renderizado ---

    if (isLoading) {
        return <Loading />; // Usar componente Loading importado
    }

    // Mostrar error si falló la carga principal (usuario o mascotas)
    if (error) {
        return (
            <Container className="mt-3">
                <Alert color="danger">
                    Error al cargar la información: {error}
                </Alert>
            </Container>
        );
    }

    // Si se debe mostrar la vista de consulta
    if (petToConsultId !== 0) {
        return (
            <ConsultarMascota
                mascotaId={petToConsultId}
                onCancel={handleCancelConsult}
            />
        );
    }

    // Si no se consulta, mostrar la lista o el estado vacío
    return (
        <React.Fragment>
            {userPets.length > 0 ? (
                <Container fluid>
                    <Row>
                        {userPets.map((elemento) => (
                            <Col
                                sm={6}
                                md={4}
                                xl={3}
                                key={elemento.id}
                                className="mb-4 d-flex align-items-stretch"
                            >
                                <Card className="w-100 shadow-sm">
                                    {/* Imagen clickeable */}
                                    <button
                                        className="border-0 bg-transparent p-0 button-consultar" 
                                        onClick={() =>
                                            handleShowConsultComponent(
                                                elemento.id
                                            )
                                        }
                                        title={`Ver detalles de ${elemento.nombre}`}
                                    >
                                        <img
                                            className="card-img-top img-fluid"
                                            
                                            src={
                                                elemento.foto ||
                                                placeholderPetImage
                                            }
                                            alt={`Foto de ${elemento.nombre}`}
                                            onError={(e) => {
                                                if (
                                                    e.target.src !==
                                                    placeholderPetImage
                                                ) {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        placeholderPetImage;
                                                }
                                            }}
                                        />
                                    </button>
                                    <CardBody className="d-flex flex-column">
                                        <h5 className="card-title text-center mb-3">
                                            {elemento.nombre ||
                                                "Mascota sin nombre"}
                                        </h5>
                                        {/* Botones de Acción */}
                                        <div className="d-flex justify-content-center mt-auto pt-2 border-top">
                                            {/* Botón Editar */}
                                            <Link
                                                className="btn btn-icon btn-sm btn-outline-primary me-2"
                                                title="Editar Mascota"
                                                to={`/modificar-mascota/${elemento.id}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                    />
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                            </Link>
                                            {/* Botón Eliminar */}
                                            <Button
                                                color="danger"
                                                outline
                                                size="sm"
                                                className="btn-icon"
                                                title="Eliminar Mascota"
                                                onClick={() =>
                                                    handleDeleteButtonClick(
                                                        elemento.nombre,
                                                        elemento.id,
                                                        elemento.foto
                                                    )
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                    />
                                                    <path d="M4 7h16" />
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                    <path d="M10 12l4 4m0 -4l-4 4" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            ) : (
                // Mensaje si no hay mascotas (después de cargar y sin error)
                // Se verifica userPets.length en lugar de userData.tieneMascota para mayor seguridad tras borrado
                <Container className="mt-3">
                    <Alert color="info">
                        <h5 className="alert-heading">
                            ¡Aún no tienes mascotas agregadas!
                        </h5>
                        <p>
                            Puedes agregar tu primera mascota usando el botón "+
                            Agregar Mascota".
                        </p>
                        {/* El botón flotante para agregar está en UserProfile.js */}
                    </Alert>
                </Container>
            )}
        </React.Fragment>
    );
};

export default Mascota; // Asegúrate que el export default sea el nombre del componente
