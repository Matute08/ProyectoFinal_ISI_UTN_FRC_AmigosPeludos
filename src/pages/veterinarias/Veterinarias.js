import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Navbar from "../landing/Navbar"; // Asegúrate que la ruta sea correcta
import Footer from "../landing/Footer"; // Asegúrate que la ruta sea correcta
import Loading from "../components/Loading"; // Asegúrate que la ruta sea correcta
import { getVeterinarias } from "../../services/commonApi"; // Asegúrate que la ruta sea correcta
import VeterinariaDetalle from "./VeterinariaDetalle"; // Asegúrate que la ruta sea correcta
// Importar el MapaVeterinaria basado en Leaflet (el refactorizado)
import MapaVeterinaria from "../components/maps/MapaVeterinaria";

// Ruta al icono (para mensaje "haz clic") - Asegúrate que sea correcta
import markerIconPath from "../../assets/images/marker/marker.png";

const Veterinarias = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registeredVets, setRegisteredVets] = useState([]);
    const [selectedVeterinaria, setSelectedVeterinaria] = useState(null);

    useEffect(() => {
        const fetchVeterinarias = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getVeterinarias();
                // Filtrar veterinarias APROBADAS (estadoId 2) y con coordenadas válidas
                const vetsActivas =
                    response.data?.filter(
                        (vet) =>
                            vet.estadoId === 2 && // Asegúrate que estadoId sea el campo correcto
                            vet.latitud &&
                            vet.longitud &&
                            !isNaN(parseFloat(vet.latitud)) &&
                            !isNaN(parseFloat(vet.longitud))
                    ) || [];

                // Ordenar alfabéticamente por nombre (opcional)
                vetsActivas.sort((a, b) => a.nombre.localeCompare(b.nombre));

                setRegisteredVets(vetsActivas);
            } catch (err) {
                console.error("Error al obtener veterinarias:", err);
                setError(
                    "No se pudieron cargar las veterinarias. Inténtalo de nuevo más tarde."
                );
                setRegisteredVets([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVeterinarias();
    }, []);

    const handleMarkerSelected = (veterinaria) => {
        setSelectedVeterinaria(veterinaria);
    };

    const closeVeterinariaDetalle = () => {
        setSelectedVeterinaria(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container
                fluid
                className="page-content buscador-fondo"
                style={{
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    minHeight: "80vh",
                }}
            >
                <h1 className="text-center mb-4">Veterinarias Registradas</h1>

                {error && <p className="text-center text-danger">{error}</p>}

                <Row className="flex-grow-1" style={{ minHeight: "65vh" }}>
                    {" "}
                    {/* Columna del Mapa */}
                    <Col
                        md={12}
                        lg={8}
                        className="mb-3 mb-lg-0 "
                        style={{ height: "100%" }}
                    >
                        {" "}
                        {/* Llenar altura */}
                        {/* Renderizar el componente MapaVeterinaria refactorizado (Leaflet) */}
                        <MapaVeterinaria
                            veterinariasRegistradas={registeredVets}
                            onMarkerClick={handleMarkerSelected}
                            selectedVeterinaria={selectedVeterinaria}
                        />
                    </Col>
                    {/* Columna de Detalles */}
                    <Col
                        md={12}
                        lg={4}
                        className="d-flex flex-column veterinaria-detalle-container"
                    >
                        {selectedVeterinaria ? (
                            <>
                               
                                <VeterinariaDetalle
                                    veterinaria={selectedVeterinaria}
                                    onClose={closeVeterinariaDetalle}
                                />
                            </>
                        ) : // Mensaje si no hay veterinarias o si no se ha seleccionado ninguna
                        registeredVets.length > 0 ? (
                            <div className="text-center text-muted d-flex flex-column justify-content-center align-items-center h-100 border rounded bg-light p-3">
                                <img
                                    src={markerIconPath}
                                    alt="marcador"
                                    style={{
                                        height: "50px",
                                        marginBottom: "15px",
                                        opacity: 0.7,
                                    }}
                                />
                                <p className="lead">
                                    Selecciona una veterinaria en el mapa para
                                    ver sus detalles.
                                </p>
                            </div>
                        ) : (
                            !error && (
                                <div className="text-center text-muted d-flex flex-column justify-content-center align-items-center h-100">
                                    <p className="lead">
                                        No hay veterinarias registradas para
                                        mostrar en este momento.
                                    </p>
                                </div>
                            )
                        )}
                    </Col>
                </Row>

                {/* Botón Flotante */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "80px", // Ajustar posición
                        right: "20px",
                        zIndex: "1000",
                    }}
                    className="floating-button-container"
                >
                    <Link
                        className="Btn"
                        to={"/agregar-veterinaria"}
                        title="Registrar mi Veterinaria"
                    >
                        <div className="sign">+</div>
                        <div className="text text-center">Registrar Vete</div>
                    </Link>
                </div>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default Veterinarias;
