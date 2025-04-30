// Settings.js (Revisado y Corregido)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    Spinner,
} from "reactstrap";
import classnames from "classnames";

// Componentes y Servicios
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import { deleteFileStorage, uploadFileUser } from "../../services/Firebase";
import Loading from "../components/Loading";
import { getUserMail, updateUser } from "../../services/userApi";
import { getGenero, getAllBarrio } from "../../services/commonApi";

// Imagen por defecto (ajusta la ruta si es necesario)
import avatarDefault from "../../assets/images/user/user-random.jpg";

// FilePond (para subida de archivos)
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Registrar plugins de FilePond
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UserProfileSetting = () => {
    const navigate = useNavigate();

    // Estado del componente
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("1");
    const [genero, setGenero] = useState([]);
    const [allBarrio, setAllBarrio] = useState([]);
    const [files, setFiles] = useState([]); // Estado para FilePond

    // Configuración de React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Regla de validación para nombres
    const nameValidation = /^[A-Za-zÀ-ÿ\s']+$/u;

    // --- EFECTOS ---

    // Efecto para cargar todos los datos iniciales necesarios
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Obtener email del localStorage
                const cachedUserData = localStorage.getItem("userData");
                if (!cachedUserData)
                    throw new Error("No hay sesión de usuario activa.");
                const dataLocalStorage = JSON.parse(cachedUserData);
                const userEmail = dataLocalStorage?.email;
                if (!userEmail)
                    throw new Error("No se pudo obtener el email del usuario.");

                // 2. Ejecutar llamadas a la API en paralelo
                const results = await Promise.allSettled([
                    getUserMail(userEmail), // Obtener datos del usuario
                    getGenero(), // Obtener géneros
                    getAllBarrio(), // Obtener todos los barrios
                ]);

                // 3. Procesar resultados
                const [userResult, generoResult, barrioResult] = results;

                // *** CORRECCIÓN AQUÍ: Acceder a .data si la API lo devuelve así ***
                if (
                    userResult.status === "fulfilled" &&
                    userResult.value?.data
                ) {
                    setUserData(userResult.value.data); // Guardar el objeto DENTRO de 'data'
                } else if (
                    userResult.status === "fulfilled" &&
                    userResult.value
                ) {
                    // Si la API devuelve el objeto directamente (menos probable basado en otros componentes)
                    console.warn(
                        "La API getUserMail parece haber devuelto el objeto directamente, no dentro de .data"
                    );
                    setUserData(userResult.value);
                } else {
                    // Manejar el caso de error o respuesta inesperada
                    console.error(
                        "Error al cargar datos del usuario:",
                        userResult.reason || userResult.value
                    );
                    throw new Error(
                        `Error al cargar datos del usuario: ${
                            userResult.reason?.message || "Respuesta no válida"
                        }`
                    );
                }

                // Procesar géneros (asumiendo { data: [...] })
                if (
                    generoResult.status === "fulfilled" &&
                    generoResult.value?.data
                ) {
                    setGenero(generoResult.value.data);
                } else {
                    console.error(
                        "Error al cargar géneros:",
                        generoResult.reason
                    );
                }

                // Procesar barrios (asumiendo que devuelve el array directamente)
                if (
                    barrioResult.status === "fulfilled" &&
                    Array.isArray(barrioResult.value)
                ) {
                    setAllBarrio(barrioResult.value);
                } else if (
                    barrioResult.status === "fulfilled" &&
                    barrioResult.value?.data
                ) {
                    // Si devuelve { data: [...] }
                    setAllBarrio(barrioResult.value.data);
                    console.warn(
                        "La API getAllBarrio devolvió los datos dentro de .data"
                    );
                } else {
                    console.error(
                        "Error al cargar barrios:",
                        barrioResult.reason
                    );
                }
            } catch (err) {
                console.error("Error cargando datos iniciales:", err);
                setError(
                    err.message || "Ocurrió un error al cargar la página."
                );
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []); // Ejecutar solo al montar

    // Efecto para actualizar los valores del formulario cuando userData cambia
    useEffect(() => {
        if (userData) {
            setValue("nombreCompleto", userData.nombreCompleto || "");
            setValue("mail", userData.mail || "");
            setValue("celular", userData.celular || "");
            setValue("calle", userData.calle || "");
            setValue("nroCalle", userData.nroCalle || "");
            setValue("generoId", userData.generoId || "");
            setValue("barrioId", userData.barrioId || "");
        }
    }, [userData, setValue]);

    // --- MANEJADORES Y FUNCIONES ---

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const obtenerUrls = async (filesToUpload) => {
        if (!filesToUpload || filesToUpload.length === 0) return [];
        const fileToUpload = filesToUpload[0].file;
        try {
            const uploadedUrl = await uploadFileUser(fileToUpload);
            return [{ foto: uploadedUrl }];
        } catch (uploadError) {
            console.error("Error al subir archivo a Firebase:", uploadError);
            throw new Error("Error al subir la nueva foto.");
        }
    };

    const onSubmit = async (dataForm) => {
        // Renombrar 'data' a 'dataForm' para claridad
        if (!userData?.id) {
            setError("Error: No se puede actualizar sin ID de usuario.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        let newPhotoUrl = null;

        try {
            // 1. Manejar subida de nueva foto (igual que antes)
            if (files.length > 0) {
                if (userData.foto) {
                    try {
                        await deleteFileStorage(userData.foto);
                    } catch (deleteError) {
                        console.warn(
                            "No se pudo borrar la foto anterior:",
                            deleteError
                        );
                    }
                }
                const urls = await obtenerUrls(files);
                if (urls.length > 0 && urls[0].foto) {
                    newPhotoUrl = urls[0].foto;
                }
            }

            // 2. *** Preparar datos para la API: Empezar con userData y sobrescribir ***
            const dataToUpdate = {
                ...userData, // <<== Copia TODOS los campos existentes (incluye tieneMascota, rolId, etc.)

                // Sobrescribir con los valores del formulario
                nombreCompleto: dataForm.nombreCompleto,
                generoId: parseInt(dataForm.generoId, 10),
                celular: dataForm.celular,
                calle: dataForm.calle,
                nroCalle: dataForm.nroCalle,
                barrioId:
                    dataForm.barrioId === ""
                        ? 0
                        : parseInt(dataForm.barrioId, 10),
                // No sobrescribir 'mail' si no es editable o no se debe enviar
                // mail: dataForm.mail,

                // Sobrescribir 'foto' SOLO si se subió una nueva
                // Si no se subió una nueva (newPhotoUrl es null), se mantendrá userData.foto de la copia inicial
                ...(newPhotoUrl !== null && { foto: newPhotoUrl }),

                // Asegurar que el ID esté presente si la API lo requiere en el body
                // Si updateUser(id, data) lo pasa como parámetro, se puede omitir aquí.
                // Por seguridad, lo dejamos como en la copia inicial de userData.
                id: userData.id,
            };

            // Opcional: Eliminar campos que NUNCA deben enviarse en una actualización
            // delete dataToUpdate.password; // Si existiera
            // delete dataToUpdate.mail; // Si el email no se puede cambiar

            console.log("Datos a enviar para actualizar:", dataToUpdate);

            // 3. Llamar a la API
            await updateUser(userData.id, dataToUpdate); // Pasar ID y el objeto completo

            setFiles([]);
            // Considera actualizar localStorage aquí si es necesario
            navigate(`/perfil/${userData.mail}`);
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setError(error.message || "No se pudo actualizar el perfil.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDERIZADO ---

    if (isLoading) return <Loading />;

    if (error && !userData) {
        return (
            <>
                <Navbar />
                <Container
                    className="page-content perfil-fondo d-flex justify-content-center align-items-center"
                    style={{ minHeight: "calc(80vh)" }}
                >
                    <p className="text-danger h5">{error}</p>
                </Container>
                <Footer />
            </>
        );
    }

    // Si no hay userData pero tampoco hubo error fatal (raro, pero posible)
    if (!userData) {
        return (
            <>
                <Navbar />
                <Container
                    className="page-content perfil-fondo d-flex justify-content-center align-items-center"
                    style={{ minHeight: "calc(80vh)" }}
                >
                    <p className="text-warning h5">
                        No se encontró información del usuario.
                    </p>
                </Container>
                <Footer />
            </>
        );
    }

    document.title = "Modificar Perfil | Amigos Peludos";
    return (
        <>
            <Navbar />
            <div className="page-content perfil-fondo">
                <Container fluid>
                    <Row>
                        {/* Columna Izquierda: Foto y Carga de Foto */}
                        <Col xxl={3}>
                            <Card className="mt-n5">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        {/* Mostrar Foto Actual */}
                                        <img
                                            className="img-thumbnail rounded-circle mb-3"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                            }}
                                            // *** CORRECCIÓN AQUÍ: Usar avatarDefault importado ***
                                            src={
                                                userData?.foto || avatarDefault
                                            }
                                            alt="Foto de perfil actual"
                                            // *** CORRECCIÓN onError: Evitar bucles y usar avatarDefault ***
                                            onError={(e) => {
                                                if (
                                                    e.target.src !==
                                                    avatarDefault
                                                ) {
                                                    e.target.onerror = null; // Prevenir bucle si avatarDefault también falla
                                                    e.target.src =
                                                        avatarDefault;
                                                }
                                            }}
                                        />
                                        <h5 className="fs-16 mb-1">
                                            {userData?.nombreCompleto ||
                                                "Usuario"}
                                        </h5>
                                        <p className="text-muted mb-3">
                                            Usuario
                                        </p>

                                        {/* FilePond */}
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={false}
                                            maxFiles={1}
                                            name="files"
                                            className="filepond filepond-input-circle"
                                            labelIdle='Arrastra o <span class="filepond--label-action">busca</span> tu nueva foto'
                                            acceptedFileTypes={[
                                                "image/png",
                                                "image/jpeg",
                                                "image/gif",
                                            ]}
                                            labelFileTypeNotAllowed="Tipo de archivo inválido"
                                            fileValidateTypeLabelExpectedTypes="Utiliza formato PNG, JPG o GIF"
                                        />
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
                                                className={classnames({
                                                    active: activeTab === "1",
                                                })}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    tabChange("1");
                                                }} // Prevenir default en NavLink
                                                href="#"
                                            >
                                                <i className="fas fa-user-edit me-1"></i>
                                                Datos Personales
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>

                                <CardBody className="p-4">
                                    {/* Mostrar error general si ocurrió durante submit o carga */}
                                    {error && !isLoading && (
                                        <p className="text-danger mb-3">
                                            {error}
                                        </p>
                                    )}

                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            {/* Pasar userData.id al form si es necesario */}
                                            <Form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <Row>
                                                    {/* Campos del formulario (sin cambios en esta parte, ya parecían correctos) */}
                                                    {/* Nombre Completo */}
                                                    <Col lg={6} md={6}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="nombreCompleto"
                                                                className="form-label"
                                                            >
                                                                Nombre Completo
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="nombreCompleto"
                                                                placeholder="Tu nombre y apellido"
                                                                className={`form-control ${
                                                                    errors.nombreCompleto
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "nombreCompleto",
                                                                    {
                                                                        required:
                                                                            "Este campo es obligatorio",
                                                                        pattern:
                                                                            {
                                                                                value: nameValidation,
                                                                                message:
                                                                                    "El nombre solo debe contener letras y espacios.",
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 100,
                                                                                message:
                                                                                    "Máximo 100 caracteres",
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
                                                    {/* Genero */}
                                                    <Col lg={6} md={6}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="generoId"
                                                                className="form-label"
                                                            >
                                                                Género
                                                            </label>
                                                            <select
                                                                id="generoId"
                                                                className={`form-select ${
                                                                    errors.generoId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "generoId",
                                                                    {
                                                                        required:
                                                                            "Selecciona tu género",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {genero.length >
                                                                0 ? (
                                                                    genero.map(
                                                                        (g) => (
                                                                            <option
                                                                                key={
                                                                                    g.id
                                                                                }
                                                                                value={
                                                                                    g.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    g.nombre
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <option
                                                                        disabled
                                                                    >
                                                                        Cargando...
                                                                    </option>
                                                                )}
                                                            </select>
                                                            {errors.generoId && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .generoId
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Celular */}
                                                    <Col lg={6} md={6}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="celular"
                                                                className="form-label"
                                                            >
                                                                Número de
                                                                Celular
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                id="celular"
                                                                placeholder="Ej: 3511234567"
                                                                className={`form-control ${
                                                                    errors.celular
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "celular",
                                                                    {
                                                                        required:
                                                                            "El número de celular es obligatorio",
                                                                        minLength:
                                                                            {
                                                                                value: 8,
                                                                                message:
                                                                                    "Debe tener al menos 8 dígitos",
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 15,
                                                                                message:
                                                                                    "Máximo 15 dígitos",
                                                                            },
                                                                        pattern:
                                                                            {
                                                                                value: /^[0-9]+$/,
                                                                                message:
                                                                                    "Solo números permitidos",
                                                                            },
                                                                    }
                                                                )}
                                                            />
                                                            {errors.celular && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .celular
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Correo Electronico (Read Only) */}
                                                    <Col lg={6} md={6}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="mail"
                                                                className="form-label"
                                                            >
                                                                Correo
                                                                Electrónico
                                                            </label>
                                                            <input
                                                                type="email"
                                                                id="mail"
                                                                className="form-control"
                                                                readOnly
                                                                style={{
                                                                    backgroundColor:
                                                                        "#e9ecef",
                                                                }}
                                                                {...register(
                                                                    "mail"
                                                                )}
                                                            />
                                                        </div>
                                                    </Col>
                                                    {/* --- Dirección --- */}
                                                    <h6 className="mt-3 mb-3">
                                                        Dirección
                                                    </h6>
                                                    {/* Pais, Provincia, Ciudad (Read Only Placeholders) */}
                                                    <Col lg={4} md={4}>
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                País
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value="Argentina"
                                                                readOnly
                                                                style={{
                                                                    backgroundColor:
                                                                        "#e9ecef",
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={4}>
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Provincia
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value="Córdoba"
                                                                readOnly
                                                                style={{
                                                                    backgroundColor:
                                                                        "#e9ecef",
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={4}>
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Ciudad
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value="Córdoba"
                                                                readOnly
                                                                style={{
                                                                    backgroundColor:
                                                                        "#e9ecef",
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    {/* Barrio */}
                                                    <Col lg={6} md={6}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="barrioId"
                                                                className="form-label"
                                                            >
                                                                Barrio
                                                            </label>
                                                            <select
                                                                id="barrioId"
                                                                className={`form-select ${
                                                                    errors.barrioId
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "barrioId",
                                                                    {
                                                                        required:
                                                                            "Selecciona tu barrio",
                                                                    }
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {allBarrio.length >
                                                                0 ? (
                                                                    allBarrio.map(
                                                                        (b) => (
                                                                            <option
                                                                                key={
                                                                                    b.id
                                                                                }
                                                                                value={
                                                                                    b.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    b.nombre
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <option
                                                                        disabled
                                                                    >
                                                                        Cargando...
                                                                    </option>
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
                                                    {/* Calle */}
                                                    <Col lg={4} md={4}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="calle"
                                                                className="form-label"
                                                            >
                                                                Calle
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="calle"
                                                                placeholder="Nombre de la calle"
                                                                className={`form-control ${
                                                                    errors.calle
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "calle",
                                                                    {
                                                                        required:
                                                                            "La calle es obligatoria",
                                                                        pattern:
                                                                            {
                                                                                value: /^[A-Za-zÀ-ÿ0-9\s'.\-]+$/u,
                                                                                message:
                                                                                    "Nombre de calle inválido",
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 150,
                                                                                message:
                                                                                    "Máximo 150 caracteres",
                                                                            },
                                                                    }
                                                                )}
                                                            />
                                                            {errors.calle && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .calle
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    {/* Altura */}
                                                    <Col lg={2} md={2}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="nroCalle"
                                                                className="form-label"
                                                            >
                                                                Altura
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="nroCalle"
                                                                placeholder="Ej: 1234"
                                                                className={`form-control ${
                                                                    errors.nroCalle
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "nroCalle",
                                                                    {
                                                                        required:
                                                                            "La altura es obligatoria",
                                                                        maxLength:
                                                                            {
                                                                                value: 10,
                                                                                message:
                                                                                    "Máximo 10 caracteres",
                                                                            },
                                                                        pattern:
                                                                            {
                                                                                value: /^[a-zA-Z0-9\s/.-]+$/,
                                                                                message:
                                                                                    "Altura inválida",
                                                                            },
                                                                    }
                                                                )}
                                                            />
                                                            {errors.nroCalle && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .nroCalle
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    {/* Botones de Acción */}
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end mt-3">
                                                            
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success d-inline-flex align-items-center" 
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                                style={{
                                                                    "--bs-btn-padding-y":
                                                                        ".4rem",
                                                                    "--bs-btn-padding-x":
                                                                        ".75rem",
                                                                    "--bs-btn-font-size":
                                                                        ".9rem",
                                                                }} // Ajuste opcional de tamaño
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Spinner
                                                                            size="sm"
                                                                            className="me-2"
                                                                        >
                                                                            {" "}
                                                                        </Spinner>{" "}
                                                                        {/* Spinner con margen */}
                                                                        Actualizando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* Icono SVG */}
                                                                        <svg
                                                                            viewBox="0 0 920 922"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="me-1"
                                                                        >
                                                                            {" "}
                                                                            {/* fill="currentColor" hereda color */}
                                                                            <g transform="translate(0,922) scale(0.1,-0.1)">
                                                                                <path d="M1350 9199 c-373 -6 -423 -9 -492 -27 -119 -32 -218 -78 -331 -152 -184 -121 -321 -279 -422 -484 -54 -108 -70 -184 -86 -403 -14 -190 -21 -6170 -8 -6733 11 -490 26 -592 111 -750 154 -284 398 -492 688 -585 80 -26 102 -28 380 -38 403 -15 6439 -14 6830 0 267 10 290 12 370 38 297 95 551 318 698 611 79 157 91 246 101 724 4 190 9 1567 9 3060 l2 2715 -1017 1017 -1018 1018 -2700 -2 c-1485 -1 -2887 -5 -3115 -9z m91 -1441 c1 -1211 11 -1792 31 -1838 8 -19 38 -56 65 -82 46 -42 56 -47 119 -55 90 -11 4648 -11 4738 0 63 8 73 13 119 55 27 26 56 62 64 80 26 61 33 442 33 1735 l0 987 158 0 157 0 850 -850 850 -850 -4 -2966 -3 -2966 -45 -81 c-91 -166 -140 -213 -296 -288 l-85 -41 -212 -9 c-117 -5 -214 -8 -216 -6 -2 1 -4 682 -6 1512 -3 2060 -9 2599 -30 2645 -8 20 -44 62 -78 93 l-63 57 -2986 0 -2986 0 -64 -57 c-35 -31 -70 -72 -77 -90 -25 -58 -34 -818 -34 -2851 l0 -1313 -152 6 c-243 10 -300 20 -387 62 -105 52 -209 157 -273 276 l-48 88 0 3601 0 3601 42 78 c76 143 172 236 307 298 80 37 154 46 404 49 l107 2 1 -882z m4599 -268 l0 -1150 -2015 0 -2015 0 0 1150 0 1150 2015 0 2015 0 0 -1150z m1145 -5036 l0 -1869 -2585 0 -2585 0 -3 1860 c-1 1023 0 1865 2 1870 2 7 873 10 2587 9 l2584 -1 0 -1869z M4980 8049 c-14 -6 -40 -24 -57 -42 l-33 -31 0 -492 0 -491 46 -36 c56 -44 101 -51 287 -45 138 4 160 10 210 56 l27 26 0 491 0 491 -32 31 c-18 18 -46 37 -61 42 -36 14 -353 13 -387 0z M3240 3451 c-166 -6 -189 -9 -220 -28 -87 -54 -140 -149 -140 -253 0 -81 23 -134 85 -195 86 -87 -33 -80 1335 -83 1210 -3 1810 6 1862 27 47 18 116 89 135 139 12 31 18 73 17 124 -1 94 -27 152 -96 211 -43 36 -53 40 -129 48 -102 10 -2597 19 -2849 10z M3160 2010 c-121 -7 -150 -19 -208 -85 -49 -56 -72 -119 -72 -199 0 -99 63 -195 162 -248 l43 -23 1460 2 c872 1 1494 5 1543 11 76 9 88 13 130 50 69 58 95 116 96 210 1 51 -5 93 -17 124 -19 49 -87 120 -135 140 -16 7 -131 14 -292 18 -350 8 -2576 9 -2710 0z" />
                                                                            </g>
                                                                        </svg>
                                                                        {/* Texto del Botón */}
                                                                        Actualizar
                                                                    </>
                                                                )}
                                                            </button>
                                                            {/* Botón Volver */}
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary d-inline-flex align-items-center" 
                                                                onClick={() =>
                                                                    navigate(
                                                                        userData?.mail
                                                                            ? `/perfil/${userData.mail}`
                                                                            : "/perfil"
                                                                    )
                                                                }
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                                style={{
                                                                    "--bs-btn-padding-y":
                                                                        ".4rem",
                                                                    "--bs-btn-padding-x":
                                                                        ".75rem",
                                                                    "--bs-btn-font-size":
                                                                        ".9rem",
                                                                }} // Ajuste opcional de tamaño
                                                            >
                                                                {/* Icono SVG */}
                                                                <svg
                                                                    viewBox="0 0 232 217"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="currentColor"
                                                                    className="me-1"
                                                                >
                                                                    {" "}
                                                                    {/* fill="currentColor" hereda color */}
                                                                    <g transform="translate(0,210) scale(0.1,-0.1)">
                                                                        <path d="M740 2163 c-27 -11 -705 -486 -717 -502 -7 -9 -15 -31 -19 -48 -13 -65 5 -79 399 -319 319 -195 373 -224 408 -224 31 0 47 7 70 29 42 42 38 79 -21 205 l-49 106 510 0 509 0 38 -34 37 -34 3 -404 c2 -441 3 -435 -57 -475 l-34 -23 -571 0 -572 0 -44 -22 c-55 -28 -86 -73 -95 -138 -14 -101 16 -180 83 -222 l37 -23 575 -3 c389 -2 597 1 642 8 187 32 350 169 417 353 l26 72 3 425 c3 350 0 439 -12 498 -39 187 -161 330 -342 400 l-69 27 -552 5 -552 5 45 108 c24 59 44 121 44 137 0 60 -85 116 -140 93z" />
                                                                    </g>
                                                                </svg>
                                                                {/* Texto del Botón */}
                                                                Volver
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
            <Footer />
        </>
    );
};

export default UserProfileSetting;
