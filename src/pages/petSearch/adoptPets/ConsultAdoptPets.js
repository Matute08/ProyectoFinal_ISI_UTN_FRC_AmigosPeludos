// ConsultAdoptPets.js (Refactorizado)

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate para Volver
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Button,
    Alert,
    Spinner,
    ListGroup,
    ListGroupItem,
    Badge,
} from "reactstrap"; // Componentes Bootstrap

// Swiper (Carrusel de Imágenes)
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Componentes y Servicios
import Loading from "../../components/Loading";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
// import { useAuth } from "../../../services/AuthContext"; // No se usa user
// import LeafletMaps from "../../components/maps/LeafletMaps"; // No se usa mapa aquí
import { getPublicacionesId } from "../../../services/PublicationsPetsApi"; // API call
import FormAdoptPets from "./FormAdoptPets"; // Modal Formulario Adopción

// Placeholder para imagen
const placeholderImage = "/images/placeholder-image.png"; // Ajusta esta ruta

const ConsultAdoptPets = () => {
    // const { user } = useAuth(); // No se usa
    const { posteoId } = useParams();
    const navigate = useNavigate();

    // --- Estados ---
    const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de formulario
    const [isLoading, setIsLoading] = useState(true);
    const [datosPublicacion, setDatosPublicacion] = useState(null);
    const [error, setError] = useState(null);

    // --- Carga de Datos ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPublicData = async () => {
            if (!posteoId) {
                setError("ID de publicación no válido.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            setDatosPublicacion(null);

            try {
                const response = await getPublicacionesId(posteoId);
                const data = response?.data || response; // Manejar si viene directo o en .data

                // Validar que sea una publicación de Adopción (tipo 3)
                if (data && typeof data === "object" && data.id) {
                    if (data.tipoPublicacionId !== 3) {
                        throw new Error("Esta publicación no es de adopción.");
                    }
                    setDatosPublicacion(data);
                } else {
                    throw new Error(
                        "No se encontraron datos para esta publicación o la respuesta de la API es inválida."
                    );
                }
            } catch (err) {
                console.error("Error fetching publicacion data:", err);
                setError(err.message || "Error al cargar la publicación.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPublicData();
    }, [posteoId]);

    // --- Cálculo de Valores Derivados ---
    const { displayDate, castracionDisplay } = useMemo(() => {
        if (!datosPublicacion) {
            return { displayDate: "", castracionDisplay: "" };
        }
        let calculatedDate = "";
        let calculatedCastracion = "No especificado";

        // Formatear Fecha de Alta (para adopción)
        if (datosPublicacion.fechaAlta) {
            try {
                calculatedDate = new Date(
                    datosPublicacion.fechaAlta
                ).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            } catch (e) {
                calculatedDate = "Inválida";
            }
        }
        // Formatear Castración
        if (typeof datosPublicacion.castracion === "boolean") {
            calculatedCastracion = datosPublicacion.castracion ? "Sí" : "No";
        }
        return {
            displayDate: calculatedDate,
            castracionDisplay: calculatedCastracion,
        };
    }, [datosPublicacion]);

    // --- Renderizado ---

    if (isLoading) {
        return <Loading />;
    }

    if (error || !datosPublicacion) {
        return (
            <>
                <Navbar />
                <Container className="page-content text-center mt-5">
                    <Alert color="danger">
                        {error || "No se encontró la publicación de adopción."}
                    </Alert>
                    <Button
                        color="secondary"
                        onClick={() => navigate(-1)}
                        className="mt-2 d-inline-flex align-items-center"
                    >
                        <i className="fas fa-arrow-left me-1"></i> Volver
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    document.title = `Adopción: ${
        datosPublicacion.nombre || "Mascota"
    } | Amigos Peludos`;

    return (
        <React.Fragment>
            <Navbar />
            <div className="page-content perfil-fondo py-4">
                <Container>
                    {/* --- Título --- */}
                    <Row className="mb-4">
                        <Col className="text-center">
                            <h1>Detalle de Mascota en Adopción</h1>
                            <Badge color="info" pill className="ms-2 fs-6">
                                Adopción
                            </Badge>
                        </Col>
                    </Row>

                    {/* --- Contenido Principal (2 Columnas) --- */}
                    <Row className="g-4">
                        {/* Columna Izquierda: Datos */}
                        <Col lg={5} md={6} className="d-flex flex-column">
                            <Card className="mb-4 shadow-sm flex-grow-1">
                                <CardHeader className="bg-light">
                                    <CardTitle tag="h5" className="mb-0">
                                        Datos de la Mascota
                                    </CardTitle>
                                </CardHeader>
                                <ListGroup flush>
                                    {datosPublicacion.nombre && (
                                        <ListGroupItem>
                                            <strong>Nombre:</strong>{" "}
                                            {datosPublicacion.nombre}
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem>
                                        <strong>Tipo:</strong>{" "}
                                        {datosPublicacion.tipoMascotaNombre ||
                                            "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Raza:</strong>{" "}
                                        {datosPublicacion.razaNombre || "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Edad Aprox.:</strong>{" "}
                                        {datosPublicacion.edadMascota || "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Sexo:</strong>{" "}
                                        {datosPublicacion.sexoMascota || "N/A"}
                                    </ListGroupItem>
                                    {/* El color no estaba en la lista original de exclusión, lo añadimos si existe */}
                                    {datosPublicacion.color && (
                                        <ListGroupItem>
                                            <strong>Color:</strong>{" "}
                                            {datosPublicacion.color}
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem>
                                        <strong>Castrado/a:</strong>{" "}
                                        {castracionDisplay}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>En adopción desde:</strong>{" "}
                                        {displayDate || "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Barrio:</strong>{" "}
                                        {datosPublicacion.barrioPublicacion ||
                                            "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Ciudad:</strong>{" "}
                                        {datosPublicacion.ciudadPublicacion ||
                                            "N/A"}
                                    </ListGroupItem>
                                </ListGroup>
                                {datosPublicacion.descripcion && (
                                    <CardBody className="border-top">
                                        <h6 className="mb-2">
                                            Descripción Adicional:
                                        </h6>
                                        <p className="text-muted mb-0">
                                            {datosPublicacion.descripcion}
                                        </p>
                                    </CardBody>
                                )}
                            </Card>
                            {/* No hay sección de contacto directo, se usa el formulario */}
                        </Col>

                        {/* Columna Derecha: Fotos y Formulario */}
                        <Col lg={7} md={6}>
                            {/* Card Fotos */}
                            <Card className="mb-4 shadow-sm">
                                <CardHeader className="bg-light">
                                    <CardTitle tag="h5" className="mb-0">
                                        Fotos
                                    </CardTitle>
                                </CardHeader>
                                <CardBody
                                    className={
                                        !(
                                            datosPublicacion.fotos &&
                                            datosPublicacion.fotos.length > 0
                                        )
                                            ? "text-center"
                                            : "p-2"
                                    }
                                >
                                    {datosPublicacion.fotos &&
                                    datosPublicacion.fotos.length > 0 ? (
                                        <Swiper
                                            modules={[
                                                Navigation,
                                                Pagination,
                                                Autoplay,
                                            ]}
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            loop={
                                                datosPublicacion.fotos.length >
                                                1
                                            }
                                            autoplay={{
                                                delay: 5000,
                                                disableOnInteraction: true,
                                            }}
                                            className="rounded"
                                        >
                                            {datosPublicacion.fotos.map(
                                                (item, index) => (
                                                    <SwiperSlide
                                                        key={
                                                            item.id ||
                                                            `foto-${index}`
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                item.foto ||
                                                                placeholderImage
                                                            }
                                                            alt={`Foto ${
                                                                index + 1
                                                            } de ${
                                                                datosPublicacion.nombre ||
                                                                "mascota en adopción"
                                                            }`}
                                                            className="img-fluid rounded"
                                                            style={{
                                                                maxHeight:
                                                                    "500px",
                                                                width: "100%",
                                                                objectFit:
                                                                    "contain",
                                                            }}
                                                            onError={(e) => {
                                                                if (
                                                                    e.target
                                                                        .src !==
                                                                    placeholderImage
                                                                ) {
                                                                    e.target.onerror =
                                                                        null;
                                                                    e.target.src =
                                                                        placeholderImage;
                                                                }
                                                            }}
                                                        />
                                                    </SwiperSlide>
                                                )
                                            )}
                                        </Swiper>
                                    ) : (
                                        <p className="text-muted mb-0 p-5">
                                            No hay fotos disponibles.
                                        </p>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Card Postulación */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-light">
                                    <CardTitle tag="h5" className="mb-0">
                                        Postularse para Adoptar
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="text-center">
                                    <p>
                                        Si cumples con los requisitos y quieres
                                        darle un hogar a{" "}
                                        {datosPublicacion.nombre ||
                                            "esta mascota"}
                                        , completa el formulario.
                                    </p>
                                    {/* Botón para abrir el modal del formulario */}
                                    <Button
                                        color="primary"
                                        onClick={() => setIsModalOpen(true)}
                                        className="d-inline-flex align-items-center"
                                    >
                                        {/* Icono Formulario */}
                                        <i className="fas fa-file-alt me-2"></i>{" "}
                                        Completar Formulario
                                    </Button>
                                </CardBody>
                            </Card>
                            {/* El mapa no parece relevante para adopción, se omite */}
                        </Col>
                    </Row>
                    {/* Botón Volver General */}
                    <Row className="mt-4">
                        <Col className="text-center">
                            <Button
                                color="secondary"
                                onClick={() => navigate(-1)}
                                className="d-inline-flex align-items-center"
                            >
                                <i className="fas fa-arrow-left me-1"></i>{" "}
                                Volver a la lista
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />

            {/* Modal del Formulario de Adopción */}
            {/* Se renderiza aquí pero se muestra/oculta con el estado isModalOpen */}
            <FormAdoptPets
                isOpen={isModalOpen}
                toggle={() => setIsModalOpen(!isModalOpen)} // Función para cerrar
                posteoId={posteoId} // Pasar ID del posteo al formulario
                mascotaNombre={datosPublicacion?.nombre} // Pasar nombre para mostrar en modal
            />
        </React.Fragment>
    );
};

export default ConsultAdoptPets;
