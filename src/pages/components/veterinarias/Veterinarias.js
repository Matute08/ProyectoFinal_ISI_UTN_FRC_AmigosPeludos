import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import Loading from "../Loading";
import MapaVeterinarias from "./MapaVeterinarias";

const Veterinarias = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cityQuery, setCityQuery] = useState("");
    const [neighborhoodQuery, setNeighborhoodQuery] = useState("");

    const handleCityChange = (e) => {
        setCityQuery(e.target.value);
    };

    const handleNeighborhoodChange = (e) => {
        setNeighborhoodQuery(e.target.value);
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <h1 className="text-center">Veterinarias</h1>
                        <Row>
                            <Col md={8} sm={12}>
                                <div className="filtros-veterinarias-container">
                                    <input
                                        type="text"
                                        className="form-control filtros-veterinarias"
                                        placeholder="Escribe la ciudad"
                                        value={cityQuery}
                                        onChange={handleCityChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control filtros-veterinarias"
                                        placeholder="Escribe el barrio"
                                        value={neighborhoodQuery}
                                        onChange={handleNeighborhoodChange}
                                    />
                                </div>
                                <MapaVeterinarias
                                    ciudad={cityQuery}
                                    barrio={neighborhoodQuery}
                                />
                            
                            </Col>

                            <Col md={4} sm={12}>
                                <h1>VETERINARIAS REGISTRADAS</h1>
                            </Col>
                        </Row>

                   

                         {/* boton agregar veterinaria  */}
                         <div
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
                                zIndex: "9999",
                            }}
                            className="floating-button-container"
                        >
                            <Link className="Btn" to={"/agregar-paseador"}>
                                <div className="sign">+</div>
                                <div className="text text-center">
                                    Registrar
                                </div>
                            </Link>
                        </div>
                    </Container>
                    <Footer  />
                </>
            ) : (
                <Loading />
            )}
        </React.Fragment>
    );
};

export default Veterinarias;
