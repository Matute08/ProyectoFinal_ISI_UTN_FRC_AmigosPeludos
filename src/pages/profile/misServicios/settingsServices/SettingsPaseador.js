import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import classnames from "classnames";

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
import {
    getPaseadorPorId,
    getExperiencia,
    getAllBarrio,
    getUserMail,
    updatePaseador,
} from "../../../../services/api.js";
import {
    uploadFilesPaseador,
    deleteFileStorage,
} from "../../../../services/Firebase";
import Loading from "../../../components/Loading.js";
import Footer from "../../../landing/Footer.js";
import Navbar from "../../../landing/Navbar.js";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { format } from "date-fns";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const SettingsPaseador = () => {
    const { paseadorId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState();
    const [experiencia, setExperiencia] = useState([]);
    const [barrio, setBarrio] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");
    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState([]);
    const [errorFile, setErrorFile] = useState("");
    const [paseador, setPaseador] = useState([]);
    const [labelFecha, setLabelFecha] = useState();
    const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres
    const daysOfWeek = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ];
    const timePeriods = ["manana", "tarde", "noche"];

    const [scheduleData, setScheduleData] = useState({});
    const [isAtLeastOneSelected, setIsAtLeastOneSelected] = useState(false);
    //formulario Hook
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
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

// Al principio del componente
const [operationsCompleted, setOperationsCompleted] = useState(0);

// ...

useEffect(() => {
    const initialScheduleData = {};
    for (const day of daysOfWeek) {
        initialScheduleData[day.toLowerCase()] = {};
        for (const period of timePeriods) {
            initialScheduleData[day.toLowerCase()][period.toLowerCase()] = false;
        }
    }
    setScheduleData(initialScheduleData);
}, []);

useEffect(() => {
    const isOneSelected = Object.values(scheduleData).some((dayData) =>
        Object.values(dayData).some((isSelected) => isSelected)
    );
    setIsAtLeastOneSelected(isOneSelected);
}, [scheduleData]);

const handleCheckboxChange = (day, period, isChecked) => {
    setScheduleData((prevData) => ({
        ...prevData,
        [day.toLowerCase()]: {
            ...prevData[day.toLowerCase()],
            [period.toLowerCase()]: isChecked,
        },
    }));
};

useEffect(() => {
    const fetchData = async () => {
        const cachedUserData = localStorage.getItem("userData");

        if (cachedUserData) {
            const dataLocalStorage = JSON.parse(cachedUserData);
            const userEmail = dataLocalStorage.email;

            const datosUsuario = await getUserMail(userEmail);
            setUserData(datosUsuario);
            setOperationsCompleted(prev => prev + 1);
        }
    };

    const fetchDataMain = async () => {
        const fetchedPaseador = await getPaseadorPorId(paseadorId);
        const experienciaData = await getExperiencia();
        const barrioData = await getAllBarrio();

        if (fetchedPaseador && experienciaData && barrioData) {
            setExperiencia(experienciaData);
            setBarrio(barrioData);
            setPaseador(fetchedPaseador);

            // Actualiza scheduleData si los datos del paseador están disponibles
            if (fetchedPaseador.grilla && fetchedPaseador.grilla.scheduleData) {
                setScheduleData(fetchedPaseador.grilla.scheduleData);
            }
            setOperationsCompleted(prev => prev + 1);
        }
    };

    if (paseadorId) {
        fetchDataMain();
        fetchData();
    }
}, [paseadorId]);

useEffect(() => {
    const fetchData = async () => {
        if (paseador && experiencia && barrio) {
            setValue("presentacion", `${paseador.presentacion}`);
            setValue("titulo", `${paseador.titulo}`);
            setValue("experienciaId", paseador.experienciaId);
            setValue("barrioTrabajoId", paseador.barrioTrabajoId);
            setValue("precioPaseo", paseador.precioPaseo);
            setValue("celular", userData && userData.celular);
            setOperationsCompleted(prev => prev + 1);
        }
    };

    fetchData();
}, [paseador, experiencia, barrio, setValue]);

useEffect(() => {
    if (operationsCompleted === 3) {
        setIsLoading(false);
    }
}, [operationsCompleted]);


    //funcion para obtener las urls de las fotos
    const obtenerUrls = async () => {
        const uploadFile = async (file) => {
            const uploadedUrl = await uploadFilesPaseador(file);
            return { foto: uploadedUrl }; // Guarda la URL en un objeto con la propiedad "link"
        };
        console.log(files);
        if (files.length > 0) {
            const urls = [];
            for (let i = 0; i < files.length; i++) {
                const uploadedUrl = await uploadFile(files[i].file);
                urls.push(uploadedUrl);
            }
            console.log(urls);
            setUrl(urls);
            return urls; // Retorna las URLs obtenidas
        }
        return []; // Retorna un arreglo vacío si no hay archivos
    };

    const onSubmit = async (data) => {
        data = {
            ...data,
            grilla: {
                scheduleData: { ...scheduleData },
            },
        };
        setErrorFile("");

        if (files.length === 0) {
            setErrorFile("El campo es obligatorio");
            //await updatePost(posteoId, data);
            //hideLoadingOverlay();
            // navigate("/perfil");
        } else {
            showLoadingOverlay();

            try {
                paseador.fotos.forEach((foto) => {
                    deleteFileStorage(foto.foto);
                });
                const urls = await obtenerUrls(); // Espera a obtener las URLs
                console.log(urls); // Utiliza las URLs obtenidas
                // Agrega las URLs a la propiedad data
                data = {
                    ...data,
                    fotos: urls.map((url) => ({ foto: url.foto })),
                };
                console.log(data);
                await updatePaseador(paseadorId, data);
                hideLoadingOverlay();
                navigate(`/perfil/${userData.mail}`);
            } catch (error) {
                // Maneja cualquier error de la actualización
                console.error("Error al realizar la publicacion:", error);
            }
        }
    };
    document.title = "Modificar Paseador | Amigos Peludos";
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
                                            {/* NOMBRE MASCOTA */}
                                            <h5 className="fs-16 mb-1">
                                                Imagenes de Paseos{" "}
                                                <span className="text-danger">
                                                    *
                                                </span>
                                            </h5>
                                            {/* FOTO DE LA MASCOTA */}
                                            <FilePond
                                                files={files}
                                                onupdatefiles={setFiles}
                                                allowMultiple={true}
                                                maxFiles={4}
                                                name="files"
                                                className="filepond filepond-input-multiple"
                                                labelIdle="Arrastra y suelta tus archivos o buscalos "
                                            />
                                            <p className="text-danger">
                                                {errorFile}
                                            </p>
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
                                                    Actualizar Datos Paseador
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        {/* FORMULARIO */}
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                {/* Celular */}
                                                <Col
                                                    lg={3}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Celular
                                                        </Label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${
                                                                errors.celular
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="celular"
                                                            placeholder="Celular"
                                                            {...register(
                                                                "celular",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                        />
                                                        {errors.celular && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .celular
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* TITULO BREVE */}
                                                <Col
                                                    lg={9}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Titulo Breve
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.titulo
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="titulo"
                                                            placeholder="Titulo breve que capte la atención"
                                                            {...register(
                                                                "titulo",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                        />
                                                        {errors.titulo && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .titulo
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* PRESENTACION PERSONAL */}
                                                <Col
                                                    lg={12}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <label className="form-label">
                                                            Presentación
                                                            Personal
                                                        </label>
                                                        <textarea
                                                            className={`form-control ${
                                                                errors.presentacion
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="presentacion"
                                                            placeholder="Texto donde habla de su experiencia."
                                                            {...register(
                                                                "presentacion",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                    maxLength: {
                                                                        value: 500,
                                                                        message:
                                                                            "El máximo de caracteres permitidos es 500.",
                                                                    },
                                                                }
                                                            )}
                                                            onChange={
                                                                handleTextareaChange
                                                            } // Agregar el manejador de cambios
                                                        />
                                                        {errors.presentacion && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .presentacion
                                                                        .message
                                                                }
                                                            </div>
                                                        )}

                                                        {/* Contador de caracteres restantes */}
                                                        <div className="text-muted">
                                                            Caracteres
                                                            restantes:{" "}
                                                            {500 - charCount}
                                                        </div>
                                                    </div>
                                                </Col>

                                                {/* EXPERIENCIA */}
                                                <Col
                                                    lg={3}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Experiencia en años
                                                        </Label>
                                                        <select
                                                            name="experienciaId"
                                                            className={`form-select ${
                                                                errors.experienciaId
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            {...register(
                                                                "experienciaId",
                                                                {
                                                                    required:
                                                                        "Seleccione una opción",
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Seleccione...
                                                            </option>
                                                            {experiencia.map(
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
                                                                            elemento.descripcion
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        {errors.experienciaId && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .experienciaId
                                                                        .message
                                                                }
                                                            </div>
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
                                                            Barrio de trabajo
                                                        </Label>
                                                        <select
                                                            name="barrioTrabajoId"
                                                            className={`form-select ${
                                                                errors.barrioTrabajoId
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            {...register(
                                                                "barrioTrabajoId",
                                                                {
                                                                    required:
                                                                        "Seleccione una opción",
                                                                }
                                                            )}
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
                                                        {errors.barrioTrabajoId && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .barrioTrabajoId
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* PRECIO */}

                                                <Col
                                                    lg={6}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <label className="form-label">
                                                            Precio por paseo
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${
                                                                errors.precioPaseo
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="precioPaseo"
                                                            placeholder="Precio por paseo"
                                                            {...register(
                                                                "precioPaseo",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                        />
                                                        {errors.precioPaseo && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .precioPaseo
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <h3 className="form-label text-center">
                                                    Horarios de Paseo
                                                </h3>
                                                <Col
                                                    lg={12}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100 table-responsive">
                                                        <table className="table table-bordered table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    {daysOfWeek.map(
                                                                        (
                                                                            day
                                                                        ) => (
                                                                            <th
                                                                                key={
                                                                                    day
                                                                                }
                                                                            >
                                                                                {
                                                                                    day
                                                                                }
                                                                            </th>
                                                                        )
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {timePeriods.map(
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
                                                                                    period
                                                                                }
                                                                            </td>
                                                                            {daysOfWeek.map(
                                                                                (
                                                                                    day
                                                                                ) => (
                                                                                    <td
                                                                                        key={
                                                                                            day
                                                                                        }
                                                                                        className="checkbox-cell"
                                                                                    >
                                                                                        <div className="custom-checkbox">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleCheckboxChange(
                                                                                                        day,
                                                                                                        period,
                                                                                                        e
                                                                                                            .target
                                                                                                            .checked
                                                                                                    )
                                                                                                }
                                                                                                checked={
                                                                                                    scheduleData[
                                                                                                        day.toLowerCase()
                                                                                                    ] &&
                                                                                                    scheduleData[
                                                                                                        day.toLowerCase()
                                                                                                    ][
                                                                                                        period.toLowerCase()
                                                                                                    ]
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                )
                                                                            )}
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Col>

                                                {!isAtLeastOneSelected && (
                                                    <div className="text-danger text-center mb-3">
                                                        Debe seleccionar al
                                                        menos un horario.
                                                    </div>
                                                )}
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

export default SettingsPaseador;
