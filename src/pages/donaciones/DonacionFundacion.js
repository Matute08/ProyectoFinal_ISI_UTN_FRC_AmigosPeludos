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
import { useParams } from "react-router-dom";

import Footer from "../landing/Footer";
import Loading from "../components/Loading";
import {
    getFundacion,
    getFundacionId,
    getPaseador,
    getUserMail,
} from "../../services/api";
import img from "../../assets/images/user/user-random.jpg";

const DonacionFundacion = () => {
    const { id } = useParams();
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
        console.log(id);
        const fetchFundaciones = async () => {
            try {
                const dataFundacion = await getFundacionId(id);
                setFundacion(dataFundacion);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener Fundacion:", error);
            }
        };
        if (id) {
            fetchFundaciones();
        }
    }, [id]);

    const handleClick = () => {
        navigate("/agregar-fundacion");
    };
    const [customAmount, setCustomAmount] = useState(""); // Nuevo estado para el monto personalizado

    const handleDonation = (amount) => {
        // Lógica para manejar la donación, puedes enviar el monto al servidor aquí
        console.log(`Donar ${amount} pesos`);
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <Row>
                            <Col
                                lg={9}
                                className="d-flex justify-content-center mb-5 text-center"
                            >
                                <div className="w-100">
                                    <div>
                                        <h1>Colabora con {fundacion.nombre}</h1>
                                        <p>{fundacion.motivoDonaciones}</p>
                                    </div>

                                    <hr />

                                    <div>
                                        <h2>¿Cuánto queres donar?</h2>
                                        <p>
                                            Los monton estan expresados en pesos
                                            Argentinos (ARS)
                                        </p>
                                    </div>

                                    <div className="donation-buttons">
                                        {[500, 1000, 1500, 2000].map(
                                            (amount, index) => (
                                                <div
                                                    key={index}
                                                    className={`amount-option p-2 w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5`}
                                                    onClick={() =>
                                                        handleDonation(amount)
                                                    }
                                                >
                                                    <div
                                                        className={`py-4 cursor-pointer text-center rounded text-xl pointer selected-amount`}
                                                    >
                                                        ${amount},00
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div
                                            className={`amount-option p-2 w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5`}
                                        >
                                            <div
                                                className={`py-4 cursor-pointer text-center rounded text-xl pointer selected-amount`}
                                            >
                                                <input
                                                    name="customAmount"
                                                    data-testid="customAmountInput"
                                                    type="text"
                                                    className={`py-4 cursor-pointer text-center font-bold rounded text-xl pointer mb-0 visible`}
                                                    value={customAmount}
                                                    onChange={(e) =>
                                                        setCustomAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div>
                                    <div>
                                        <img src={fundacion.imagen} alt="" />
                                        <h3>{fundacion.nombre}</h3>
                                    </div>
                                    <div>
                                        <p>
                                            {fundacion.direccion}{" "}
                                            {fundacion.nroCalle}
                                        </p>
                                    </div>
                                    <hr />
                                    <p>{fundacion.descripcion}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="d-flex justify-content-center align-items-center"></Row>
                    </Container>
                    <Footer />
                </>
            ) : (
                <Loading />
            )}
        </React.Fragment>
    );
};

export default DonacionFundacion;
