import React, { useContext, useState, useEffect, Component } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
    CardHeader,
} from "reactstrap";
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/footer";
import { useAuth } from "../AutheticationInner/authContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
} from "../../services/api";

//Images
import avatar1 from "../../assets/images/user/user-random.jpg";

const Profile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [userBarrio, setUserBarrio] = useState();
    const [userCiudad, setUserCiudad] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const usuario = async () => {
        setUserData(await getUserMail(user.email));
    };

    const barrio = async () => {
        setUserBarrio(await getBarrioUser(userData.barrioId));
    };
    const ciudad = async () => {
        setUserCiudad(await getCiudadUser(userBarrio.ciudadId));
    };

    useEffect(() => {
        usuario();
    }, [user]);

    useEffect(() => {
        if (userData) {
            barrio();
            if (userBarrio) {
                ciudad();
            } else {
                barrio();
            }
        } else {
            usuario();
        }
    }, [userData]);
    useEffect(() => {
        if (userData && userBarrio && userCiudad) {
            setIsLoading(false);
        }
    }, [userData, userBarrio, userCiudad]);

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    SwiperCore.use([Autoplay]);

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

    document.title = "Perfil | Amigos Peludos";



    const nombreUsuario = userData?.nombre;
    const apellidoUsuario = userData?.apellido;
    const celular = userData?.celular;
    const direccion = userData?.calle;
    const nombreBarrio = userBarrio?.nombre;
    const nombreCiudad = userCiudad?.nombre;
    const mail = userData?.mail;

    return (
        <React.Fragment>
            {isLoading ? (
                <div>CARGANDO...</div>
            ) : (
                <>
                    <>
                        <Navbar></Navbar>
                    </>

                    <div className="page-content">
                        <Container fluid>
                            <div className="position-relative mx-n4 mt-n4">
                                <div className="profile-wid-bg profile-setting-img">
                                    <div className="overlay-content">
                                        <div className="text-end p-3">
                                            <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                                <Input
                                                    id="profile-foreground-img-file-input"
                                                    type="file"
                                                    className="profile-foreground-img-file-input"
                                                />
                                                <Link
                                                    to="/modificar-perfil"
                                                    className="btn btn-success"
                                                >
                                                    <i className="ri-edit-box-line align-bottom"></i>{" "}
                                                    Editar Perfil
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Row>
                                <Col xxl={3}>
                                    <Card className="mt-n5">
                                        <CardBody className="p-4">
                                            <div className="text-center">
                                                <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                    <div className="col-auto">
                                                        <div className="avatar-lg">
                                                            <img
                                                                src={avatar1}
                                                                alt="user-img"
                                                                className="img-thumbnail rounded-circle"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* NOMBRE USUARIO */}
                                                <h5 className="fs-16 mb-1">
                                                    {nombreUsuario}{" "}
                                                    {apellidoUsuario}
                                                </h5>
                                                <p className="text-muted mb-0">Usuario</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xxl={9}>
                                    {/* TITULOS PESTAÑAS */}
                                    <Card className="mt-xxl-n5">
                                        <CardHeader>
                                            <Nav
                                                className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                                role="tablist"
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active:
                                                                activeTab ===
                                                                "1",
                                                        })}
                                                        onClick={() => {
                                                            tabChange("1");
                                                        }}
                                                    >
                                                        <i className="fas fa-home"></i>
                                                        Datos Personales
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        to="#"
                                                        className={classnames({
                                                            active:
                                                                activeTab ===
                                                                "2",
                                                        })}
                                                        onClick={() => {
                                                            tabChange("2");
                                                        }}
                                                        type="button"
                                                    >
                                                        <i className="far fa-user"></i>
                                                        Datos de mis Mascotas
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </CardHeader>

                                        <CardBody className="p-4">
                                            <TabContent activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    <div className="table-responsive">
                                                        <Table className="table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Nombre y
                                                                        Apellido:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {
                                                                            nombreUsuario
                                                                        }{" "}
                                                                        {
                                                                            apellidoUsuario
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Numero
                                                                        de
                                                                        Celular
                                                                        :
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {
                                                                            celular
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Correo
                                                                        Electronico:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {mail}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Provincia:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        Cordoba
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Ciudad:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {
                                                                            nombreCiudad
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Barrio:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {
                                                                            nombreBarrio
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th
                                                                        className="ps-0"
                                                                        scope="row"
                                                                    >
                                                                        Direccion:
                                                                    </th>
                                                                    <td className="text-muted">
                                                                        {
                                                                            direccion
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </TabPane>

                                                <TabPane tabId="2">
                                                    <Card>
                                                        <CardBody></CardBody>
                                                    </Card>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>

                    <>
                        <Footer></Footer>
                    </>
                </>
            )}
        </React.Fragment>
    );
};

export default Profile;
