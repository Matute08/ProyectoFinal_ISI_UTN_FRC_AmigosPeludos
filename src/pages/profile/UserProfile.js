import React, { useState, useEffect } from "react";
import {
    Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, CardHeader, TabContent, TabPane
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";

// Componentes Personalizados
import Loading from "../components/Loading";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Mascota from "../profile/pet/Mascotas";
import AsideLeft from "./AsideLeft"; 
import MyPosts from "./post/MyPosts";
import GenerateQr from "./qr/GenerateQr";
import MisServicios from "./misServicios/MisServicios";

// Servicio API
import { getUserMail } from "../../services/userApi";

// Estilos para el Botón de Acción Flotante (FAB)
const fabStyles = {
    position: "fixed", bottom: "20px", right: "20px", zIndex: 9999,
};

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                try {
                    const dataLocalStorage = JSON.parse(cachedUserData);
                    const userEmail = dataLocalStorage?.email;

                    if (!userEmail) {
                        throw new Error("No se encontró email en localStorage.");
                    }

                    //getUserMail devuelve { data: { ...datos } }
                    const response = await getUserMail(userEmail);
                    const datosUsuario = response?.data;

                    if (!datosUsuario) {
                        throw new Error("La respuesta de la API no contiene datos de usuario.");
                    }

                    // Crear la dirección combinada 
                    const direccionCompleta = `${datosUsuario.calle || ""} ${datosUsuario.nroCalle || ""}`.trim();

                    // Actualizar estado con los datos obtenidos y la dirección combinada
                    setUserData({
                        ...datosUsuario,
                        direccionCompleta: direccionCompleta // Añadir la dirección combinada
                    });

                    document.title = "Perfil | Amigos Peludos";

                } catch (err) {
                    console.error("Error al cargar datos del usuario en Profile:", err);
                    setError("Error al cargar los datos del perfil.");
                    setUserData(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("No hay datos de usuario localizados. Por favor, inicia sesión.");
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []); // Ejecutar solo al montar

    // Determinar si la pestaña 'Mis Servicios' debe mostrarse
    const showServiciosTab = userData && (
        userData.esPaseador || userData.esCuidador || userData.esVeterinaria || userData.esFundacion
    );

    // --- Renderizado ---

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container fluid className="page-content perfil-fondo d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
                    <p className="text-danger">{error}</p>
                </Container>
                <Footer />
            </>
        );
    }

    // Render principal cuando no hay carga ni error
    return (
        <>
            <Navbar />
            <Container fluid className="page-content perfil-fondo">
                <Row>
                    {/* ---PASAMOS userData como prop a AsideLeft --- */}
                    {userData && <AsideLeft userData={userData} />}

                    {/* Columna de Contenido Principal (Pestañas) */}
                    <Col xxl={9} lg={8} md={12}>
                        <Card className="mt-n5">
                            <CardHeader>
                                <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                                    {/* Pestaña: Mis Mascotas */}
                                    <NavItem>
                                        <NavLink
                                            href="#mis-mascotas"
                                            className={classnames("d-md-inline-block", { active: activeTab === "1" })}
                                            onClick={(e) => { e.preventDefault(); toggleTab("1"); }}
                                            role="tab" aria-selected={activeTab === "1"}
                                        >
                                            Mis Mascotas
                                        </NavLink>
                                    </NavItem>
                                    {/* Pestaña: Mis Publicaciones */}
                                    <NavItem>
                                        <NavLink
                                            href="#mis-publicaciones"
                                            className={classnames("d-md-inline-block", { active: activeTab === "2" })}
                                            onClick={(e) => { e.preventDefault(); toggleTab("2"); }}
                                            role="tab" aria-selected={activeTab === "2"}
                                        >
                                            Mis Publicaciones
                                        </NavLink>
                                    </NavItem>
                                    {/* Pestaña: Mi QR */}
                                    <NavItem>
                                        <NavLink
                                            href="#mi-qr"
                                            className={classnames("d-md-inline-block", { active: activeTab === "3" })}
                                            onClick={(e) => { e.preventDefault(); toggleTab("3"); }}
                                            role="tab" aria-selected={activeTab === "3"}
                                        >
                                            Mi QR
                                        </NavLink>
                                    </NavItem>
                                    {/* Pestaña: Mis Servicios (Condicional) */}
                                    {showServiciosTab && (
                                        <NavItem>
                                            <NavLink
                                                href="#mis-servicios"
                                                className={classnames("d-md-inline-block", { active: activeTab === "4" })}
                                                onClick={(e) => { e.preventDefault(); toggleTab("4"); }}
                                                role="tab" aria-selected={activeTab === "4"}
                                            >
                                                Mis Servicios
                                            </NavLink>
                                        </NavItem>
                                    )}
                                </Nav>
                            </CardHeader>
                            <CardBody>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1"><Mascota /></TabPane>
                                    <TabPane tabId="2"><MyPosts /></TabPane>
                                    <TabPane tabId="3"><GenerateQr /></TabPane>
                                    {showServiciosTab && (
                                        <TabPane tabId="4"><MisServicios /></TabPane>
                                    )}
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Botón Flotante */}
                <div style={fabStyles} className="floating-button-container">
                    <button
                        className="Btn" 
                        onClick={() => navigate("/agregar-mascota")}
                        type="button"
                    >
                        <div className="sign">+</div> 
                        <div className="text">Agregar Mascota</div> 
                    </button>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default Profile;