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

import {
    getPublicacionesUser,
    deletePost,
} from "../../../services/PublicationsPetsApi";
import { deleteFileStorage } from "../../../services/Firebase";
import Modal from "../../components/Modal";

// Define una ruta real a una imagen placeholder en tu proyecto
const placeholderImage = "/images/placeholder-image.png"; 

const MyPosts = () => {
    const { handleSweetAlertDeletePost } = Modal();
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedUserData = localStorage.getItem("userData");
            if (!cachedUserData) {
                console.warn(
                    "No se encontraron datos de usuario en localStorage para cargar posts."
                );
                setIsLoading(false);
                return;
            }
            const dataLocalStorage = JSON.parse(cachedUserData);
            const userEmail = dataLocalStorage?.email;
            if (!userEmail) {
                throw new Error(
                    "No se pudo obtener el email del usuario desde localStorage."
                );
            }
            const response = await getPublicacionesUser(userEmail);
            if (response?.data) {
                setUserPosts(response.data);
            } else {
                console.warn(
                    "La respuesta de getPublicacionesUser no contiene 'data'.",
                    response
                );
                setUserPosts([]);
            }
        } catch (err) {
            console.error(
                "Error al cargar las publicaciones del usuario:",
                err
            );
            setError(err.message || "No se pudieron cargar las publicaciones.");
            setUserPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserPosts();
    }, [fetchUserPosts]);

    const handleDeletePetApi = async (id, fotos) => {
        try {
            await deletePost(id);
            if (fotos && Array.isArray(fotos)) {
                const deletePromises = fotos.map((foto) => {
                    if (foto?.foto) {
                        return deleteFileStorage(foto.foto).catch((err) => {
                            console.warn(
                                `No se pudo borrar la foto ${foto.foto}:`,
                                err
                            );
                        });
                    }
                    return Promise.resolve();
                });
                await Promise.all(deletePromises);
            }
            return true;
        } catch (error) {
            console.error("Error en handleDeletePetApi:", error);
            return false;
        }
    };

    const handleDeleteConfirmed = async (id, fotos) => {
        const success = await handleDeletePetApi(id, fotos);
        if (success) {
            setUserPosts((currentPosts) =>
                currentPosts.filter((post) => post.id !== id)
            );
            console.log(`Publicación ${id} eliminada exitosamente.`);
        } else {
            console.error(`Falló la eliminación de la publicación ${id}.`);
            alert("Error al eliminar la publicación. Inténtalo de nuevo.");
        }
        return success;
    };

    const handleDeleteButtonClick = (id, fotos) => {
        handleSweetAlertDeletePost(id, fotos, () =>
            handleDeleteConfirmed(id, fotos)
        );
    };

    // --- Renderizado ---

    if (isLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner color="primary" />
                <p>Cargando tus publicaciones...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-3">
                <Alert color="danger">
                    Error al cargar publicaciones: {error}
                </Alert>
            </Container>
        );
    }

    return (
        <React.Fragment>
            {userPosts.length > 0 ? (
                <Container fluid>
                    <Row>
                        {userPosts.map((elemento) => (
                            <Col
                                sm={6}
                                md={4}
                                xl={3}
                                key={elemento.id}
                                className="mb-4 d-flex align-items-stretch"
                            >
                                <Card className="w-100 shadow-sm">
                                    <Link
                                        className="border-0 bg-transparent p-0 button-consultar"
                                        to={
                                            elemento.tipoPublicacionId === 3
                                                ? `/consultar-posteo-adopcion/${elemento.id}`
                                                : `/consultar-posteo/${elemento.id}`
                                        }
                                    >
                                        <div className="d-flex justify-content-center">
                                            <img
                                                className="card-img-top img-fluid"
                                                
                                                src={
                                                    elemento.fotos?.[0]?.foto ||
                                                    placeholderImage
                                                }
                                                alt={`Foto de ${
                                                    elemento.nombre || "publicación"
                                                }`}
                                                onError={(e) => {
                                                    if (
                                                        e.target.src !==
                                                        placeholderImage
                                                    ) {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            placeholderImage;
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Link>
                                    <CardBody className="d-flex flex-column">
                                        <h5 className="card-title text-center mb-3">
                                            {elemento.nombre ||
                                                "Publicación sin nombre"}
                                        </h5>
                                        <div className="d-flex justify-content-center mt-auto pt-2 border-top">
                                            {/* Botón Editar */}
                                            <Link
                                                className="btn btn-icon btn-sm btn-outline-primary me-2"
                                                title="Editar Publicación"
                                                to={
                                                    elemento.tipoPublicacionId ===
                                                    3
                                                        ? `/modificar-posteo-adopcion/${elemento.id}`
                                                        : `/modificar-posteo/${elemento.id}`
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
                                                title="Eliminar Publicación"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteButtonClick(
                                                        elemento.id,
                                                        elemento.fotos
                                                    );
                                                }}
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
                <Container className="mt-3">
                    <Alert color="info">
                        <h5 className="alert-heading">
                            ¡Aún no tienes publicaciones!
                        </h5>
                        <p>
                            Puedes crear publicaciones de mascotas perdidas,
                            encontradas o en adopción desde la sección
                            correspondiente.
                        </p>
                    </Alert>
                </Container>
            )}
        </React.Fragment>
    );
};

export default MyPosts;
