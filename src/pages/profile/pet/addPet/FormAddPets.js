// FormAddPets.js (Refactorizado)

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
    Button, // Añadir componentes Reactstrap
} from "reactstrap";
// import { useAuth } from "../../../../services/AuthContext"; // user no se usa

// Servicios y Componentes
import { uploadFilePetsUser } from "../../../../services/Firebase";
import Loading from "../../../components/Loading";
import { getUserMail, updateUser } from "../../../../services/userApi";
import {
    postMascota,
    getTipoMascota,
    getSexoMascota,
    getAllEdadMascota,
} from "../../../../services/PetsApi";
import { getAllRazaId } from "../../../../services/commonApi";
import Navbar from "../../../landing/Navbar" 
import Footer from "../../../landing/Footer";
// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Registrar plugins de FilePond
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const FormAddPets = () => {
    const navigate = useNavigate();
    // const { user } = useAuth(); // No se usa

    // --- Estados ---
    const [userData, setUserData] = useState(null); // Datos del usuario actual
    const [tipoMascotaOptions, setTipoMascotaOptions] = useState([]);
    const [razaOptions, setRazaOptions] = useState([]);
    const [sexoOptions, setSexoOptions] = useState([]);
    const [edadOptions, setEdadOptions] = useState([]);
    const [files, setFiles] = useState([]); // FilePond state
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de datos (tipos, sexo, etc.)
    const [isLoadingRazas, setIsLoadingRazas] = useState(false); // Carga específica de razas
    const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario
    const [error, setError] = useState(null); // Error en carga inicial
    const [submitError, setSubmitError] = useState(null); // Error al enviar formulario
    const [activeTab, setActiveTab] = useState("1"); // Solo una pestaña

    // --- React Hook Form ---
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const selectedTipoIdForm = watch("tipoId"); // Observar cambios en Tipo

    // Validaciones (igual que antes)
    const nameValidation = /^[A-Za-zÀ-ÿ\s']+$/u;
    const numberValidation = /^[0-9]+$/;

    // --- CARGA DE DATOS INICIAL ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Cargar datos necesarios en paralelo
                const results = await Promise.allSettled([
                    getUserMail(
                        JSON.parse(localStorage.getItem("userData") || "{}")
                            ?.email || ""
                    ),
                    getTipoMascota(),
                    getSexoMascota(),
                    getAllEdadMascota(),
                ]);

                const [userResult, tipoResult, sexoResult, edadResult] =
                    results;

                // Procesar Usuario (necesario para idUsuario y tieneMascota)
                if (
                    userResult.status === "fulfilled" &&
                    userResult.value?.data
                ) {
                    setUserData(userResult.value.data);
                } else if (
                    userResult.status === "fulfilled" &&
                    userResult.value
                ) {
                    setUserData(userResult.value); // Fallback si no viene en .data
                } else {
                    // Si no se puede cargar el usuario, es un error crítico para agregar mascota
                    throw new Error(
                        "No se pudieron cargar los datos del usuario."
                    );
                }

                // Procesar Tipos
                if (
                    tipoResult.status === "fulfilled" &&
                    tipoResult.value?.data
                ) {
                    setTipoMascotaOptions(tipoResult.value.data);
                } else {
                    throw new Error("Error al cargar tipos de mascota.");
                }

                // Procesar Sexos
                if (
                    sexoResult.status === "fulfilled" &&
                    sexoResult.value?.data
                ) {
                    setSexoOptions(sexoResult.value.data);
                } else {
                    console.warn(
                        "Warn: Error al cargar sexos.",
                        sexoResult.reason
                    );
                } // No crítico?

                // Procesar Edades
                if (
                    edadResult.status === "fulfilled" &&
                    edadResult.value?.data
                ) {
                    setEdadOptions(edadResult.value.data);
                } else {
                    console.warn(
                        "Warn: Error al cargar edades.",
                        edadResult.reason
                    );
                } // No crítico?
            } catch (err) {
                console.error("Error cargando datos iniciales:", err);
                setError(err.message || "Error al cargar datos necesarios.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []); // Cargar solo una vez al montar

    // --- CARGA DINÁMICA DE RAZAS ---
    const handleTipoChange = useCallback(
        async (event) => {
            const tipoId = event.target.value;
            setValue("razaId", ""); // Resetear selección de raza al cambiar tipo
            setRazaOptions([]); // Limpiar opciones anteriores

            if (tipoId) {
                setIsLoadingRazas(true); // Indicar carga de razas
                try {
                    const razasResponse = await getAllRazaId(tipoId);
                    const razas = razasResponse?.data || razasResponse;
                    if (Array.isArray(razas)) {
                        setRazaOptions(razas);
                    } else {
                        console.error(
                            "Respuesta inválida al cargar razas:",
                            razasResponse
                        );
                    }
                } catch (err) {
                    console.error(
                        `Error al cargar razas para tipo ${tipoId}:`,
                        err
                    );
                    // Podrías mostrar un error específico al usuario aquí
                } finally {
                    setIsLoadingRazas(false);
                }
            }
        },
        [setValue]
    );

    // --- MANEJADORES Y OTRAS FUNCIONES ---
    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Función para subir la foto a Firebase
    const uploadPetPhoto = async () => {
        if (!files || files.length === 0) {
            // Lanzar error si la foto es obligatoria
            throw new Error("Debes seleccionar una foto para la mascota.");
            // return null; // O devolver null si es opcional
        }
        const fileToUpload = files[0].file;
        try {
            // Usar ID de usuario y timestamp para nombre único si es necesario
            const fileName = `pet_${userData?.id}_${Date.now()}`;
            const uploadedUrl = await uploadFilePetsUser(
                fileToUpload,
                fileName
            ); // Asume que acepta nombre
            return uploadedUrl;
        } catch (uploadError) {
            console.error("Error al subir foto de mascota:", uploadError);
            throw new Error("Error al subir la imagen.");
        }
    };

    // --- SUBMIT DEL FORMULARIO ---
    const onSubmit = async (dataForm) => {
        if (!userData?.id) {
            setSubmitError("Error: No se pudo identificar al usuario.");
            return;
        }
        // Validar que se haya seleccionado un archivo (FilePond no se integra fácil con RHF required)
        if (files.length === 0) {
            setSubmitError("Debes seleccionar una foto para la mascota.");
            // Opcional: Foco en FilePond (requiere ref)
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // 1. Subir la foto PRIMERO
            const fotoUrl = await uploadPetPhoto();
            if (!fotoUrl) {
                // El error ya se lanzó en uploadPetPhoto si era obligatorio
                // throw new Error("Falló la subida de la foto."); // Redundante si uploadPetPhoto lanza error
                return; // Salir si falla la subida
            }

            // 2. Preparar datos para la API postMascota
            const payload = {
                nombre: dataForm.nombre,
                edadId: dataForm.edadId ? parseInt(dataForm.edadId, 10) : null,
                sexoId: dataForm.sexoId ? parseInt(dataForm.sexoId, 10) : null,
                castracion: dataForm.castracion === "1",
                peso: String(dataForm.peso ?? ""), // Enviar como string según modelo C#
                descripcion: dataForm.descripcion || null,
                idUsuario: userData.id, // ID del usuario logueado
                foto: fotoUrl, // URL de Firebase
                color: dataForm.color || null,
                razaId: parseInt(dataForm.razaId, 10), // Es int no nullable
                // id: No se envía, lo genera la BD
                // tipoId: No existe en el modelo C#
            };

            console.log("Payload para postMascota:", payload);

            // 3. Crear la mascota en la BD
            await postMascota(payload);
            console.log("Mascota creada exitosamente.");

            // 4. Actualizar 'tieneMascota' del usuario SI es necesario
            if (!userData.tieneMascota) {
                console.log(
                    "Usuario no tenía mascotas, actualizando 'tieneMascota' a true..."
                );
                try {
                    await updateUser(userData.id, { tieneMascota: true });
                    console.log(
                        "Estado 'tieneMascota' del usuario actualizado."
                    );
                    // Opcional: Actualizar estado local userData si se sigue usando después
                    // setUserData(prev => ({...prev, tieneMascota: true}));
                } catch (userUpdateError) {
                    console.error(
                        "Error al actualizar 'tieneMascota' del usuario:",
                        userUpdateError
                    );
                    // Considerar esto como un error no crítico o mostrar una advertencia
                    setSubmitError(
                        "Mascota agregada, pero hubo un problema al actualizar el estado del usuario."
                    );
                }
            }

            setFiles([]); // Limpiar FilePond
            navigate(`/perfil/${userData.mail}`); // Volver al perfil
        } catch (error) {
            console.error("Error al agregar la mascota:", error);
            setSubmitError(error.message || "No se pudo agregar la mascota.");
            // Considerar borrar la foto subida a Firebase si falla el postMascota? (Complejo)
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDERIZADO ---

    if (isLoading) {
        return <Loading />;
    }

    // Error crítico si no se cargaron datos esenciales (usuario, tipos)
    if (error || !userData || tipoMascotaOptions.length === 0) {
        const userEmailForNav = userData?.mail || "";
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
                            {error ||
                                "No se pudieron cargar datos esenciales para agregar mascotas."}
                        </p>
                    </Alert>
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

    document.title = "Agregar Mascota | Amigos Peludos";
    return (
        <React.Fragment>
            {/* Asumiendo que Navbar y Footer están en un layout superior */}
            {/* <Navbar /> */}
            <div className="page-content perfil-fondo">
                {" "}
                {/* Quitar page-content si Navbar/Footer no están aquí */}
                <Container fluid>
                    <Row>
                        {/* Columna Izquierda: Foto */}
                        <Col xl={3}>
                            <Card
                                className="mt-n5 sticky-top"
                                style={{ top: "20px" }}
                            >
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <h5 className="fs-16 mb-2">
                                            Foto de la Mascota{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </h5>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={false} // Solo una foto
                                            maxFiles={1}
                                            name="petPhoto" // Nombre del campo
                                            required={true} // Marcar como requerido visualmente
                                            className="filepond-input-trigger"
                                            labelIdle='Arrastra o <span class="filepond--label-action">busca</span> la foto'
                                            acceptedFileTypes={[
                                                "image/png",
                                                "image/jpeg",
                                                "image/gif",
                                            ]}
                                            labelFileTypeNotAllowed="Archivo inválido"
                                            fileValidateTypeLabelExpectedTypes="Usa PNG, JPG o GIF"
                                        />
                                        {/* Mostrar error de submit relacionado a la foto */}
                                        {submitError &&
                                            submitError
                                                .toLowerCase()
                                                .includes("foto") && (
                                                <Alert
                                                    color="danger"
                                                    className="mt-2 p-2 small"
                                                >
                                                    {submitError}
                                                </Alert>
                                            )}
                                        {/* O mostrar un error genérico si files está vacío al intentar submit */}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Columna Derecha: Formulario */}
                        <Col xl={9}>
                            <Card className="mt-n5">
                                <CardHeader>
                                    {/* Tab simple, se podría quitar si no hay más pestañas */}
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
                                <CardBody>
                                    {submitError &&
                                        !submitError
                                            .toLowerCase()
                                            .includes("foto") && (
                                            <Alert color="danger">
                                                {submitError}
                                            </Alert>
                                        )}
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1" className="p-3">
                                            <Form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <Row>
                                                    {/* --- Campos del formulario --- */}
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
                                                                                value: nameValidation,
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
                                                                onChange={
                                                                    handleTipoChange
                                                                }
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
                                                                    isLoadingRazas ||
                                                                    razaOptions.length ===
                                                                        0
                                                                }
                                                            >
                                                                <option value="">
                                                                    {selectedTipoIdForm
                                                                        ? isLoadingRazas
                                                                            ? "Cargando..."
                                                                            : razaOptions.length >
                                                                              0
                                                                            ? "Seleccione raza..."
                                                                            : "No hay razas"
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
                                                            {isLoadingRazas && (
                                                                <Spinner
                                                                    size="sm"
                                                                    className="ms-2"
                                                                />
                                                            )}
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
                                                            />{" "}
                                                            {errors.descripcion && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .descripcion
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>{" "}
                                                    {/* Contador quitado por simplicidad, se puede re-añadir si es necesario */}
                                                    {/* Botones */}
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end mt-3">
                                                            {/* Botón Agregar Mascota (Bootstrap) */}
                                                            <Button
                                                                type="submit"
                                                                color="success"
                                                                className="d-inline-flex align-items-center"
                                                                disabled={
                                                                    isSubmitting ||
                                                                    isLoadingRazas
                                                                }
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Spinner
                                                                            size="sm"
                                                                            className="me-2"
                                                                        />{" "}
                                                                        Agregando...
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
                                                                        Agregar
                                                                        Mascota
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="me-1" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
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
            {/* <Footer /> */}
        </React.Fragment>
    );
};

export default FormAddPets;
