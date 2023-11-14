import React, { useState, useEffect } from "react";
import {
    getUserMail,
    getCuidadores,
    deleteCuidador,
    updateUser,
} from "../../../services/api";
import { Col, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

const ServicioCuidador = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cuidadores, setCuidadores] = useState();
    const { handleSweetAlertDeleteCuidador } = Modal();

    const daysOfWeek = {
        lunes: "Lunes",
        martes: "Martes",
        miercoles: "Miercoles",
        jueves: "Jueves",
        viernes: "Viernes",
        sabado: "Sabado",
        domingo: "Domingo",
    };

    const timePeriods = {
        manana: "Mañana",
        tarde: "Tarde",
        noche: "Noche",
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
                datosUsuario.calle = `${
                    datosUsuario.calle + " " + datosUsuario.nroCalle
                }`;
                setUserData(datosUsuario);
                //setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchServicios = async () => {
            if (userData) {
                try {
                    const dataCuidador = await getCuidadores();

                    // Filtrar paseadores, cuidadores y veterinarias según el userData.id
                    const cuidadoresFiltrados = dataCuidador.filter(
                        (cuidador) => cuidador.idUsuario === userData.id
                    );

                    setCuidadores(cuidadoresFiltrados);

                    setIsLoading(false);
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
            }
        };
        if (userData && userData.id) {
            fetchServicios();
        }
    }, [userData && userData.id]);

    //funcion para eliminar al cudiador
    const handleDeleteCuidador = async () => {
        const idCuidador = cuidadores && cuidadores[0].id;
        const deleteResponse = await deleteCuidador(idCuidador);

        const actualizarUser = {
            esCuidador: null,
        };

        await updateUser(userData.id, actualizarUser);

        console.log(deleteResponse);
        return deleteResponse.success;
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    {cuidadores.length > 0 && (
                        <Row className="mt-4">
                            <Col>
                                {/* Renderizar los datos de paseadores aquí */}
                                {cuidadores.map((cuidador) => (
                                    <div key={cuidador.id}>
                                        <Row>
                                            <Col lg={6}>
                                                <div className="m-3">
                                                    <h2>
                                                        Título:
                                                        {cuidador &&
                                                            cuidador.titulo}
                                                    </h2>
                                                </div>

                                                <div className="m-3">
                                                    <h5>
                                                        {" "}
                                                        <strong>
                                                            {" "}
                                                            Descripción del
                                                            paseador:{" "}
                                                        </strong>
                                                        {cuidador &&
                                                            cuidador.presentacion}
                                                    </h5>
                                                </div>

                                                <Col lg={12}>
                                                    <Row>
                                                        <Row className="mt-4">
                                                            <h3 className="m-3">
                                                                Donde cuido
                                                            </h3>
                                                        </Row>
                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        Realizo
                                                                        cuidados
                                                                        en mi:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                        cuidador.tipoVivienda}{" "}
                                                                </h5>
                                                            </div>
                                                        </Row>

                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        La
                                                                        dirección
                                                                        es:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                        cuidador.calle}{" "}
                                                                    {cuidador &&
                                                                        cuidador.nroCalle}
                                                                    {cuidador.tipoVivienda ===
                                                                    "Departamento"
                                                                        ? `${" - "}Piso/Depto: ${
                                                                              cuidador &&
                                                                              cuidador.piso
                                                                          }`
                                                                        : ""}
                                                                </h5>
                                                            </div>
                                                        </Row>
                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        Barrio:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                        cuidador.barrio}{" "}
                                                                </h5>
                                                            </div>
                                                        </Row>

                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        Cuido
                                                                        mascotas
                                                                        hace:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                        cuidador.experiencia}{" "}
                                                                </h5>
                                                            </div>
                                                        </Row>
                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        Patio o
                                                                        Balcon:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                    cuidador.patioBalcon ===
                                                                        true
                                                                        ? "Si"
                                                                        : "No"}{" "}
                                                                </h5>
                                                            </div>
                                                        </Row>
                                                        <Row>
                                                            <div className="m-3">
                                                                <h5>
                                                                    <strong>
                                                                        Transporte
                                                                        propio:{" "}
                                                                    </strong>
                                                                    {cuidador &&
                                                                    cuidador.transportePropio ===
                                                                        true
                                                                        ? "Si"
                                                                        : "No"}{" "}
                                                                </h5>
                                                            </div>
                                                        </Row>
                                                    </Row>

                                                    <Row>
                                                        <div className="m-3">
                                                            <h5>
                                                                <strong>
                                                                    Teléfono de
                                                                    contácto:{" "}
                                                                </strong>
                                                                {cuidador &&
                                                                    cuidador
                                                                        .datosUsuario
                                                                        .celular}{" "}
                                                            </h5>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className="m-3">
                                                            <h5>
                                                                <strong>
                                                                    El precio
                                                                    por hora de
                                                                    cuidado es
                                                                    de:{" $"}
                                                                </strong>
                                                                {cuidador &&
                                                                    cuidador.precioCuidado}{" "}
                                                            </h5>
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Col>

                                            <Col lg={6} className="">
                                                <Row className="">
                                                    <div className="m-3 text-center">
                                                        <h4>
                                                            <strong>
                                                                Imágenes:{" "}
                                                            </strong>
                                                        </h4>

                                                        <div
                                                            id="carouselExampleControlsCuidador"
                                                            className="carousel slide "
                                                            data-bs-ride="carousel"
                                                        >
                                                            <style>
                                                                {`
                                              
                                                                        .carousel-control-prev-icon,
                                                                        .carousel-control-next-icon {
                                                                            background-color: black;
                                                                            border-radius:50%
                                                                        }
                                                                        `}
                                                            </style>
                                                            <div
                                                                className="carousel-inner"
                                                                role="listbox"
                                                            >
                                                                {cuidador &&
                                                                    cuidador.fotos.map(
                                                                        (
                                                                            foto,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                className={`carousel-item ${
                                                                                    index ===
                                                                                    0
                                                                                        ? "active"
                                                                                        : ""
                                                                                }`}
                                                                                key={
                                                                                    foto.id
                                                                                }
                                                                            >
                                                                                <img
                                                                                    className="d-block img-fluid mx-auto  img-servicios-perfil"
                                                                                    src={
                                                                                        foto.foto
                                                                                    }
                                                                                    alt={`Slide ${
                                                                                        index +
                                                                                        1
                                                                                    }`}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <a
                                                                className="carousel-control-prev"
                                                                href="#carouselExampleControlsCuidador"
                                                                role="button"
                                                                data-bs-slide="prev"
                                                            >
                                                                <span
                                                                    className="carousel-control-prev-icon"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                <span className="sr-only">
                                                                    Previous
                                                                </span>
                                                            </a>
                                                            <a
                                                                className="carousel-control-next"
                                                                href="#carouselExampleControlsCuidador"
                                                                role="button"
                                                                data-bs-slide="next"
                                                            >
                                                                <span
                                                                    className="carousel-control-next-icon"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                <span className="sr-only">
                                                                    Next
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <div className="m-3">
                                                <h5>
                                                    <strong>Horarios: </strong>
                                                </h5>
                                                {/* DIAS DE TRABAJO */}
                                                <Col
                                                    lg={12}
                                                    xl={12}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-75 table-responsive">
                                                        <table className="table table-bordered table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    {Object.keys(
                                                                        daysOfWeek
                                                                    ).map(
                                                                        (
                                                                            day
                                                                        ) => (
                                                                            <th
                                                                                key={
                                                                                    day
                                                                                }
                                                                            >
                                                                                {
                                                                                    daysOfWeek[
                                                                                        day
                                                                                    ]
                                                                                }
                                                                            </th>
                                                                        )
                                                                    )}
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {Object.keys(
                                                                    timePeriods
                                                                ).map(
                                                                    (
                                                                        period
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                period
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    timePeriods[
                                                                                        period
                                                                                    ]
                                                                                }
                                                                            </td>
                                                                            {Object.keys(
                                                                                daysOfWeek
                                                                            ).map(
                                                                                (
                                                                                    day
                                                                                ) => {
                                                                                    const isAvailable =
                                                                                        cuidador &&
                                                                                        cuidador.grilla &&
                                                                                        cuidador
                                                                                            .grilla
                                                                                            .scheduleData &&
                                                                                        cuidador
                                                                                            .grilla
                                                                                            .scheduleData[
                                                                                            day.toLowerCase()
                                                                                        ] &&
                                                                                        cuidador
                                                                                            .grilla
                                                                                            .scheduleData[
                                                                                            day.toLowerCase()
                                                                                        ][
                                                                                            period
                                                                                        ];

                                                                                    const symbolStyle =
                                                                                        isAvailable
                                                                                            ? "green-text"
                                                                                            : "red-text";

                                                                                    return (
                                                                                        <td
                                                                                            key={
                                                                                                day
                                                                                            }
                                                                                            className="checkbox-cell"
                                                                                        >
                                                                                            <span
                                                                                                className={
                                                                                                    symbolStyle
                                                                                                }
                                                                                            >
                                                                                                {isAvailable
                                                                                                    ? "✓"
                                                                                                    : "✗"}
                                                                                            </span>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className=" w-100 d-flex justify-content-end m-3">
                                                <Link
                                                    class="button-pz btn-pz-danger m-3"
                                                    onClick={() =>
                                                        handleSweetAlertDeleteCuidador(
                                                            handleDeleteCuidador
                                                        )
                                                    }
                                                >
                                                    <span class="span-pz text-pz">
                                                        Eliminar Cuidador
                                                    </span>
                                                    <span class="span-pz icon-pz m-1">
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            className="svg-pz"
                                                        >
                                                            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                                        </svg>
                                                    </span>
                                                </Link>

                                                <Link
                                                    class="button-pz btn-pz-success m-3"
                                                    to={`/modificar-cuidador/${cuidador.id}`}
                                                >
                                                    <span class="span-pz text-pz">
                                                        Modificar
                                                    </span>
                                                    <span class="span-pz icon-pz">
                                                        <svg
                                                            viewBox="0 0 490 490"
                                                            className="svg-pz-modificar"
                                                        >
                                                            <g
                                                                transform="translate(0,490) scale(0.1,-0.1)"
                                                                fill="#ffff"
                                                            >
                                                                <path
                                                                    d="M4107 4670 c-32 -12 -77 -32 -100 -47 -23 -14 -181 -164 -352 -334
                                                                l-310 -309 318 -317 318 -318 313 315 c293 295 315 320 352 394 38 79 39 82
                                                                39 190 -1 91 -5 121 -23 166 -44 111 -142 209 -252 252 -81 31 -226 35 -303 8z"
                                                                />
                                                                <path
                                                                    d="M2442 3077 c-424 -424 -772 -777 -772 -782 0 -13 612 -625 625 -625
                                                                3 0 1555 1542 1555 1555 0 13 -612 625 -625 625 -6 0 -358 -348 -783 -773z"
                                                                />
                                                                <path
                                                                    d="M743 3765 c-124 -34 -213 -108 -270 -223 l-38 -76 0 -1360 0 -1361
                                                                23 -58 c34 -82 125 -178 211 -220 l66 -32 1366 0 1365 0 76 38 c121 59 204
                                                                167 228 296 6 34 10 387 10 953 l0 900 -29 29 c-38 37 -82 39 -116 4 l-25 -24
                                                                0 -904 c0 -991 2 -965 -60 -1039 -16 -20 -53 -48 -82 -62 l-52 -26 -1305 0
                                                                c-908 0 -1318 3 -1345 11 -53 15 -138 100 -154 155 -9 32 -12 350 -12 1345 l0
                                                                1304 24 51 c13 28 41 65 62 82 78 65 36 62 1034 62 l907 0 27 26 c35 36 34 77
                                                                -3 115 l-29 29 -914 -1 c-754 0 -922 -3 -965 -14z"
                                                                />
                                                                <path
                                                                    d="M1432 1773 c-73 -208 -133 -386 -132 -396 0 -25 54 -77 79 -77 16 0
                                                                759 255 768 264 1 1 -129 133 -290 294 l-292 292 -133 -377z"
                                                                />
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </Row>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    )}
                </>
            ) : (
                <>
                    <h2>Cargando...</h2>
                </>
            )}
        </React.Fragment>
    );
};

export default ServicioCuidador;
