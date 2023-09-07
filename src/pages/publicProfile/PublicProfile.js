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
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import PublicAsideLeft from "./PublicAsideLeft";
//Images
import img1 from "../../assets/images/paseos/paseo1.jpeg";
import img2 from "../../assets/images/paseos/paseo2.jpg";
import img3 from "../../assets/images/paseos/paseo3.jpg";

const PublicProfile = () => {
    const daysOfWeek = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ];
    const timePeriods = ["Mañana", "Tarde", "Noche"];

    // Estado para almacenar los días seleccionados
    const [selectedDays, setSelectedDays] = useState({
        Lunes: { Mañana: true, Tarde: true },
        Martes: { Mañana: true },
        Miércoles: { Mañana: true },
        Jueves: { Mañana: true },
    });
    const handleCheckboxChange = (day, period, isChecked) => {
        // No permitimos cambiar el estado de las celdas
        return;
    };

    const { correoElectronico } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");

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

    document.title = "Perfil | Amigos Peludos";

    useEffect(() => {
        console.log(correoElectronico);
    }, []);

    return (
        <React.Fragment>
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
                                                active: activeTab === "1",
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
                                                active: activeTab === "2",
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
                                                active: activeTab === "3",
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
                                        {/* aca va la info de los servicios */}
                                        <div className="text-center">
                                            <h2>AMO LOS ANIMALES</h2>
                                        </div>
                                        <div className="m-4">
                                            <h5>
                                                ¡Hola! Soy un apasionado de los
                                                perros y un amante de las
                                                caminatas al aire libre. Como
                                                paseador de perros, mi objetivo
                                                es brindar a tus peludos amigos
                                                la mejor experiencia posible
                                                mientras están fuera de casa.
                                            </h5>
                                        </div>
                                        <div>
                                            <h3>
                                                Realizo paseos en: Nueva Cordoba
                                            </h3>
                                        </div>
                                        <div className="mt-5">
                                            <h3>2500 por paseo</h3>
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn-next-paseador button-container "
                                                type="submit"
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
                                            class="carousel slide"
                                            data-bs-ride="carousel"
                                        >
                                            <div
                                                class="carousel-inner"
                                                role="listbox"
                                            >
                                                <div class="carousel-item active">
                                                    <img
                                                        class="d-block img-fluid mx-auto  img-paseo-perfil"
                                                        src={img1}
                                                        alt="First slide"
                                                    />
                                                </div>
                                                <div class="carousel-item">
                                                    <img
                                                        class="d-block img-fluid mx-auto  img-paseo-perfil"
                                                        src={img2}
                                                        alt="Second slide"
                                                    />
                                                </div>
                                                <div class="carousel-item">
                                                    <img
                                                        class="d-block img-fluid mx-auto  img-paseo-perfil"
                                                        src={img3}
                                                        alt="Third slide"
                                                    />
                                                </div>
                                            </div>
                                            <a
                                                class="carousel-control-prev"
                                                href="#carouselExampleControls"
                                                role="button"
                                                data-bs-slide="prev"
                                            >
                                                <span
                                                    class="carousel-control-prev-icon"
                                                    aria-hidden="true"
                                                ></span>
                                                <span class="sr-only">
                                                    Previous
                                                </span>
                                            </a>
                                            <a
                                                class="carousel-control-next"
                                                href="#carouselExampleControls"
                                                role="button"
                                                data-bs-slide="next"
                                            >
                                                <span
                                                    class="carousel-control-next-icon"
                                                    aria-hidden="true"
                                                ></span>
                                                <span class="sr-only">
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
                                                className="d-flex justify-content-center"
                                            >
                                                <div className="mb-3 w-100 table-responsive">
                                                    <table className="table table-bordered table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                {daysOfWeek.map(
                                                                    (day) => (
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
                                                                (period) => (
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
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        day
                                                                                    }
                                                                                    className="checkbox-cell"
                                                                                >
                                                                                    <div className="custom-checkbox">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleCheckboxChange(
                                                                                                    day,
                                                                                                    period,
                                                                                                    e
                                                                                                        .target
                                                                                                        .checked
                                                                                                )
                                                                                            }
                                                                                            checked={
                                                                                                selectedDays[
                                                                                                    day
                                                                                                ]?.[
                                                                                                    period
                                                                                                ]
                                                                                            }
                                                                                            disabled
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            )
                                                                        )}
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: "9999",
                    }}
                    className="floating-button-container"
                >
                    <button
                        class="Btn"
                        onClick={() => {
                            navigate("/agregar-mascota");
                        }}
                    >
                        <div class="sign">+</div>

                        <div class="text">Agregar Mascota</div>
                    </button>
                </div> */}
            </Container>

            <Footer />
        </React.Fragment>
    );
};

export default PublicProfile;
