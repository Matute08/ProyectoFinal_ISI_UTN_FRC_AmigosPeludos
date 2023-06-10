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
} from "reactstrap";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Mascota from "../profile/pet/Mascotas";
import AsideLeft from "./AsideLeft";
//Images

const Profile = () => {
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
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

                    <Col xxl={9} lg={8} md={12} >
                        <Card className="mt-n5">
                            <CardHeader >
                                <Nav
                                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                    role="tablist"
                                >
                                    <NavItem>
                                        <NavLink
                                            to="#"
                                            className={classnames({
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => {
                                                tabChange("1");
                                            }}
                                            type="button"
                                        >
                                            <i className="far fa-user"></i> Mis
                                            Mascotas
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody>

                                {/* COMPONENTE MASCOTAS */}
                                <Mascota />

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
                        <Link
                            to={"/agregar-mascota"}
                            type="button"
                            variant="primary"
                            id="floating-button"
                            className="boton-flotante"
                            data-tooltip-id="botonTooltip"
                            data-tooltip-place="top"
                            data-tooltip-variant="info"
                            
                        >
                            +
                        </Link>
                        <Tooltip id="botonTooltip">Agregar Mascota</Tooltip>
                    </div>
                
            </Container>
            
            <Footer />
        
        </React.Fragment>
    );
};

export default Profile;
