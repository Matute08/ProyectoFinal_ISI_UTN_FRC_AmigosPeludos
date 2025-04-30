import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Button, Alert, Spinner } from "reactstrap";
import Loading from "../../components/Loading"; // Asumiendo ruta correcta
import { getUserId } from "../../../services/userApi"; // Asumiendo ruta correcta
import avatarDefault from "../../../assets/images/user/user-random.jpg"; // Importar avatar por defecto (ajusta ruta)

const QrUsuario = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener los datos del usuario por ID
    const fetchUserData = useCallback(async () => {
        if (!id) {
            setError("ID de usuario no proporcionado.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await getUserId(id);
             // Asumiendo que la API devuelve { data: {...} }
            if (!response?.data) throw new Error("No se encontraron datos para este usuario.");
            setUserData(response.data);
        } catch (err) {
            console.error("Error fetching user data by ID:", err);
            setError(err.message || "Error al cargar la información.");
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); // Ejecutar cuando cambie la función (o el ID)

    // Función para abrir WhatsApp
    const openWhatsApp = () => {
        const phoneNumber = userData?.celular;
        if (!phoneNumber) {
            alert("El número de celular de este usuario no está disponible.");
            return;
        }
        // Asume formato local y añade prefijo de Argentina
        const fullPhoneNumber = `54${phoneNumber}`;
        const message = "¡Hola! Encontré a tu mascota perdida y escaneé su código QR.";
        const whatsappUrl = `https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer"); // Añadir seguridad a window.open
    };

    // Establecer título del documento
    useEffect(() => {
        if (userData?.nombreCompleto) {
            document.title = `Contacto de ${userData.nombreCompleto} | Amigos Peludos`;
        } else {
            document.title = "Datos de Contacto | Amigos Peludos";
        }
    }, [userData]);


    // --- Renderizado ---

    if (isLoading) {
        return <Loading />;
    }

    return (
        <React.Fragment>
             {/* Se puede añadir un Navbar/Footer simple si esta página es pública */}
             {/* <NavbarSimple /> */}
            <Container className="mt-4 mb-4">
                {error && <Alert color="danger">{error}</Alert>}

                {userData ? (
                    <Card className="shadow-sm">
                        <CardBody>
                            <Row className="align-items-center text-center text-md-start">
                                <Col xs="12" md="4" className="mb-3 mb-md-0 text-center">
                                    <img
                                        // Usar foto del usuario o avatar por defecto
                                        src={userData.foto || avatarDefault}
                                        alt={`Foto de ${userData.nombreCompleto}`}
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                         onError={(e) => { if (e.target.src !== avatarDefault) { e.target.onerror = null; e.target.src = avatarDefault; } }}
                                    />
                                </Col>
                                <Col xs="12" md="8">
                                    <h2 className="mb-3">
                                        ¡Hola! Pertenezco a <span className="fw-bold">{userData.nombreCompleto}</span>
                                    </h2>
                                    {/* Mostrar dirección solo si ambos campos existen */}
                                    {(userData.calle || userData.nroCalle) && (
                                        <p className="lead mb-3">
                                            <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                                            Mi domicilio es: {`${userData.calle || ''} ${userData.nroCalle || ''}`.trim()}
                                        </p>
                                    )}
                                    <p className="text-muted">Si me encontraste, por favor contacta a mi dueño.</p>
                                    <Button
                                        color="success"
                                        onClick={openWhatsApp}
                                        disabled={!userData.celular} // Deshabilitar si no hay celular
                                        className="mt-2"
                                        size="lg"
                                    >
                                        <i className="fab fa-whatsapp me-2"></i>Contactar por WhatsApp
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                ) : (
                     // Mensaje si no hay error pero tampoco datos (después de cargar)
                     !error && <Alert color="warning">No se pudo cargar la información del usuario.</Alert>
                )}
            </Container>
             {/* <FooterSimple /> */}
        </React.Fragment>
    );
};

export default QrUsuario;