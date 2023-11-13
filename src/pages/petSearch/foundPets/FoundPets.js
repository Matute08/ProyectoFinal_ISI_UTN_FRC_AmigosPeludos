import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import LeafletMaps from "../../components/maps/LeafletMaps";
import { getMascotasPublicadas, getTipoMascota, getAllRazaId, getCiudad, getAllBarrio } from "../../../services/api";

const FoundPets = () => {
  const navigate = useNavigate();
  const [activeCardId, setActiveCardId] = useState(null);
  const [isCardShowing, setCardShowing] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const lastIndex = currentPage * cardsPerPage;
  const firstIndex = lastIndex - cardsPerPage;
  const [showModal, setShowModal] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filtroTipoMascota, setFiltroTipoMascota] = useState("");
  const [filtroRaza, setFiltroRaza] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [filtroBarrio, setFiltroBarrio] = useState("");

  const [tiposMascota, setTiposMascota] = useState([]);
  const [razas, setRazas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);

  useEffect(() => {
    const cargarListasFiltros = async () => {
      const tiposMascotaData = await getTipoMascota();
      setTiposMascota(tiposMascotaData);

      // También puedes cargar las otras listas de filtros de manera similar
      const razasData = await getAllRazaId(tiposMascotaData[0].id);
      setRazas(razasData);

      const ciudadesData = await getCiudad();
      setCiudades(ciudadesData);

      const barriosData = await getAllBarrio();
      setBarrios(barriosData);
    };
    cargarListasFiltros();
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      const publicData = await getMascotasPublicadas("Encontrada");
      const sortedPublicaciones = publicData.sort(
        (a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta)
      );
      setPublicaciones(sortedPublicaciones);
      setPublicacionesFiltradas(sortedPublicaciones);
      setIsLoading(false);
    };
    fetchPublicData();
  }, []);

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

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);

    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const aplicarFiltros = () => {
    let publicacionesFiltradasCopy = [...publicaciones]; // Copia del estado original
  
    // Filtrar por tipo de mascota
    if (filtroTipoMascota) {
      publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
        (publicacion) => publicacion.tipoMascotaNombre === filtroTipoMascota
      );
    }
  
    // Filtrar por raza
    if (filtroRaza) {
        publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter((publicacion) =>
        publicacion.raza && publicacion.raza.includes(filtroRaza)
      );
      
    }
  
    // Filtrar por ciudad
    if (filtroCiudad) {
      publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
        (publicacion) => publicacion.ciudad === filtroCiudad
      );
    }
  
    // Filtrar por barrio
    if (filtroBarrio) {
      publicacionesFiltradasCopy = publicacionesFiltradasCopy.filter(
        (publicacion) => publicacion.barrio === filtroBarrio
      );
    }
  
    // Actualizar el estado de las publicaciones filtradas
    setPublicacionesFiltradas(publicacionesFiltradasCopy);
  };
  

  const handleClick = (id) => {
    if (activeCardId === id) {
      setActiveCardId(null);
      setCardShowing(false);
    } else {
      setActiveCardId(id);
      setCardShowing(true);
    }
  };

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
                    <h1>Publicaciones de Mascotas Encontradas</h1>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div
                      className={` container-cards ${
                        isCardShowing ? "showing" : ""
                      }`}
                    >
                      <div className="filtros">
                        <select
                          value={filtroTipoMascota}
                          onChange={(e) => setFiltroTipoMascota(e.target.value)}
                        >
                          <option value="">Tipo de Mascota</option>
                          {tiposMascota.map((tipo) => (
                            <option key={tipo.id} value={tipo.tipo}>
                              {tipo.tipo}
                            </option>
                          ))}
                        </select>

                        <select
                          value={filtroRaza}
                          onChange={(e) => setFiltroRaza(e.target.value)}
                        >
                          <option value="">Raza</option>
                          {razas.map((raza) => (
                            <option key={raza.id} value={raza.nombre}>
                              {raza.nombre}
                            </option>
                          ))}
                        </select>

                        <select
                          value={filtroCiudad}
                          onChange={(e) => setFiltroCiudad(e.target.value)}
                        >
                          <option value="">Ciudad</option>
                          {ciudades.map((ciudad) => (
                            <option key={ciudad.id} value={ciudad.nombre}>
                              {ciudad.nombre}
                            </option>
                          ))}
                        </select>

                        <select
                          value={filtroBarrio}
                          onChange={(e) => setFiltroBarrio(e.target.value)}
                        >
                          <option value="">Barrio</option>
                          {barrios.map((barrio) => (
                            <option key={barrio.id} value={barrio.nombre}>
                              {barrio.nombre}
                            </option>
                          ))}
                        </select>

                        <button onClick={aplicarFiltros}>Aplicar Filtros</button>
                      </div>

                      {publicacionesFiltradas.map((elemento) => (
                        <div
                          key={elemento.id}
                          className={`card-pets ${
                            activeCardId === elemento.id ? "show" : ""
                          }`}
                          onClick={() => handleClick(elemento.id)}
                        >
                          <div className="card__image-holder">
                            {elemento &&
                              elemento.fotos &&
                              elemento.fotos.length > 0 && (
                                <img
                                  key={elemento.fotos[0].id}
                                  className="card__image"
                                  src={elemento.fotos[0].foto}
                                  alt="Imagen de la publicación"
                                />
                              )}
                          </div>

                          <div className="card-title">
                            <a
                              className="toggle-info btn-card"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClick(elemento.id);
                              }}
                            >
                              <span className="span-card span-left"></span>
                              <span className="span-card span-right"></span>
                            </a>
                            <h2 className="titulo-card">
                              {elemento.nombre}
                              <p className="texto-card">
                                Encontrado el día{" "}
                                {new Date(elemento.fechaPerdida).toLocaleDateString(
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
                              {elemento.descripcion}
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
                                  <span className="button-text">Ver Más</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Pagination
                      cardsPerPage={cardsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalCards={publicacionesFiltradas.length}
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
                  <h5>No hay publicaciones aún.</h5>
                </div>
              </>
            )}

            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: "9999",
              }}
              className="floating-button-container"
            >
              <Link className="Btn" to={"/publicacion-mascota-encontrada"}>
                <div className="sign">+</div>
                <div className="text text-center">Crear Posteo</div>
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

export default FoundPets;
