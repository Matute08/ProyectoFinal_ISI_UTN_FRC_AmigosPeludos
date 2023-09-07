import React, { useState, useEffect } from "react";
import {
    Card,
    Col,
    Container,
    Row,
    CardHeader,
    CardBody,
    CardFooter,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import FilterPets from "../components/FilterPets";
import LeafletMaps from "../components/maps/LeafletMaps";
import { getMascotasPublicadas } from "../../services/api";
import img from "../../assets/images/user/lucho.jpg";
import img2 from "../../assets/images/user/martin.jpg";

const Paseadores = () => {
    const navigate = useNavigate();
    const [activeCardId, setActiveCardId] = useState(null);
    const [isCardShowing, setCardShowing] = useState(false);
    const [cardsPerPage, setCardsPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * cardsPerPage;
    const firstIndex = lastIndex - cardsPerPage;
    const [showModal, setShowModal] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);

    //cambiar a true
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const updateCardsPerPage = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth > 1516) {
                setCardsPerPage(12);
            } else if (screenWidth > 1151 && screenWidth <= 1515) {
                setCardsPerPage(9);
            } else {
                setCardsPerPage(8);
            }
        };

        // Llama a la función updateCardsPerPage en el montaje inicial y cada vez que la ventana se redimensione
        updateCardsPerPage();
        window.addEventListener("resize", updateCardsPerPage);

        // Limpia el evento del listener cuando el componente se desmonte
        return () => window.removeEventListener("resize", updateCardsPerPage);
    }, []);

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar></Navbar>
                    <Container fluid className="page-content buscador-fondo">
                        {/* {publicaciones.length !== 0 ? ( */}
                        <>
                            <Row>
                                <Col className="d-flex justify-content-center mb-5">
                                    <h1>Publicaciones de Paseadores</h1>
                                </Col>
                            </Row>
                            {/* <Row className="d-flex justify-content-center ">
                                    <FilterPets
                                        cardsData={publicaciones}
                                    ></FilterPets>
                                </Row> */}

                            <Row className="d-flex justify-content-center align-items-center">
                                <Col
                                    lg={8}
                                    className="d-flex justify-content-center"
                                >
                                    <Card className="card-paseador">
                                        <Row className="g-0">
                                            <Col md={4}>
                                                <img
                                                    className=" img-paseador rounded-start img-fluid h-90 object-cover"
                                                    src={img}
                                                    alt="Card"
                                                />
                                                <h5 className="precio-paseador">
                                                    $2500 / Paseo
                                                </h5>
                                            </Col>

                                            <Col md={8}>
                                                <CardBody>
                                                    <h2 className="mb-3">
                                                        AMO A LAS MASCOTAS
                                                    </h2>
                                                    <h5 className="mb-2">
                                                        Luciano Merlo
                                                    </h5>
                                                </CardBody>

                                                <CardFooter className="card-footer">
                                                    <p className="presentacion-paseador card-text text-muted mb-0">
                                                        ¡Hola! Soy un apasionado
                                                        de los perros y un
                                                        amante de las caminatas
                                                        al aire libre. Como
                                                        paseador de perros, mi
                                                        objetivo es brindar a
                                                        tus peludos amigos la
                                                        mejor experiencia
                                                        posible mientras están
                                                        fuera de casa.
                                                        
                                                    </p>
                                                </CardFooter>
                                                <Col className="button-container d-flex justify-content-end">
                                                    <Link
                                                        to="/perfilpublico/lucianomerlo@gmail.com"
                                                        className="btn-next-paseador button-container m-3"
                                                    >
                                                        <span class="transition"></span>
                                                        <span class="gradient"></span>
                                                        <span class="label">
                                                            Ver Perfil
                                                        </span>
                                                    </Link>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="d-flex justify-content-center align-items-center">
                                <Col
                                    lg={8}
                                    className="d-flex justify-content-center"
                                >
                                    <Card className="card-paseador">
                                        <Row className="g-0">
                                            <Col md={4}>
                                                <img
                                                    className=" img-paseador rounded-start img-fluid h-90 object-cover"
                                                    src={img2}
                                                    alt="Card"
                                                />
                                                <h5 className="precio-paseador">
                                                    $2000 / Paseo
                                                </h5>
                                            </Col>

                                            <Col md={8}>
                                                <CardBody>
                                                    <h2 className="mb-3">
                                                        SOY PASEADOR
                                                    </h2>
                                                    <h5 className="mb-2">
                                                        Martin Pereira Duarte
                                                    </h5>
                                                </CardBody>

                                                <CardFooter className="card-footer">
                                                    <p className="presentacion-paseador card-text text-muted mb-0">
                                                        Estoy comprometido con
                                                        la seguridad, comodidad
                                                        y diversión de la mascota. Conmigo,
                                                        tus perros disfrutarán
                                                        de paseos emocionantes y
                                                        saludables, y podrás
                                                        tener la tranquilidad de
                                                        que están en buenas
                                                        manos. ¡Estoy listo para
                                                        hacer nuevos amigos
                                                        peludos y explorar el
                                                        mundo juntos!
                                                    </p>
                                                </CardFooter>
                                                <Col className="button-container d-flex justify-content-end">
                                                    <Link className="btn-next-paseador button-container m-3"
                                                        to="/perfilpublico/martinpereira@gmail.com"
                                                        >
                                                        <span class="transition"></span>
                                                        <span class="gradient"></span>
                                                        <span class="label">
                                                            Ver Perfil
                                                        </span>
                                                    </Link>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>

                            {/* <Row>
                                    <Col>
                                        <Pagination
                                            cardsPerPage={cardsPerPage}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalCards={publicaciones.length}
                                        ></Pagination>
                                    </Col>
                                </Row> */}
                        </>
                        {/* ) : ( */}
                        {/* <>
                                <div
                                    className="alert alert-primary w-100 d-flex justify-content-center "
                                    role="alert"
                                >
                                    <h5>No hay publicaciones aun.</h5>
                                </div>
                            </> */}
                        {/* )} */}

                        {/* boton agregar paseador  */}
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
                                    Soy Paseador
                                </div>
                            </Link>
                        </div>
                    </Container>
                    <Footer></Footer>
                </>
            ) : (
                <Loading></Loading>
            )}
        </React.Fragment>
    );
};

export default Paseadores;
