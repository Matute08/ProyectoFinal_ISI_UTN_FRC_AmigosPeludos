import React, { useState, useEffect, useCallback } from "react"; // useCallback añadido
import { useNavigate, useParams } from "react-router-dom";
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
    Alert, // Añadido para mostrar errores
} from "reactstrap";
import classnames from "classnames";

// API Imports
import { useAuth } from "../../../services/AuthContext";
import {
    getRaza,
    getCiudad,
    getAllBarrio,
    getAllRazaId,
} from "../../../services/commonApi";
import {
    getAllEdadMascota,
    getSexoMascota,
    getTipoMascota,
} from "../../../services/PetsApi";
import { getUserMail } from "../../../services/userApi";
import {
    getPublicacionesId,
    updatePost,
    deleteFotoPosteo,
    postFotoPosteo,
} from "../../../services/PublicationsPetsApi";
import {
    uploadFilesPetsLost,
    deleteFileStorage,
} from "../../../services/Firebase";

// Component Imports
import Loading from "../../components/Loading";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";

// FilePond Imports
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const SettingsAdoptPets = () => {
    const { posteoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Asumiendo que user tiene email

    // --- State Hooks ---
    const [posteo, setPosteo] = useState(null); // Inicializar como null
    const [userData, setUserData] = useState(null); // Inicializar como null
    const [tipoMascotaOptions, setTipoMascotaOptions] = useState([]);
    const [tipoSexoOptions, setTipoSexoOptions] = useState([]);
    const [edadMascotaOptions, setEdadMascotaOptions] = useState([]);
    const [razaOptions, setRazaOptions] = useState([]);
    const [ciudadOptions, setCiudadOptions] = useState([]); // Aunque esté deshabilitado, lo cargamos por si cambia
    const [barrioOptions, setBarrioOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Para errores generales de carga
    const [submitError, setSubmitError] = useState(null); // Para errores de envío
    const [activeTab, setActiveTab] = useState("1");
    const [files, setFiles] = useState([]); // Para FilePond (nuevos archivos)
    const [existingFotos, setExistingFotos] = useState([]); // Fotos actuales del posteo

    // --- React Hook Form ---
    const {
        register,
        handleSubmit,
        setValue,
        watch, // Para observar cambios en tipoId
        formState: { errors },
        reset, // Para resetear el form con los datos cargados
    } = useForm({
        defaultValues: {
            // Valores por defecto iniciales
            nombre: "",
            tipoId: "",
            razaId: "",
            edadId: "",
            sexoId: "",
            castracion: "",
            descripcion: "",
            ciudadId: "Cordoba", // Hardcoded como en el original
            barrioId: "",
        },
    });

    // Observar el valor del tipo de mascota para cargar las razas dinámicamente
    const selectedTipoId = watch("tipoId");

    // --- Funciones de Carga de Datos ---

    // Carga las razas según el tipo de mascota seleccionado
    const fetchRazasByType = useCallback(async (tipoId) => {
        if (!tipoId) {
            setRazaOptions([]); // Limpiar opciones si no hay tipo seleccionado
            return;
        }
        try {
            // console.log(`Workspaceing razas for tipoId: ${tipoId}`);
            const response = await getAllRazaId(tipoId);
            setRazaOptions(response.data || []);
        } catch (err) {
            console.error("Error fetching razas by type:", err);
            setError(
                "No se pudieron cargar las razas para el tipo seleccionado."
            );
            setRazaOptions([]);
        }
    }, []); // Sin dependencias, ya que usa tipoId como argumento

    // Carga inicial de todos los datos necesarios
    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Resetear error al iniciar carga
        try {
            // Validar posteoId y user
            if (!posteoId || !user?.email) {
                throw new Error(
                    "Falta ID de posteo o información del usuario."
                );
            }

            // Ejecutar todas las llamadas iniciales en paralelo
            const [
                posteoResponse,
                userDataResponse,
                tipoMascotaResponse,
                tipoSexoResponse,
                edadMascotaResponse,
                ciudadResponse, // Aunque esté deshabilitado, lo cargamos
                barrioResponse,
            ] = await Promise.all([
                getPublicacionesId(posteoId),
                getUserMail(user.email),
                getTipoMascota(),
                getSexoMascota(),
                getAllEdadMascota(),
                getCiudad(),
                getAllBarrio(),
            ]);

            // --- Procesar Datos y Actualizar Estados ---
            const fetchedPosteo = posteoResponse?.data;
            if (!fetchedPosteo)
                throw new Error("No se pudo obtener la publicación.");

            const fetchedUserData = userDataResponse?.data;
            if (!fetchedUserData)
                throw new Error(
                    "No se pudo obtener la información del usuario."
                );

            setPosteo(fetchedPosteo);
            setUserData(fetchedUserData);
            setTipoMascotaOptions(tipoMascotaResponse?.data || []);
            setTipoSexoOptions(tipoSexoResponse?.data || []);
            setEdadMascotaOptions(edadMascotaResponse?.data || []);
            setCiudadOptions(ciudadResponse?.data || []); // Guardar por si acaso
            setBarrioOptions(barrioResponse?.data || []);

            // Procesar fotos existentes
            const initialFotos =
                fetchedPosteo.fotos?.map((foto) => ({
                    id: foto?.id,
                    url: foto?.foto,
                    source: foto, // Guardar la fuente original si es necesaria
                    isExisting: true, // Marcar como existente
                    toBeDeleted: false, // Marcar para no borrar inicialmente
                })) || [];
            setExistingFotos(initialFotos);

            // --- Resetear el formulario con los datos cargados ---
            // Obtener el tipoId correcto basado en la razaId inicial
            let initialTipoId = "";
            if (fetchedPosteo.razaId) {
                try {
                    const todasLasRazas = await getRaza(); // Obtener todas para buscar el tipo
                    const razaActual = todasLasRazas.data?.find(
                        (r) => r.id === fetchedPosteo.razaId
                    );
                    initialTipoId = razaActual?.tipoMascotaId || "";
                } catch (err) {
                    console.error("Error fetching initial raza type:", err);
                    // Continuar sin el tipo inicial si falla
                }
            }

            // Resetear el formulario una vez que tengamos initialTipoId
            reset({
                nombre: fetchedPosteo.nombre || "",
                tipoId: initialTipoId, // Usar el tipo derivado de la raza
                razaId: fetchedPosteo.razaId || "",
                edadId: fetchedPosteo.edadId || "",
                sexoId: fetchedPosteo.sexoId || "",
                castracion:
                    fetchedPosteo.castracion === true
                        ? "1"
                        : fetchedPosteo.castracion === false
                        ? "0"
                        : "", // Manejar true/false/null
                descripcion: fetchedPosteo.descripcion || "",
                ciudadId: "Cordoba", // Valor fijo según código original
                barrioId: fetchedPosteo.barrioId || "",
            });

            // Si teníamos un tipo inicial, cargar sus razas correspondientes
            if (initialTipoId) {
                await fetchRazasByType(initialTipoId);
                // Asegurarse que el valor de razaId se mantenga después de cargar las opciones
                setValue("razaId", fetchedPosteo.razaId || "");
            }
        } catch (err) {
            console.error("Error loading initial data:", err);
            setError(
                err.message ||
                    "Ocurrió un error al cargar los datos. Inténtalo de nuevo."
            );
            setPosteo(null); // Limpiar datos si hay error
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [posteoId, user, reset, fetchRazasByType, setValue]); // Incluir dependencias

    // Efecto para la carga inicial de datos
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]); // Ejecutar cuando loadInitialData cambie (solo al montar o si cambian sus deps)

    // Efecto para cargar razas cuando cambia el tipo de mascota seleccionado en el form
    useEffect(() => {
        if (selectedTipoId) {
            // console.log(`TipoId changed to: ${selectedTipoId}, fetching razas...`);
            fetchRazasByType(selectedTipoId);
            // Limpiar el valor de raza si el tipo cambia, excepto en la carga inicial
            // (El reset inicial ya se encarga de poner la raza correcta)
            if (posteo && selectedTipoId !== watch("tipoId")) {
                // Evitar limpiar en la carga inicial
                setValue("razaId", "");
            }
        } else {
            setRazaOptions([]); // Limpiar si no hay tipo
            setValue("razaId", ""); // Limpiar valor también
        }
    }, [selectedTipoId, fetchRazasByType, setValue, posteo, watch]); // Depender de selectedTipoId

    // --- Handlers ---

    const handleTabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Marcar una foto existente para borrarla (luego se confirma en onSubmit)
    const handleMarkForDeletion = (idToDelete) => {
        setExistingFotos((prevFotos) =>
            prevFotos.map((foto) =>
                foto.id === idToDelete ? { ...foto, toBeDeleted: true } : foto
            )
        );
    };

    // --- Form Submission ---

    const onSubmit = async (data) => {
        setIsLoading(true);
        setSubmitError(null);

        const fotosVisibles = existingFotos.filter(
            (f) => !f.toBeDeleted
        ).length;
        if (fotosVisibles === 0 && files.length === 0) {
            setSubmitError(
                "Debes tener al menos una foto para la publicación."
            );
            setIsLoading(false);
            return;
        }

        // Helper para parsear IDs de forma segura
        const parseId = (value) => {
            if (value === null || value === undefined || value === "")
                return null; // O undefined si prefieres omitir
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? null : parsed; // Devuelve null si no es un número válido
        };

        // Convertir castracion
        let castracionValue = null;
        if (data.castracion === "1") {
            castracionValue = true;
        } else if (data.castracion === "0") {
            castracionValue = false;
        }

        const finalData = {
            id: parseId(posteoId), // ¡Incluir el ID!
            nombre: data.nombre,
            razaId: parseId(data.razaId),
            edadId: parseId(data.edadId),
            sexoId: parseId(data.sexoId),
            barrioId: parseId(data.barrioId),
            descripcion: data.descripcion,
            castracion: castracionValue,

            // --- IDs Fijos ---
            tipoPublicacionId: parseId(posteo?.tipoPublicacionId),
            usuarioId: parseId(userData?.id),

            // --- Campos Adicionales del Modelo (tomados del posteo original) ---
            telefono: posteo?.telefono,
            latitud: posteo?.latitud, // Asegúrate que sea número o null
            longitud: posteo?.longitud, // Asegúrate que sea número o null
            color: posteo?.color,
            fechaPerdida: posteo?.fechaPerdida, // Mantener formato si existe
            calle: posteo?.calle,
            fechaAlta: posteo?.fechaAlta, // Mantener formato si existe
        };

        // Limpiar undefined (nulls son generalmente OK si el tipo C# es nullable, como string? o double?)
        Object.keys(finalData).forEach((key) => {
            if (finalData[key] === undefined) {
                delete finalData[key];
            }
        });

        try {
            // --- 1. Borrar Fotos Marcadas ---
            const fotosAEliminar = existingFotos.filter(
                (foto) => foto.toBeDeleted && foto.id
            );
            if (fotosAEliminar.length > 0) {
                // console.log("Fotos a eliminar:", fotosAEliminar);
                await Promise.all(
                    fotosAEliminar.map(async (foto) => {
                        try {
                            await deleteFileStorage(foto.url); // Borrar de Firebase/Storage
                            await deleteFotoPosteo(foto.id); // Borrar de la BD
                            // console.log(`Foto ${foto.id} eliminada`);
                        } catch (err) {
                            console.error(
                                `Error eliminando foto ${foto.id}:`,
                                err
                            );
                            // Decidir si continuar o detenerse. Aquí continuamos.
                            // throw new Error(`Error al eliminar la foto ${foto.id}.`); // Descomentar para detener
                        }
                    })
                );
            }

            // --- 2. Subir Nuevas Fotos ---
            let newPhotoUrls = [];
            if (files.length > 0) {
                // console.log("Subiendo nuevas fotos:", files);
                const uploadPromises = files.map((fileWrapper) =>
                    uploadFilesPetsLost(fileWrapper.file)
                );
                newPhotoUrls = await Promise.all(uploadPromises);
                // console.log("Nuevas URLs:", newPhotoUrls);

                // Guardar las nuevas fotos en la BD asociadas al posteo
                await Promise.all(
                    newPhotoUrls.map((url) =>
                        postFotoPosteo({
                            foto: url,
                            publicacionMascotaId: parseInt(posteoId, 10),
                        })
                    )
                );
            }

            // --- 3. Actualizar Datos del Posteo ---
            // Ahora finalData debería tener la estructura correcta
            console.log(
                "Actualizando posteo con (Payload Final Revisado):",
                JSON.stringify(finalData, null, 2)
            );
            await updatePost(posteoId, finalData); // Intenta la actualización

            // --- 4. Navegar al perfil si todo OK ---
            // console.log("Posteo actualizado correctamente.");
            navigate(`/perfil/${userData?.mail}`); // Navegar al perfil
        } catch (err) {
            console.error("Error during submission:", err);
            setSubmitError(
                err.message ||
                    "Error al actualizar la publicación. Verifica los datos e inténtalo de nuevo."
            );
            // No quitar el loading aquí si queremos que el usuario vea el error y reintente
            setIsLoading(false); // O quitarlo para permitir reintentar
        }
        // finally {
        // setIsLoading(false); // Quitar loading si no se hizo en catch
        // }
    };

    // --- Renderizado ---

    document.title = "Modificar Publicación | Amigos Peludos";

    if (isLoading && !posteo) {
        // Mostrar loading solo en la carga inicial
        return <Loading />;
    }

    if (error) {
        // Mostrar error de carga si existe
        return (
            <>
                <Navbar />
                <Container className="page-content perfil-fondo pt-5">
                    <Alert color="danger">
                        <h4>Error al cargar datos</h4>
                        <p>{error}</p>
                        <button
                            onClick={loadInitialData}
                            className="btn btn-primary"
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="btn btn-secondary ms-2"
                        >
                            Volver al Inicio
                        </button>
                    </Alert>
                </Container>
                <Footer />
            </>
        );
    }

    // Si llegamos aquí, tenemos datos (o estamos listos para el formulario)
    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content perfil-fondo">
                {isLoading && <Loading overlay={true} />}{" "}
                {/* Loading como overlay durante submit */}
                <Row>
                    {/* Columna Izquierda: Fotos */}
                    <Col xl={3}>
                        <Card className="mt-n5">
                            <CardBody className="p-4">
                                <div className="text-center">
                                    <h5 className="fs-16 mb-3">
                                        Imágenes{" "}
                                        <span className="text-danger">*</span>
                                    </h5>

                                    {/* Fotos Existentes */}
                                    <div className="mb-3 d-flex flex-wrap justify-content-center">
                                        {existingFotos
                                            .filter((f) => !f.toBeDeleted)
                                            .map((foto) => (
                                                <div
                                                    key={foto.id || foto.url}
                                                    className="container-img-cargadas m-1"
                                                >
                                                    <img
                                                        className="img-cargadas"
                                                        src={foto.url}
                                                        alt={`Foto existente ${
                                                            foto.id || ""
                                                        }`}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/path/to/placeholder.png")
                                                        } // Placeholder si falla la carga
                                                    />
                                                    <button
                                                        type="button" // Importante para no submitear el form
                                                        className="btn-eliminar-foto"
                                                        onClick={() =>
                                                            handleMarkForDeletion(
                                                                foto.id
                                                            )
                                                        }
                                                        title="Eliminar esta foto"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        {existingFotos.filter(
                                            (f) => !f.toBeDeleted
                                        ).length === 0 &&
                                            files.length === 0 && (
                                                <p className="text-muted small w-100">
                                                    No hay imágenes. Debes
                                                    agregar al menos una.
                                                </p>
                                            )}
                                    </div>

                                    {/* FilePond para nuevas fotos */}
                                    <FilePond
                                        files={files}
                                        onupdatefiles={setFiles}
                                        allowMultiple={true}
                                        maxFiles={
                                            4 -
                                            existingFotos.filter(
                                                (f) => !f.toBeDeleted
                                            ).length
                                        } // Limitar según las existentes
                                        name="files"
                                        className="filepond filepond-input-multiple"
                                        labelIdle='Arrastra y suelta nuevas fotos aquí o <span class="filepond--label-action"> Búscalas </span>'
                                        acceptedFileTypes={[
                                            "image/png",
                                            "image/jpeg",
                                            "image/jpg",
                                        ]}
                                        labelFileTypeNotAllowed="Tipo de archivo inválido"
                                        fileValidateTypeLabelExpectedTypes="Se esperan {allButLastType} o {lastType}"
                                        credits={false} // Ocultar créditos de FilePond
                                    />
                                    {submitError && (
                                        <Alert color="danger" className="mt-2">
                                            {submitError}
                                        </Alert>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Columna Derecha: Formulario */}
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
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => handleTabChange("1")}
                                            type="button"
                                        >
                                            Actualizar Datos Publicación
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        {/* Nombre Mascota */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="nombre"
                                                    className="form-label"
                                                >
                                                    Nombre de la mascota
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    className="form-control"
                                                    placeholder="Nombre (si lo tiene)"
                                                    {...register("nombre")}
                                                />
                                            </div>
                                        </Col>

                                        {/* Tipo de Mascota */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="tipoId"
                                                    className="form-label"
                                                >
                                                    Tipo de Mascota{" "}
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
                                                    {...register("tipoId", {
                                                        required:
                                                            "El tipo es requerido",
                                                    })}
                                                >
                                                    <option value="">
                                                        Seleccione...
                                                    </option>
                                                    {tipoMascotaOptions.map(
                                                        (el) => (
                                                            <option
                                                                key={el.id}
                                                                value={el.id}
                                                            >
                                                                {el.tipo}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.tipoId && (
                                                    <div className="invalid-feedback">
                                                        {errors.tipoId.message}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Raza */}
                                        <Col lg={6} md={6}>
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
                                                    {...register("razaId", {
                                                        required:
                                                            "La raza es requerida",
                                                    })}
                                                    disabled={
                                                        !selectedTipoId ||
                                                        razaOptions.length === 0
                                                    } // Deshabilitar si no hay tipo o razas
                                                >
                                                    <option value="">
                                                        Seleccione...
                                                    </option>
                                                    {razaOptions.map((el) => (
                                                        <option
                                                            key={el.id}
                                                            value={el.id}
                                                        >
                                                            {el.nombre}
                                                        </option>
                                                    ))}
                                                    {selectedTipoId &&
                                                        razaOptions.length ===
                                                            0 && (
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                No hay razas
                                                                para este tipo
                                                            </option>
                                                        )}
                                                </select>
                                                {errors.razaId && (
                                                    <div className="invalid-feedback">
                                                        {errors.razaId.message}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Edad Aproximada */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="edadId"
                                                    className="form-label"
                                                >
                                                    Edad aproximada{" "}
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
                                                    {...register("edadId", {
                                                        required:
                                                            "La edad es requerida",
                                                    })}
                                                >
                                                    <option value="">
                                                        Seleccione...
                                                    </option>
                                                    {edadMascotaOptions.map(
                                                        (el) => (
                                                            <option
                                                                key={el.id}
                                                                value={el.id}
                                                            >
                                                                {el.descripcion}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.edadId && (
                                                    <div className="invalid-feedback">
                                                        {errors.edadId.message}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Castrado */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="castracion"
                                                    className="form-label"
                                                >
                                                    Castrada/o
                                                </Label>
                                                <select
                                                    id="castracion"
                                                    className="form-select"
                                                    {...register("castracion")} // No requerido
                                                >
                                                    <option value="">
                                                        No se sabe / No aplica
                                                    </option>
                                                    <option value="1">
                                                        Sí
                                                    </option>
                                                    <option value="0">
                                                        No
                                                    </option>
                                                </select>
                                            </div>
                                        </Col>

                                        {/* Sexo */}
                                        <Col lg={6} md={6}>
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
                                                    {...register("sexoId", {
                                                        required:
                                                            "El sexo es requerido",
                                                    })}
                                                >
                                                    <option value="">
                                                        Seleccione...
                                                    </option>
                                                    {tipoSexoOptions.map(
                                                        (el) => (
                                                            <option
                                                                key={el.id}
                                                                value={el.id}
                                                            >
                                                                {el.nombre}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.sexoId && (
                                                    <div className="invalid-feedback">
                                                        {errors.sexoId.message}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Ciudad (Deshabilitada) */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="ciudadId"
                                                    className="form-label"
                                                >
                                                    Ciudad{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Label>
                                                <input
                                                    type="text"
                                                    id="ciudadId"
                                                    className="form-control"
                                                    {...register("ciudadId", {
                                                        required:
                                                            "La ciudad es requerida",
                                                    })}
                                                    disabled // Deshabilitado como en el original
                                                />
                                                {errors.ciudadId && (
                                                    <div className="invalid-feedback d-block">
                                                        {
                                                            errors.ciudadId
                                                                .message
                                                        }
                                                    </div>
                                                )}{" "}
                                                {/* Mostrar error aunque esté disabled */}
                                            </div>
                                        </Col>

                                        {/* Barrio */}
                                        <Col lg={6} md={6}>
                                            <div className="mb-3">
                                                <Label
                                                    htmlFor="barrioId"
                                                    className="form-label"
                                                >
                                                    Barrio{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Label>
                                                <select
                                                    id="barrioId"
                                                    className={`form-select ${
                                                        errors.barrioId
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    {...register("barrioId", {
                                                        required:
                                                            "El barrio es requerido",
                                                    })}
                                                >
                                                    <option value="">
                                                        Seleccione...
                                                    </option>
                                                    {barrioOptions.map((el) => (
                                                        <option
                                                            key={el.id}
                                                            value={el.id}
                                                        >
                                                            {el.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.barrioId && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.barrioId
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
                                                    Aclaraciones / Descripción
                                                </Label>
                                                <textarea
                                                    id="descripcion"
                                                    className={`form-control ${
                                                        errors.descripcion
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    rows="4"
                                                    placeholder="Describe cualquier detalle importante sobre la mascota, su temperamento, necesidades especiales, etc."
                                                    {...register(
                                                        "descripcion",
                                                        {
                                                            maxLength: {
                                                                value: 600,
                                                                message:
                                                                    "La descripción no puede exceder los 600 caracteres",
                                                            },
                                                        }
                                                    )}
                                                />
                                                {errors.descripcion && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.descripcion
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Botones */}
                                        <Col lg={12}>
                                            <div className="hstack gap-2 justify-content-end">
                                                {/* Botón Actualizar */}
                                                <button
                                                    className="button-pz btn-pz-success"
                                                    type="submit"
                                                    disabled={isLoading} // Deshabilitar mientras se envía
                                                >
                                                    <span className="span-pz text-pz">
                                                        {isLoading
                                                            ? "Actualizando..."
                                                            : "Actualizar"}
                                                    </span>
                                                    {/* Icono SVG (simplificado por brevedad) */}
                                                </button>

                                                {/* Botón Volver */}
                                                <button
                                                    type="button" // Evita submit
                                                    className="button-pz btn-pz-secondary"
                                                    onClick={() =>
                                                        navigate(
                                                            `/perfil/${userData?.mail}`
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    <span className="span-pz text-pz">
                                                        Volver
                                                    </span>
                                                    {/* Icono SVG (simplificado por brevedad) */}
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
            <Footer />
        </React.Fragment>
    );
};

export default SettingsAdoptPets;
