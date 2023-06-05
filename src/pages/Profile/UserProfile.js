import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import { useAuth } from "../../services/AuthContext";
import { getUserMail, getBarrioUser, getCiudadUser } from "../../services/Api";
import Mascota from "./Mascotas/Mascotas";

//Images
import avatar1 from "../../assets/images/user/user-random.jpg";

const Profile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getUserMail(user.email);
            setUserData(userData);
            setIsLoading(false);
        };

        fetchUserData();
    }, [user]);

    const tableData = [
        {
            title: "Nombre y Apellido",
            value: userData ? `${userData.nombre} ${userData.apellido}` : "",
        },
        {
            title: "Correo Electrónico",
            value: userData ? userData.mail : "",
        },
        {
            title: "Número de Celular",
            value: userData ? userData.celular : "",
        },
        {
            title: "Género",
            value: userData ? userData.generoId : "--",
        },
        {
            title: "Provincia",
            value: "Córdoba",
        },
        {
            title: "Ciudad",
            value: "Córdoba",
        },
        {
            title: "Barrio",
            value: userData ? userData.barrioId : "-",
        },
        {
            title: "Dirección",
            value:
                !userData || userData.calle === null
                    ? " "
                    : userData.calle + " " + userData.nroCalle,
        },
    ];

    SwiperCore.use([Autoplay]);

    document.title = "Perfil | Amigos Peludos";

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar/>
                    <Container fluid className="page-content perfil-fondo">
                        <Row>
                            <Col xxl={3}>
                                <Card className="mt-n5">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                <div className="col-auto">
                                                    <div className="img-profile">
                                                        <img
                                                            src={userData.foto ? userData.foto : avatar1}
                                                            alt="user-img"
                                                            className="img-thumbnail rounded-circle"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <h5 className="fs-16 mb-1">
                                                {userData && (
                                                    <>
                                                        {userData.nombre}{" "}
                                                        {userData.apellido}
                                                    </>
                                                )}
                                            </h5>
                                            <p className="text-muted mb-0">
                                                Usuario
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody className="p-4">
                                        <h5 className="card-title mb-3 text-center">
                                            Datos Personales
                                        </h5>
                                        <div className="table-responsive">
                                            <Table className="table-borderless mb-0">
                                                <tbody>
                                                    {tableData.map(
                                                        (elemento) => (
                                                            <tr
                                                                key={
                                                                    elemento.title
                                                                }
                                                            >
                                                                <th
                                                                    className="ps-0"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        elemento.title
                                                                    }
                                                                </th>
                                                                <td className="text-muted">
                                                                    {
                                                                        elemento.value
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                to="/modificar-perfil"
                                                className="btn btn-success"
                                            >
                                                <i className="ri-edit-box-line align-bottom"></i>{" "}
                                                Editar Perfil
                                            </Link>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col xxl={9}>
                                <Card className="mt-xxl-n5">
                                    <CardHeader>
                                        <Nav
                                            className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                            role="tablist"
                                        >
                                            <NavItem>
                                                <NavLink
                                                    to="#"
                                                    className={classnames({
                                                        active:
                                                            activeTab === "1",
                                                    })}
                                                    onClick={() => {
                                                        tabChange("1");
                                                    }}
                                                    type="button"
                                                >
                                                    <i className="far fa-user"></i>{" "}
                                                    Mis Mascotas
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        <Mascota />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    <Footer />
                </>
            ) : (
                <></>
            )}
        </React.Fragment>
    );
};

export default Profile;
