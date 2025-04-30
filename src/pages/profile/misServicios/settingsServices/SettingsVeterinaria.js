import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import Map from "../../../components/maps/MapaUbicacionParticular.js";

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
    Table,
    Input,
} from "reactstrap";


import {
    getAllBarrio,
    getVeterinariaId,
    updateHorarioVeterinaria,
    updateServicioVeterinaria,
    updateVeterinaria,
} from "../../../../services/commonApi.js";
import { getUserMail } from "../../../../services/userApi.js";
import Loading from "../../../components/Loading.js";
import Footer from "../../../landing/Footer.js";
import Navbar from "../../../landing/Navbar.js";

const SettingsVeterinarias = () => {
    const { veterinariaId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState();
    const [barrio, setBarrio] = useState([]);
    const [direccion, setDireccion] = useState("");
    const [altura, setAltura] = useState("");
    const [selectedBarrio, setSelectedBarrio] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");
    const [veterinaria, setVeterinaria] = useState([]);
    const [dataHorario, setDataHorario] = useState();
    const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres
    const [operationsCompleted, setOperationsCompleted] = useState(0);
    const [longitud, setLongitud] = useState();
    const [isGeocoding, setIsGeocoding] = useState(false); // Nuevo estado para rastrear la geocodificación
    const [latitud, setLatitud] = useState();

    const [horarios, setHorarios] = useState({
        lunes: ["", "", "", ""],
        martes: ["", "", "", ""],
        miercoles: ["", "", "", ""],
        jueves: ["", "", "", ""],
        viernes: ["", "", "", ""],
        sabado: ["", "", "", ""],
        domingo: ["", "", "", ""],
    });

    const [checkBoxState, setCheckBoxState] = useState({
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
    });

    const [diasDesde, setDiasDesde] = useState(0);
    const [horariosConcatenados, setHorariosConcatenados] = useState();
    const [diasHasta, setDiasHasta] = useState(0);

    const handleDiasDesdeChange = (e) => {
        setDiasDesde(Number(e.target.value));
    };
    const handleMapClick = (lat, lng) => {
        setLatitud(lat);
        setLongitud(lng);
    };
    const handleLocationChange = (location) => {
        setLatitud(location.lat);
        setLongitud(location.lon);
    };
    //formulario Hook
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        trigger,
    } = useForm();

    // Función para manejar cambios en el campo de texto
    const handleTextareaChange = (e) => {
        const charCount = e.target.value.length;
        setCharCount(charCount); // Actualiza el estado con la cantidad de caracteres
    };

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const showLoadingOverlay = () => {
        setIsLoading(true);
    };
    const hideLoadingOverlay = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                const dataLocalStorage = JSON.parse(cachedUserData);
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                setUserData(datosUsuario);
                setOperationsCompleted((prev) => prev + 1);
            }
        };

        const fetchDataMain = async () => {
            const fetchedVeterinaria = await getVeterinariaId(veterinariaId);
            const barrioData = await getAllBarrio();

            if (fetchedVeterinaria && barrioData) {
                setBarrio(barrioData);
                setVeterinaria(fetchedVeterinaria);

                setOperationsCompleted((prev) => prev + 1);
            }
        };

        if (veterinariaId) {
            fetchDataMain();
            fetchData();
        }
    }, [veterinariaId]);

    useEffect(() => {
        const fetchData = async () => {
            if (veterinaria && barrio) {
                setValue("nombre", `${veterinaria.nombre}`);
                setValue("barrioId", veterinaria.barrioId);
                setValue("direccion", `${veterinaria.direccion}`);
                setValue("numeroCalle", `${veterinaria.numeroCalle}`);
                setValue("numeroTelefono", `${veterinaria.numeroTelefono}`);
                setValue("cuil", `${veterinaria.cuil}`);
                setLatitud(veterinaria.latitud);
                setLongitud(veterinaria.longitud);
                setDireccion(veterinaria.direccion)
                setAltura(veterinaria.numeroCalle)
                setSelectedBarrio(veterinaria.barrio)
                setValue(
                    "castraciones",
                    veterinaria.servicios &&
                        veterinaria.servicios.castraciones === true
                        ? "true"
                        : "false"
                );

                setValue(
                    "internaciones",
                    veterinaria.servicios &&
                        veterinaria.servicios.internaciones === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "vacunaciones",
                    veterinaria.servicios &&
                        veterinaria.servicios.vacunaciones === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "equipoLaboratorio",
                    veterinaria.servicios &&
                        veterinaria.servicios.equipoLaboratorio === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "radiografias",
                    veterinaria.servicios &&
                        veterinaria.servicios.radiografias === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "ecografias",
                    veterinaria.servicios &&
                        veterinaria.servicios.ecografias === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "guardia24hs",
                    veterinaria.servicios &&
                        veterinaria.servicios.guardia24hs === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "emergencias",
                    veterinaria.servicios &&
                        veterinaria.servicios.emergencias === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "observaciones",
                    veterinaria.servicios &&
                        veterinaria.servicios.observaciones === true
                        ? "true"
                        : "false"
                );
                setValue(
                    "otros",
                    veterinaria.servicios && veterinaria.servicios.otros !== ""
                        ? veterinaria.servicios.otros
                        : ""
                );

                setValue(
                    "cbu",
                    `${veterinaria.cbu}` !== null ? veterinaria.cbu : ""
                );

                setOperationsCompleted((prev) => prev + 1);
            }
        };

        fetchData();
    }, [veterinaria, barrio, setValue]);

    useEffect(() => {
        if (operationsCompleted === 3) {
            setIsLoading(false);
        }
    }, [operationsCompleted]);

    const handleKeyPress = (e) => {
        // Permitir solo números (0-9) y la tecla de retroceso
        const regex = /^[0-9\b]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleDiasHastaChange = (e) => {
        setDiasHasta(Number(e.target.value));
    };

    const handleCheckBoxChange = (dia, value) => {
        setCheckBoxState((prevState) => ({
            ...prevState,
            [dia]: value,
        }));
    };
    const generarTabla = () => {
        if (diasDesde === 0 || diasHasta === 0) {
            return null;
        }

        const diasSeleccionados = [...Array(7).keys()].slice(
            diasDesde - 1,
            diasHasta
        );

        return (
            <Table striped bordered responsive>
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>
                            Horario de <br /> Corrido
                        </th>
                        <th>Desde Turno Mañana</th>
                        <th>Hasta Turno Mañana</th>
                        <th>Desde Turno Tarde</th>
                        <th>Hasta Turno Tarde</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(horarios).map(
                        (dia, index) =>
                            diasSeleccionados.includes(index) && (
                                <tr key={dia}>
                                    <td>{dia}</td>
                                    <td>
                                        <Input
                                            type="checkbox"
                                            checked={checkBoxState[dia]}
                                            onChange={(e) =>
                                                handleCheckBoxChange(
                                                    dia,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="select"
                                            value={horarios[dia][0]}
                                            onChange={(e) =>
                                                handleHorarioChange(
                                                    dia,
                                                    0,
                                                    e.target.value
                                                )
                                            }
                                            //disabled={checkBoxState[dia]}
                                        >
                                            <option value="">
                                                Seleccione...
                                            </option>
                                            <option value="8am">8am</option>
                                            <option value="9am">9am</option>
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type="select"
                                            value={horarios[dia][1]}
                                            onChange={(e) =>
                                                handleHorarioChange(
                                                    dia,
                                                    1,
                                                    e.target.value
                                                )
                                            }
                                            disabled={checkBoxState[dia]}
                                        >
                                            <option value="">
                                                Seleccione...
                                            </option>
                                            <option value="8:00">8:00</option>
                                            <option value="8:15">8:15</option>
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type="select"
                                            value={horarios[dia][2]}
                                            onChange={(e) =>
                                                handleHorarioChange(
                                                    dia,
                                                    2,
                                                    e.target.value
                                                )
                                            }
                                            disabled={checkBoxState[dia]}
                                        >
                                            <option value="">
                                                Seleccione...
                                            </option>
                                            <option value="13:00">13:00</option>
                                            <option value="14:00">14:00</option>
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type="select"
                                            value={horarios[dia][3]}
                                            onChange={(e) =>
                                                handleHorarioChange(
                                                    dia,
                                                    3,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Seleccione...
                                            </option>
                                            <option value="17:00">17:00</option>
                                            <option value="18:00">18:00</option>
                                        </Input>
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </Table>
        );
    };

    const handleHorarioChange = (dia, turno, value) => {
        setHorarios((prevHorarios) => ({
            ...prevHorarios,
            [dia]: prevHorarios[dia].map((horario, index) =>
                index === turno ? value : horario
            ),
        }));
    };

    const generarHorariosConcatenados = () => {
        const horariosConcatenados = {};
        for (const dia in horarios) {
            const [desdeManana, hastaManana, desdeTarde, hastaTarde] =
                horarios[dia];
            if (desdeManana && hastaManana && desdeTarde && hastaTarde) {
                horariosConcatenados[
                    dia
                ] = `Turno Mañana desde ${desdeManana} hasta ${hastaManana} y Turno Tarde desde ${desdeTarde} hasta ${hastaTarde}`;
            } else if (desdeManana && hastaTarde) {
                horariosConcatenados[
                    dia
                ] = `Horario corrido desde ${desdeManana} hasta ${hastaTarde}`;
            } else {
                const turnos = [];
                if (desdeManana && hastaManana) {
                    turnos.push(
                        `Turno Mañana desde ${desdeManana} hasta ${hastaManana}`
                    );
                }
                if (desdeTarde && hastaTarde) {
                    turnos.push(
                        `Turno Tarde desde ${desdeTarde} hasta ${hastaTarde}`
                    );
                }
                horariosConcatenados[dia] = turnos.join(" y ");
            }
        }
        horariosConcatenados.idVeterinaria = parseInt(veterinariaId,10)
        horariosConcatenados.id = parseInt(veterinaria&& veterinaria.horarios&&veterinaria.horarios.id,10)

        return horariosConcatenados;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
    };
    useEffect(() => {
        const hsConcatenados = generarHorariosConcatenados();
        setHorariosConcatenados(hsConcatenados);
    }, [horarios]);

    const onSubmit = async ({ ...data }) => {
        if (isGeocoding) {
            // Evita enviar el formulario si la geocodificación está en curso
            return;
        }
        setIsGeocoding(true); // Indica que la geocodificación está en curso
        data.latitud = Number(latitud.toFixed(5));
        data.longitud = Number(longitud.toFixed(5));
        data.barrioId = parseInt(data.barrioId, 10);
        data.numeroCalle = parseInt(data.numeroCalle, 10);
        data.cbu = data.cbu === null ? " " : data.cbu
        
        data.estadoId = veterinaria&& parseInt(veterinaria.estadoId,10);
        data.usuarioId = veterinaria&& parseInt(veterinaria.usuarioId,10)
        data.fechaAlta = veterinaria && veterinaria.fechaAlta;
        data.id = veterinaria&& parseInt(veterinaria.id,10)
        const isValid = await trigger();
        if (isValid) {
            data.horario=horariosConcatenados
        }

        const dataHorario = data.horario
        // Realiza la conversión de valores booleanos en el objeto "servicios"
        const servicios = {
            castraciones: data.castraciones === "true" ? true : false,
            internaciones: data.internaciones === "true" ? true : false,
            vacunaciones: data.vacunaciones === "true" ? true : false,
            equipoLaboratorio: data.equipoLaboratorio === "true" ? true : false,
            radiografias: data.radiografias === "true" ? true : false,
            ecografias: data.ecografias === "true" ? true : false,
            guardia24hs: data.guardia24hs === "true" ? true : false,
            emergencias: data.emergencias === "true" ? true : false,
            observaciones: data.observaciones === "true" ? true : false,
            otros: data.otros === "" ? null : data.otros ,
            idVeterinaria: parseInt(veterinariaId,10),
            id: parseInt(veterinaria&& veterinaria.servicios&&veterinaria.servicios.id,10)
        };
        const dataServicios = servicios
        delete data.castraciones
        delete data.internaciones
        delete data.vacunaciones
        delete data.equipoLaboratorio
        delete data.radiografias
        delete data.ecografias
        delete data.guardia24hs
        delete data.emergencias
        delete data.observaciones
        delete data.otros
        delete data.horario
        delete data.diasDesde
        delete data.diasHasta

       console.log(data);
       
       showLoadingOverlay();

        try {
            console.log(data);
            console.log(dataHorario);
            console.log(dataServicios);
            await updateVeterinaria(veterinariaId, data);
            await updateHorarioVeterinaria(veterinariaId, dataHorario)
            await updateServicioVeterinaria(veterinariaId, dataServicios)
            hideLoadingOverlay();
            navigate(`/perfil/${userData.mail}`);
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al realizar la publicación:", error);
        }
    };

    document.title = "Modificar Veterinaria | Amigos Peludos";
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar></Navbar>
                    <Container fluid className="page-content perfil-fondo">
                        <Row>
                            {/* fotos */}
                            <Col xl={3}>
                                <Card className="mt-n5">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            {/* NOMBRE */}
                                            <h5 className="fs-16 mb-1">
                                                Veterinaria{" "}
                                                {veterinaria &&
                                                    veterinaria.nombre}
                                            </h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col xl={9}>
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
                                                    Actualizar Datos Veterinaria
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        {/* FORMULARIO */}
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                {/* nombre vete */}
                                                <Col
                                                    lg={3}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Nombre Veterinaria
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.nombre
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="nombre"
                                                            placeholder="Nombre Veterinaria"
                                                            {...register(
                                                                "nombre",
                                                                {
                                                                    validate: (
                                                                        value
                                                                    ) => {
                                                                        if (
                                                                            value.trim() ===
                                                                            ""
                                                                        ) {
                                                                            return "Este campo es obligatorio";
                                                                        }
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.nombre &&
                                                            !userData.nombre && (
                                                                <p className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .nombre
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </Col>

                                                {/* BARRIO */}
                                                <Col
                                                    lg={3}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Barrio
                                                        </Label>
                                                        <select
                                                            name="barrioId"
                                                            className={`form-select ${
                                                                errors.barrioId
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            {...register(
                                                                "barrioId",
                                                                {
                                                                    required:
                                                                        "Seleccione una opción",
                                                                }
                                                            )}
                                                            onChange={(e) => {
                                                                setSelectedBarrio(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            {barrio.map(
                                                                (elemento) => (
                                                                    <option
                                                                        key={
                                                                            elemento.id
                                                                        }
                                                                        value={parseInt(
                                                                            elemento.id,
                                                                            10
                                                                        )}
                                                                    >
                                                                        {
                                                                            elemento.nombre
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        {errors.barrioId && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .barrioId
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* direccion */}
                                                <Col
                                                    lg={3}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Dirección:
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.direccion
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="direccion"
                                                            placeholder="Dirección"
                                                            {...register(
                                                                "direccion",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onBlur={(e) => {
                                                                setDireccion(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                        {errors.direccion && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .direccion
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* numero direccion */}
                                                <Col
                                                    lg={1}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Altura:
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            maxLength={4}
                                                            className={`form-control ${
                                                                errors.numeroCalle
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="numeroCalle"
                                                            placeholder="Altura"
                                                            {...register(
                                                                "numeroCalle",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onBlur={(e) => {
                                                                setAltura(
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    )
                                                                ); // Parsea el valor a un número usando parseInt
                                                            }}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.numeroCalle && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .numeroCalle
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* celular */}
                                                <Col
                                                    lg={2}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Celular de Contácto
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            maxLength={15}
                                                            className={`form-control ${
                                                                errors.numeroTelefono
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="numeroTelefono"
                                                            placeholder="Celular de Contácto"
                                                            {...register(
                                                                "numeroTelefono",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.numeroTelefono && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .numeroTelefono
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* cuit */}

                                                <Col
                                                    lg={4}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            CUIT
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            maxLength={11}
                                                            className={`form-control ${
                                                                errors.cuil
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="cuil"
                                                            placeholder="CUIT Veterinaria"
                                                            {...register(
                                                                "cuil",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.cuil && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors.cuil
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col lg={5}>
                                                    <Row className="w-75">
                                                        <Col
                                                            lg={12}
                                                            className="d-flex justify-content-center"
                                                        >
                                                            <div className="mb-3 w-100">
                                                                <Label className="form-label">
                                                                    Ingrese su
                                                                    CBU para
                                                                    recibir
                                                                    transferencias
                                                                </Label>
                                                                <input
                                                                    type="text"
                                                                    maxLength={
                                                                        15
                                                                    }
                                                                    className={`form-control `}
                                                                    {...register(
                                                                        "cbu"
                                                                    )}
                                                                    placeholder="CBU"
                                                                    onKeyPress={
                                                                        handleKeyPress
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg={12}>
                                                    <Map
                                                        onMapClick={
                                                            handleMapClick
                                                        }
                                                        direccion={direccion}
                                                        altura={altura}
                                                        ciudad={"Cordoba"}
                                                        pais={"Argentina"}
                                                        barrio={selectedBarrio}
                                                        onLocationChange={
                                                            handleLocationChange
                                                        }
                                                    />
                                                </Col>

                                                <Col className="mt-5" lg={12}>
                                                    <div className="w-100 text-center">
                                                        <h5>
                                                            Indique el horario
                                                            laboral de la
                                                            veterinaria
                                                        </h5>
                                                        <p>
                                                            Seleccione los días
                                                            laborables
                                                        </p>
                                                        <div className="d-flex justify-content-center">
                                                            <div className="m-3">
                                                                <label>
                                                                    Desde:
                                                                </label>
                                                                <select
                                                                    type="select"
                                                                    name="diasDesde"
                                                                    className={`form-select ${
                                                                        errors.diasDesde
                                                                            ? "is-invalid"
                                                                            : ""
                                                                    }`}
                                                                    {...register(
                                                                        "diasDesde",
                                                                        {
                                                                            required:
                                                                                "Seleccione una opción",
                                                                        }
                                                                    )}
                                                                    onChange={
                                                                        handleDiasDesdeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        Seleccione
                                                                        el día
                                                                        inicial
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            1
                                                                        }
                                                                    >
                                                                        Lunes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            2
                                                                        }
                                                                    >
                                                                        Martes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            3
                                                                        }
                                                                    >
                                                                        Miércoles
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            4
                                                                        }
                                                                    >
                                                                        Jueves
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            5
                                                                        }
                                                                    >
                                                                        Viernes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            6
                                                                        }
                                                                    >
                                                                        Sábado
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            7
                                                                        }
                                                                    >
                                                                        Domingo
                                                                    </option>
                                                                </select>
                                                                {errors.diasDesde && (
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors
                                                                                .diasDesde
                                                                                .message
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="m-3">
                                                                <label>
                                                                    Hasta:
                                                                </label>
                                                                <select
                                                                    type="select"
                                                                    name="diasHasta"
                                                                    className={`form-select ${
                                                                        errors.diasHasta
                                                                            ? "is-invalid"
                                                                            : ""
                                                                    }`}
                                                                    {...register(
                                                                        "diasHasta",
                                                                        {
                                                                            required:
                                                                                "Seleccione una opción",
                                                                        }
                                                                    )}
                                                                    onChange={
                                                                        handleDiasHastaChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        Seleccione
                                                                        el día
                                                                        inicial
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            1
                                                                        }
                                                                    >
                                                                        Lunes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            2
                                                                        }
                                                                    >
                                                                        Martes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            3
                                                                        }
                                                                    >
                                                                        Miércoles
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            4
                                                                        }
                                                                    >
                                                                        Jueves
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            5
                                                                        }
                                                                    >
                                                                        Viernes
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            6
                                                                        }
                                                                    >
                                                                        Sábado
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            7
                                                                        }
                                                                    >
                                                                        Domingo
                                                                    </option>
                                                                </select>
                                                                {errors.diasHasta && (
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors
                                                                                .diasHasta
                                                                                .message
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {generarTabla()}
                                                    </div>
                                                </Col>

                                                <Col lg={12}>
                                                    <div className="w-100 text-center mt-5">
                                                        <h5>
                                                            Indique los
                                                            servicios brindados
                                                        </h5>

                                                        <Row className="w-100">
                                                            {/* Castraciones */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Castraciones
                                                                    </Label>
                                                                    <select
                                                                        name="castraciones"
                                                                        className={`form-select ${
                                                                            errors.castraciones
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "castraciones",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.castraciones && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .castraciones
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            {/* internaciones */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Internaciones
                                                                    </Label>
                                                                    <select
                                                                        name="internaciones"
                                                                        className={`form-select ${
                                                                            errors.internaciones
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "internaciones",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.internaciones && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .internaciones
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* vacunaciones */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Vacunaciones
                                                                    </Label>
                                                                    <select
                                                                        name="vacunaciones"
                                                                        className={`form-select ${
                                                                            errors.vacunaciones
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "vacunaciones",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.vacunaciones && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .vacunaciones
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            {/* radiografias */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Radiografias
                                                                    </Label>
                                                                    <select
                                                                        name="radiografias"
                                                                        className={`form-select ${
                                                                            errors.radiografias
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "radiografias",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.radiografias && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .radiografias
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* ecografias */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Ecografias
                                                                    </Label>
                                                                    <select
                                                                        name="ecografias"
                                                                        className={`form-select ${
                                                                            errors.ecografias
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "ecografias",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.ecografias && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .ecografias
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* guardia24hs */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Haces
                                                                        Guardias
                                                                        24hs
                                                                    </Label>
                                                                    <select
                                                                        name="guardia24hs"
                                                                        className={`form-select ${
                                                                            errors.guardia24hs
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "guardia24hs",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.guardia24hs && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .guardia24hs
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* emergencias */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Realizas
                                                                        Emergencias
                                                                        a
                                                                        Domicilio
                                                                    </Label>
                                                                    <select
                                                                        name="emergencias"
                                                                        className={`form-select ${
                                                                            errors.emergencias
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "emergencias",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.emergencias && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .emergencias
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* observaciones */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Realizas
                                                                        Observaciones
                                                                        Gratis
                                                                    </Label>
                                                                    <select
                                                                        name="observaciones"
                                                                        className={`form-select ${
                                                                            errors.observaciones
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "observaciones",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.observaciones && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .observaciones
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            {/* equipoLaboratorio */}
                                                            <Col
                                                                lg={4}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Extracciones
                                                                        de
                                                                        sangre
                                                                    </Label>
                                                                    <select
                                                                        name="equipoLaboratorio"
                                                                        className={`form-select ${
                                                                            errors.equipoLaboratorio
                                                                                ? "is-invalid"
                                                                                : ""
                                                                        }`}
                                                                        {...register(
                                                                            "equipoLaboratorio",
                                                                            {
                                                                                required:
                                                                                    "Seleccione una opción",
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Si.
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            No.
                                                                        </option>
                                                                    </select>
                                                                    {errors.equipoLaboratorio && (
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors
                                                                                    .equipoLaboratorio
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            {/* otros */}
                                                            <Col
                                                                lg={12}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <div className="mb-3 w-100">
                                                                    <Label className="form-label">
                                                                        Otros
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        name="otros"
                                                                        className={`form-control 
                                        }`}
                                                                        {...register(
                                                                            "otros"
                                                                        )}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>

                                               

                                                <Col lg={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            class="button-pz btn-pz-success"
                                                            type="submit"
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
                                                            onClick={() => {
                                                                navigate(
                                                                    `/perfil/${userData.mail}`
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

export default SettingsVeterinarias;
