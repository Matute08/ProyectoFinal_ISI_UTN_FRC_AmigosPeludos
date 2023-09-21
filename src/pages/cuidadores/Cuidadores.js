import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Col,
    Container,
    Row,
    CardHeader,
    CardBody,
    CardFooter,
} from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Loading from "../components/Loading";
import { getPaseador } from "../../services/api";
import img from "../../assets/images/user/user-random.jpg"

const Cuidadores = () => {
    const navigate = useNavigate();
    const [paseadores, setPaseadores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPaseadores = async () => {
            try {
                const dataPaseador = await getPaseador();
                setPaseadores(dataPaseador);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener paseadores:", error);
            }

            console.log(paseadores);
        };

        fetchPaseadores();
    }, []);

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <Row>
                            <Col className="d-flex justify-content-center mb-5 text-center">
                                <h1>Publicaciones de Cuidadores</h1>
                            </Col>
                        </Row>

                        <Row className="d-flex justify-content-center align-items-center">
                            {paseadores.length > 0 ? (
                                // Renderizar la lista de paseadores si hay al menos uno
                                paseadores.map((paseador) => (
                                    <Col
                                        lg={8}
                                        className="mb-4"
                                        key={paseador.id}
                                    >
                                        <Card className="card-paseador">
                                            <Row className="g-0">
                                                <Col md={4}>
                                                    {paseador.datosUsuario &&
                                                    paseador.datosUsuario
                                                        .foto ? (
                                                        <img
                                                            className="img-paseador rounded-start img-fluid h-90 object-cover"
                                                            src={
                                                                paseador
                                                                    .datosUsuario
                                                                    .foto
                                                            }
                                                            alt="Card"
                                                        />
                                                    ) : (
                                                        <img
                                                            className="img-paseador rounded-start img-fluid h-90 object-cover"
                                                            src={img}
                                                            alt="Imagen por defecto"
                                                        />
                                                    )}
                                                    <h5 className="precio-paseador">
                                                        ${paseador.precioPaseo}{" "}
                                                        / Paseo
                                                    </h5>
                                                </Col>

                                                <Col md={8}>
                                                    <CardBody>
                                                        <h2 className="mb-3">
                                                            {paseador.titulo}
                                                        </h2>
                                                        <h5 className="mb-2">
                                                            {paseador.datosUsuario &&
                                                            paseador
                                                                .datosUsuario
                                                                .nombreCompleto
                                                                ? paseador
                                                                      .datosUsuario
                                                                      .nombreCompleto
                                                                : "Nombre no disponible"}
                                                        </h5>
                                                    </CardBody>

                                                    <CardFooter className="card-footer">
                                                        <p className="presentacion-paseador card-text text-muted mb-0">
                                                            {
                                                                paseador.presentacion
                                                            }
                                                        </p>
                                                    </CardFooter>
                                                    <Col className="button-container d-flex justify-content-end">
                                                        {paseador.datosUsuario &&
                                                        paseador.datosUsuario
                                                            .mail ? (
                                                            <Link
                                                                to={`/perfilpublico/${paseador.datosUsuario.mail}/${paseador.id}`}
                                                                className="btn-next-paseador button-container m-3"
                                                            >
                                                                <span className="transition"></span>
                                                                <span className="gradient"></span>
                                                                <span className="label">
                                                                    Ver Perfil
                                                                </span>
                                                            </Link>
                                                        ) : (
                                                            <p>
                                                                No hay correo
                                                                electrónico
                                                                disponible
                                                            </p>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                // Mostrar un mensaje si no hay cuidadores
                                <div
                                    className="alert alert-primary w-75"
                                    role="alert"
                                >
                                    <h5>No Hay Cuidadores Registrados.</h5>
                                </div>
                            )}
                        </Row>

                        {/* Botón agregar paseador */}
                        <div
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
                                zIndex: "9999",
                            }}
                            className="floating-button-container"
                        >
                            <Link className="Btn" to="/agregar-paseador">
                                <div className="sign">+</div>
                                <div className="text text-center">
                                    Soy Cuidador
                                </div>
                            </Link>
                        </div>
                    </Container>
                    <Footer />
                </>
            ) : (
                <Loading />
            )}
        </React.Fragment>
    );
};

export default Cuidadores;
