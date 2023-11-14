import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import FilterPets from "../../components/FilterPets";
import { useNavigate } from "react-router-dom";
import LeafletMaps from "../../components/maps/LeafletMaps";
import { getMascotasPublicadas, getTipoMascota,getSexoMascota,getCiudad,getAllBarrio } from "../../../services/api";
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

    const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
    const [filtroTipoMascota, setFiltroTipoMascota] = useState("");
    const [filtroSexo, setFiltroSexo] = useState("");
    const [filtroBarrio, setFiltroBarrio] = useState("");
    const [tiposMascota, setTiposMascota] = useState([]);
    const [sexo, setSexo] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [filtroCiudad, setFiltroCiudad] = useState("");


    useEffect(() => {
        const cargarListasFiltros = async () => {
            const tiposMascotaData = await getTipoMascota();
            setTiposMascota(tiposMascotaData);

          
            const sexoData = await getSexoMascota();
            setSexo(sexoData);

            const ciudadesData = await getCiudad();
            setCiudades(ciudadesData);

            const barriosData = await getAllBarrio();
            setBarrios(barriosData);
        };
        cargarListasFiltros();
    }, []);

    // Dentro de la función useEffect
    useEffect(() => {
        const fetchPublicData = async () => {
            const publicData = await getMascotasPublicadas("Perdida");
            // Ordenar las publicaciones por fecha de forma descendente (de la más reciente a la más antigua)
            const sortedPublicaciones = publicData.sort(
                (a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta)
            );
            setPublicaciones(sortedPublicaciones);
            setPublicacionesFiltradas(sortedPublicaciones);
            setIsLoading(false);
        };
        console.log(publicaciones);
        fetchPublicData();
    }, []);


    const handleLimpiarFiltros = () => {
        setFiltroTipoMascota("");
        setFiltroBarrio("");
        setPublicacionesFiltradas(publicaciones);
    };
    const aplicarFiltros = () => {
        let publicacionesFiltradasCopy = [...publicaciones]; // Copia del estado original

        // Filtrar por tipo de mascota
        if (filtroTipoMascota) {
            publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
                (publicacion) =>
                    publicacion.tipoMascotaNombre === filtroTipoMascota
            );
        }

        // Filtrar por barrio
        if (filtroBarrio) {
            console.log(filtroBarrio);
            publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
                (publicacion) =>
                    publicacion.barrioId === parseInt(filtroBarrio, 10)
            );
        }

        // Filtrar por sexo
        if (filtroSexo) {
          console.log(filtroSexo);
          publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
              (publicacion) =>
                  publicacion.sexoId === parseInt(filtroSexo, 10)
          );
      }

        // Actualizar el estado de las publicaciones filtradas
        setPublicacionesFiltradas(publicacionesFiltradasCopy);
    };

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
                                    <Col className="d-flex justify-content-center text-center mb-5">
                                        <h1>
                                            Publicaciones de Mascotas Perdidas
                                        </h1>
                                    </Col>
                                </Row>

                                <Row
                                    className={`d-flex justify-content-center `}
                                >
                                    <Col lg={2}>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Tipo de mascota:
                                            </label>
                                            <select
                                                className="form-select"
                                                value={filtroTipoMascota}
                                                onChange={(e) =>
                                                    setFiltroTipoMascota(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Seleccione...
                                                </option>
                                                {tiposMascota.map((tipo) => (
                                                    <option
                                                        key={tipo.id}
                                                        value={tipo.tipo}
                                                        className="form-control"
                                                    >
                                                        {tipo.tipo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>

                                    <Col lg={2}>
                                        <div className="mb-3">
                                            <label>Barrio:</label>
                                            <select
                                                name="barrio"
                                                className="form-select"
                                                value={filtroBarrio}
                                                onChange={(e) =>
                                                    setFiltroBarrio(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Seleccione...
                                                </option>
                                                {barrios.map((elemento) => (
                                                    <option
                                                        className="form-control"
                                                        key={elemento.id}
                                                        value={elemento.id}
                                                    >
                                                        {elemento.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>

                                    <Col lg={2}>
                                        <div className="mb-3">
                                            <label>Sexo:</label>
                                            <select
                                                name="sexo"
                                                className="form-select"
                                                value={filtroSexo}
                                                onChange={(e) =>
                                                    setFiltroSexo(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Seleccione...
                                                </option>
                                                {sexo.map((elemento) => (
                                                    <option
                                                        className="form-control"
                                                        key={elemento.id}
                                                        value={elemento.id}
                                                    >
                                                        {elemento.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>

                                    <Col lg={2}>
                                        <div className="button-filter w-100 d-flex justify-content-center">
                                            <button
                                                className="btn btn-success mt-2 acept"
                                                onClick={aplicarFiltros}
                                            >
                                                Aplicar
                                            </button>
                                            <button
                                                className="btn btn-danger mt-2 clean"
                                                onClick={handleLimpiarFiltros}
                                            >
                                                Limpiar
                                            </button>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        {publicacionesFiltradas.length > 0 ? (
                                            <div
                                                className={` container-cards ${
                                                    isCardShowing
                                                        ? "showing"
                                                        : ""
                                                }`}
                                            >
                                                {publicacionesFiltradas
                                                    .map((elemento) => (
                                                        <div key={elemento.id}>
                                                            <div class="card ">
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
                                                                            src={
                                                                                elemento
                                                                                    .fotos[0]
                                                                                    .foto
                                                                            }
                                                                            alt="Imagen de la publicación"
                                                                            class="card-img-top card__image"
                                                                        />
                                                                    )}

                                                                <div class="card-body">
                                                                    <div className="card-pets ">
                                                                        <div className="card-title">
                                                                            <h2 className="titulo-card ">
                                                                                {elemento.nombre
                                                                                    ? elemento.nombre
                                                                                    : "-"}
                                                                                <p className="texto-card">
                                                                                    Desde:{" "}
                                                                                    {new Date(
                                                                                        elemento.fechaAlta
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
                                                                    </div>
                                                                    <hr />
                                                                    <div className="card-pets">
                                                                        <p className="card-description card-text">
                                                                            {
                                                                                elemento.descripcion
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                        
                                                                    <div className="card-actions">
                                                                        <Link
                                                                            className="learn-more button-learn-more"
                                                                            to={`/consultar-posteo/${elemento.id}`}
                                                                        >
                                                                            <span
                                                                                className="circle"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <span className="icon arrow"></span>
                                                                            </span>
                                                                            <span className="button-text">
                                                                                Ver
                                                                                Más
                                                                            </span>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* <div className="card__image-holder">
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
                                                                        e.stopPropagation();
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
                                                                        elemento.nombre ? (elemento.nombre):("-")
                                                                    }
                                                                    <p className="texto-card">
                                                                        Desde: {" "}
                                                                        {new Date(
                                                                            elemento.fechaAlta
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
                                                                            className="learn-more button-learn-more"
                                                                            to={`/consultar-posteo/${elemento.id}`}
                                                                        >
                                                                            <span
                                                                                className="circle"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <span className="icon arrow"></span>
                                                                            </span>
                                                                            <span className="button-text">
                                                                                Ver
                                                                                Más
                                                                            </span>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    ))
                                                    .slice(
                                                        firstIndex,
                                                        lastIndex
                                                    )}
                                            </div>
                                        ) : (
                                            <div
                                                className="alert alert-primary w-100 d-flex justify-content-center "
                                                role="alert"
                                            >
                                                <h5>
                                                    No hay publicaciones con
                                                    esos filtros.
                                                </h5>
                                            </div>
                                        )}
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
                                to={"/publicacion-mascota-perdida"}
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
