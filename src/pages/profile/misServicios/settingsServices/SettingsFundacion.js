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
    getCuidadorPorId,
    getExperiencia,
    getAllBarrio,
    getUserMail,
    updateCuidador,
    getTipoVivienda,
    getCuidadoresId,
    deleteFotoCuidador,
    postFotoCuidador,
    updateGrillaCuidador,
    getFundacionId,
    updateFundacion,
} from "../../../../services/api.js";
import {
    uploadFilescuidador,
    deleteFileStorage,
    uploadFilesCuidador,
    uploadFileFundaciones,
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

const SettingsFundacion = () => {
    const { fundacionId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");
    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState([]);
    const [errorFile, setErrorFile] = useState("");
    const [barrio, setBarrio] = useState([]);
    const [selectedBarrio, setSelectedBarrio] = useState("");
    const [fundacion, setFundacion] = useState([]);
    const [labelFecha, setLabelFecha] = useState();
    const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres
    const [fotosTemporales, setFotosTemporales] = useState([]);
    const [charCountDescr, setCharCountDescr] = useState(400); // Estado para el contador de caracteres
    const [charCountUtiliz, setCharCountUtiliz] = useState(400); // Estado para el contador de caracteres
    //formulario Hook
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        trigger,
    } = useForm();

    // Definir reglas de validación para el campo texto
    const nameValidation = /^[A-Za-z\s]+$/; // Acepta letras y espacios
    const numberValidation = /^[0-9]+$/;

    const handleDescripcionChange = (e) => {
        const inputValue = e.target.value;
        setCharCountDescr(400 - inputValue.length);
    };

    const handleMotivoDonacionesChange = (e) => {
        const inputValue = e.target.value;
        setCharCountUtiliz(400 - inputValue.length);
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

    const handleKeyPress = (e) => {
        // Permitir solo números (0-9) y la tecla de retroceso
        const regex = /^[0-9\b]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };
    // Al principio del componente
    const [operationsCompleted, setOperationsCompleted] = useState(0);

    // ...
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
            const fetchedFundacion = await getFundacionId(fundacionId);
            const barrioData = await getAllBarrio();
            if (fetchedFundacion && barrioData) {
                setBarrio(barrioData);
                setFundacion(fetchedFundacion);

                setOperationsCompleted((prev) => prev + 1);

                const fotosConEstadoTemporal = [
                    {
                        id: 1, // Asegúrate de que foto y foto.id no sean undefined
                        url:
                            (fetchedFundacion && fetchedFundacion.imagen) || "", // Asegúrate de que foto y foto.url no sean undefined
                        estadoTemporal: true,
                    },
                ];
                setFotosTemporales(fotosConEstadoTemporal);
            }
            console.log(fundacion);
            console.log(fotosTemporales)
        };

        if (fundacionId) {
            fetchDataMain();
            fetchData();
        }
    }, [fundacionId]);

    useEffect(() => {
        const fetchData = async () => {
            if (fundacion && barrio) {
                setValue("nombre", fundacion.nombre);
                setValue("direccion",fundacion.direccion);
                setValue("nroCalle",fundacion.nroCalle);
                setValue("barrioId",fundacion.barrioId);
                setValue("cbu", fundacion.cbu);
                setValue("aliasCbu",fundacion.aliasCbu);
                setValue("telefono", fundacion.telefono);
                setValue("paginaUrl", fundacion.paginaUrl);
                setValue("facebook", fundacion.facebook);
                setValue("instagram", fundacion.instagram);
                setValue("descripcion", fundacion.descripcion);
                setValue("cuit", fundacion.cuit);
                setValue("motivoDonaciones", fundacion.motivoDonaciones);
                setValue("imagen", fundacion.imagen);
                setValue("fechaAlta", fundacion.fechaAlta);
                setValue("usuarioId", fundacion.usuarioId);
                
                

                setOperationsCompleted((prev) => prev + 1);
            }
        };

        fetchData();
    }, [fundacion, barrio, setValue]);

    useEffect(() => {
        if (operationsCompleted === 3) {
            setIsLoading(false);
        }
    }, [operationsCompleted]);

    //funcion para obtener las urls de las fotos
    const obtenerUrls = async () => {
        const uploadFile = async (file) => {
            const uploadedUrl = await uploadFileFundaciones(file);
            return { imagen: uploadedUrl }; // Guarda la URL en un objeto con la propiedad "link"
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
        setErrorFile("");
        showLoadingOverlay();
        // Validar antes de continuar
        const isValid = await trigger();
        if (isValid) {
            data.nroCalle = parseInt(data.nroCalle, 10);
            data.barrioId = parseInt(data.barrioId, 10);
            data.id = parseInt(fundacion.id, 10);
            data.estadoId = fundacion.estadoId;
            data.fechaAlta = fundacion.fechaAlta;
        }
        try {
            // Verificar si hay fotos nuevas antes de obtener las URLs
            if (files.length > 0) {
                await deleteFileStorage(fundacion.imagen);
                // Obtener las URLs de las nuevas fotos
                const urls = await obtenerUrls();

                data.imagen = urls;

                // Opcional: Mostrar la URL en la consola para verificación
                console.log("URL de la foto:", data.imagen);
            }
            //data.imagen= fotosTemporales.url
            console.log(data);
            await updateFundacion(fundacionId, data);
            hideLoadingOverlay();
            navigate(`/perfil/${userData&& userData.mail}`);
        } catch (error) {
            // Manejar cualquier error de la actualización
            console.error("Error al actualizar la fundacion:", error);
        }
    };
    document.title = "Modificar Fundacion | Amigos Peludos";
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
                                                Imagen{" "}
                                                <span className="text-danger">
                                                    *
                                                </span>
                                            </h5>
                                            {/* FOTOS DEL SERVIDOR */}
                                            {fotosTemporales &&
                                                fotosTemporales
                                                    .filter(
                                                        (foto) =>
                                                            foto.estadoTemporal
                                                    ) // Filtrar según el estado
                                                    .map((foto) => (
                                                        <div
                                                            key={foto.id}
                                                            className="container-img-cargadas"
                                                        >
                                                            <img
                                                                className="img-cargadas"
                                                                src={foto.url}
                                                                alt={`Foto ${foto.id}`}
                                                            />
                                                        </div>
                                                    ))}
                                            {/* FOTO DE LA MASCOTA */}
                                            <FilePond
                                                files={files}
                                                onupdatefiles={setFiles}
                                                allowMultiple={false}
                                                maxFiles={1}
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
                                                    Actualizar Datos Fundación
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        {/* FORMULARIO */}
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                {/* NOMBRE */}
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Nombre de la
                                                            Fundación
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.nombre
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="nombre"
                                                            placeholder="Nombre de la fundación"
                                                            {...register(
                                                                "nombre",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El campo es obligatorio",
                                                                    },
                                                                    pattern: {
                                                                        value: nameValidation,
                                                                        message:
                                                                            "Solo debe contener letras y espacios.",
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

                                                {/* DIRECCION */}
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Dirección
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.direccion
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="direccion"
                                                            placeholder="Direccion"
                                                            {...register(
                                                                "direccion",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El campo es obligatorio",
                                                                    },
                                                                    pattern: {
                                                                        value: nameValidation,
                                                                        message:
                                                                            "Solo debe contener letras y espacios.",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.direccion && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .direccion
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* NUMERO CALLE */}
                                                <Col lg={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Altura
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.nroCalle
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            maxLength={3}
                                                            name="nroCalle"
                                                            placeholder="Altura"
                                                            {...register(
                                                                "nroCalle",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El campo es requerido.",
                                                                    },
                                                                    pattern: {
                                                                        value: numberValidation,
                                                                        message:
                                                                            "Solo debe contener numeros.",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.nroCalle && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .nroCalle
                                                                        .message
                                                                }
                                                            </span>
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
                                                                errors.cuit
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="cuit"
                                                            placeholder="CUIT Fundación"
                                                            {...register(
                                                                "cuit",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.cuit && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors.cuit
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* CBU */}
                                                <Col
                                                    lg={4}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Ingrese su CBU para
                                                            recibir donaciones
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            maxLength={15}
                                                            {...register(
                                                                "cbu",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            placeholder="CBU"
                                                            className={`form-control ${
                                                                errors.cbu
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.cbu && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.cbu
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* ALIAS CBU */}
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Alias
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.aliasCbu
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="aliasCbu"
                                                            placeholder="Alias"
                                                            {...register(
                                                                "aliasCbu",
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            "El campo es obligatorio",
                                                                    },
                                                                    // pattern: {
                                                                    //     value: nameValidation,
                                                                    //     message:
                                                                    //         "Solo debe contener letras y espacios.",
                                                                    // },
                                                                }
                                                            )}
                                                        />
                                                        {errors.aliasCbu && (
                                                            <span className="text-danger">
                                                                {
                                                                    errors
                                                                        .aliasCbu
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* TELEFONO */}
                                                <Col
                                                    lg={4}
                                                    className="d-flex justify-content-center"
                                                >
                                                    <div className="mb-3 w-100">
                                                        <Label className="form-label">
                                                            Telefono de Contácto
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            maxLength={15}
                                                            className={`form-control ${
                                                                errors.telefono
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="telefono"
                                                            placeholder="Telefono de Contácto"
                                                            {...register(
                                                                "telefono",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",
                                                                }
                                                            )}
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {errors.telefono && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .telefono
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/* PAGINA PROPIA */}
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Pagina Web Fundación
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control`}
                                                            name="paginaUrl"
                                                            placeholder="URL de la pagina web"
                                                            {...register(
                                                                "paginaUrl"
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                                {/* FACEBOOK */}
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Nombre de Usuario de
                                                            Facebook
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control`}
                                                            name="facebook"
                                                            placeholder="Facebook"
                                                            {...register(
                                                                "facebook"
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                                {/* INSTAGRAM */}
                                                <Col lg={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Nombre de Usuario de
                                                            Instagram
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className={`form-control`}
                                                            name="instagram"
                                                            placeholder="Instagram"
                                                            {...register(
                                                                "instagram"
                                                            )}
                                                        />
                                                    </div>
                                                </Col>

                                                {/* DESCRIPCION FUNDACION */}
                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Descripción de la
                                                            Fundación
                                                        </Label>
                                                        <textarea
                                                            type="text"
                                                            className={`form-control ${
                                                                errors.telefono
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="descripcion"
                                                            maxLength={400}
                                                            onChange={
                                                                handleDescripcionChange
                                                            }
                                                            {...register(
                                                                "descripcion",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",

                                                                    maxLength: {
                                                                        value: 400,
                                                                        message:
                                                                            "El maximo de caracteres es 400",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.descripcion && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .descripcion
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                        {/* Contador de caracteres restantes */}
                                                        <div className="text-muted">
                                                            Caracteres
                                                            restantes:{" "}
                                                            {charCountDescr}
                                                        </div>
                                                    </div>
                                                </Col>
                                                {/* DESCRIPCION DE LA UTILIZACION DEL DINERO */}
                                                <Col lg={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">
                                                            Utilización de la
                                                            Donación
                                                        </Label>
                                                        <textarea
                                                            type="text"
                                                            maxLength={400}
                                                            onChange={
                                                                handleMotivoDonacionesChange
                                                            }
                                                            className={`form-control ${
                                                                errors.telefono
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="motivoDonaciones"
                                                            {...register(
                                                                "motivoDonaciones",
                                                                {
                                                                    required:
                                                                        "Este campo es obligatorio",

                                                                    maxLength: {
                                                                        value: 400,
                                                                        message:
                                                                            "El maximo de caracteres es 400",
                                                                    },
                                                                }
                                                            )}
                                                        />
                                                        {errors.motivoDonaciones && (
                                                            <p className="invalid-feedback">
                                                                {
                                                                    errors
                                                                        .motivoDonaciones
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                        {/* Contador de caracteres restantes */}
                                                        <div className="text-muted">
                                                            Caracteres
                                                            restantes:{" "}
                                                            {charCountUtiliz}
                                                        </div>
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

export default SettingsFundacion;
