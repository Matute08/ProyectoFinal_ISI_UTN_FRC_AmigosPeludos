import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Label,
    Row,
    Card,
    CardBody,
    CardHeader,
    Container,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import { useAuth } from "../../../../services/AuthContext";
import {
    getTipoMascota,
    getSexoMascota,
    getAllEdadMascota,
    postMascota,
    getUserMail,
    updateUser,
    getAllRazaId,
} from "../../../../services/api";
import classnames from "classnames";
import { uploadFilePetsUser } from "../../../../services/Firebase";
import Loading from "../../../components/Loading";

import userRandom from "../../../../assets/images/user/user-random.jpg";

const FormAddPets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [tipoMascota, setTipoMascota] = useState();
    const [tipoSexo, setTipoSexo] = useState();
    const [edadMascota, setEdadMascota] = useState();
    const [raza, setRaza] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");

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
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${datosUsuario.calle + " " + datosUsuario.nroCalle}`;
                setUserData(datosUsuario);
                setIsLoading(false);
            }
        };
        const tipoMascotas = async () => {
            const dataTipoMascota = await getTipoMascota();
            if (dataTipoMascota) {
                setTipoMascota(dataTipoMascota);
            }
        };
        const tipoSexo = async () => {
            const dataTipoSexo = await getSexoMascota();
            if (dataTipoSexo) {
                setTipoSexo(dataTipoSexo);
            }
        };
        const edadMascota = async () => {
            const dataEdadMascota = await getAllEdadMascota();
            if (dataEdadMascota) {
                setEdadMascota(dataEdadMascota);
            }
        };
        fetchUserData();
        tipoMascotas();
        tipoSexo();
        edadMascota();
    }, []);

    const getRaza = async (e) => {
        const op = e.target.value;
        setRaza(await getAllRazaId(op));
        if (raza) {
            console.log(raza);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        showLoadingOverlay();
        data.idUsuario = `${userData.id}`;
        userData.tieneMascota = true;

        if (data.castracion === "1") {
            data.castracion = true;
        } else {
            data.castracion = false;
        }

        try {
            if (data.foto) {
                const url = await uploadFilePetsUser(data.foto[0]);
                data.foto = url;
            }
            await postMascota(data);
            await updateUser(userData.id, userData);
            hideLoadingOverlay();
            navigate("/perfil");
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar el usuario:", error);
        }
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Container fluid className="page-content perfil-fondo">
                        <Row>
                            <Col xl={3}>
                                <Card className="mt-n5">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                <img
                                                    src={userRandom}
                                                    className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                    alt="user-profile"
                                                />
                                                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                    <input
                                                        id="profile-img-file-input"
                                                        type="file"
                                                        className="profile-img-file-input"
                                                        {...register("foto", {
                                                            required: {
                                                                value: true,
                                                                message:
                                                                    "La foto de la mascota es obligatoria",
                                                            },
                                                        })}
                                                    />

                                                    {errors.foto && (
                                                        <span className="text-danger">
                                                            {
                                                                errors.foto
                                                                    .message
                                                            }
                                                        </span>
                                                    )}
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
                                            {/* NOMBRE MASCOTA */}
                                            <h5 className="fs-16 mb-1">
                                                Foto de la mascota{" "}
                                                <span className="text-danger">
                                                    *
                                                </span>
                                            </h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col xl={9} >
                                <Card className="mt-n5">
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
                                                    Agregar Mascota
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        {/* FORMULARIO */}
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Nombre de la mascota
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="nombre"
                                                            placeholder="Nombre de la mascota"
                                                            {...register(
                                                                "nombre",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El nombre de la mascota es requerido",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.nombre && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .nombre
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Tipo de Mascota{" "}
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </label>
                                                        <select
                                                            name="tipoId"
                                                            className="form-select "
                                                            {...register(
                                                                "tipoId",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El tipo de la mascota es requerido.",
                                                                    },
                                                                }
                                                            )}
                                                            onChange={getRaza}
                                                        >
                                                            <option value="">
                                                                Seleccione un
                                                                tipo de mascota
                                                            </option>
                                                            {tipoMascota &&
                                                                tipoMascota.map(
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
                                                                                elemento.tipo
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                        </select>
                                                        {errors.tipoId && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .tipoId
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Raza
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <select
                                                            name="raza"
                                                            className="form-select "
                                                            {...register(
                                                                "razaId",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "La raza de la mascota es requerida.",
                                                                    },
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            {raza &&
                                                                raza.map(
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
                                                        {errors.raza && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors.raza
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Edad aproximada
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <select
                                                            name="edadId"
                                                            className="form-select "
                                                            {...register(
                                                                "edadId",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "La edad de la mascota es requerida.",
                                                                    },
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            {edadMascota &&
                                                                edadMascota.map(
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
                                                                                elemento.descripcion
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                        </select>
                                                        {errors.edadId && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .edadId
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={2}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Peso
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="peso"
                                                            placeholder="Peso aproximado"
                                                            {...register(
                                                                "peso",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El peso de la mascota es requerido",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.peso && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors.peso
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={2}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Castrada/o
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <select
                                                            name="castracion"
                                                            className="form-select "
                                                            {...register(
                                                                "castracion",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "Debe seleccionar si se encuentra castrada/o.",
                                                                    },
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            <option value="1">
                                                                Si
                                                            </option>
                                                            <option value="0">
                                                                No
                                                            </option>
                                                        </select>
                                                        {errors.castracion && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .castracion
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col lg={2}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Sexo Mascota
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <select
                                                            name="sexoId"
                                                            className="form-select "
                                                            {...register(
                                                                "sexoId",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El sexo de la mascota es requerido.",
                                                                    },
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            {tipoSexo &&
                                                                tipoSexo.map(
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
                                                        {errors.sexoId && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .sexoId
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Color
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="color"
                                                            placeholder="Color"
                                                            {...register(
                                                                "color",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El color de la mascota es requerido",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.color && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors.color
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Descripción de la
                                                            mascota
                                                        </Label>
                                                        <textarea
                                                            type="text"
                                                            className="form-control"
                                                            name="descripcion"
                                                            {...register(
                                                                "descripcion",
                                                                {
                                                                    maxLength: {
                                                                        value: 400,
                                                                        message:
                                                                            "El maximo de caracteres es 400",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.descripcion && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .descripcion
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            class="button-pz btn-pz-success"
                                                            type="submit"
                                                        >
                                                            <span class="span-pz text-pz">
                                                                Agregar Mascota
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
                                                            onClick={() => {
                                                                navigate(
                                                                    `/perfil/${userData && userData.mail}`
                                                                );
                                                            }}
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
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default FormAddPets;
