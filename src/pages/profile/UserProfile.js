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
import Loading from "../components/Loading";
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Mascota from "../profile/pet/Mascotas";
import AsideLeft from "./AsideLeft";
import MyPosts from "./post/MyPosts";
import GenerateQr from "./qr/GenerateQr";
import MisServicios from "./misServicios/MisServicios";
import { getUserMail } from "../../services/api";
//Images

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
    useEffect(() => {
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${
                    datosUsuario.calle + " " + datosUsuario.nroCalle
                }`;
                setUserData(datosUsuario);
                setIsLoading(false);
            }
        };

        fetchUserData();
       
    }, []);

    document.title = "Perfil | Amigos Peludos";

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />

                    <Container fluid className="page-content perfil-fondo">
                        <Row>
                            {/* COMPONENTE DE LA INFO DEL USUARIO */}
                            <AsideLeft></AsideLeft>

                            <Col xxl={9} lg={8} md={12}>
                                <Card className="mt-n5">
                                    <CardHeader>
                                        <Nav
                                            className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                            role="tablist"
                                        >
                                            <NavItem>
                                                <NavLink
                                                    href="#mis-mascotas"
                                                    className={`d-md-inline-block ${
                                                        activeTab === "1"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        toggleTab("1");
                                                    }}
                                                >
                                                    <span className=" d-md-inline-block">
                                                        Mis Mascotas
                                                    </span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#mis-publicaciones"
                                                    className={`d-md-inline-block ${
                                                        activeTab === "2"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        toggleTab("2");
                                                    }}
                                                >
                                                    <span className=" d-md-inline-block">
                                                        Mis Publicaciones
                                                    </span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#mi-qr"
                                                    className={`d-md-inline-block ${
                                                        activeTab === "3"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        toggleTab("3");
                                                    }}
                                                >
                                                    <span className=" d-md-inline-block">
                                                        Mi QR
                                                    </span>
                                                </NavLink>
                                            </NavItem>
                                            {userData &&
                                            userData.esPaseador === null &&
                                            userData.esCuidador === null &&
                                            userData.esVeterinaria === null &&
                                            userData.esFundacion === null ? (
                                                ""
                                            ) : (
                                                <NavItem>
                                                    <NavLink
                                                        href="#mis-servicios"
                                                        className={`d-md-inline-block ${
                                                            activeTab === "4"
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() => {
                                                            toggleTab("4");
                                                        }}
                                                    >
                                                        <span className=" d-md-inline-block">
                                                            Mis Servicios
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                            )}
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                {/* COMPONENTE MASCOTAS */}
                                                <Mascota />
                                            </TabPane>

                                            <TabPane tabId="2">
                                                <MyPosts></MyPosts>
                                            </TabPane>

                                            <TabPane tabId="3">
                                                <GenerateQr></GenerateQr>
                                            </TabPane>
                                            <TabPane tabId="4">
                                                <MisServicios></MisServicios>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <div
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
                        </div>
                    </Container>

                    <Footer />
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default Profile;
