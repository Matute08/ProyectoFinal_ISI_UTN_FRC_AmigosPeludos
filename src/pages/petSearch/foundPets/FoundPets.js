// FoundPets.js (Refactorizado con Filtros Reactivos)

import React, { useState, useEffect, useMemo } from "react";
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
} from "reactstrap"; // Usar componentes reactstrap

import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

// Servicios API
import { getTipoMascota, getSexoMascota } from "../../../services/PetsApi";
import { getAllBarrio, getCiudad } from "../../../services/commonApi";
import { getMascotasPublicadas } from "../../../services/PublicationsPetsApi";

// Placeholder para imagen
const placeholderImage = "/images/placeholder-image.png"; // Define una ruta real

const FoundPets = () => {
    // Estados de Datos
    const [allPosts, setAllPosts] = useState([]); // Lista original completa
    const [filteredPosts, setFilteredPosts] = useState([]); // Lista filtrada para mostrar
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para Opciones de Filtros
    const [tiposMascotaOptions, setTiposMascotaOptions] = useState([]);
    const [sexoOptions, setSexoOptions] = useState([]);
    const [barriosOptions, setBarriosOptions] = useState([]);
    const [ciudadesOptions, setCiudadesOptions] = useState([]);

    // Estado ÚNICO para los filtros aplicados
    const [filters, setFilters] = useState({
        tipo: "", // Guardará el NOMBRE del tipo (ej: "Perro")
        sexo: "", // Guardará el ID del sexo (ej: "1")
        barrio: "", // Guardará el ID del barrio (ej: "15")
        ciudad: "", // Guardará el ID de la ciudad (ej: "1") - ¡Verificar si existe en los datos!
    });

    // Estados de Paginación
    const [cardsPerPage, setCardsPerPage] = useState(12); // Default más alto
    const [currentPage, setCurrentPage] = useState(1);

    // --- CARGA INICIAL DE DATOS Y OPCIONES ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Cargar todo en paralelo
                const results = await Promise.allSettled([
                    getMascotasPublicadas("Encontrada"), // Publicaciones tipo "Encontrada"
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
                    setFilteredPosts(sortedPosts); // Inicialmente mostrar todos
                } else {
                    console.error(
                        "Error al cargar publicaciones:",
                        postsResult.reason
                    );
                    setAllPosts([]);
                    setFilteredPosts([]);
                    // Podría ser un error crítico o simplemente no hay posts
                    // throw new Error("No se pudieron cargar las publicaciones.");
                }

                // Procesar Tipos
                if (
                    tiposResult.status === "fulfilled" &&
                    tiposResult.value?.data
                ) {
                    setTiposMascotaOptions(tiposResult.value.data);
                } else {
                    console.warn(
                        "Warn: Error al cargar tipos",
                        tiposResult.reason
                    );
                }

                // Procesar Sexo
                if (
                    sexoResult.status === "fulfilled" &&
                    sexoResult.value?.data
                ) {
                    setSexoOptions(sexoResult.value.data);
                } else {
                    console.warn(
                        "Warn: Error al cargar sexos",
                        sexoResult.reason
                    );
                }

                // Procesar Barrios
                if (
                    barriosResult.status === "fulfilled" &&
                    barriosResult.value?.data
                ) {
                    setBarriosOptions(barriosResult.value.data);
                } else if (
                    barriosResult.status === "fulfilled" &&
                    Array.isArray(barriosResult.value)
                ) {
                    setBarriosOptions(barriosResult.value); // Si devuelve array directamente
                } else {
                    console.warn(
                        "Warn: Error al cargar barrios",
                        barriosResult.reason
                    );
                }

                // Procesar Ciudades
                if (
                    ciudadesResult.status === "fulfilled" &&
                    ciudadesResult.value?.data
                ) {
                    setCiudadesOptions(ciudadesResult.value.data);
                } else if (
                    ciudadesResult.status === "fulfilled" &&
                    Array.isArray(ciudadesResult.value)
                ) {
                    setCiudadesOptions(ciudadesResult.value);
                } else {
                    console.warn(
                        "Warn: Error al cargar ciudades",
                        ciudadesResult.reason
                    );
                }
            } catch (err) {
                console.error("Error fatal durante la carga inicial:", err);
                setError(err.message || "Error al cargar la página.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []); // Cargar solo al montar

    // --- LÓGICA DE FILTRADO REACTIVO ---
    useEffect(() => {
        console.log("Aplicando filtros:", filters);
        let postsResult = [...allPosts]; // Empezar con todos los posts

        // Aplicar filtro por Tipo (comparando nombre)
        if (filters.tipo) {
            postsResult = postsResult.filter(
                (p) => p.tipoMascotaNombre === filters.tipo
            );
        }
        // Aplicar filtro por Sexo (comparando ID)
        if (filters.sexo) {
            postsResult = postsResult.filter(
                (p) => p.sexoId === parseInt(filters.sexo, 10)
            );
        }
        // Aplicar filtro por Barrio (comparando ID)
        if (filters.barrio) {
            postsResult = postsResult.filter(
                (p) => p.barrioId === parseInt(filters.barrio, 10)
            );
        }
        // Aplicar filtro por Ciudad (comparando ID - ¡Ajustar si la estructura es diferente!)
        if (filters.ciudad) {
            // Asunción: El objeto publicacion tiene ciudadId directamente O anidado en barrio
            // Opción A: si es p.ciudadId
            // postsResult = postsResult.filter(
            //     (p) => p.ciudadId === parseInt(filters.ciudad, 10)
            // );
            // Opción B: si es p.barrio.ciudadId (¡requiere que la API incluya barrio con ciudad!)
            // postsResult = postsResult.filter(
            //    (p) => p.barrio?.ciudadId === parseInt(filters.ciudad, 10)
            // );
            // *** ¡DESCOMENTA Y AJUSTA LA OPCIÓN CORRECTA SEGÚN TUS DATOS! ***
            // Por ahora, lo dejo comentado para evitar errores si no existe.
            console.warn(
                "Filtrado por ciudad no implementado o propiedad no encontrada en datos."
            );
        }

        setFilteredPosts(postsResult);
        setCurrentPage(1); // Resetear a la primera página al cambiar filtros
        console.log("Posts filtrados:", postsResult.length);
    }, [filters, allPosts]); // Re-filtrar cuando cambien los filtros o la lista original

    // --- MANEJADOR DE CAMBIOS EN FILTROS ---
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // --- LIMPIAR FILTROS ---
    const handleLimpiarFiltros = () => {
        setFilters({ tipo: "", sexo: "", barrio: "", ciudad: "" });
        // setFilteredPosts(allPosts); // Ya no es necesario, el useEffect lo hará
    };

    // --- PAGINACIÓN ---
    useEffect(() => {
        // (Lógica de ajuste de cardsPerPage según resize - sin cambios)
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

    // Calcular índices para paginación actual
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

    // Error crítico durante la carga
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
                        <h1>Mascotas Encontradas</h1>
                        <p className="text-muted">
                            Aquí puedes ver las mascotas que otros usuarios han
                            encontrado.
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
                            {/* Filtro Ciudad (¡Verificar si funciona con tus datos!) */}
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
                                    {barriosOptions.map((barrio) => (
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
                    // Mensaje si no hay NINGUNA publicación inicial
                    <Alert color="info">
                        No hay publicaciones de mascotas encontradas por el
                        momento.
                    </Alert>
                ) : filteredPosts.length === 0 ? (
                    // Mensaje si hay publicaciones pero NINGUNA coincide con los filtros
                    <Alert color="warning">
                        No se encontraron publicaciones que coincidan con los
                        filtros seleccionados.
                    </Alert>
                ) : (
                    // Mostrar tarjetas si hay resultados filtrados
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
                                    {/* Usar Card  */}
                                    <Card className="w-100 shadow-sm overflow-hidden">
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
                                                tag="img" // Asegurar que sea img
                                                src={
                                                    elemento.fotos?.[0]?.foto ||
                                                    placeholderImage
                                                }
                                                alt={`Foto de ${
                                                    elemento.nombre ||
                                                    "mascota encontrada"
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
                                                <CardTitle
                                                    tag="h5"
                                                    className="mb-2 text-truncate"
                                                >
                                                    {elemento.nombre ||
                                                        "Mascota Encontrada"}
                                                </CardTitle>
                                                <CardText className="text-muted small mb-2">
                                                    Encontrada el:{" "}
                                                    {new Date(
                                                        elemento.fechaAlta
                                                    ).toLocaleDateString(
                                                        "es-AR"
                                                    )}{" "}
                                                    {/* Formato Arg */}
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
                                                {/* Botón Ver Más  */}
                                                <Button
                                                    color="primary"
                                                    outline
                                                    size="sm"
                                                    className="mt-auto align-self-start"
                                                >
                                                    {" "}
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
                                    totalCards={filteredPosts.length} // Basado en los posts filtrados
                                />
                            </Col>
                        </Row>
                    </>
                )}

                {/* --- Botón Flotante (FAB) - Encontrados --- */}
                <Link
                    to="/publicacion-mascota-encontrada"
                    className="btn btn-success btn-lg rounded-circle position-fixed shadow d-flex align-items-center justify-content-center"
                    title="Crear Posteo de Mascota Encontrada"
                    style={{
                        bottom: "30px",
                        right: "30px",
                        zIndex: 1050,
                        width: "60px", // Tamaño fijo
                        height: "60px", // Tamaño fijo
                    }}
                >
                    <i className="fas fa-plus fa-lg"></i> {/* Icono centrado */}
                </Link>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default FoundPets;
