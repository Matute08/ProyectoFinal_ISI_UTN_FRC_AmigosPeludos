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

import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Mascota from "../profile/pet/Mascotas";
import AsideLeft from "./AsideLeft";
import MyPosts from "./post/MyPosts";
import GenerateQr from "./qr/GenerateQr";
//Images

const Profile = () => {
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

    return (
        <React.Fragment>
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
                                                Mis Mascotas
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            href="#mis-publicaciones"
                                            className={classnames({
                                                active: activeTab === "2",
                                            })}
                                            onClick={() => {
                                                toggleTab("2");
                                            }}
                                        >
                                            {/* <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "} */}
                                            <span className=" d-md-inline-block">
                                                Mis Publicaciones
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            href="#mi-qr"
                                            className={classnames({
                                                active: activeTab === "3",
                                            })}
                                            onClick={() => {
                                                toggleTab("3");
                                            }}
                                        >
                                            {/* <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "} */}
                                            <span className=" d-md-inline-block">
                                                Mi QR
                                            </span>
                                        </NavLink>
                                    </NavItem>
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
        </React.Fragment>
    );
};

export default Profile;
