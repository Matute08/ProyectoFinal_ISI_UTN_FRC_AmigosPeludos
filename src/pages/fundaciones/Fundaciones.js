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
import { getFundacion, getPaseador, getUserMail } from "../../services/api";
import img from "../../assets/images/user/user-random.jpg";

const Fundaciones = () => {
    const navigate = useNavigate();
    const [fundacion, setFundacion] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [idUser, setIdUser] = useState();
    const [boton, setBoton] = useState(true);

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
        const fetchFundaciones = async () => {
            try {
                const dataFundacion = await getFundacion();
                setFundacion(dataFundacion);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener Fundacion:", error);
            }
            console.log(fundacion && fundacion[0].imagen);
        };

        fetchFundaciones();
    }, []);
    const handleClick = () => {
        navigate("/agregar-fundacion");
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <Row>
                            <Col className="d-flex justify-content-center mb-5 text-center">
                                <h1>Fundaciones</h1>
                            </Col>
                        </Row>

                        <Row className="d-flex justify-content-center align-items-center">
                            {fundacion
                                .filter((item) => item.estadoId === 2) // Filtrar por estadoId
                                .map((item, index) => (
                                    <Col sm={6} lg={4} xl={3} key={index}>
                                        <Card>
                                            <CardHeader className="container-header-fundacion">
                                                <div className="container-imagen-fundacion">
                                                    <img
                                                        src={item.imagen}
                                                        alt=""
                                                        className="img-fundacion"
                                                    />
                                                </div>
                                            </CardHeader>
                                            <CardBody className="p-4 text-center container-body-fundacion">
                                                <h3 className=" mb-1 text-center">
                                                    {item.nombre}
                                                </h3>
                                                <p className="text-muted mb-0">
                                                    {item.direccion}{" "}
                                                    {item.nroCalle}
                                                    {","}
                                                    {item.barrio}
                                                </p>
                                            </CardBody>
                                            <CardFooter className="container-footer-fundacion">
                                                <div className="container-descricion-fundacion">
                                                    <p className="text-muted mb-0 descripcion-fundacion">
                                                        {item.descripcion}
                                                    </p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    {/* <Link to={`/donar-fundacion/${item.id}`} className="boton-donar-fundacion">
                                                        <span>Donar</span>
                                                    </Link> */}
                                                    <Link to={``} className="boton-donar-fundacion">
                                                        <span>Donar</span>
                                                    </Link>
                                                </div>
                                            </CardFooter>
                                            {/* <div className="card-footer text-center">
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item">
                                                        <Link
                                                            to={`www.facebook.com/${item.facebook}`}
                                                            className="lh-1 align-middle link-secondary"
                                                        >
                                                            <i className="ri-facebook-fill"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <Link
                                                            to={`www.facebook.com/${item.telefono}`}
                                                            className="lh-1 align-middle link-success"
                                                        >
                                                            <i className="ri-whatsapp-line"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <Link
                                                            to="#"
                                                            className="lh-1 align-middle link-primary"
                                                        >
                                                            <i className="ri-linkedin-fill"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <Link
                                                            to="#"
                                                            className="lh-1 align-middle link-danger"
                                                        >
                                                            <i className="ri-slack-fill"></i>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div> */}
                                        </Card>
                                    </Col>
                                ))}
                        </Row>

                        {!fundacion || fundacion.length === 0 ? (
                            <div
                                className="alert alert-primary w-75"
                                role="alert"
                            >
                                <h5>No Hay Fundaciones Registradas.</h5>
                            </div>
                        ) : null}

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
                                        Soy Fundación
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

export default Fundaciones;
