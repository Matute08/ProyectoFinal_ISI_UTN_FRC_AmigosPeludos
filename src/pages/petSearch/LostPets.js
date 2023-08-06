import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import FilterPets from "../components/FilterPets";
import { useNavigate } from "react-router-dom";
import LeafletMaps from "../components/maps/LeafletMaps";
import { getPublicaciones } from "../../services/api";
const LostPets = () => {
    const navigate = useNavigate();
    const [activeCardId, setActiveCardId] = useState(null);
    const [isCardShowing, setCardShowing] = useState(false);
    const [cardsPerPage, setCardsPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * cardsPerPage;
    const firstIndex = lastIndex - cardsPerPage;
    const [showModal, setShowModal] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dentro de la función useEffect
    useEffect(() => {
        const fetchPublicData = async () => {
            const publicData = await getPublicaciones();
            // Ordenar las publicaciones por fecha de forma descendente (de la más reciente a la más antigua)
            const sortedPublicaciones = publicData.sort(
                (a, b) => new Date(a.fechaAlta) - new Date(b.fechaAlta)
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
                        {publicaciones.length !== 0 ? (
                            <>
                                <Row>
                                    <Col className="d-flex justify-content-center mb-5">
                                        <h1>
                                            Publicaciones de Mascotas Perdidas
                                        </h1>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center ">
                                    <FilterPets
                                        cardsData={publicaciones}
                                    ></FilterPets>
                                </Row>

                                <Row>
                                    <Col>
                                        <div
                                            className={` container-cards ${
                                                isCardShowing ? "showing" : ""
                                            }`}
                                        >
                                            {publicaciones &&
                                                publicaciones
                                                    .map((elemento) => (
                                                        <div
                                                            key={elemento.id}
                                                            className={`card-pets ${
                                                                activeCardId ===
                                                                elemento.id
                                                                    ? "show"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleClick(
                                                                    elemento.id
                                                                )
                                                            }
                                                        >
                                                            <div className="card__image-holder">
                                                                {elemento &&
                                                                    elemento.fotos &&
                                                                    elemento
                                                                        .fotos
                                                                        .length >
                                                                        0 && (
                                                                        <img
                                                                            key={
                                                                                elemento
                                                                                    .fotos[0]
                                                                                    .id
                                                                            }
                                                                            className="card__image"
                                                                            src={
                                                                                elemento
                                                                                    .fotos[0]
                                                                                    .foto
                                                                            }
                                                                            alt="Imagen de la publicación"
                                                                        />
                                                                    )}
                                                            </div>

                                                            <div className="card-title">
                                                                <a
                                                                    className="toggle-info btn-card"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation(); // Evitar que el clic se propague al elemento de la tarjeta
                                                                        handleClick(
                                                                            elemento.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <span className="span-card span-left"></span>
                                                                    <span className="span-card span-right"></span>
                                                                </a>
                                                                <h2 className="titulo-card">
                                                                    {
                                                                        elemento.nombre
                                                                    }
                                                                    <p className="texto-card">
                                                                        Perdido
                                                                        desde el{" "}
                                                                        {new Date(
                                                                            elemento.fechaPerdida
                                                                        ).toLocaleDateString(
                                                                            "es-ES",
                                                                            {
                                                                                day: "2-digit",
                                                                                month: "2-digit",
                                                                                year: "numeric",
                                                                            }
                                                                        )}
                                                                    </p>
                                                                </h2>
                                                            </div>
                                                            <div className="card-flap flap1">
                                                                <div className="card-description">
                                                                    {
                                                                        elemento.descripcion
                                                                    }
                                                                </div>
                                                                <div className="card-flap flap2">
                                                                    <div className="card-actions">
                                                                        <Link
                                                                            class="learn-more button-learn-more"
                                                                            to={`/consultar-posteo/${elemento.id}`}
                                                                        >
                                                                            <span
                                                                                class="circle"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <span class="icon arrow"></span>
                                                                            </span>
                                                                            <span class="button-text">
                                                                                Ver
                                                                                Mas
                                                                            </span>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                    .slice(
                                                        firstIndex,
                                                        lastIndex
                                                    )}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Pagination
                                            cardsPerPage={cardsPerPage}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalCards={publicaciones.length}
                                        ></Pagination>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                <div
                                    className="alert alert-primary w-100 d-flex justify-content-center "
                                    role="alert"
                                >
                                    <h5>No hay publicaciones aun.</h5>
                                </div>
                            </>
                        )}

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
                                to={"/registrar-mascota-perdida"}
                            >
                                <div className="sign">+</div>
                                <div className="text text-center">
                                    Crear Posteo
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

export default LostPets;
