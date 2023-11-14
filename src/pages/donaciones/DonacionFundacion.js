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
import axios from "axios";
import Footer from "../landing/Footer";
import Loading from "../components/Loading";
import {
    getFundacion,
    getFundacionId,
    getPaseador,
    getUserMail,
} from "../../services/api";
import img from "../../assets/images/user/user-random.jpg";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const DonacionFundacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fundacion, setFundacion] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [idUser, setIdUser] = useState();
    const [boton, setBoton] = useState(true);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [mostrarBoton, setMostrarBoton] = useState(false);

    const [preferenceId, setPreferenceId] = useState(null);
    initMercadoPago("TEST-8ad7c3f4-f218-474f-a719-2d5600b8253d");

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

    const handleDonation = (amount) => {
        if (selectedAmount === amount) {
            // Deseleccionar el botón si ya está seleccionado
            setSelectedAmount(null);
            setMostrarBoton(false);
        } else {
            // Seleccionar el nuevo botón
            setSelectedAmount(amount);
            setMostrarBoton(true);
        }
        console.log(`Donar ${amount} pesos`);
    };

    //MERCADO PAGO FUNCIONES
    const createPreference = async () => {
        try {
            // la URL que sea el endpoint del servidor
            const response = await axios.post(
                "https://amigospeludos.azurewebsites.net/api/MercadoPago/create_preference",
                {
                    title: `Gracias por la donacion a ${
                        fundacion && fundacion.nombre
                    }`,
                    unit_price: selectedAmount,
                    quantity: 1,
                    //idFundacion: id, PROBAR SI FUNCIONA HACERLO ASI: /fundaciones/donar-fundacion/idFundacion
                }
            );
            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setMostrarBoton(false);
            setPreferenceId(id);
        }
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
                                        <div className="w-100 d-flex justify-content-center">
                                            <p className="texto-donar m-2">
                                                {fundacion.motivoDonaciones}
                                            </p>
                                        </div>
                                    </div>

                                    <hr />

                                    <div>
                                        <h2>¿Cuánto queres donar?</h2>
                                        <p className="texto-donar m-2">
                                            Los monton estan expresados en pesos
                                            argentinos (ARS)
                                        </p>
                                    </div>

                                    <div className="donation-buttons">
                                        <div className="amount-options-container d-flex justify-content-center">
                                            {[500, 1000, 1500, 2000].map(
                                                (amount, index) => (
                                                    <div
                                                        key={index}
                                                        className={`amount-option p-2 w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5 ${
                                                            selectedAmount ===
                                                            amount
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleDonation(
                                                                amount
                                                            )
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
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="m-5 d-flex justify-content-center d-flex">
                                        {selectedAmount &&
                                        selectedAmount !== " " ? (
                                            <Row className="justify-content-center">
                                                <Col xs={12} md={6}>
                                                    {mostrarBoton ? (
                                                        <button
                                                            className="mb-3 button-donar"
                                                            onClick={handleBuy}
                                                            variant="primary"
                                                        >
                                                            Donar
                                                        </button>
                                                    ) : preferenceId ? (
                                                        <Wallet
                                                            initialization={{
                                                                preferenceId,
                                                            }}
                                                        />
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div>
                                    <div>
                                        <hr />
                                        <div className="d-flex justify-content-center">
                                            <img
                                                className="imagen-donar m-3"
                                                src={fundacion.imagen}
                                                alt=""
                                            />
                                        </div>
                                        <h3 className="text-center">
                                            {fundacion.nombre}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="texto-donar text-center">
                                            {fundacion.direccion}{" "}
                                            {fundacion.nroCalle}
                                        </p>
                                    </div>
                                    <hr />
                                    <p className="texto-donar m-1">
                                        {fundacion.descripcion}
                                    </p>
                                    <hr />
                                    <div className="m-4">
                                        <a
                                            className="texto-donar d-flex"
                                            href={fundacion.paginaUrl}
                                            target="_blank"
                                        >
                                            Pagina Web
                                        </a>
                                        <a
                                            className="texto-donar d-flex"
                                            href={fundacion.facebook}
                                            target="_blank"
                                        >
                                            Facebook
                                        </a>
                                        <a
                                            className="texto-donar d-flex"
                                            href={fundacion.instagram}
                                            target="_blank"
                                        >
                                            Instagram
                                        </a>
                                    </div>
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
