import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import { useAuth } from "../autheticationInner/AuthContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
} from "../../services/Api";
import { uploadFileUser } from "../autheticationInner/Firebase";

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
    const [userId, setUserId] = useState();

    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };


    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        if (data.nombre === "") {
            data.nombre = nombreUsuario;
        }
        if (data.apellido === "") {
            data.apellido = apellidoUsuario;
        }
        if (data.mail === "") {
            data.mail = mail;
        }
        if (data.celular === "") {
            data.celular = celular;
        }
        if (data.calle === "") {
            data.calle = null
        }
        if (data.nroCalle === "") {
            data.nroCalle = null
        }

        try {
            //setUserData(data);
            if (data.foto !== "") {
                const url = await uploadFileUser(data.foto[0])
                console.log(url) 
                data.foto= url;
                console.log(data)  
            }
            await updateUser(userId, data); // Llama a la función de la API para actualizar los datos del usuario
            navigate("/perfil");
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar el usuario:", error);
        }
    };

 

    //----OBTENER DATOS
    const usuario = async () => {
        setUserData(await getUserMail(user.email));
    };
    const obtenerId = (datos) => {
        setUserId(datos.id);
    };

    const barrio = async () => {
        if (userData.barrioId === 0) {
            setUserBarrio(null);
        } else {
            setUserBarrio(await getBarrioUser(userData.barrioId));
        }
    };
    const ciudad = async () => {
        if (userBarrio === null) {
            setUserCiudad(null);
        } else {
            setUserCiudad(await getCiudadUser(userBarrio.ciudadId));
        }
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

    const nombreUsuario = userData?.nombre;
    const apellidoUsuario = userData?.apellido;
    const mail = userData?.mail;
    const celular = userData?.celular;
    const calle = userData?.calle;
    const nroCalle = userData?.nroCalle;
    const genero = userData?.generoId;
    const nombreBarrio = userBarrio?.nombre;
    const nombreCiudad = userCiudad?.nombre;

    document.title = "Modificar Perfil | Amigos Peludos";
    return (
        <React.Fragment>
            <>
                <Navbar></Navbar>
            </>
            <div className="page-content perfil-fondo">
                <Container fluid>
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
                                                <input
                                                    id="profile-img-file-input"
                                                    type="file"
                                                    className="profile-img-file-input"
                                                    {...register("foto")}
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
                                            <Form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="firstnameInput"
                                                                className="form-label"
                                                            >
                                                                Nombre
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="nombre"
                                                                defaultValue={
                                                                    nombreUsuario
                                                                }
                                                                {...register(
                                                                    "nombre"
                                                                )}
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="apellido"
                                                                defaultValue={
                                                                    apellidoUsuario
                                                                }
                                                                {...register(
                                                                    "apellido"
                                                                )}
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
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="celular"
                                                                defaultValue={
                                                                    celular
                                                                }
                                                                {...register(
                                                                    "celular"
                                                                )}
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
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                name="mail"
                                                                defaultValue={
                                                                    mail
                                                                }
                                                                readOnly
                                                                {...register(
                                                                    "mail"
                                                                )}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="countryInput"
                                                                className="form-label"
                                                            >
                                                                Pais
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="barrio"
                                                                DefaultValue={
                                                                    nombreBarrio
                                                                }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="addressInput"
                                                                className="form-label"
                                                            >
                                                                Direccion
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="calle"
                                                                defaultValue={
                                                                    calle
                                                                }
                                                                {...register(
                                                                    "calle"
                                                                )}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={1}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="numberInput"
                                                                className="form-label"
                                                            >
                                                                Altura
                                                            </Label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                minLength="1"
                                                                maxLength="6"
                                                                defaultValue={
                                                                    nroCalle
                                                                }
                                                                {...register(
                                                                    "nroCalle"
                                                                )}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button
                                                                className="btn btn-primary"
                                                                type="submit"
                                                                
                                                            >
                                                                Actualizar
                                                            </button>
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
                </Container>
            </div>

            <>
                <Footer></Footer>
            </>
        </React.Fragment>
    );
};

export default UserProfileSetting;
