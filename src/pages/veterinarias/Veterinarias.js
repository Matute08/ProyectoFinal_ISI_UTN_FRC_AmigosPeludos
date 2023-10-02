import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label } from "reactstrap";
import { Link } from "react-router-dom";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Loading from "../components/Loading";
//import MapaVeterinaria from "./MapaVeterinarias";
import { getVeterinarias } from "../../services/api";
import VeterinariaDetalle from "./VeterinariaDetalle";
import MapaVeterinaria from "../components/maps/MapaVeterinaria";
const Veterinarias = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cityQuery, setCityQuery] = useState("");
    const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
    const [veterinarias, setVeterinarias] = useState("");
    const [selectedVeterinaria, setSelectedVeterinaria] = useState(null);

    const handleCityChange = (e) => {
        setCityQuery(e.target.value);
    };

    const handleNeighborhoodChange = (e) => {
        setNeighborhoodQuery(e.target.value);
    };

    useEffect(() => {
        const fetchVeterinarias = async () => {
            try {
                const dataVeterinarias = await getVeterinarias();
                setVeterinarias(dataVeterinarias);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener veterinarias:", error);
            }
        };
        console.log(selectedVeterinaria);
        fetchVeterinarias();
    }, []);
    const showVeterinariaDetalle = (veterinaria) => {
        setSelectedVeterinaria(veterinaria);
      };
      

    // Función para cerrar el detalle de la veterinaria
    const closeVeterinariaDetalle = () => {
        setSelectedVeterinaria(null);
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <h1 className="text-center mb-5">Veterinarias</h1>

                        {/* <Row className="filtros-veterinarias-container w-50">
                            <Col md={6}>
                                <input
                                    type="text"
                                    className="form-control filtros-veterinarias"
                                    placeholder="Escribe la ciudad"
                                    value={cityQuery}
                                    onChange={handleCityChange}
                                />
                            </Col>
                            <Col md={6}>
                                <input
                                    type="text"
                                    className="form-control filtros-veterinarias"
                                    placeholder="Escribe el barrio"
                                    value={neighborhoodQuery}
                                    onChange={handleNeighborhoodChange}
                                />
                            </Col>
                        </Row> */}

                        <Row>
                            <Col md={12} lg={8} style={{ minHeight: "500px" }}>
                                {/* Añade un margen inferior al contenedor del mapa */}
                                <div style={{ marginBottom: "60px"}}>
                                    <MapaVeterinaria 
                                        ciudad={cityQuery}
                                        barrio={neighborhoodQuery}
                                        onMarkerClick={(marker) =>
                                            showVeterinariaDetalle(marker)
                                        }
                                    />
                                </div>
                            </Col>
                            <Col
                                md={12}
                                lg={4}
                                style={{ minHeight: "500px" }}
                                className="veterinaria-detalle-container"
                            >
                                <h3 className="text-center mt-2">
                                    Veterinarias Registradas
                                </h3>
                                {/* Mostrar los detalles de la veterinaria seleccionada */}
                                <VeterinariaDetalle
                                    veterinaria={selectedVeterinaria}
                                    onClose={closeVeterinariaDetalle}
                                />
                            </Col>
                        </Row>

                        {/* Boton para agregar veterinaria */}
                        <div
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
                                zIndex: "9999",
                            }}
                            className="floating-button-container"
                        >
                            <Link className="Btn" to={"/agregar-veterinaria"}>
                                <div className="sign">+</div>
                                <div className="text text-center">
                                    Registrar
                                </div>
                            </Link>
                        </div>
                    </Container>

                    {/* Establece un margen superior para el footer */}
                    <Footer style={{ marginTop: "60px" }} />
                </>
            ) : (
                <Loading />
            )}
        </React.Fragment>
    );
};

export default Veterinarias;
