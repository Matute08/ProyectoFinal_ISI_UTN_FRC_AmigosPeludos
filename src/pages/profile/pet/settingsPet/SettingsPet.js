// SettingsPet.js (Corregido v3 - Carga Secuencial y userData restaurado)

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Col,
    Container,
    Form,
    Label,
    Row,
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    Spinner,
    Alert,
    Button,
} from "reactstrap";

// Componentes y Servicios
import Navbar from "../../../landing/Navbar";
import Footer from "../../../landing/Footer";
import Loading from "../../../components/Loading";
import {
    deleteFileStorage,
    uploadFilePetsUser,
} from "../../../../services/Firebase";
import { getUserMail } from "../../../../services/userApi"; // Necesario para el botón Volver
import {
    getMascotaId,
    getTipoMascota,
    getSexoMascota,
    getAllEdadMascota,
    updatePets,
} from "../../../../services/PetsApi";
import { getAllRazaId } from "../../../../services/commonApi";

// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Placeholder para imagen
const placeholderPetImage = "/images/placeholder-pet.png"; // Ajusta esta ruta

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// --- Componente Principal ---
const SettingsPet = () => {
    const { mascotaId } = useParams();
    const navigate = useNavigate();

    // --- Estados ---
    const [mascotaData, setMascotaData] = useState(null);
    const [userData, setUserData] = useState(null); // Estado para datos del usuario (para email)
    const [tipoMascotaOptions, setTipoMascotaOptions] = useState([]);
    const [razaOptions, setRazaOptions] = useState([]);
    const [sexoOptions, setSexoOptions] = useState([]);
    const [edadOptions, setEdadOptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [activeTab, setActiveTab] = useState("1");
    const [charCount, setCharCount] = useState(400);
    const initialTipoIdRef = useRef(null); // Usar Ref para guardar el tipoId inicial sin causar re-render
    const isInitialLoadDone = useRef(false); // Flag para controlar la carga inicial completa

    // --- React Hook Form ---
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const selectedTipoIdForm = watch("tipoId"); // Observar cambios en el select de Tipo

    // --- Funciones de Carga de Datos ---
    const loadStaticData = useCallback(async () => {
        console.log("Cargando datos estáticos (tipos, sexo, edad)...");
        try {
            const results = await Promise.allSettled([
                getTipoMascota(),
                getSexoMascota(),
                getAllEdadMascota(),
                // Cargar datos del usuario aquí también
                getUserMail(
                    JSON.parse(localStorage.getItem("userData") || "{}")
                        ?.email || ""
                ),
            ]);
            const [tipoResult, sexoResult, edadResult, userResult] = results;

            if (tipoResult.status === "fulfilled" && tipoResult.value?.data) {
                setTipoMascotaOptions(tipoResult.value.data);
            } else {
                throw new Error("Error al cargar tipos.");
            }

            if (sexoResult.status === "fulfilled" && sexoResult.value?.data) {
                setSexoOptions(sexoResult.value.data);
            } // else opcionalmente manejar error

            if (edadResult.status === "fulfilled" && edadResult.value?.data) {
                setEdadOptions(edadResult.value.data);
            } // else opcionalmente manejar error

            // Guardar datos del usuario para el botón "Volver"
            if (userResult.status === "fulfilled" && userResult.value?.data) {
                setUserData(userResult.value.data);
            } else if (userResult.status === "fulfilled" && userResult.value) {
                setUserData(userResult.value); // Si viene directo
            } else {
                console.warn(
                    "Warn: No se cargaron datos del usuario para navegación.",
                    userResult.reason
                );
            }
        } catch (err) {
            console.error("Error crítico cargando datos estáticos:", err);
            setError(err.message || "Error al cargar opciones del formulario.");
            throw err; // Re-lanzar para detener la carga si es crítico
        }
    }, []);

    const loadPetData = useCallback(async () => {
        if (!mascotaId) throw new Error("ID de mascota no disponible.");
        console.log(`Cargando datos para mascota ID: ${mascotaId}...`);
        try {
            const mascotaResult = await getMascotaId(mascotaId);
            if (mascotaResult?.data) {
                setMascotaData(mascotaResult.data);
                return mascotaResult.data; // Devolver para usarla inmediatamente
            } else {
                throw new Error("No se encontraron datos para la mascota.");
            }
        } catch (err) {
            console.error("Error cargando datos de la mascota:", err);
            setError(err.message || "Error al cargar la mascota.");
            throw err; // Re-lanzar
        }
    }, [mascotaId]);

    const loadRazaOptions = useCallback(
        async (tipoId, setRazaValue = false, initialPetData = null) => {
            if (!tipoId) {
                setRazaOptions([]);
                if (setRazaValue) setValue("razaId", ""); // Limpiar valor si se limpia tipo
                return;
            }
            console.log(`Cargando razas para tipoId: ${tipoId}...`);
            try {
                const razasResponse = await getAllRazaId(tipoId);
                const razas = razasResponse?.data || razasResponse;
                if (Array.isArray(razas)) {
                    setRazaOptions(razas);
                    console.log(`Razas cargadas (${razas.length})`);
                    // Si se indicó, establecer el valor inicial de razaId del formulario
                    if (setRazaValue && initialPetData) {
                        setValue("razaId", initialPetData.razaId || "");
                        console.log(
                            `Valor inicial de razaId (${initialPetData.razaId}) establecido.`
                        );
                    }
                } else {
                    console.error(
                        "Respuesta inválida al cargar razas:",
                        razasResponse
                    );
                    setRazaOptions([]);
                }
            } catch (err) {
                console.error(
                    `Error al cargar razas para tipo ${tipoId}:`,
                    err
                );
                setRazaOptions([]);
                // Podrías establecer un error específico para razas si es necesario
            }
        },
        [setValue]
    );

    // --- EFECTOS DE CARGA Y POBLACIÓN ---

    // 1. Efecto Principal de Carga Inicial
    useEffect(() => {
        const initialLoadFlow = async () => {
            setIsLoading(true);
            setError(null);
            isInitialLoadDone.current = false;
            initialTipoIdRef.current = null;

            try {
                // Cargar todo en paralelo inicialmente
                await Promise.allSettled([loadStaticData(), loadPetData()]);
                // En este punto, los estados (mascotaData, tipoMascotaOptions, etc.)
                // deberían estar listos si no hubo errores críticos

                // El siguiente efecto se encargará de procesar estos datos
                console.log("Carga base completada.");
            } catch (err) {
                // El error ya fue seteado dentro de las funciones de carga
                console.error("Error en el flujo de carga inicial:", err);
                setIsLoading(false); // Detener carga si algo falla críticamente
            }
            // No ponemos setIsLoading(false) aquí todavía, esperamos a poblar el form y razas
        };
        initialLoadFlow();
    }, [mascotaId, loadStaticData, loadPetData]); // Depender solo de mascotaId y las funciones de carga

    // 2. Efecto para Procesar Datos Cargados y Poblar Formulario Inicialmente
    useEffect(() => {
        // Ejecutar solo si tenemos los datos necesarios y la carga inicial aún no se ha completado
        if (
            mascotaData &&
            tipoMascotaOptions.length > 0 &&
            !isInitialLoadDone.current
        ) {
            console.log("Procesando datos cargados para poblar formulario...");
            let inferredTipoId = null;
            const foundType = tipoMascotaOptions.find(
                (tipo) => tipo.tipo === mascotaData.tipoMascotaNombre
            );

            if (foundType) {
                inferredTipoId = foundType.id;
                initialTipoIdRef.current = inferredTipoId; // Guardar en Ref
                console.log(
                    `Tipo ID inicial inferido y guardado en Ref: ${inferredTipoId}`
                );
            } else {
                console.warn(
                    `No se encontró tipo para '${mascotaData.tipoMascotaNombre}'`
                );
                initialTipoIdRef.current = null;
            }

            // Poblar formulario con reset (usando el tipo inferido)
            reset({
                nombre: mascotaData.nombre || "",
                tipoId: inferredTipoId || "",
                edadId: mascotaData.edadId || "",
                sexoId: mascotaData.sexoId || "",
                castracion: mascotaData.castracion ? "1" : "0",
                peso: mascotaData.peso || "",
                descripcion: mascotaData.descripcion || "",
                color: mascotaData.color || "",
                razaId: "", // Dejar vacío, se llenará al cargar razas
            });
            setCharCount(400 - (mascotaData.descripcion?.length || 0));
            console.log(
                "Formulario reseteado con valores iniciales (excepto raza)."
            );

            // Iniciar carga de razas para el tipo inicial
            if (inferredTipoId) {
                loadRazaOptions(inferredTipoId, true, mascotaData) // Pedir que setee el valor inicial
                    .finally(() => {
                        console.log(
                            "Carga inicial completa (incluyendo razas iniciales)."
                        );
                        isInitialLoadDone.current = true; // Marcar carga inicial como completa
                        setIsLoading(false); // ¡Ahora sí, terminar carga!
                    });
            } else {
                console.log(
                    "No se pudo inferir tipoId inicial, no se cargan razas iniciales."
                );
                isInitialLoadDone.current = true; // Marcar carga inicial como completa
                setIsLoading(false); // Terminar carga igual
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mascotaData, tipoMascotaOptions, reset, loadRazaOptions]); // Depender de datos y reset

    // 3. Efecto para Recargar Razas cuando el USUARIO cambia el Tipo
    useEffect(() => {
        // Ejecutar solo DESPUÉS de la carga inicial y si el tipo seleccionado cambió
        if (
            isInitialLoadDone.current &&
            selectedTipoIdForm !== initialTipoIdRef.current
        ) {
            console.log(
                `Usuario cambió tipo a ${selectedTipoIdForm}. Recargando razas...`
            );
            setValue("razaId", ""); // Resetear selección de raza
            loadRazaOptions(selectedTipoIdForm, false); // Cargar nuevas opciones, no setear valor
        }
    }, [selectedTipoIdForm, loadRazaOptions, setValue]);

    // --- MANEJADORES Y FUNCIONES AUXILIARES ---
    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    const handleTextareaChange = (e) => {
        setCharCount(400 - e.target.value.length);
    };
    const uploadNewPhoto = async () => {
        if (!files || files.length === 0) return null;
        const fileToUpload = files[0].file;
        try {
            const uploadedUrl = await uploadFilePetsUser(fileToUpload);
            return uploadedUrl;
        } catch (uploadError) {
            console.error("Error al subir nueva foto:", uploadError);
            throw new Error("Error al subir la nueva imagen.");
        }
    };

    // --- SUBMIT ---
    const onSubmit = async (dataForm) => {
        if (!mascotaId || !mascotaData) {
            setSubmitError("Error: Faltan datos base de la mascota.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        let newPhotoUrl = null;

        try {
            // 1. Manejar foto (igual que antes)
            if (files.length > 0) {
                if (mascotaData.foto) {
                    try { await deleteFileStorage(mascotaData.foto); } catch (e) { console.warn("Warn: No se borró foto anterior", e); }
                }
                newPhotoUrl = await uploadNewPhoto();
            }

            // 2. Construir payload EXPLICITAMENTE basado en el modelo C#
            const dataToUpdate = {
                // --- Campos Mapeados del Modelo C# ---
                id: mascotaData.id, // Enviar ID si la API PUT lo espera en el cuerpo
                nombre: dataForm.nombre || null, // Enviar null si está vacío? o string vacío? Depende de API
                edadId: dataForm.edadId ? parseInt(dataForm.edadId, 10) : null, // Enviar null si está vacío
                sexoId: dataForm.sexoId ? parseInt(dataForm.sexoId, 10) : null, // Enviar null si está vacío
                castracion: dataForm.castracion === "1", // Booleano
                peso: String(dataForm.peso ?? ""), // <<-- Convertir a String, manejar null/undefined
                descripcion: dataForm.descripcion || null,
                idUsuario: mascotaData.idUsuario, // Mantener el idUsuario original
                foto: newPhotoUrl !== null ? newPhotoUrl : mascotaData.foto, // Nueva foto o la existente
                color: dataForm.color || null,
                razaId: parseInt(dataForm.razaId, 10), // Asegurar que sea Int (validación RHF debe asegurar que no sea vacío)
                 // --- NO incluir campos [NotMapped] ---
                 // tipoId: NO SE ENVÍA
                 // razaNombre: NO SE ENVÍA
                 // mailUsuario: NO SE ENVÍA
                 // edadMascota: NO SE ENVÍA
                 // sexoMascota: NO SE ENVÍA
                 // tipoMascotaNombre: NO SE ENVÍA
            };

            // Opcional: Quitar 'id' si la API lo toma de la URL y no del body
            // delete dataToUpdate.id;

            console.log("Datos a enviar (ajustados a C#):", dataToUpdate);

            // 3. Llamar a la API
            await updatePets(mascotaId, dataToUpdate);

            setFiles([]);
            const userEmailForNav = userData?.mail || '';
            navigate(`/perfil/${userEmailForNav}`);

        } catch (error) {
            console.error("Error al actualizar mascota:", error);
            // Intentar obtener detalles del error 400 si la API los devuelve
            let errorMsg = "No se pudo guardar los cambios.";
            if (error.response && error.response.data && typeof error.response.data === 'object') {
                // Si la API devuelve errores de validación en un objeto
                errorMsg = Object.values(error.response.data).flat().join(' '); // Intenta mostrar mensajes de validación
            } else if (error.message) {
                 errorMsg = error.message;
            }
             setSubmitError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDERIZADO ---

    if (isLoading) {
        return <Loading />; // Mostrar mientras carga TODO lo inicial
    }

    // Error crítico si no se cargó mascota o hubo otro error fatal
    if (error || !mascotaData) {
        const userEmailForNav = userData?.mail || ""; // Obtener email si existe
        return (
            <>
                <Navbar />
                <Container
                    className="page-content perfil-fondo d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: "calc(80vh)" }}
                >
                    <Alert color="danger" className="text-center">
                        <h4 className="alert-heading">Error</h4>
                        <p>
                            {error || "No se encontró la mascota solicitada."}
                        </p>
                    </Alert>
                    {/* Usar userData?.mail para el botón volver */}
                    <Button
                        color="secondary"
                        onClick={() => navigate(`/perfil/${userEmailForNav}`)}
                        className="mt-3"
                    >
                        Volver al Perfil
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    // Renderizado del formulario si todo está listo
    document.title = `Editar ${
        mascotaData.nombre || "Mascota"
    } | Amigos Peludos`;
    return (
        <React.Fragment>
            <Navbar />
            <div className="page-content perfil-fondo">
                <Container fluid>
                    <Row>
                        {/* Columna Izquierda: Foto */}
                        <Col xxl={3}>
                            <Card
                                className="mt-n5 sticky-top"
                                style={{ top: "80px" }}
                            >
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <h5 className="fs-16 mb-2">
                                            Imagen Actual de{" "}
                                            {mascotaData.nombre}
                                        </h5>
                                        <img
                                            className="img-thumbnail rounded mb-3"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                            src={
                                                mascotaData.foto ||
                                                placeholderPetImage
                                            }
                                            alt={`Foto actual de ${mascotaData.nombre}`}
                                            onError={(e) => {
                                                if (
                                                    e.target.src !==
                                                    placeholderPetImage
                                                ) {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        placeholderPetImage;
                                                }
                                            }}
                                        />
                                        <h6 className="fs-15 mb-1">
                                            Cambiar Imagen{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </h6>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={false}
                                            maxFiles={1}
                                            name="files"
                                            className="filepond-input-trigger"
                                            labelIdle='Arrastra o <span class="filepond--label-action">busca</span> una nueva foto'
                                            acceptedFileTypes={[
                                                "image/png",
                                                "image/jpeg",
                                                "image/gif",
                                            ]}
                                            labelFileTypeNotAllowed="Archivo inválido"
                                            fileValidateTypeLabelExpectedTypes="Usa PNG, JPG o GIF"
                                        />
                                        <p className="text-muted small">
                                            (*) Opcional si ya existe imagen.
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Columna Derecha: Formulario */}
                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                <CardHeader>
                                    <Nav
                                        className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist"
                                    >
                                        <NavItem>
                                            <NavLink
                                                className={
                                                    activeTab === "1"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => tabChange("1")}
                                                href="#"
                                            >
                                                <i className="fas fa-paw me-1"></i>{" "}
                                                Datos de la Mascota
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    {submitError && (
                                        <Alert color="danger">
                                            {submitError}
                                        </Alert>
                                    )}
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <Row>
                                                    {/* --- CAMPOS DEL FORMULARIO --- */}
                                                    {/* Nombre, Tipo, Raza, Edad, Peso, Castracion, Sexo, Color, Descripcion */}
                                                    {/* (El JSX de los campos es el mismo que antes, pero ahora deberían poblarse correctamente) */}

                                                    {/* Nombre */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="nombre"
                                                                className="form-label"
                                                            >
                                                                Nombre{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                id="nombre"
                                                                placeholder="Nombre mascota"
                                                                className={`form-control ${
                                                                    errors.nombre
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "nombre",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                        pattern:
                                                                            {
                                                                                value: /^[A-Za-zÀ-ÿ\s']+$/u,
                                                                                message:
                                                                                    "Solo letras/espacios",
                                                                            },
                                                                        maxLength: 50,
                                                                    }
                                                                )}
                                                            />
                                                            {errors.nombre && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .nombre
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Tipo */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="tipoId"
                                                                className="form-label"
                                                            >
                                                                Tipo{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <select
                                                                id="tipoId"
                                                                className={`form-select ${
                                                                    errors.tipoId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "tipoId",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {tipoMascotaOptions.map(
                                                                    (tipo) => (
                                                                        <option
                                                                            key={
                                                                                tipo.id
                                                                            }
                                                                            value={
                                                                                tipo.id
                                                                            }
                                                                        >
                                                                            {
                                                                                tipo.tipo
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors.tipoId && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .tipoId
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Raza */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="razaId"
                                                                className="form-label"
                                                            >
                                                                Raza{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <select
                                                                id="razaId"
                                                                className={`form-select ${
                                                                    errors.razaId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "razaId",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    !selectedTipoIdForm ||
                                                                    razaOptions.length ===
                                                                        0
                                                                }
                                                            >
                                                                <option value="">
                                                                    {selectedTipoIdForm
                                                                        ? razaOptions.length >
                                                                          0
                                                                            ? "Seleccione raza..."
                                                                            : "Cargando/No hay..."
                                                                        : "Seleccione tipo..."}
                                                                </option>
                                                                {razaOptions.map(
                                                                    (raza) => (
                                                                        <option
                                                                            key={
                                                                                raza.id
                                                                            }
                                                                            value={
                                                                                raza.id
                                                                            }
                                                                        >
                                                                            {
                                                                                raza.nombre
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors.razaId && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .razaId
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Edad */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="edadId"
                                                                className="form-label"
                                                            >
                                                                Edad{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <select
                                                                id="edadId"
                                                                className={`form-select ${
                                                                    errors.edadId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "edadId",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {edadOptions.map(
                                                                    (edad) => (
                                                                        <option
                                                                            key={
                                                                                edad.id
                                                                            }
                                                                            value={
                                                                                edad.id
                                                                            }
                                                                        >
                                                                            {
                                                                                edad.descripcion
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors.edadId && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .edadId
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Peso */}
                                                    <Col lg={2} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="peso"
                                                                className="form-label"
                                                            >
                                                                Peso(kg){" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="number"
                                                                id="peso"
                                                                step="0.1"
                                                                className={`form-control ${
                                                                    errors.peso
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Ej: 5.5"
                                                                {...register(
                                                                    "peso",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                        valueAsNumber: true,
                                                                        min: {
                                                                            value: 0.1,
                                                                            message:
                                                                                "> 0",
                                                                        },
                                                                        max: {
                                                                            value: 150,
                                                                            message:
                                                                                "Excesivo",
                                                                        },
                                                                    }
                                                                )}
                                                            />
                                                            {errors.peso && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .peso
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Castracion */}
                                                    <Col lg={3} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="castracion"
                                                                className="form-label"
                                                            >
                                                                Castrado/a{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <select
                                                                id="castracion"
                                                                className={`form-select ${
                                                                    errors.castracion
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "castracion",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                <option value="1">
                                                                    Sí
                                                                </option>
                                                                <option value="0">
                                                                    No
                                                                </option>
                                                            </select>
                                                            {errors.castracion && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .castracion
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Sexo */}
                                                    <Col lg={3} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="sexoId"
                                                                className="form-label"
                                                            >
                                                                Sexo{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <select
                                                                id="sexoId"
                                                                className={`form-select ${
                                                                    errors.sexoId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "sexoId",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {sexoOptions.map(
                                                                    (sexo) => (
                                                                        <option
                                                                            key={
                                                                                sexo.id
                                                                            }
                                                                            value={
                                                                                sexo.id
                                                                            }
                                                                        >
                                                                            {
                                                                                sexo.nombre
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors.sexoId && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .sexoId
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Color */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="color"
                                                                className="form-label"
                                                            >
                                                                Color{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                id="color"
                                                                placeholder="Color predominante"
                                                                className={`form-control ${
                                                                    errors.color
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "color",
                                                                    {
                                                                        required:
                                                                            "Requerido",
                                                                        maxLength:
                                                                            {
                                                                                value: 50,
                                                                                message:
                                                                                    "Max 50",
                                                                            },
                                                                    }
                                                                )}
                                                            />
                                                            {errors.color && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .color
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Descripcion */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="descripcion"
                                                                className="form-label"
                                                            >
                                                                Descripción
                                                            </Label>
                                                            <textarea
                                                                id="descripcion"
                                                                rows="4"
                                                                className={`form-control ${
                                                                    errors.descripcion
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Carácter, señas..."
                                                                maxLength={400}
                                                                {...register(
                                                                    "descripcion",
                                                                    {
                                                                        maxLength:
                                                                            {
                                                                                value: 400,
                                                                                message:
                                                                                    "Max 400",
                                                                            },
                                                                    }
                                                                )}
                                                                onChange={
                                                                    handleTextareaChange
                                                                }
                                                            />{" "}
                                                            <div className="d-flex justify-content-between">
                                                                {errors.descripcion && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {
                                                                            errors
                                                                                .descripcion
                                                                                .message
                                                                        }
                                                                    </div>
                                                                )}{" "}
                                                                <small className="text-muted ms-auto mt-1">
                                                                    Restantes:{" "}
                                                                    {charCount}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    {/* Botones */}
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end mt-3">
                                                            {/* Botón Actualizar (Bootstrap) */}
                                                            <Button
                                                                type="submit"
                                                                color="success"
                                                                className="d-inline-flex align-items-center"
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Spinner
                                                                            size="sm"
                                                                            className="me-2"
                                                                        />{" "}
                                                                        Guardando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="me-1"
                                                                            width="16"
                                                                            height="16"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="2"
                                                                            stroke="currentColor"
                                                                            fill="none"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <path
                                                                                stroke="none"
                                                                                d="M0 0h24v24H0z"
                                                                                fill="none"
                                                                            />
                                                                            <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                                                            <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                                            <path d="M14 4l0 4l-6 0l0 -4" />
                                                                        </svg>{" "}
                                                                        Guardar
                                                                        Cambios
                                                                    </>
                                                                )}
                                                            </Button>
                                                            {/* Botón Volver (Bootstrap) */}
                                                            <Button
                                                                type="button"
                                                                color="secondary"
                                                                className="d-inline-flex align-items-center"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/perfil/${
                                                                            userData?.mail ||
                                                                            ""
                                                                        }`
                                                                    )
                                                                }
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="me-1"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path
                                                                        stroke="none"
                                                                        d="M0 0h24v24H0z"
                                                                        fill="none"
                                                                    />
                                                                    <path d="M9 14l-4 -4l4 -4" />
                                                                    <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                                                                </svg>{" "}
                                                                Volver
                                                            </Button>
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
            <Footer />
        </React.Fragment>
    );
};

export default SettingsPet;
