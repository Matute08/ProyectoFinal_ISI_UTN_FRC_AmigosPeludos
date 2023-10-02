import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
import { getCuidadores, getUserMail } from "../../services/api";
import img from "../../assets/images/user/user-random.jpg";

const Cuidadores = () => {
    const navigate = useNavigate();
    const [cuidadores, setCuidadores] = useState([]);
    const [userCuidador, setUserCuidador] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [idUser, setIdUser] = useState("");
    const [boton, setBoton] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const userData = await getUserMail(userEmail);
                setUserData(userData);
                setIdUser(userData.id);
            }
        };

        fetchUserData();
    }, []);
    useEffect(() => {
        const fetchCuidador = async () => {
            try {
                const dataCuidadores = await getCuidadores();
                setCuidadores(dataCuidadores);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener cuidadores:", error);
            }
        };

        fetchCuidador();
    }, []);

    const fetchCuidadoresUser = async () => {
        // Filtrar paseadores según el userData.id
        const cuidadoresFiltrados = cuidadores.filter(
            (cuidador) => cuidador.idUsuario === idUser
        );
        setUserCuidador(cuidadoresFiltrados);

        // Validar si el usuario puede crear una nueva publicación
        const puedeCrearPublicacion = cuidadoresFiltrados.length === 0;

        // Actualizar el estado del botón
        if (puedeCrearPublicacion !== "") {
            setBoton(true);
        }
    };

    useEffect(() => {
        if (userData && idUser && cuidadores) {
            fetchCuidadoresUser();
        }
    }, [idUser, cuidadores, userData]);

    const handleClick = () => {
        if (userCuidador && userCuidador.length == 0) {
            // Redirigir a la página correspondiente si no es paseador
            navigate("/agregar-cuidador");
        } else {
            // Mostrar el Swal si ya es paseador
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Usted ya es un cuidador, no puede registrarse nuevamente",
                footer: "",
                confirmButtonText: "Aceptar",
            });
        }
    };
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
                            {cuidadores.length > 0 ? (
                                // Renderizar la lista de paseadores si hay al menos uno
                                cuidadores.map((cuidador) => (
                                    <Col
                                        lg={8}
                                        className="mb-4"
                                        key={cuidador.id}
                                    >
                                        <Card className="card-paseador">
                                            <Row className="g-0">
                                                <Col md={4}>
                                                    {cuidador.datosUsuario &&
                                                    cuidador.datosUsuario
                                                        .foto ? (
                                                        <img
                                                            className="img-paseador rounded-start img-fluid h-90 object-cover"
                                                            src={
                                                                cuidador
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
                                                        ${cuidador.precioPaseo}{" "}
                                                        / Paseo
                                                    </h5>
                                                </Col>

                                                <Col md={8}>
                                                    <CardBody>
                                                        <h2 className="mb-3">
                                                            {cuidador.titulo}
                                                        </h2>
                                                        <h5 className="mb-2">
                                                            {cuidador.datosUsuario &&
                                                            cuidador
                                                                .datosUsuario
                                                                .nombreCompleto
                                                                ? cuidador
                                                                      .datosUsuario
                                                                      .nombreCompleto
                                                                : "Nombre no disponible"}
                                                        </h5>
                                                    </CardBody>

                                                    <CardFooter className="card-footer">
                                                        <p className="presentacion-paseador card-text text-muted mb-0">
                                                            {
                                                                cuidador.presentacion
                                                            }
                                                        </p>
                                                    </CardFooter>
                                                    <Col className="button-container d-flex justify-content-end">
                                                        {cuidador.datosUsuario &&
                                                        cuidador.datosUsuario
                                                            .mail ? (
                                                            <Link
                                                                to={`/perfilPublicoCuidador/${cuidador.datosUsuario.mail}/${cuidador.id}`}
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
                        {boton && (
                            <div
                                style={{
                                    position: "fixed",
                                    bottom: "20px",
                                    right: "20px",
                                    zIndex: "9999",
                                }}
                                className="floating-button-container"
                            >
                                <button className="Btn" onClick={handleClick}>
                                    <div className="sign">+</div>
                                    <div className="text text-center">
                                        Soy Cuidador
                                    </div>
                                </button>
                            </div>
                        )}
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
