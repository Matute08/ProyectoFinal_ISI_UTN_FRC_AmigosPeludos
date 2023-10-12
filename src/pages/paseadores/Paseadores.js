import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { getPaseador, getUserMail } from "../../services/api";
import img from "../../assets/images/user/user-random.jpg";

const Paseadores = () => {
    const navigate = useNavigate();
    const [paseadores, setPaseadores] = useState([]);
    const [userPaseador, setUserPaseador] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [idUser, setIdUser] = useState();
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
        //verificar si el usuario tiene paseadores para prohibir crear uno nuevo
        const fetchPaseadoresUser = async () => {
            // Filtrar paseadores según el userData.id
            const paseadoresFiltrados = paseadores.filter(
                (paseador) => paseador.idUsuario === idUser
            );
            setUserPaseador(paseadoresFiltrados);
    
            // Validar si el usuario puede crear una nueva publicación
            const puedeCrearPublicacion = paseadoresFiltrados.length === 0;
    
            // Actualizar el estado del botón
            if (puedeCrearPublicacion !== "") {
                setBoton(true);
            }
        };

        fetchUserData();
        fetchPaseadoresUser();
    }, []);

    useEffect(() => {
        const fetchPaseadores = async () => {
            try {
                const dataPaseador = await getPaseador();
                setPaseadores(dataPaseador);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener paseadores:", error);
            }
        };

        fetchPaseadores();
    }, []);
    // const fetchPaseadoresUser = async () => {
    //     // Filtrar paseadores según el userData.id
    //     const paseadoresFiltrados = paseadores.filter(
    //        (paseador) => paseador.idUsuario === idUser
    //     );
    //     setUserPaseador(paseadoresFiltrados);
     
    //     // Validar si el usuario puede crear una nueva publicación
    //     const puedeCrearPublicacion = paseadoresFiltrados.length === 0;
     
    //     // Actualizar el estado del botón
    //     if (puedeCrearPublicacion !== "") {
            
    //         setBoton(true);
    //     }
    //  };
     
    //  useEffect(() => {
    //     if (userData && idUser && paseadores) {
    //        fetchPaseadoresUser()
    //     }
    //  }, [idUser, paseadores, userData]);
     

    const handleClick = () => {
        if (userPaseador && userPaseador.length == 0) {
            // Redirigir a la página correspondiente si no es paseador
            navigate("/agregar-paseador");
        } else {
            // Mostrar el Swal si ya es paseador
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Usted ya es un paseador, no puede registrarse nuevamente",
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
                                <h1>Publicaciones de Paseadores</h1>
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
                                                                to={`/perfilPublicoPaseador/${paseador.datosUsuario.mail}/${paseador.id}`}
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
                                // Mostrar un mensaje si no hay paseadore
                                <div
                                    className="alert alert-primary w-75"
                                    role="alert"
                                >
                                    <h5>No Hay Paseadores Registrados.</h5>
                                </div>
                            )}
                        </Row>

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
                                        Soy Paseador
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

export default Paseadores;
