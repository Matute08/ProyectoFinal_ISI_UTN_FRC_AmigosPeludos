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
import { useAuth } from "../../services/AuthContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
    getGenero,
} from "../../services/Api";
import { uploadFileUser } from "../../services/Firebase";
import Loading from "../loading/Loading";

//import images

import avatar1 from "../../assets/images/user/user-random.jpg";

const UserProfileSetting = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [userBarrio, setUserBarrio] = useState();
    const [userCiudad, setUserCiudad] = useState();
    const [userId, setUserId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");
    const [genero, setGenero] = useState([]);
    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    const showLoadingOverlay = () => {
        setIsLoading(true);
    };
    const hideLoadingOverlay = () => {
        setIsLoading(false);
    };

    const handleAsyncTask = async () => {
        showLoadingOverlay();
    };

    useEffect(() => {
        usuario();
        
    }, [user]);

    useEffect(() => {
        const getGeneros = async () => {
            const data = await getGenero();
            if (data) {
                setGenero(data);
            }
        };
        getGeneros();
    }, []);
    useEffect(() => {
        if (userData) {
            obtenerId(userData);
            setIsLoading(false);
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

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        showLoadingOverlay();
        if (data.nombreCompleto === "") {
            data.nombreCompleto = nombreUsuario;
        }

        if (data.mail === "") {
            data.mail = mail;
        }
        if (data.celular === "") {
            data.celular = celular;
        }
        if (data.calle === "") {
            data.calle = null;
        }
        if (data.nroCalle === "") {
            data.nroCalle = null;
        }
        if (data.generoId === "") {
            data.generoId = null;
        }

        try {
            if (data.foto !== "") {
                const url = await uploadFileUser(data.foto[0]);
                data.foto = url;
                setUserData(data);
            }
            await updateUser(userId, data); // Llama a la función de la API para actualizar los datos del usuario
            hideLoadingOverlay();
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

    const nombreUsuario = userData?.nombreCompleto;
    const apellidoUsuario = userData?.apellido;
    const mail = userData?.mail;
    const celular = userData?.celular;
    const calle = userData?.calle;
    const nroCalle = userData?.nroCalle;
    const nombreBarrio = userBarrio?.nombre;
    const nombreCiudad = userCiudad?.nombre;

    document.title = "Modificar Perfil | Amigos Peludos";
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar></Navbar>

                    <div className="page-content perfil-fondo">
                        <Container fluid>
                            <Row>
                                <Col xxl={3}>
                                    <Card className="mt-n5">
                                        <CardBody className="p-4">
                                            <div className="text-center">
                                                <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                    <img
                                                        src={
                                                            userData.foto
                                                                ? userData.foto
                                                                : avatar1
                                                        }
                                                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                        alt="user-profile"
                                                    />
                                                    <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                        <input
                                                            id="profile-img-file-input"
                                                            type="file"
                                                            className="profile-img-file-input"
                                                            {...register(
                                                                "foto"
                                                            )}
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
                                                    {nombreUsuario}
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
                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label
                                                                        htmlFor="firstnameInput"
                                                                        className="form-label"
                                                                    >
                                                                        Nombre
                                                                        Completo
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="nombre"
                                                                        defaultValue={
                                                                            nombreUsuario
                                                                        }
                                                                        {...register(
                                                                            "nombreCompleto"
                                                                        )}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg={2}>
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Genero{" "}
                                                                    </label>
                                                                    <select
                                                                        name="generoId"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "generoId",
                                                                            {}
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        {genero &&
                                                                            genero.map(
                                                                                (
                                                                                    elemento
                                                                                ) => (
                                                                                    <option
                                                                                        className="form-control"
                                                                                        key={
                                                                                            elemento.id
                                                                                        }
                                                                                        value={
                                                                                            elemento.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            elemento.nombre
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                </div>
                                                            </Col>

                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label
                                                                        htmlFor="phonenumberInput"
                                                                        className="form-label"
                                                                    >
                                                                        Numero
                                                                        de
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
                                                            <Col lg={4}>
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
                                                                        defaultValue={
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
                                                                        to={
                                                                            "/perfil"
                                                                        }
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

                    <Footer></Footer>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default UserProfileSetting;
