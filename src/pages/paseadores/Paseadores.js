import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import FilterPets from "../components/FilterPets";
import LeafletMaps from "../components/maps/LeafletMaps";
import { getMascotasPublicadas } from "../../services/api";
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


    // Dentro de la función useEffect
    useEffect(() => {
        const fetchPublicData = async () => {
            const publicData = await getMascotasPublicadas("Adopcion");
            // Ordenar las publicaciones por fecha de forma descendente (de la más reciente a la más antigua)
            const sortedPublicaciones = publicData.sort(
                (a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta)
            );
            setPublicaciones(sortedPublicaciones);
            setIsLoading(false);
        };
        console.log(publicaciones);
        fetchPublicData();
    }, []);

    const handleClick = (id) => {
        if (activeCardId === id) {
            setActiveCardId(null); // Cerrar la tarjeta si se hace clic en la misma tarjeta nuevamente
            setCardShowing(false);
        } else {
            setActiveCardId(id);
            setCardShowing(true);
        }
    };

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

    const handleCloseModal = () => setShowModal(false);
    const handleOpenModal = () => setShowModal(true);

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
                                        <h1>
                                            Publicaciones de Paseadores
                                        </h1>
                                    </Col>
                                </Row>
                                {/* <Row className="d-flex justify-content-center ">
                                    <FilterPets
                                        cardsData={publicaciones}
                                    ></FilterPets>
                                </Row> */}

                                

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

                        {/* boton agregar mascota  */}
                        <div
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
                                zIndex: "9999",
                            }}
                            className="floating-button-container"
                        >
                            <Link
                                className="Btn"
                                to={"/agregar-paseador"}
                            >
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
