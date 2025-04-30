// LostPets.js (Refactorizado con Filtros Reactivos y Estilo Consistente)

import React, { useState, useEffect, useMemo, useCallback } from "react"; // Añadir useCallback
import {
    Card,
    Col,
    Container,
    Row,
    Alert,
    Spinner,
    Input,
    Label,
    Button,
    CardImg,
    CardBody,
    CardTitle,
    CardText,
} from "reactstrap";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

// Servicios API (Asegúrate que las rutas sean correctas)
import { getTipoMascota, getSexoMascota } from "../../../services/PetsApi";
import { getAllBarrio, getCiudad } from "../../../services/commonApi";
import { getMascotasPublicadas } from "../../../services/PublicationsPetsApi";

// Placeholder para imagen
const placeholderImage = "/images/placeholder-image.png"; // Define una ruta real

const LostPets = () => {
    // --- Estados ---
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiposMascotaOptions, setTiposMascotaOptions] = useState([]);
    const [sexoOptions, setSexoOptions] = useState([]);
    const [barriosOptions, setBarriosOptions] = useState([]);
    const [ciudadesOptions, setCiudadesOptions] = useState([]);
    const [filters, setFilters] = useState({
        tipo: "",
        sexo: "",
        barrio: "",
        ciudad: "",
    });
    const [cardsPerPage, setCardsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);

    // --- CARGA INICIAL ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await Promise.allSettled([
                    getMascotasPublicadas("Perdida"), // <--- Cambiado a "Perdida"
                    getTipoMascota(),
                    getSexoMascota(),
                    getAllBarrio(),
                    getCiudad(),
                ]);

                const [
                    postsResult,
                    tiposResult,
                    sexoResult,
                    barriosResult,
                    ciudadesResult,
                ] = results;

                // Procesar Publicaciones
                if (
                    postsResult.status === "fulfilled" &&
                    postsResult.value?.data
                ) {
                    const sortedPosts = postsResult.value.data.sort(
                        (a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta)
                    );
                    setAllPosts(sortedPosts);
                    setFilteredPosts(sortedPosts);
                } else {
                    console.error(
                        "Error al cargar publicaciones 'Perdida':",
                        postsResult.reason
                    );
                    setAllPosts([]);
                    setFilteredPosts([]);
                }

                // Procesar Opciones de Filtros (asumiendo que devuelven .data)
                if (
                    tiposResult.status === "fulfilled" &&
                    tiposResult.value?.data
                )
                    setTiposMascotaOptions(tiposResult.value.data);
                else
                    console.warn(
                        "Warn: Error al cargar tipos",
                        tiposResult.reason
                    );

                if (sexoResult.status === "fulfilled" && sexoResult.value?.data)
                    setSexoOptions(sexoResult.value.data);
                else
                    console.warn(
                        "Warn: Error al cargar sexos",
                        sexoResult.reason
                    );

                // Ajustar según estructura devuelta por getAllBarrio
                const barriosData =
                    barriosResult.status === "fulfilled"
                        ? barriosResult.value?.data || barriosResult.value
                        : [];
                if (Array.isArray(barriosData)) setBarriosOptions(barriosData);
                else
                    console.warn(
                        "Warn: Error o formato inesperado al cargar barrios",
                        barriosResult.reason
                    );

                // Ajustar según estructura devuelta por getCiudad
                const ciudadesData =
                    ciudadesResult.status === "fulfilled"
                        ? ciudadesResult.value?.data || ciudadesResult.value
                        : [];
                if (Array.isArray(ciudadesData))
                    setCiudadesOptions(ciudadesData);
                else
                    console.warn(
                        "Warn: Error o formato inesperado al cargar ciudades",
                        ciudadesResult.reason
                    );
            } catch (err) {
                console.error("Error fatal durante la carga inicial:", err);
                setError(err.message || "Error al cargar la página.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []); // Cargar solo al montar

    // --- FILTRADO REACTIVO ---
    useEffect(() => {
        let postsResult = [...allPosts];

        if (filters.tipo) {
            postsResult = postsResult.filter(
                (p) => p.tipoMascotaNombre === filters.tipo
            );
        }
        if (filters.sexo) {
            postsResult = postsResult.filter(
                (p) => p.sexoId === parseInt(filters.sexo, 10)
            );
        }
        if (filters.barrio) {
            postsResult = postsResult.filter(
                (p) => p.barrioId === parseInt(filters.barrio, 10)
            );
        }
        if (filters.ciudad) {
            // ¡¡¡IMPORTANTE!!! Asumiendo que la publicación tiene ciudadId directamente
            // Si la ciudad está dentro del barrio (p.barrio.ciudadId), necesitas que la API getMascotasPublicadas incluya esa información anidada
            postsResult = postsResult.filter(
                (p) => p.ciudadId === parseInt(filters.ciudad, 10)
            ); // AJUSTA ESTA LÍNEA SI ES NECESARIO
            // console.warn("Filtrado por ciudad necesita revisión de la estructura de datos.");
        }

        setFilteredPosts(postsResult);
        setCurrentPage(1); // Resetear página al filtrar
    }, [filters, allPosts]);

    // --- MANEJADORES ---
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleLimpiarFiltros = () => {
        setFilters({ tipo: "", sexo: "", barrio: "", ciudad: "" });
    };

    // --- PAGINACIÓN ---
    useEffect(() => {
        const updateCardsPerPage = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth > 1516) setCardsPerPage(12);
            else if (screenWidth > 1151) setCardsPerPage(9);
            else setCardsPerPage(8);
        };
        updateCardsPerPage();
        window.addEventListener("resize", updateCardsPerPage);
        return () => window.removeEventListener("resize", updateCardsPerPage);
    }, []);

    const lastIndex = currentPage * cardsPerPage;
    const firstIndex = lastIndex - cardsPerPage;
    const currentPosts = useMemo(
        () => filteredPosts.slice(firstIndex, lastIndex),
        [filteredPosts, firstIndex, lastIndex]
    );

    // --- RENDERIZADO ---

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container className="page-content text-center mt-5">
                    <Alert color="danger">
                        Error al cargar las publicaciones: {error}
                    </Alert>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content buscador-fondo">
                <Row>
                    <Col className="text-center mb-4">
                        <h1>Mascotas Perdidas</h1>
                        <p className="text-muted">
                            Ayúdanos a encontrar a sus familias.
                        </p>
                    </Col>
                </Row>

                {/* --- Sección de Filtros --- */}
                <Card className="mb-4 shadow-lg bg-transparent">
                    <CardBody>
                        <Row className="g-3 align-items-end">
                            {/* Filtro Tipo */}
                            <Col lg={2} md={4} sm={6}>
                                <Label
                                    htmlFor="filtroTipo"
                                    className="form-label"
                                >
                                    Tipo:
                                </Label>
                                <Input
                                    type="select"
                                    name="tipo"
                                    id="filtroTipo"
                                    className="form-select"
                                    bsSize="sm"
                                    value={filters.tipo}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    {tiposMascotaOptions.map((tipo) => (
                                        // Usar tipo.tipo como valor si se compara por nombre
                                        <option key={tipo.id} value={tipo.tipo}>
                                            {tipo.tipo}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                            {/* Filtro Sexo */}
                            <Col lg={2} md={4} sm={6}>
                                <Label
                                    htmlFor="filtroSexo"
                                    className="form-label"
                                >
                                    Sexo:
                                </Label>
                                <Input
                                    type="select"
                                    name="sexo"
                                    id="filtroSexo"
                                    className="form-select"
                                    bsSize="sm"
                                    value={filters.sexo}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    {sexoOptions.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                            {/* Filtro Ciudad */}
                            <Col lg={2} md={4} sm={6}>
                                <Label
                                    htmlFor="filtroCiudad"
                                    className="form-label"
                                >
                                    Ciudad:
                                </Label>
                                <Input
                                    type="select"
                                    name="ciudad"
                                    id="filtroCiudad"
                                    className="form-select"
                                    bsSize="sm"
                                    value={filters.ciudad}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todas</option>
                                    {ciudadesOptions.map((ciudad) => (
                                        <option
                                            key={ciudad.id}
                                            value={ciudad.id}
                                        >
                                            {ciudad.nombre}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                            {/* Filtro Barrio */}
                            <Col lg={3} md={6} sm={6}>
                                <Label
                                    htmlFor="filtroBarrio"
                                    className="form-label"
                                >
                                    Barrio:
                                </Label>
                                <Input
                                    type="select"
                                    name="barrio"
                                    id="filtroBarrio"
                                    className="form-select"
                                    bsSize="sm"
                                    value={filters.barrio}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    {barriosOptions
                                        // Opcional: Filtrar barrios por ciudad seleccionada
                                        .filter(
                                            (b) =>
                                                !filters.ciudad ||
                                                b.ciudadId ===
                                                    parseInt(filters.ciudad, 10)
                                        )
                                        .map((barrio) => (
                                            <option
                                                key={barrio.id}
                                                value={barrio.id}
                                            >
                                                {barrio.nombre}
                                            </option>
                                        ))}
                                </Input>
                            </Col>
                            {/* Botón Limpiar */}
                            <Col
                                lg={3}
                                md={6}
                                sm={12}
                                className="text-lg-end text-md-start"
                            >
                                <Button
                                    color="dark"
                                    outline
                                    size="sm"
                                    onClick={handleLimpiarFiltros}
                                    className="w-100 w-lg-auto"
                                >
                                    <i className="fas fa-eraser me-1"></i>
                                    Limpiar Filtros
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {/* --- Lista de Publicaciones --- */}
                {allPosts.length === 0 ? (
                    <Alert color="info">
                        No hay publicaciones de mascotas perdidas por el
                        momento.
                    </Alert>
                ) : filteredPosts.length === 0 ? (
                    <Alert color="warning">
                        No se encontraron publicaciones que coincidan con los
                        filtros seleccionados.
                    </Alert>
                ) : (
                    <>
                        <Row>
                            {currentPosts.map((elemento) => (
                                <Col
                                    sm={6}
                                    md={4}
                                    xl={3}
                                    key={elemento.id}
                                    className="mb-4 d-flex align-items-stretch"
                                >
                                    <Card className="w-100 shadow-sm overflow-hidden">
                                        {/* Enlace en toda la tarjeta para ir al detalle */}
                                        <Link
                                            to={`/consultar-posteo/${elemento.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                            }}
                                        >
                                            <CardImg
                                                top
                                                tag="img"
                                                src={
                                                    elemento.fotos?.[0]?.foto ||
                                                    placeholderImage
                                                }
                                                alt={`Foto de ${
                                                    elemento.nombre ||
                                                    "mascota perdida"
                                                }`}
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                                onError={(e) => {
                                                    if (
                                                        e.target.src !==
                                                        placeholderImage
                                                    ) {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            placeholderImage;
                                                    }
                                                }}
                                            />
                                            <CardBody className="d-flex flex-column flex-grow-1">
                                                {" "}
                                                {/* flex-grow-1 para que el body ocupe espacio */}
                                                <CardTitle
                                                    tag="h5"
                                                    className="mb-2 text-truncate"
                                                >
                                                    {elemento.nombre ||
                                                        "Mascota Perdida"}
                                                </CardTitle>
                                                <CardText className="text-muted small mb-2">
                                                    Perdida el:{" "}
                                                    {new Date(
                                                        elemento.fechaAlta
                                                    ).toLocaleDateString(
                                                        "es-AR"
                                                    )}
                                                </CardText>
                                                <CardText
                                                    className="flex-grow-1 mb-3"
                                                    style={{
                                                        maxHeight: "80px",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {elemento.descripcion ||
                                                        "Sin descripción."}
                                                </CardText>
                                                <Button
                                                    color="primary"
                                                    outline
                                                    size="sm"
                                                    className="mt-auto align-self-start"
                                                    tag="div"
                                                >
                                                    {" "}
                                                    {/* Usar tag="div" para no anidar <a> */}
                                                    Ver Detalles{" "}
                                                    <i className="fas fa-arrow-right ms-1"></i>
                                                </Button>
                                            </CardBody>
                                        </Link>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        {/* --- Paginación --- */}
                        <Row className="mt-4">
                            <Col>
                                <Pagination
                                    cardsPerPage={cardsPerPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalCards={filteredPosts.length}
                                />
                            </Col>
                        </Row>
                    </>
                )}

                {/* --- Botón Flotante (FAB) --- */}
                <Link
                    to="/publicacion-mascota-adopcion" // Ruta correcta para crear post de adopción
                    className="btn btn-info btn-lg rounded-circle position-fixed shadow d-flex align-items-center justify-content-center text-white"
                    title="Publicar Mascota en Adopción"
                    style={{
                        bottom: "30px",
                        right: "30px",
                        zIndex: 1050,
                        width: "60px",
                        height: "60px",
                        paddingTop: "12px",
                    }}
                >
                    <i className="fas fa-plus fa-lg"></i>
                </Link>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default LostPets;
