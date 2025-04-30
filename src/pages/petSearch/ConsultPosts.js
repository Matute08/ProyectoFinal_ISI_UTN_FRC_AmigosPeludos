// ConsultPosts.js (Refactorizado v2 - Usando <i> para Font Awesome)

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
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
} from "reactstrap";
// import { useAuth } from "../../services/AuthContext"; // user no se usa

// Swiper (Carrusel de Imágenes)
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper"; // Módulos deseados
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Mapa
import LeafletMaps from "../components/maps/LeafletMaps"; // Verificar ruta

// API
import { getPublicacionesId } from "../../services/PublicationsPetsApi"; // Verificar ruta

// Placeholder para imagen
const placeholderImage = "/images/placeholder-image.png"; // Define una ruta real

const ConsultPosts = () => {
    // const { user } = useAuth(); // No se usa
    const { posteoId } = useParams();
    const navigate = useNavigate();

    // --- Estados ---
    const [isLoading, setIsLoading] = useState(true);
    const [datosPublicacion, setDatosPublicacion] = useState(null);
    const [error, setError] = useState(null);

    // --- Carga de Datos ---
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll al top
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
                // Asumiendo que la API devuelve { data: {...} }
                const data = response?.data || response; // Manejar ambos casos
                if (data && typeof data === "object" && data.id) {
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
    }, [posteoId]); // Dependencia correcta

    // --- Cálculo de Valores Derivados ---
    const {
        titulo,
        labelFecha,
        displayDate,
        castracionDisplay,
        tipoPublicacionId,
    } = useMemo(() => {
        if (!datosPublicacion) {
            return {
                titulo: "Cargando...",
                labelFecha: "",
                displayDate: "",
                castracionDisplay: "",
                tipoPublicacionId: null,
            };
        }
        let calculatedTitulo = "Detalle de Publicación";
        let calculatedLabelFecha = "Fecha";
        let calculatedDate = "";
        let calculatedCastracion = "No especificado";
        const pubType = datosPublicacion.tipoPublicacionId;

        if (pubType === 1) {
            calculatedTitulo = "Detalle de Mascota Perdida";
            calculatedLabelFecha = "Perdida el";
        } else if (pubType === 2) {
            calculatedTitulo = "Detalle de Mascota Encontrada";
            calculatedLabelFecha = "Encontrada el";
        } else if (pubType === 3) {
            calculatedTitulo = "Detalle de Mascota en Adopción";
            calculatedLabelFecha = "En adopción desde";
        }

        const dateToFormat =
            pubType === 3
                ? datosPublicacion.fechaAlta
                : datosPublicacion.fechaPerdida;
        if (dateToFormat) {
            try {
                calculatedDate = new Date(dateToFormat).toLocaleDateString(
                    "es-AR",
                    { day: "2-digit", month: "2-digit", year: "numeric" }
                );
            } catch (e) {
                calculatedDate = "Inválida";
            }
        }
        if (typeof datosPublicacion.castracion === "boolean") {
            calculatedCastracion = datosPublicacion.castracion ? "Sí" : "No";
        }
        return {
            titulo: calculatedTitulo,
            labelFecha: calculatedLabelFecha,
            displayDate: calculatedDate,
            castracionDisplay: calculatedCastracion,
            tipoPublicacionId: pubType,
        };
    }, [datosPublicacion]);

    // --- Función WhatsApp ---
    const openWhatsApp = () => {
        const phoneNumber = datosPublicacion?.telefono;
        if (!phoneNumber) {
            alert("El teléfono de contacto no está disponible.");
            return;
        }
        let message = `¡Hola! Vi la publicación de ${
            datosPublicacion?.nombre || "la mascota"
        } (${
            datosPublicacion?.publicacionTipo || ""
        }) y quisiera más información.`;
        // Personalizar mensaje aún más si se desea
        const whatsappUrl = `https://wa.me/54${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

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
                        {error || "No se encontró la publicación."}
                    </Alert>
                    <Button
                        color="secondary"
                        onClick={() => navigate(-1)}
                        className="mt-2 d-inline-flex align-items-center"
                    >
                        {/* Icono Volver con <i> */}
                        <i className="fas fa-arrow-left me-1"></i> Volver
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    document.title = `${titulo} | Amigos Peludos`;

    return (
        <React.Fragment>
            <Navbar />
            <div className="page-content perfil-fondo py-4">
                <Container>
                    {/* --- Título --- */}
                    <Row className="mb-4">
                        <Col className="text-center">
                            <h1>{titulo}</h1>
                            <Badge
                                color={
                                    tipoPublicacionId === 1
                                        ? "danger"
                                        : tipoPublicacionId === 2
                                        ? "success"
                                        : "info"
                                }
                                pill
                                className="ms-2 fs-6"
                            >
                                {datosPublicacion.publicacionTipo || ""}
                            </Badge>
                        </Col>
                    </Row>

                    {/* --- Contenido Principal (2 Columnas) --- */}
                    <Row className="g-4">
                        {/* Columna Izquierda: Datos y Contacto */}
                        <Col lg={5} md={6} className="d-flex flex-column">
                            {" "}
                            {/* Flex column */}
                            {/* Card Datos Mascota */}
                            <Card className="mb-4 shadow-sm flex-grow-1">
                                {" "}
                                {/* flex-grow-1 */}
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
                                    <ListGroupItem>
                                        <strong>Color:</strong>{" "}
                                        {datosPublicacion.color || "N/A"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Castrado/a:</strong>{" "}
                                        {castracionDisplay}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>{labelFecha}:</strong>{" "}
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
                            {/* Card Datos de Contacto */}
                            <Card className="shadow-sm mt-auto">
                                {" "}
                                {/* mt-auto para empujar abajo si hay espacio */}
                                <CardHeader className="bg-light">
                                    <CardTitle tag="h5" className="mb-0">
                                        Contacto
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="text-center">
                                    <p className="mb-3">
                                        Si tienes información o estás
                                        interesado:
                                    </p>
                                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                        {/* Botón WhatsApp con <i> */}
                                        {datosPublicacion.telefono && (
                                            <Button
                                                color="success"
                                                onClick={openWhatsApp}
                                                className="d-inline-flex align-items-center"
                                            >
                                                {/* Icono WhatsApp con <i> */}
                                                <i className="fab fa-whatsapp me-2"></i>{" "}
                                                WhatsApp
                                            </Button>
                                        )}
                                        {/* Botón Mail con <i> */}
                                        {datosPublicacion.mailUsuario && (
                                            <Button
                                                color="secondary"
                                                outline
                                                href={`mailto:${datosPublicacion.mailUsuario}`}
                                                className="d-inline-flex align-items-center"
                                            >
                                                {/* Icono Mail con <i> */}
                                                <i className="fas fa-envelope me-2"></i>{" "}
                                                Enviar Mail
                                            </Button>
                                        )}
                                    </div>
                                    {!datosPublicacion.telefono &&
                                        !datosPublicacion.mailUsuario && (
                                            <p className="text-danger mt-2 mb-0">
                                                No hay datos de contacto
                                                disponibles.
                                            </p>
                                        )}
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Columna Derecha: Fotos y Mapa */}
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
                                    {" "}
                                    {/* Centrar si no hay fotos */}
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
                                            } // Loop solo si hay más de 1 foto
                                            autoplay={{
                                                delay: 5000,
                                                disableOnInteraction: true,
                                            }} // Delay más largo, parar en interacción
                                            className="rounded"
                                        >
                                            {datosPublicacion.fotos.map(
                                                (
                                                    item,
                                                    index // Añadir index
                                                ) => (
                                                    <SwiperSlide
                                                        key={
                                                            item.id ||
                                                            `foto-${index}`
                                                        }
                                                    >
                                                        {" "}
                                                        {/* Mejor key */}
                                                        <img
                                                            src={
                                                                item.foto ||
                                                                placeholderImage
                                                            }
                                                            alt={`Foto ${
                                                                index + 1
                                                            } de la mascota`}
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

                            {/* Card Mapa */}
                            {datosPublicacion.latitud &&
                                datosPublicacion.longitud && (
                                    <Card className="shadow-sm">
                                        <CardHeader className="bg-light">
                                            <CardTitle
                                                tag="h5"
                                                className="mb-0"
                                            >
                                                Ubicación de Referencia
                                            </CardTitle>
                                        </CardHeader>
                                        <CardBody
                                            className="p-0"
                                            style={{ height: "350px" }}
                                        >
                                            <LeafletMaps
                                                latitud={
                                                    datosPublicacion.latitud
                                                }
                                                longitud={
                                                    datosPublicacion.longitud
                                                }
                                                isClickeable={false}
                                            />
                                        </CardBody>
                                    </Card>
                                )}
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
                                {/* Icono Volver con <i> */}
                                <i className="fas fa-arrow-left me-1"></i>{" "}
                                Volver a la lista
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </React.Fragment>
    );
};

export default ConsultPosts;
