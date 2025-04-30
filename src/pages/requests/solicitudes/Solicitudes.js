// Solicitudes.js
import React, { useState, useEffect } from 'react';
import {
    Card, CardBody, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane, CardHeader
} from 'reactstrap';
import { useAuth } from '../../../services/AuthContext'; // Ajusta ruta
import { useUserData } from '../../../hooks/useUserData'; // Ajusta ruta
import { getFundacion, getVeterinarias } from '../../../services/commonApi'; // Ajusta ruta
import Loading from '../../components/Loading'; // Ajusta ruta
import Footer from '../../landing/Footer'; // Ajusta ruta
import Navbar from '../../landing/Navbar'; // Ajusta ruta
import SolicitudesFundacion from './SolicitudesFundacion';
import SolicitudesVeterinaria from './SolicitudesVeterinaria';

const Solicitudes = () => {
    const { user } = useAuth();
    const { userData, isLoading: isLoadingUser } = useUserData(); // Usa el hook
    const [activeTab, setActiveTab] = useState('1');
    const [notificacionesVete, setNotificacionesVete] = useState(0);
    const [notificacionesFunda, setNotificacionesFunda] = useState(0);
    const [isLoadingCounts, setIsLoadingCounts] = useState(true);

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Efecto para calcular notificaciones (PENDIENTE: Optimizar si es posible con API de conteo)
    useEffect(() => {
        // Solo calcular si tenemos userData
        if (!userData?.id) {
            setIsLoadingCounts(false); // No hay usuario, no hay cuentas que cargar
            return;
        }

        const fetchCounts = async () => {
            setIsLoadingCounts(true);
            try {
                const [veteData, fundaData] = await Promise.all([
                    getVeterinarias(), // Idealmente sería getPendingVeterinariasCount()
                    getFundacion()     // Idealmente sería getPendingFundacionesCount()
                ]);

                // Asume que estadoId 1 es 'Pendiente' o 'Revision'
                const pendingVete = veteData.data.filter(v => v.estadoId === 1).length;
                const pendingFunda = fundaData.data.filter(f => f.estadoId === 1).length;

                setNotificacionesVete(pendingVete);
                setNotificacionesFunda(pendingFunda);

            } catch (error) {
                console.error("Error fetching notification counts:", error);
                // Manejar error si es necesario (mostrar mensaje, etc.)
                setNotificacionesVete(0); // Resetea en caso de error
                setNotificacionesFunda(0);
            } finally {
                setIsLoadingCounts(false);
            }
        };

        fetchCounts();
    }, [userData]); // Depende de userData

    document.title = "Solicitudes de Servicios | Amigos Peludos";

    // Estado general de carga
    const isLoading = isLoadingUser || isLoadingCounts;

    return (
        <>
            <Navbar />
            <div className="page-content perfil-fondo">
                <Container fluid className="contenedor-form">
                    <Row>
                        <Col className=" d-flex justify-content-center titulo-consult-pest ">
                            <h1>Solicitudes de Servicios</h1>
                        </Col>
                    </Row>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                                            <NavItem>
                                                <NavLink
                                                    href="#Veterinarias"
                                                    className={activeTab === '1' ? 'active' : ''}
                                                    onClick={() => toggleTab('1')}
                                                >
                                                    Solicitudes Veterinarias
                                                    {notificacionesVete > 0 && (
                                                        <span className="circulo-rojo ms-1">{notificacionesVete}</span> // Añadido ms-1 para espacio
                                                    )}
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                   href="#Fundaciones"
                                                   className={activeTab === '2' ? 'active' : ''}
                                                   onClick={() => toggleTab('2')}
                                                >
                                                    Solicitudes Fundaciones
                                                    {notificacionesFunda > 0 && (
                                                         <span className="circulo-rojo ms-1">{notificacionesFunda}</span>
                                                    )}
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                {/* Renderiza el componente hijo directamente */}
                                                {activeTab === '1' && <SolicitudesVeterinaria />}
                                            </TabPane>
                                            <TabPane tabId="2">
                                                 {/* Renderiza el componente hijo directamente */}
                                                {activeTab === '2' && <SolicitudesFundacion />}
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default Solicitudes;