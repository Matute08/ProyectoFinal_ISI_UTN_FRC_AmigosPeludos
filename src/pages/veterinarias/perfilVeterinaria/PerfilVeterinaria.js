import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, CardText, Button, Spinner, Alert, ListGroup, ListGroupItem, Badge } from "reactstrap"; // Añadir componentes
import Footer from "../../landing/Footer";
import Loading from "../../components/Loading";
import Navbar from "../../landing/Navbar";
import { getVeterinariaId } from "../../../services/commonApi"; // Ajusta la ruta
import { useParams, useNavigate } from "react-router-dom"; // useNavigate para botón "Volver"
import { RiMapPinLine, RiPhoneLine, RiTimeLine, RiWhatsappLine, RiBankCardLine, RiHandHeartLine, RiFingerprintLine, RiArrowGoBackLine } from 'react-icons/ri'; // Importar iconos necesarios


// Importaciones de imágenes de servicios (mantener como antes)
import guardia from "../../../assets/images/servicesVet/24hs.jpeg";
import castra from "../../../assets/images/servicesVet/castracion_1.jpg";
import eco from "../../../assets/images/servicesVet/ecografia.png";
import emerg from "../../../assets/images/servicesVet/emergencia.jpg";
import obser from "../../../assets/images/servicesVet/observacion.png";
import opera from "../../../assets/images/servicesVet/operacion_1.jpg";
import radio from "../../../assets/images/servicesVet/radiografia.jpg";
import sangre from "../../../assets/images/servicesVet/sangre.jpg";
import vacuna from "../../../assets/images/servicesVet/vacunacion.jpg";
import otros from "../../../assets/images/servicesVet/otros.jpg";

// Mercado Pago (mantener si se usa)
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

// --- Configuración de Imágenes y Nombres de Servicios ---
const servicioInfo = {
    castraciones: { img: castra, nombre: "Castraciones" },
    internaciones: { img: opera, nombre: "Internaciones" }, // Asumiendo opera para internaciones
    vacunaciones: { img: vacuna, nombre: "Vacunaciones" },
    equipoLaboratorio: { img: sangre, nombre: "Laboratorio" }, // Nombre más corto
    radiografias: { img: radio, nombre: "Radiografías" },
    ecografias: { img: eco, nombre: "Ecografías" },
    guardia24hs: { img: guardia, nombre: "Guardia 24hs" },
    emergencias: { img: emerg, nombre: "Emergencias" }, // Nombre más corto
    observaciones: { img: obser, nombre: "Observaciones" },
    otros: { img: otros, nombre: "Otros Servicios" }, // Nombre genérico
};

// Helper para formatear horarios (mejorado)
const formatHorarioSimple = (horarioStr) => {
     if (!horarioStr || typeof horarioStr !== 'string' || horarioStr.toLowerCase() === 'cerrado') {
         return <Badge color="secondary" pill>Cerrado</Badge>;
     }
     // Reemplazar descripciones largas por etiquetas cortas
     return horarioStr
         .replace(/Turno mañana desde /gi, "Mañana: ")
         .replace(/Turno tarde desde /gi, "Tarde: ")
         .replace(/ y /gi, " / "); // Separador más corto
};

const PerfilVeterinaria = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [veterinaria, setVeterinaria] = useState(null);
    const [error, setError] = useState(null);
    const { idVete } = useParams();
    const navigate = useNavigate(); // Para botón "Volver"

    // --- Estado Mercado Pago ---
    const [showDonationInput, setShowDonationInput] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [isCreatingPreference, setIsCreatingPreference] = useState(false);

    // --- Efectos (Fetch Data, Init MP) ---
    useEffect(() => {
        // Función Fetch
        const fetchVeterinaria = async () => {
            // ... (lógica fetch sin cambios, solo usar setVeterinaria) ...
             setIsLoading(true);
             setError(null);
             try {
                 const response = await getVeterinariaId(idVete);
                 if (response.data && response.data.estadoId === 2) {
                    setVeterinaria(response.data);
                 } else {
                    setError("No se encontró la veterinaria o no está disponible.");
                    setVeterinaria(null);
                 }
             } catch (err) {
                 console.error("Error al obtener la veterinaria:", err);
                 setError("No se pudo cargar la información de la veterinaria.");
                 setVeterinaria(null);
             } finally {
                 setIsLoading(false);
             }
        };
        fetchVeterinaria();
    }, [idVete]);

    useEffect(() => {
        // Inicializar MP solo si hay datos y CBU/Alias
        if (veterinaria && (veterinaria.cbu || veterinaria.alias)) {
             // USA TU PUBLIC KEY DE PRODUCCIÓN O TEST SEGÚN CORRESPONDA
            initMercadoPago("TEST-8ad7c3f4-f218-474f-a719-2d5600b8253d", { locale: 'es-AR' });
        }
    }, [veterinaria]);

    // --- Handlers (WhatsApp, MP) ---
    const openWhatsApp = () => {
        // ... (lógica WhatsApp sin cambios) ...
         if (!veterinaria?.numeroTelefono) return;
         const phoneNumber = veterinaria.numeroTelefono;
         const message = `¡Hola ${veterinaria.nombre}! Vi tu perfil en Amigos Peludos.`;
         const whatsappUrl = `https://wa.me/54${phoneNumber}?text=${encodeURIComponent(message)}`;
         window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleDonationToggle = () => {
        setShowDonationInput(!showDonationInput);
        setPreferenceId(null); // Resetear preferencia al mostrar/ocultar
        setDonationAmount(''); // Limpiar monto
    };

    const createPreference = async () => {
       // ... (lógica createPreference sin cambios) ...
        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            alert("Por favor, ingrese un monto válido para la donación.");
            return null;
        }
        setIsCreatingPreference(true);
        try {
            const response = await axios.post(
                 "https://amigospeludos.azurewebsites.net/api/MercadoPago/create_preference", // TU ENDPOINT BACKEND
                {
                    title: `Donación para ${veterinaria?.nombre || 'Veterinaria'}`,
                    unit_price: parseFloat(donationAmount),
                    quantity: 1,
                    back_urls: { success: window.location.href, failure: window.location.href, pending: window.location.href },
                    auto_return: "approved",
                    // notification_url: "TU_WEBHOOK" // Si usas
                }
            );
            return response.data.id;
        } catch (error) {
            console.error("Error creando preferencia de Mercado Pago:", error);
            alert("Error al iniciar el proceso de donación. Inténtalo de nuevo.");
            return null;
        } finally {
            setIsCreatingPreference(false);
        }
    };

    const handleBuy = async () => {
        // ... (lógica handleBuy sin cambios) ...
         const id = await createPreference();
         if (id) {
             setPreferenceId(id);
         }
    };

    // --- Renderizado ---

    if (isLoading) return <Loading />;

    if (error || !veterinaria) {
        return (
            <React.Fragment>
                <Navbar />
                <Container className="page-content my-5 text-center d-flex flex-column justify-content-center align-items-center" style={{minHeight: '60vh'}}>
                    <Alert color="danger">{error || "No se encontró la información de la veterinaria."}</Alert>
                    <Button color="secondary" onClick={() => navigate('/veterinarias')}><RiArrowGoBackLine className="me-1"/> Volver a Veterinarias</Button>
                </Container>
                <Footer />
            </React.Fragment>
        );
    }

    // -- Renderizado Principal (Veterinaria encontrada) --
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const horariosKeys = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];


    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content perfil-fondo pt-4 pb-5">

                {/* --- Encabezado --- */}
                <Row className="mb-4 align-items-center">
                    <Col>
                        <h1 className="text-center display-5 fw-bold text-primary">
                            {veterinaria.nombre}
                        </h1>
                    </Col>
                </Row>

                {/* --- Foto Principal (si existe) --- */}
                {veterinaria.foto && (
                    <Row className="mb-4 justify-content-center">
                        <Col xs={12} md={10} lg={8} xl={6}>
                            <img
                                src={veterinaria.foto}
                                alt={`Foto ${veterinaria.nombre}`}
                                className="img-fluid rounded shadow"
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </Col>
                    </Row>
                )}

                {/* --- Fila Principal: Contacto y Horarios --- */}
                <Row className="justify-content-center mb-4 gx-lg-4 "> {/* gx aumenta gutter en lg */}
                    {/* Columna Contacto y Acciones */}
                    <Col lg={5} md={6} className="mb-4 mb-md-0">
                        <Card className="h-100 shadow-sm">
                            <CardHeader className="bg-light">
                                <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
                                    <RiMapPinLine className="me-2 text-info" /> Información y Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="mb-3">
                                    <strong className="d-block text-muted">Dirección:</strong>
                                    <span>{veterinaria.direccion} {veterinaria.numeroCalle}</span>
                                </div>
                                {veterinaria.numeroTelefono && (
                                    <div className="mb-3">
                                        <strong className="d-block text-muted">Teléfono:</strong>
                                        <span>{veterinaria.numeroTelefono}</span>
                                         <Button color="success" outline size="sm" onClick={openWhatsApp} className="ms-2 d-inline-flex align-items-center">
                                            <RiWhatsappLine className="me-1"/> WhatsApp
                                         </Button>
                                    </div>
                                )}
                                {veterinaria.cuil && (
                                    <div className="mb-3">
                                        <strong className="d-block text-muted"><RiFingerprintLine className="me-1"/> CUIT:</strong>
                                        <span>{veterinaria.cuil}</span>
                                    </div>
                                )}

                                {/* Sección Donaciones */}
                                {(veterinaria.cbu || veterinaria.alias) && (
                                    <div className="mt-4 pt-3 border-top">
                                        <h6 className="d-flex align-items-center text-danger">
                                            <RiHandHeartLine className="me-2"/> ¿Quieres apoyar a esta veterinaria?
                                        </h6>
                                        {veterinaria.cbu && <p className="ms-2 mb-1 small"><strong>CBU:</strong> {veterinaria.cbu}</p>}
                                        {veterinaria.alias && <p className="ms-2 mb-1 small"><strong>Alias:</strong> {veterinaria.alias}</p>}

                                        <Button color="info" size="sm" outline onClick={handleDonationToggle} className="mt-2 d-inline-flex align-items-center">
                                            <RiBankCardLine className="me-1"/> {showDonationInput ? 'Cancelar Donación MP' : 'Donar con Mercado Pago'}
                                        </Button>

                                        {showDonationInput && (
                                            <div className="mt-3 p-3 border rounded bg-light">
                                                <label className="form-label fw-bold small">Monto a donar (ARS):</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm mb-2"
                                                    value={donationAmount}
                                                    onChange={(e) => { setDonationAmount(e.target.value); setPreferenceId(null);}}
                                                    placeholder="Ej: 500"
                                                    min="1"
                                                />
                                                {!preferenceId ? (
                                                    <Button
                                                        color="primary"
                                                        size="sm"
                                                        onClick={handleBuy}
                                                        disabled={isCreatingPreference || !donationAmount || parseFloat(donationAmount) <= 0}
                                                        className="w-100"
                                                    >
                                                        {isCreatingPreference ? <Spinner size="sm" /> : 'Pagar con Mercado Pago'}
                                                    </Button>
                                                ) : (
                                                    <div className="mt-2 wallet-container"> {/* Añadir clase para posible estilo */}
                                                         <Wallet initialization={{ preferenceId: preferenceId }} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Columna Horarios */}
                    <Col lg={5} md={6}>
                        <Card className="h-100 shadow-sm">
                             <CardHeader className="bg-light">
                                <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
                                     <RiTimeLine className="me-2 text-info"/> Horarios de Atención
                                </CardTitle>
                             </CardHeader>
                             <CardBody>
                                {/* Usar ListGroup para mejor presentación */}
                                <ListGroup flush>
                                    {horariosKeys.map((key, index) => (
                                        <ListGroupItem key={key} className="d-flex justify-content-between align-items-center px-0">
                                            <strong>{diasSemana[index]}:</strong>
                                            <span>{formatHorarioSimple(veterinaria.horarios?.[key])}</span>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                             </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* --- Sección Servicios --- */}
                <Row className="justify-content-center mb-4">
                    <Col xs={12}>
                        <h2 className="text-center mb-4 display-6">Servicios Ofrecidos</h2>
                    </Col>
                     {/* Renderizar tarjetas de servicio */}
                     {Object.entries(veterinaria.servicios || {})
                        .filter(([key, value]) => servicioInfo[key] && key !== 'otros' && value === true) // Filtrar activos y mapeados (excluir otros)
                        .map(([key, value]) => {
                            const info = servicioInfo[key];
                            return (
                                <Col key={key} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
                                    <Card className="h-100 w-100 text-center shadow-sm service-card"> {/* Añadir clase para hover */}
                                        {info.img && (
                                            <div className="d-flex justify-content-center align-items-center p-3" style={{ height: '150px', overflow: 'hidden' }}>
                                                <CardTitle tag="h5" className="service-card-title">{info.nombre}</CardTitle> {/* Título superpuesto */}
                                                <img
                                                    src={info.img}
                                                    alt={info.nombre}
                                                    className="card-img-top service-card-img" // Clase para efecto hover
                                                    style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', objectFit: 'cover', zIndex: 1, transition: 'opacity 0.3s ease' }}
                                                 />
                                            </div>
                                        )}
                                         {/* Quitar CardBody si solo es título sobre imagen */}
                                    </Card>
                                </Col>
                            );
                        })}
                </Row>

                {/* --- Sección Otros Servicios --- */}
                {veterinaria.servicios?.otros && (
                    <Row className="justify-content-center mb-5">
                         <Col md={10} lg={8}>
                              <Card className="shadow-sm">
                                 <CardHeader className="bg-secondary text-white"><h5 className="mb-0">{servicioInfo['otros']?.nombre || 'Otros Servicios'}</h5></CardHeader>
                                  <CardBody>
                                      <CardText>{veterinaria.servicios.otros}</CardText>
                                  </CardBody>
                              </Card>
                         </Col>
                    </Row>
                )}

                 {/* --- Botón Volver --- */}
                  <Row className="mt-4 text-center">
                       <Col>
                           <Button color="secondary" onClick={() => navigate('/veterinarias')}>
                               <RiArrowGoBackLine className="me-1"/> Volver al Listado
                           </Button>
                       </Col>
                  </Row>

            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default PerfilVeterinaria;


