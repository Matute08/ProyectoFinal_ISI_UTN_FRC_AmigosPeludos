import React, { useEffect, useState } from "react";

import {
    Form,
    Label,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "reactstrap";
import {
    getUserMail,
    getCiudad,
    getAllBarrio,
    postFormularioAdopcion,
    getPublicacionesId
} from "../../../services/api";
import { useAuth } from "../../../services/AuthContext";
import { useForm } from "react-hook-form";

const FormAdoptPets = ({ isOpen, toggle, posteoId }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState();
    const [ciudad, setCiudad] = useState();
    const [barrio, setBarrio] = useState();
    const [publi, setPubli] = useState();

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
        const ciudadMascota = async () => {
            const dataCiudad = await getCiudad();
            if (dataCiudad) {
                setCiudad(dataCiudad);
            }
        };
        const barrioMascota = async () => {
            const dataBarrio = await getAllBarrio();
            if (dataBarrio) {
                setBarrio(dataBarrio);
            }
        };
        const publicacion = async () =>{
            const publiData = await getPublicacionesId(posteoId);
            if (publiData) {
                setPubli(publiData)
            }
        }

        fetchUserData();
        ciudadMascota();
        barrioMascota();
        publicacion();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            //data.tipoViviendaId = data.tipoViviendaId === "1";
            data.estadoResidencia = data.estadoResidencia === "1";
            data.aceptaMascota = data.aceptaMascota === "1";
            data.viviendaCerrada = data.viviendaCerrada === "1";
            data.estadoFormularioId = 1;
            data.usuarioIdSolicitante = userData.id
            data.usuarioIdSolicitado = publi.usuarioId
            data.publicacionMascotaId = parseInt(posteoId, 10);


            console.log("Formulario enviar");
            console.log(data);
            await postFormularioAdopcion(data);

            window.location.reload()
            //navigate("/mascotas-adopcion");
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al enviar el formulario:", error);
        }
    };

    document.title = "Consultar Posteo | Amigos Peludos";
    return (
        <React.Fragment>
            {/* Extra Large Modal */}
            <Modal size="xl" isOpen={isOpen} toggle={toggle}>
                <ModalHeader
                    className="modal-title "
                    id="myExtraLargeModalLabel"
                    toggle={toggle}
                >
                    <h3>Formulario de Adopción</h3>
                </ModalHeader>

                <ModalBody>
                    <p className="description-form">
                        Este formulario es para procesar la solicitud. La
                        concretación de la adopción quedará sujeta a los datos
                        brindados y a la verificación de los mismos.
                    </p>

                    {/* FORMULARIO */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="form-adopt ">
                            {/* nombre  */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Nombre{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        placeholder=" Apellido"
                                        {...register("nombre", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.nombre && (
                                        <span className="text-danger">
                                            {errors.nombre.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/*  apellido */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Apellido
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="apeliido"
                                        placeholder="Apellido"
                                        {...register("apellido", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.apellido && (
                                        <span className="text-danger">
                                            {errors.apellido.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* dni */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        DNI{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="dni"
                                        placeholder="DNI"
                                        {...register("dni", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.dni && (
                                        <span className="text-danger">
                                            {errors.dni.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* telefono de contacto */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Telefono de Contacto{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="celular"
                                        placeholder="Telefono de Contacto"
                                        {...register("celular", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.celular && (
                                        <span className="text-danger">
                                            {errors.celular.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* calle */}
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Dirección{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="calle"
                                        placeholder="Dirección"
                                        {...register("calle", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.calle && (
                                        <span className="text-danger">
                                            {errors.calle.message}
                                        </span>
                                    )}
                                </div>
                            </Col>
                            {/* altura */}
                            <Col lg={2}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Altura de Direccion{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="nroCalle"
                                        placeholder="Dirección"
                                        {...register("nroCalle", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.nroCalle && (
                                        <span className="text-danger">
                                            {errors.nroCalle.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* ciudad */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Ciudad
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <select
                                        name="ciudadId"
                                        className="form-select "
                                        {...register("ciudadId", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        {ciudad &&
                                            ciudad.map((elemento) => (
                                                <option
                                                    className="form-control"
                                                    key={elemento.id}
                                                    value={elemento.id}
                                                >
                                                    {elemento.nombre}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.ciudad && (
                                        <span className="text-danger">
                                            {errors.ciudad.message}
                                        </span>
                                    )}
                                </div>
                            </Col>
                            {/* barrio */}
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Barrio
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <select
                                        name="barrio"
                                        className="form-select "
                                        {...register("barrio", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        {barrio &&
                                            barrio.map((elemento) => (
                                                <option
                                                    className="form-control"
                                                    key={elemento.id}
                                                    value={elemento.id}
                                                >
                                                    {elemento.nombre}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.barrio && (
                                        <span className="text-danger">
                                            {errors.barrio.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* vivienda */}
                            <Col lg={6}>
                                <Label className="form-label">
                                    ¿En qué tipo de vivienda habitás?{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <div className="form-control radio-options">
                                    <label className="radio-label">
                                        <input
                                            name="tipoViviendaId"
                                            {...register("tipoViviendaId", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="0"
                                        />

                                        <span className="radio-text">Casa</span>
                                    </label>

                                    <label className="radio-label">
                                        <input
                                            name="tipoViviendaId"
                                            {...register("tipoViviendaId", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="1"
                                        />

                                        <span className="radio-text">
                                            Departamento
                                        </span>
                                    </label>
                                </div>
                                {errors.tipoViviendaId && (
                                    <span className="text-danger">
                                        {errors.tipoViviendaId.message}
                                    </span>
                                )}
                            </Col>

                            {/* propietario o inquilino */}
                            <Col lg={6}>
                                <Label className="form-label">
                                    Es usted..{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <div className="form-control radio-options">
                                    <label className="radio-label">
                                        <input
                                            name="estadoResidencia"
                                            {...register("estadoResidencia", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="0"
                                        />

                                        <span className="radio-text">
                                            Propietario
                                        </span>
                                    </label>

                                    <label className="radio-label">
                                        <input
                                            name="estadoResidencia"
                                            {...register("estadoResidencia", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="1"
                                        />

                                        <span className="radio-text">
                                            Inquilino
                                        </span>
                                    </label>
                                </div>
                                {errors.estadoResidencia && (
                                    <span className="text-danger">
                                        {errors.estadoResidencia.message}
                                    </span>
                                )}
                            </Col>

                            {/* podes tener mascotas */}
                            <Col lg={6}>
                                <Label className="form-label">
                                    ¿Podes tener mascotas donde habitas?{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <div className="form-control radio-options">
                                    <label className="radio-label">
                                        <input
                                            name="aceptaMascota"
                                            {...register("aceptaMascota", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="1"
                                        />

                                        <span className="radio-text">Si.</span>
                                    </label>

                                    <label className="radio-label">
                                        <input
                                            name="aceptaMascota"
                                            {...register("aceptaMascota", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="0"
                                        />

                                        <span className="radio-text">No</span>
                                    </label>
                                </div>
                                {errors.aceptaMascota && (
                                    <span className="text-danger">
                                        {errors.aceptaMascota.message}
                                    </span>
                                )}
                            </Col>

                            {/* tenes red */}
                            <Col lg={6}>
                                <Label className="form-label">
                                    ¿Tenés cerramientos en los balcones y/o
                                    ventanas? (red o rejas){" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <div className="form-control radio-options">
                                    <label className="radio-label">
                                        <input
                                            name="viviendaCerrada"
                                            {...register("viviendaCerrada", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="1"
                                        />

                                        <span className="radio-text">Si.</span>
                                    </label>

                                    <label className="radio-label">
                                        <input
                                            name="viviendaCerrada"
                                            {...register("viviendaCerrada", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "El campo es requerido",
                                                },
                                            })}
                                            type="radio"
                                            value="0"
                                        />

                                        <span className="radio-text">No.</span>
                                    </label>
                                </div>
                                {errors.viviendaCerrada && (
                                    <span className="text-danger">
                                        {errors.viviendaCerrada.message}
                                    </span>
                                )}
                            </Col>

                            {/* tenes mascotas */}
                            <Col lg={12}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        ¿Tenés otras mascotas? Si es afirmativo,
                                        cuales{" "}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="otrasMascotas"
                                        placeholder="No/Si"
                                        {...register("otrasMascotas", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El campo es requerido",
                                            },
                                        })}
                                    />
                                    {errors.otrasMascotas && (
                                        <span className="text-danger">
                                            {errors.otrasMascotas.message}
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
                                            Enviar
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
                                        onClick={toggle}
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
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default FormAdoptPets;
