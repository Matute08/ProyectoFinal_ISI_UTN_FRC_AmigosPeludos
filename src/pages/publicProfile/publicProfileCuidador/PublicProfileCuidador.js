import React, { useContext, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    Table,
    CardHeader,
    TabContent,
    TabPane,
} from "reactstrap";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";

import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import Loading from "../../components/Loading";
import { getPaseadorPorId } from "../../../services/api";
import PublicAsideLeft from "./PublicAsideLeftPaseador";

const PublicProfileCuidador = () => {
    const { correoElectronico, id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDataPaseador = async () => {
            try {
                const dataPaseador = await getPaseadorPorId(id);
                if (dataPaseador) {
                    setUserData(dataPaseador);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setIsLoading(false);
            }
        };
        console.log(userData);
        fetchDataPaseador();
    }, [id]);

    const openWhatsApp = () => {
        // Número de teléfono al que enviar el mensaje
        const phoneNumber = userData && userData.datosUsuario.celular;

        // Mensaje predeterminado
        const message = "¡Hola! Necesito tu servicio de paseador! ";

        // Crear la URL de WhatsApp con el número de teléfono y el mensaje
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        // Redireccionar al usuario a la URL de WhatsApp
        window.open(whatsappUrl, "_blank");
    };

    const daysOfWeek = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ];
    const timePeriods = ["manana", "tarde", "noche"];

    

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const toggleActivityTab = (tab) => {
        if (activityTab !== tab) {
            setActivityTab(tab);
        }
    };

    SwiperCore.use([Autoplay]);

    document.title = "Perfil Paseador| Amigos Peludos";

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />

                    <Container fluid className="page-content perfil-fondo">
                        <Row>
                            {/* COMPONENTE DE LA INFO DEL USUARIO */}
                            <PublicAsideLeft
                                correoElectronico={correoElectronico}
                            ></PublicAsideLeft>

                            <Col xxl={9} lg={8} md={12}>
                                <Card className="mt-n5">
                                    <CardHeader>
                                        <Nav
                                            className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                            role="tablist"
                                        >
                                            <NavItem>
                                                <NavLink
                                                    //href="#mis-mascotas"
                                                    className={classnames({
                                                        active:
                                                            activeTab === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggleTab("1");
                                                    }}
                                                >
                                                    {/* <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "} */}
                                                    {/* el span tenia una clase = d-none */}
                                                    <span className=" d-md-inline-block">
                                                        Datos Paseador
                                                    </span>
                                                </NavLink>
                                            </NavItem>

                                            <NavItem>
                                                <NavLink
                                                    //href="#mis-mascotas"
                                                    className={classnames({
                                                        active:
                                                            activeTab === "2",
                                                    })}
                                                    onClick={() => {
                                                        toggleTab("2");
                                                    }}
                                                >
                                                    {/* <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "} */}
                                                    {/* el span tenia una clase = d-none */}
                                                    <span className=" d-md-inline-block">
                                                        Imagenes
                                                    </span>
                                                </NavLink>
                                            </NavItem>

                                            <NavItem>
                                                <NavLink
                                                    //href="#mis-mascotas"
                                                    className={classnames({
                                                        active:
                                                            activeTab === "3",
                                                    })}
                                                    onClick={() => {
                                                        toggleTab("3");
                                                    }}
                                                >
                                                    {/* <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "} */}
                                                    {/* el span tenia una clase = d-none */}
                                                    <span className=" d-md-inline-block">
                                                        Horarios
                                                    </span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                <Row>
                                                    <div className="text-center">
                                                        <h2>
                                                            {userData &&
                                                                userData.titulo}
                                                        </h2>
                                                    </div>
                                                </Row>

                                                <Row>
                                                    <div className="m-4">
                                                        <h5>
                                                            {" "}
                                                            <strong>
                                                                {" "}
                                                                Descripción del
                                                                paseador:{" "}
                                                            </strong>
                                                            {userData &&
                                                                userData.presentacion}
                                                        </h5>
                                                    </div>
                                                </Row>

                                                <Row>
                                                    <div className="m-4">
                                                        <h5>
                                                            <strong>
                                                                Realizo paseos
                                                                en el barrio:{" "}
                                                            </strong>
                                                            {userData &&
                                                                userData.barrioTrabajo}
                                                        </h5>
                                                    </div>
                                                </Row>
                                                <Row>
                                                    <div className="m-4">
                                                        <h5>
                                                            <strong>
                                                                El precio por
                                                                paseo es de:{" "}
                                                            </strong>
                                                            {userData &&
                                                                userData.precioPaseo}{" "}
                                                        </h5>
                                                    </div>
                                                </Row>

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        className="btn-next-paseador button-container"
                                                        type="submit"
                                                        onClick={openWhatsApp}
                                                    >
                                                        <span class="transition"></span>
                                                        <span class="gradient"></span>
                                                        <span class="label">
                                                            Contactar
                                                        </span>
                                                    </button>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId="2">
                                                <div
                                                    id="carouselExampleControls"
                                                    className="carousel slide"
                                                    data-bs-ride="carousel"
                                                >
                                                    <style>
                                                        {`
                                          
                                          .carousel-control-prev-icon,
                                          .carousel-control-next-icon {
                                            background-color: black;
                                            border-radius:50%
                                          }
                                        `}
                                                    </style>
                                                    <div
                                                        className="carousel-inner"
                                                        role="listbox"
                                                    >
                                                        {userData &&
                                                            userData.fotos.map(
                                                                (
                                                                    foto,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        className={`carousel-item ${
                                                                            index ===
                                                                            0
                                                                                ? "active"
                                                                                : ""
                                                                        }`}
                                                                        key={
                                                                            foto.id
                                                                        }
                                                                    >
                                                                        <img
                                                                            className="d-block img-fluid mx-auto img-paseo-perfil"
                                                                            src={
                                                                                foto.foto
                                                                            }
                                                                            alt={`Slide ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                    <a
                                                        className="carousel-control-prev"
                                                        href="#carouselExampleControls"
                                                        role="button"
                                                        data-bs-slide="prev"
                                                    >
                                                        <span
                                                            className="carousel-control-prev-icon"
                                                            aria-hidden="true"
                                                        ></span>
                                                        <span className="sr-only">
                                                            Previous
                                                        </span>
                                                    </a>
                                                    <a
                                                        className="carousel-control-next"
                                                        href="#carouselExampleControls"
                                                        role="button"
                                                        data-bs-slide="next"
                                                    >
                                                        <span
                                                            className="carousel-control-next-icon"
                                                            aria-hidden="true"
                                                        ></span>
                                                        <span className="sr-only">
                                                            Next
                                                        </span>
                                                    </a>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId="3">
                                                <Row>
                                                    {/* DIAS DE TRABAJO */}
                                                    <Col
                                                        lg={12}
                                                        xl={8}
                                                        className="d-flex justify-content-center"
                                                    >
                                                        <div className="mb-3 w-100 table-responsive">
                                                            <table className="table table-bordered table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        {daysOfWeek.map(
                                                                            (
                                                                                day
                                                                            ) => (
                                                                                <th
                                                                                    key={
                                                                                        day
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        day
                                                                                    }
                                                                                </th>
                                                                            )
                                                                        )}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {timePeriods.map(
                                                                        (
                                                                            period
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    period
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        period
                                                                                    }
                                                                                </td>
                                                                                {daysOfWeek.map(
                                                                                    (
                                                                                        day
                                                                                    ) => {
                                                                                        const isAvailable =
                                                                                            userData &&
                                                                                            userData.grilla &&
                                                                                            userData
                                                                                                .grilla
                                                                                                .scheduleData &&
                                                                                            userData
                                                                                                .grilla
                                                                                                .scheduleData[
                                                                                                day.toLowerCase()
                                                                                            ] &&
                                                                                            userData
                                                                                                .grilla
                                                                                                .scheduleData[
                                                                                                day.toLowerCase()
                                                                                            ][
                                                                                                period
                                                                                            ];

                                                                                        const symbolStyle =
                                                                                            isAvailable
                                                                                                ? "green-text"
                                                                                                : "red-text";

                                                                                        return (
                                                                                            <td
                                                                                                key={
                                                                                                    day
                                                                                                }
                                                                                                className="checkbox-cell"
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        symbolStyle
                                                                                                    }
                                                                                                >
                                                                                                    {isAvailable
                                                                                                        ? "✓"
                                                                                                        : "✗"}
                                                                                                </span>
                                                                                            </td>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Col>
                                                    {/* Información a la derecha de la grilla */}
                                                    <Col lg={12} xl={4}>
                                                        <div className="alert alert-info profile-schedule-alert">
                                                            <div className="hidden-xs hidden-sm hidden-ms">
                                                                <p className="text-center m-0">
                                                                    <i className="mdi mdi-clock-time-three-outline mdi-48px"></i>
                                                                </p>
                                                                <br />
                                                            </div>
                                                            Los turnos son
                                                            aproximados, para
                                                            coordinar horarios
                                                            exactos contáctese
                                                            con{" "}
                                                            {userData &&
                                                                userData
                                                                    .datosUsuario
                                                                    .nombreCompleto}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
            <Footer />
        </React.Fragment>
    );
};

export default PublicProfileCuidador;
