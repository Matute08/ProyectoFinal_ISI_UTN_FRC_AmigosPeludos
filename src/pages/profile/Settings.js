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
    getAllBarrio,
} from "../../services/api";
import { deleteFileStorage, uploadFileUser } from "../../services/Firebase";
import Loading from "../components/Loading";

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
    const [allBarrio, setAllBarrio] = useState([]);

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
            }
        } else {
            usuario();
        }
    }, [userData]);

    const { register, handleSubmit, setValue, formState:{errors} } = useForm();
    // Definir reglas de validación para el campo de nombre
    const nameValidation = /^[A-Za-z\s]+$/; // Acepta letras y espacios
    useEffect(() => {
        if (userData) {
            setValue("nombreCompleto", `${userData.nombreCompleto}`);
            setValue("mail", userData.mail);
            setValue("celular", userData.celular);
            setValue("calle", userData.calle);
            setValue("nroCalle", userData.nroCalle);
            setValue("generoId", userData.generoId);
            setValue(
                "barrioId",
                userData.barrioId !== 0 ? userData.barrioId : ""
            );
            setValue("foto", userData.foto);
        }
    }, [userData, setValue]);

    //EVENTO SUBMIT
    const onSubmit = async (data) => {
        showLoadingOverlay();
        if (data.barrioId === "") {
            data.barrioId = 0;
        }
        try {
            // Verificar la foto
            if (data.foto === null) {
                console.log("");
            } else if (typeof data.foto === "object" && data.foto.length > 0) {
                if (userData.foto !== null) {
                    deleteFileStorage(userData.foto);
                }
                // La foto es un FileList, se debe realizar una acción
                const url = await uploadFileUser(data.foto[0]);
                data.foto = url;
                setUserData(data);
            }
            await updateUser(userId, data); // Llama a la función de la API para actualizar los datos del usuario
            hideLoadingOverlay();
            navigate(`/perfil/${userData.mail}`);
        } catch (error) {
            // Manejar cualquier error de la actualización
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
        setAllBarrio(await getAllBarrio());
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
                                                    {userData
                                                        ? userData.nombreCompleto
                                                        : ""}
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
                                                                    <label
                                                                        htmlFor="firstnameInput"
                                                                        className="form-label"
                                                                    >
                                                                        Nombre
                                                                        Completo
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${
                                                                            errors.nombreCompleto
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        name="nombreCompleto"
                                                                        {...register(
                                                                            "nombreCompleto",
                                                                            {
                                                                                required: true,
                                                                                pattern:
                                                                                    {
                                                                                        value: nameValidation,
                                                                                        message:
                                                                                            "El nombre solo debe contener letras y espacios.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    />
                                                                    {errors.nombreCompleto && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .nombreCompleto
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
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
                                                                        Número
                                                                        de
                                                                        Celular
                                                                    </Label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="celular"
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
                                                                    <label className="form-label">
                                                                        Barrio{" "}
                                                                    </label>
                                                                    <select
                                                                        name="barrioId"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "barrioId",
                                                                            {}
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>

                                                                        {allBarrio &&
                                                                            allBarrio.map(
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
                                                                        htmlFor="addressInput"
                                                                        className="form-label"
                                                                    >
                                                                        Direccion
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="calle"
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
                                                                        {...register(
                                                                            "nroCalle"
                                                                        )}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="hstack gap-2 justify-content-end">
                                                                    <button
                                                                        class="button-pz btn-pz-success"
                                                                        to={
                                                                            "/perfil"
                                                                        }
                                                                    >
                                                                        <span class="span-pz text-pz">
                                                                            Actualizar
                                                                        </span>
                                                                        <span class="span-pz icon-pz">
                                                                            <svg
                                                                                viewBox="0 0 920 922"
                                                                                className="svg-pz"
                                                                            >
                                                                                <g
                                                                                    transform="translate(0,922) scale(0.1,-0.1)"
                                                                                    fill="#ffff"
                                                                                    stroke="none"
                                                                                >
                                                                                    <path
                                                                                        d="M1350 9199 c-373 -6 -423 -9 -492 -27 -119 -32 -218 -78 -331 
                                                                                    -152 -184 -121 -321 -279 -422 -484 -54 -108 -70 -184 -86 -403 -14 -190 -21 -6170 -8 
                                                                                    -6733 11 -490 26 -592 111 -750 154 -284 398 -492 688 -585 80 -26 102 -28 380 -38 403 
                                                                                    -15 6439 -14 6830 0 267 10 290 12 370 38 297 95 551 318 698 611 79 157 91 246 101 724 4 
                                                                                    190 9 1567 9 3060 l2 2715 -1017 1017 -1018 1018 -2700 -2 c-1485 -1 -2887 -5 -3115 -9z m91 
                                                                                    -1441 c1 -1211 11 -1792 31 -1838 8 -19 38 -56 65 -82 46 -42 56 -47 119 -55 90 -11 4648 -11 
                                                                                    4738 0 63 8 73 13 119 55 27 26 56 62 64 80 26 61 33 442 33 1735 l0 987 158 0 157 0 850 -850 850 
                                                                                    -850 -4 -2966 -3 -2966 -45 -81 c-91 -166 -140 -213 -296 -288 l-85 -41 -212 -9 c-117 -5 -214 -8 
                                                                                    -216 -6 -2 1 -4 682 -6 1512 -3 2060 -9 2599 -30 2645 -8 20 -44 62 -78 93 l-63 57 -2986 0 -2986 
                                                                                    0 -64 -57 c-35 -31 -70 -72 -77 -90 -25 -58 -34 -818 -34 -2851 l0 -1313 -152 6 c-243 10 -300 20 
                                                                                    -387 62 -105 52 -209 157 -273 276 l-48 88 0 3601 0 3601 42 78 c76 143 172 236 307 298 80 37 154 
                                                                                    46 404 49 l107 2 1 -882z m4599 -268 l0 -1150 -2015 0 -2015 0 0 1150 0 1150 2015 0 2015 0 0 -1150z 
                                                                                    m1145 -5036 l0 -1869 -2585 0 -2585 0 -3 1860 c-1 1023 0 1865 2 1870 2 7 873 10 2587 9 l2584 -1 0 
                                                                                    -1869z M4980 8049 c-14 -6 -40 -24 -57 -42 l-33 -31 0 -492 0 -491 46 -36 c56 -44 101 -51 287 -45 138
                                                                                     4 160 10 210 56 l27 26 0 491 0 491 -32 31 c-18 18 -46 37 -61 42 -36 14 -353 13 -387 0z M3240 3451
                                                                                      c-166 -6 -189 -9 -220 -28 -87 -54 -140 -149 -140 -253 0 -81 23 -134 85 -195 86 -87 -33 -80 1335
                                                                                       -83 1210 -3 1810 6 1862 27 47 18 116 89 135 139 12 31 18 73 17 124 -1 94 -27 152 -96 211 -43 36 
                                                                                       -53 40 -129 48 -102 10 -2597 19 -2849 10z M3160 2010 c-121 -7 -150 -19 -208 -85 -49 -56 -72 -119
                                                                                        -72 -199 0 -99 63 -195 162 -248 l43 -23 1460 2 c872 1 1494 5 1543 11 76 9 88 13 130 50 69 58
                                                                                         95 116 96 210 1 51 -5 93 -17 124 -19 49 -87 120 -135 140 -16 7 -131 14 -292 18 -350 8 -2576 9 -2710 0z"
                                                                                    />
                                                                                </g>
                                                                            </svg>
                                                                        </span>
                                                                    </button>

                                                                    <button
                                                                        class="button-pz btn-pz-secondary"
                                                                        to={`/perfil/${userData.mail}`}
                                                                    >
                                                                        <span class="span-pz text-pz">
                                                                            Volver
                                                                        </span>
                                                                        <span class="span-pz icon-pz">
                                                                            <svg
                                                                                viewBox="0 0 232 217"
                                                                                className="svg-pz"
                                                                            >
                                                                                <g
                                                                                    transform="translate(0,210) scale(0.1,-0.1)"
                                                                                    fill="#ffff"
                                                                                    stroke="none"
                                                                                >
                                                                                    <path
                                                                                        d="M740 2163 c-27 -11 -705 -486 -717 -502 -7 -9 -15 -31 -19 -48 -13
                                                                                            -65 5 -79 399 -319 319 -195 373 -224 408 -224 31 0 47 7 70 29 42 42 38 79
                                                                                            -21 205 l-49 106 510 0 509 0 38 -34 37 -34 3 -404 c2 -441 3 -435 -57 -475
                                                                                            l-34 -23 -571 0 -572 0 -44 -22 c-55 -28 -86 -73 -95 -138 -14 -101 16 -180
                                                                                            83 -222 l37 -23 575 -3 c389 -2 597 1 642 8 187 32 350 169 417 353 l26 72 3
                                                                                            425 c3 350 0 439 -12 498 -39 187 -161 330 -342 400 l-69 27 -552 5 -552 5 45
                                                                                            108 c24 59 44 121 44 137 0 60 -85 116 -140 93z"
                                                                                    />
                                                                                </g>
                                                                            </svg>
                                                                        </span>
                                                                    </button>
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
