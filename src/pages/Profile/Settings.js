import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    Button,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import Modal from "react-bootstrap/Modal";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/footer";
import { useAuth } from "../AutheticationInner/authContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
} from "../../services/api";

//import images
import progileBg from "../../assets/images/user/user-random.jpg";
import avatar1 from "../../assets/images/user/user-random.jpg";

const UserProfileSetting = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [userBarrio, setUserBarrio] = useState();
    const [userCiudad, setUserCiudad] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();

    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    //----OBTENER DATOS
    const usuario = async () => {
        setUserData(await getUserMail(user.email));
    };
    const obtenerId = (datos) => {
        setUserId(datos.id);
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
            obtenerId(userData);
        }
    }, [userData]);

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

    const nombreUsuario = userData?.nombre;
    const apellidoUsuario = userData?.apellido;
    const celular = userData?.celular;
    const calle = userData?.calle;
    const nombreBarrio = userBarrio?.nombre;
    const nombreCiudad = userCiudad?.nombre;
    const mail = userData?.mail;

    //ACTUALIZAR DATOS

    const [updateUserData, setUpdateUserData] = useState({});

    useEffect(() => {
        setUpdateUserData({
            nombre: nombreUsuario,
            apellido: apellidoUsuario,
            mail: mail,
            celular: celular,
            calle: calle,
        });
    }, [nombreUsuario, apellidoUsuario, mail, celular, calle]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que se produzca la acción predeterminada de envío del formulario
        try {
            console.log(updateUserData);
            console.log(nombreUsuario);
            console.log(updateUserData.nombre);
            await updateUser(userId, updateUserData); // Llama a la función de la API para actualizar los datos del usuario
            setUserData(updateUserData);
            navigate("/perfil");

            // Actualiza cualquier otro estado o realiza acciones adicionales después de la actualización exitosa
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar el usuario:", error);
        }
    };

    document.title = "Modificar Perfil | Amigos Peludos";
    return (
        <React.Fragment>
            <>
                <Navbar></Navbar>
            </>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img
                                src={progileBg}
                                className="profile-wid-img"
                                alt=""
                            />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input
                                            id="profile-foreground-img-file-input"
                                            type="file"
                                            className="profile-foreground-img-file-input"
                                        />
                                        <Label
                                            htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light"
                                        >
                                            <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                                            Cambiar Fondo
                                        </Label>
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
                                            <img
                                                src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile"
                                            />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input
                                                    id="profile-img-file-input"
                                                    type="file"
                                                    className="profile-img-file-input"
                                                />
                                                <Label
                                                    htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs"
                                                >
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        {/* NOMBRE USUARIO */}
                                        <h5 className="fs-16 mb-1">
                                            {nombreUsuario} {apellidoUsuario}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            Usuario
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                {/* TITULOS PESTAÑAS */}
                                <CardHeader>
                                    <Nav
                                        className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist"
                                    >
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active: activeTab === "1",
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
                                                    active: activeTab === "2",
                                                })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button"
                                            >
                                                <i className="far fa-user"></i>
                                                Cambiar Contraseña
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>

                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            {/* FORMULARIO */}
                                            <Form onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="firstnameInput"
                                                                className="form-label"
                                                            >
                                                                Nombre
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="firstnameInput"
                                                                name="nombre"
                                                                placeholder={
                                                                    nombreUsuario
                                                                }
                                                                defaultValue={
                                                                    nombreUsuario
                                                                }
                                                                onChange={(e) =>
                                                                    setUpdateUserData(
                                                                        {
                                                                            ...updateUserData,
                                                                            nombre: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="lastnameInput"
                                                                className="form-label"
                                                            >
                                                                Apellido
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                name="apellido"
                                                                id="lastnameInput"
                                                                placeholder={
                                                                    apellidoUsuario
                                                                }
                                                                defaultValue={
                                                                    apellidoUsuario
                                                                }
                                                                onChange={(e) =>
                                                                    setUpdateUserData(
                                                                        {
                                                                            ...updateUserData,
                                                                            apellido:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="phonenumberInput"
                                                                className="form-label"
                                                            >
                                                                Numero de
                                                                Celular
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                className="form-control"
                                                                name="celular"
                                                                id="phonenumberInput"
                                                                placeholder={
                                                                    celular
                                                                }
                                                                defaultValue={
                                                                    celular
                                                                }
                                                                onChange={(e) =>
                                                                    setUpdateUserData(
                                                                        {
                                                                            ...updateUserData,
                                                                            celular:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="emailInput"
                                                                className="form-label"
                                                            >
                                                                Correo
                                                                Electronico
                                                            </Label>
                                                            <Input
                                                                type="email"
                                                                className="form-control"
                                                                name="mail"
                                                                id="emailInput"
                                                                defaultValue={
                                                                    mail
                                                                }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>
                                                    {/* <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="JoiningdatInput"
                                                                className="form-label"
                                                            >
                                                                Fecha de
                                                                Nacimiento
                                                            </Label>
                                                            <Flatpickr
                                                                className="form-control"
                                                                options={{
                                                                    dateFormat:
                                                                        "d M, Y",
                                                                }}
                                                            />
                                                        </div>
                                                    </Col> */}

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="countryInput"
                                                                className="form-label"
                                                            >
                                                                Pais
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="countryInput"
                                                                placeholder="Argentina"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="provinceInput"
                                                                className="form-label"
                                                            >
                                                                Provincia
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="provinceInput"
                                                                placeholder="Cordoba"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="cityInput"
                                                                className="form-label"
                                                            >
                                                                Ciudad
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="cityInput"
                                                                placeholder="Cordoba"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="barrioInput"
                                                                className="form-label"
                                                            >
                                                                Barrio
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="barrioInput"
                                                                name="barrio"
                                                                placeholder="Barrio"
                                                                DefaultValue={
                                                                    nombreBarrio
                                                                }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="addressInput"
                                                                className="form-label"
                                                            >
                                                                Direccion
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="addressInput"
                                                                name="calle"
                                                                placeholder={
                                                                    calle
                                                                }
                                                                defaultValue={
                                                                    calle
                                                                }
                                                                onChange={(e) =>
                                                                    setUpdateUserData(
                                                                        {
                                                                            ...updateUserData,
                                                                            calle: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="numberInput"
                                                                className="form-label"
                                                            >
                                                                Altura
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                className="form-control"
                                                                minLength="1"
                                                                maxLength="6"
                                                                id="numberInput"
                                                                placeholder="Numero"
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={
                                                                    handleShow
                                                                }
                                                            >
                                                                Actualizar
                                                            </Button>
                                                            <Link
                                                                to={"/perfil"}
                                                                type="button"
                                                                className="btn btn-soft-success"
                                                            >
                                                                Cancelar
                                                            </Link>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Actualizar Datos</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Deseas actualizar tus datos?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleSubmit}>
                                Actualizar
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>

            <>
                <Footer></Footer>
            </>
        </React.Fragment>
    );
};

export default UserProfileSetting;
