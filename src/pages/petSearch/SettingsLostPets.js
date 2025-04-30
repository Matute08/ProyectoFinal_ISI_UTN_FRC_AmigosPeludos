import React, { useState, useEffect, useCallback } from "react";
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
import { format } from "date-fns"; // Mantenido para formatear fecha inicial

// API Imports (ajustar rutas si es necesario)
import { useAuth } from "../../services/AuthContext"; // Cambiado para usar AuthContext
import {
    getRaza, // Necesario para inferir tipo inicial
    getCiudad,
    getAllBarrio,
    getAllRazaId,
} from "../../services/commonApi";
import {
    getAllEdadMascota,
    getSexoMascota,
    getTipoMascota,
} from "../../services/PetsApi";
import { getUserMail } from "../../services/userApi";
import {
    getPublicacionesId,
    updatePost,
    deleteFotoPosteo,
    postFotoPosteo, // Añadido para seguir el patrón de AdoptPets
} from "../../services/PublicationsPetsApi";
import {
    uploadFilesPetsLost,
    deleteFileStorage,
} from "../../services/Firebase";

// Component Imports (ajustar rutas si es necesario)
import Loading from "../components/Loading";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import LeafletMaps from "../components/maps/LeafletMaps"; // Componente específico de LostPets

// FilePond Imports
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// --- Componente Principal ---
const SettingsLostPets = () => {
    const { posteoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Usar useAuth como en AdoptPets

    // --- Estados ---
    const [posteo, setPosteo] = useState(null); // Datos originales del posteo
    const [userData, setUserData] = useState(null);
    const [tipoMascotaOptions, setTipoMascotaOptions] = useState([]);
    const [razaOptions, setRazaOptions] = useState([]);
    const [sexoOptions, setSexoOptions] = useState([]);
    const [edadOptions, setEdadOptions] = useState([]);
    const [ciudadOptions, setCiudadOptions] = useState([]);
    const [barrioOptions, setBarrioOptions] = useState([]);
    const [files, setFiles] = useState([]); // Nuevos archivos de FilePond
    const [existingFotos, setExistingFotos] = useState([]); // Fotos existentes { id, url, isExisting, toBeDeleted }
    const [mapCoords, setMapCoords] = useState(null); // { lat, lng } si el usuario mueve el marcador
    const [isLoading, setIsLoading] = useState(true); // Estado general de carga/submit
    const [error, setError] = useState(null); // Errores críticos de carga
    const [submitError, setSubmitError] = useState(null); // Errores de envío
    const [activeTab, setActiveTab] = useState("1");
    const [charCount, setCharCount] = useState(600); // Límite de descripción

    // --- React Hook Form ---
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            // Valores iniciales antes de cargar datos
            nombre: "",
            tipoId: "",
            razaId: "",
            edadId: "",
            sexoId: "",
            castracion: "",
            descripcion: "",
            color: "",
            fechaPerdida: "",
            ciudadId: "Cordoba", // Valor fijo deshabilitado
            barrioId: "",
            calle: "",
            telefono: "",
        },
    });
    const selectedTipoIdForm = watch("tipoId");
    const descripcionValue = watch("descripcion"); // Para contador de caracteres

    // --- Funciones de Carga ---

    // Carga las razas según el tipo de mascota seleccionado
    const fetchRazasByType = useCallback(async (tipoId) => {
        if (!tipoId) {
            setRazaOptions([]);
            return;
        }
        console.log(`Cargando razas para tipoId: ${tipoId}...`);
        try {
            const response = await getAllRazaId(tipoId);
            const razas = response?.data || response; // Manejar ambos casos
            if (Array.isArray(razas)) {
                setRazaOptions(razas);
                console.log(`Razas cargadas (${razas.length})`);
            } else {
                console.error("Respuesta inválida al cargar razas:", response);
                setRazaOptions([]);
            }
        } catch (err) {
            console.error(`Error cargando razas para tipo ${tipoId}:`, err);
            setError(
                "No se pudieron cargar las razas para el tipo seleccionado."
            );
            setRazaOptions([]);
        }
    }, []); // Dependencia vacía

    // Carga inicial de todos los datos necesarios
    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSubmitError(null);
        console.log("Iniciando carga de datos iniciales...");

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
                ciudadResponse,
                barrioResponse,
                todasLasRazasResponse, // Para inferir tipo inicial
            ] = await Promise.allSettled([
                // Usar allSettled para manejar errores individuales si es necesario
                getPublicacionesId(posteoId),
                getUserMail(user.email),
                getTipoMascota(),
                getSexoMascota(),
                getAllEdadMascota(),
                getCiudad(),
                getAllBarrio(),
                getRaza(), // Obtener todas las razas
            ]);

            // --- Procesar Resultados y Actualizar Estados ---

            // Función helper para verificar resultados de Promise.allSettled
            const checkResult = (result, name) => {
                if (result.status === "fulfilled" && result.value?.data) {
                    return result.value.data;
                } else if (result.status === "fulfilled" && result.value) {
                    // Para getUserMail que puede devolver el objeto directamente
                    return result.value;
                } else {
                    console.error(
                        `Error cargando ${name}:`,
                        result.reason || result.value
                    );
                    // Lanzar error solo para datos críticos
                    if (
                        [
                            "posteo",
                            "userData",
                            "barrios",
                            "tipos",
                            "sexos",
                            "edades",
                            "todasLasRazas",
                        ].includes(name)
                    ) {
                        throw new Error(
                            `Error crítico: No se pudo cargar ${name}.`
                        );
                    }
                    return null; // Devolver null para datos no críticos (ej: ciudad)
                }
            };

            const fetchedPosteo = checkResult(posteoResponse, "posteo");
            const fetchedUserData = checkResult(userDataResponse, "userData");
            const fetchedTipos = checkResult(tipoMascotaResponse, "tipos");
            const fetchedSexos = checkResult(tipoSexoResponse, "sexos");
            const fetchedEdades = checkResult(edadMascotaResponse, "edades");
            const fetchedCiudades = checkResult(ciudadResponse, "ciudades");
            const fetchedBarrios = checkResult(barrioResponse, "barrios");
            const todasLasRazas = checkResult(
                todasLasRazasResponse,
                "todasLasRazas"
            );

            // Actualizar estados principales
            setPosteo(fetchedPosteo);
            setUserData(fetchedUserData);
            setTipoMascotaOptions(fetchedTipos || []);
            setSexoOptions(fetchedSexos || []);
            setEdadOptions(fetchedEdades || []);
            setCiudadOptions(fetchedCiudades || []);
            setBarrioOptions(fetchedBarrios || []);

            // Procesar fotos existentes
            const initialFotos =
                fetchedPosteo?.fotos
                    ?.filter((foto) => foto && foto.id && foto.foto) // Filtrar inválidas
                    .map((foto) => ({
                        id: foto.id,
                        url: foto.foto,
                        isExisting: true,
                        toBeDeleted: false, // Marcar para no borrar inicialmente
                    })) || [];
            setExistingFotos(initialFotos);

            // --- Resetear el formulario con los datos cargados ---
            let initialTipoId = "";
            if (fetchedPosteo?.razaId && Array.isArray(todasLasRazas)) {
                const razaActual = todasLasRazas.find(
                    (r) => r.id === fetchedPosteo.razaId
                );
                initialTipoId = razaActual?.tipoMascotaId || "";
                console.log(
                    `Tipo inicial inferido de raza ${fetchedPosteo.razaId}: ${initialTipoId}`
                );
            }

            // Formatear fecha antes de resetear
            let formattedDate = "";
            try {
                if (fetchedPosteo?.fechaPerdida) {
                    formattedDate = format(
                        new Date(fetchedPosteo.fechaPerdida),
                        "yyyy-MM-dd"
                    );
                }
            } catch (dateError) {
                console.error("Error formateando fecha inicial:", dateError);
            }

            reset({
                nombre: fetchedPosteo?.nombre || "",
                tipoId: initialTipoId || "", // Usar el tipo inferido
                razaId: fetchedPosteo?.razaId || "", // Establecer raza inicial
                edadId: fetchedPosteo?.edadId || "",
                sexoId: fetchedPosteo?.sexoId || "",
                castracion:
                    fetchedPosteo?.castracion === true
                        ? "1"
                        : fetchedPosteo?.castracion === false
                        ? "0"
                        : "", // Manejar true/false/null
                descripcion: fetchedPosteo?.descripcion || "",
                color: fetchedPosteo?.color || "",
                fechaPerdida: formattedDate, // Fecha formateada
                ciudadId: "Cordoba", // Valor fijo
                barrioId: fetchedPosteo?.barrioId || "",
                calle: fetchedPosteo?.calle || "",
                telefono: fetchedPosteo?.telefono || "",
            });

            // Actualizar contador de caracteres
            setCharCount(600 - (fetchedPosteo?.descripcion?.length || 0));
            console.log("Formulario reseteado con datos iniciales.");

            // Cargar las razas para el tipo inicial (si se encontró)
            if (initialTipoId) {
                await fetchRazasByType(initialTipoId);
                // Asegurarse de que el valor de razaId se mantenga después de cargar las opciones
                setValue("razaId", fetchedPosteo?.razaId || "");
                console.log(
                    `Razas cargadas para el tipo inicial ${initialTipoId}.`
                );
            }
        } catch (err) {
            console.error("Error en loadInitialData:", err);
            setError(
                err.message ||
                    "Ocurrió un error al cargar los datos. Inténtalo de nuevo."
            );
            setPosteo(null); // Limpiar datos si hay error crítico
            setUserData(null);
            setExistingFotos([]);
        } finally {
            setIsLoading(false);
            console.log("Carga inicial de datos finalizada.");
        }
    }, [posteoId, user, reset, fetchRazasByType, setValue]); // Dependencias clave de la carga

    // --- Efectos ---

    // 1. Carga inicial de datos
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]); // Ejecutar solo al montar o si cambian sus dependencias

    // 2. Cargar razas cuando cambia el tipo de mascota seleccionado en el form (después de la carga inicial)
    useEffect(() => {
        // Evitar ejecutar si aún se está cargando o si el posteo no existe (indica fallo en carga inicial)
        if (!isLoading && posteo && selectedTipoIdForm !== undefined) {
            // Comprobar si realmente cambió respecto al valor en posteo (o el inferido inicialmente)
            // Esto es un poco complejo porque el valor inicial de tipoId no está directamente en posteo
            // Una forma simple es limpiar razaId siempre que tipoId cambie *después* de la carga inicial
            // console.log(`TipoId cambió a: ${selectedTipoIdForm}, recargando razas...`);
            fetchRazasByType(selectedTipoIdForm);
            // Limpiar el valor de raza si el tipo cambia (evita seleccionar una raza inválida)
            // Podríamos ser más inteligentes y solo limpiar si el cambio no fue parte del reset inicial
            // Por ahora, limpiamos siempre que cambie después de la carga
            if (!isLoading) {
                // Asegurar que no se limpie durante la carga inicial
                setValue("razaId", "");
            }
        }
    }, [selectedTipoIdForm, fetchRazasByType, setValue, isLoading, posteo]); // Depender de selectedTipoIdForm e isLoading/posteo para controlar ejecución

    // 3. Efecto para actualizar contador de caracteres
    useEffect(() => {
        setCharCount(600 - (descripcionValue?.length || 0));
    }, [descripcionValue]);

    // --- Manejadores ---

    const handleTabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Marcar/Desmarcar una foto existente para borrarla
    const handleMarkForDeletion = (idToDelete) => {
        setExistingFotos((prevFotos) =>
            prevFotos.map(
                (foto) =>
                    foto.id === idToDelete
                        ? { ...foto, toBeDeleted: !foto.toBeDeleted }
                        : foto // Toggle delete status
            )
        );
    };

    // Callback para recibir coordenadas del mapa si cambian
    const handleMapChange = useCallback((coords) => {
        console.log("Nuevas coordenadas del mapa:", coords);
        setMapCoords(coords);
    }, []);

    // --- Envío del Formulario ---
    const onSubmit = async (dataForm) => {
        if (!posteoId || !posteo || !userData) {
            setSubmitError("Error: Faltan datos base para actualizar.");
            return;
        }

        setIsLoading(true); // Usar isLoading general para indicar actividad
        setSubmitError(null);

        // Validar que quede al menos una foto
        const fotosVisibles =
            existingFotos.filter((f) => !f.toBeDeleted).length + files.length;
        if (fotosVisibles === 0) {
            setSubmitError(
                "Debes tener al menos una foto para la publicación."
            );
            setIsLoading(false);
            return;
        }
        if (fotosVisibles > 4) {
            setSubmitError("Puedes tener un máximo de 4 fotos en total.");
            setIsLoading(false);
            return;
        }

        try {
            // --- 1. Borrar Fotos Marcadas ---
            const fotosAEliminar = existingFotos.filter(
                (foto) => foto.toBeDeleted && foto.id && foto.url
            );
            if (fotosAEliminar.length > 0) {
                console.log(
                    "Eliminando fotos marcadas:",
                    fotosAEliminar.map((f) => f.id)
                );
                const deletePromises = fotosAEliminar.map(async (foto) => {
                    try {
                        await deleteFotoPosteo(foto.id); // Borrar de la BD
                        await deleteFileStorage(foto.url); // Borrar de Firebase/Storage
                        console.log(`Foto ${foto.id} eliminada.`);
                    } catch (err) {
                        console.error(`Error eliminando foto ${foto.id}:`, err);
                        // Considerar si el error de eliminación debe detener el proceso
                        throw new Error(
                            `Error al eliminar la foto ${foto.id}. Deteniendo.`
                        ); // Detener si una falla
                    }
                });
                await Promise.all(deletePromises); // Esperar a que todas se completen o una falle
            }

            // --- 2. Subir y Vincular Nuevas Fotos ---
            let newPhotoUrls = [];
            if (files.length > 0) {
                console.log("Subiendo nuevas fotos:", files.length);
                const uploadPromises = files.map(
                    (fileItem) => uploadFilesPetsLost(fileItem.file) // Sube a Firebase
                );
                // Esperar a que todas las subidas se completen
                newPhotoUrls = await Promise.all(uploadPromises);
                console.log("Nuevas URLs subidas:", newPhotoUrls);

                // Vincular las nuevas fotos a la publicación en la BD
                const linkPromises = newPhotoUrls.map((url) =>
                    postFotoPosteo({
                        foto: url,
                        publicacionMascotaId: parseInt(posteoId, 10), // Asegurar que el ID sea número
                    })
                );
                await Promise.all(linkPromises); // Esperar a que todas se vinculen
                console.log("Nuevas fotos vinculadas a la publicación.");
            }

            // --- 3. Determinar coordenadas finales ---
            const finalLatitud = mapCoords ? mapCoords.lat : posteo.latitud;
            const finalLongitud = mapCoords ? mapCoords.lng : posteo.longitud;

            // --- 4. Construir payload para updatePost (sin fotos) ---
            const parseId = (value) => (value ? parseInt(value, 10) : null); // Helper
            let castracionValue = null;
            if (dataForm.castracion === "1") castracionValue = true;
            else if (dataForm.castracion === "0") castracionValue = false;

            const finalData = {
                // IDs requeridos para la actualización
                id: parseInt(posteoId, 10), // ID de la publicación a actualizar
                usuarioId: posteo.usuarioId, // Mantener el usuario original
                tipoPublicacionId: posteo.tipoPublicacionId, // Mantener el tipo de publicación

                // Datos del formulario
                nombre: dataForm.nombre || null,
                razaId: parseId(dataForm.razaId),
                edadId: parseId(dataForm.edadId),
                sexoId: parseId(dataForm.sexoId),
                barrioId: parseId(dataForm.barrioId),
                // ciudadId: 1, // Asumiendo Córdoba fijo, si es necesario enviarlo
                castracion: castracionValue,
                color: dataForm.color || null,
                fechaPerdida: dataForm.fechaPerdida || null, // Asegurar formato YYYY-MM-DD o null
                calle: dataForm.calle || null,
                telefono: dataForm.telefono || null,
                descripcion: dataForm.descripcion || null,

                // Datos de ubicación actualizados
                latitud: finalLatitud ? Number(finalLatitud) : null,
                longitud: finalLongitud ? Number(finalLongitud) : null,

                // Campos que no están en el form pero pueden ser necesarios (tomados del original)
                mailUsuario: posteo.mailUsuario || userData?.mail, // Asegurar que el mail esté
                // fechaAlta: posteo.fechaAlta // Normalmente no se actualiza

                // NO incluir 'fotos' ni 'tipoId' aquí si el backend no los espera en updatePost
                // tipoId se usa para la raza, pero la razaId es lo que se envía
            };

            // Limpiar propiedades con valor undefined si es necesario
            Object.keys(finalData).forEach((key) => {
                if (finalData[key] === undefined) {
                    finalData[key] = null; // O delete finalData[key]; según prefiera el backend
                }
            });

            console.log(
                "Datos finales a enviar (updatePost):",
                JSON.stringify(finalData, null, 2)
            );

            // --- 5. Llamar a la API updatePost ---
            await updatePost(posteoId, finalData);

            console.log("Posteo actualizado exitosamente.");
            setFiles([]); // Limpiar FilePond
            navigate(`/perfil/${userData?.mail}`); // Navegar al perfil
        } catch (error) {
            console.error("Error al actualizar el posteo:", error);
            let errorMsg =
                "No se pudo guardar los cambios. Verifique los datos e inténtelo de nuevo.";
            if (error.response) {
                // Error desde la API
                console.error("Error Response:", error.response);
                // Intentar extraer mensajes de validación o error específicos
                if (
                    error.response.data &&
                    typeof error.response.data === "object" &&
                    !Array.isArray(error.response.data)
                ) {
                    const validationErrors = Object.values(error.response.data)
                        .flat()
                        .join(" ");
                    if (validationErrors) {
                        errorMsg = `Error de validación: ${validationErrors}`;
                    } else if (error.response.data.title) {
                        errorMsg = `${error.response.data.title} (Status: ${error.response.status})`;
                    }
                } else if (
                    typeof error.response.data === "string" &&
                    error.response.data.length < 200
                ) {
                    errorMsg = error.response.data;
                } else {
                    errorMsg = `Error del servidor (Status: ${error.response.status}). ${error.message}`;
                }
            } else if (error.request) {
                // No hubo respuesta
                errorMsg =
                    "No se recibió respuesta del servidor. Verifique su conexión.";
            } else {
                // Error en la lógica previa o configuración de la petición
                errorMsg =
                    error.message ||
                    "Error desconocido durante la actualización.";
            }
            setSubmitError(errorMsg);
        } finally {
            setIsLoading(false); // Finalizar estado de carga
        }
    };

    // --- Renderizado ---

    // Estado de Carga Inicial
    if (isLoading && !posteo) {
        return <Loading />;
    }

    // Estado de Error Crítico (carga fallida)
    if (error || !posteo || !userData) {
        // Si hay error o faltan datos esenciales post-carga
        const userEmailForNav = userData?.mail || user?.email || "";
        return (
            <>
                <Navbar />
                <Container
                    fluid
                    className="page-content perfil-fondo d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: "calc(80vh)" }}
                >
                    <Alert color="danger" className="text-center">
                        <h4 className="alert-heading">Error</h4>
                        <p>
                            {error ||
                                "No se pudieron cargar los datos necesarios para editar la publicación."}
                        </p>
                        <p>Posteo Data: {posteo ? "OK" : "Falta"}</p>
                        <p>User Data: {userData ? "OK" : "Falta"}</p>
                    </Alert>
                    <Button
                        color="primary" // Cambiado a primary para reintentar
                        onClick={loadInitialData} // Botón para reintentar
                        className="mt-3 me-2"
                    >
                        Reintentar Carga
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() =>
                            navigate(
                                userEmailForNav
                                    ? `/perfil/${userEmailForNav}`
                                    : "/"
                            )
                        }
                        className="mt-3"
                    >
                        {userEmailForNav ? "Volver al Perfil" : "Ir al Inicio"}
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    // Renderizado del Formulario
    const labelFecha =
        posteo.tipoPublicacionId === 1
            ? "Fecha de Pérdida"
            : "Fecha de Encuentro";
    document.title = `Editar Publicación | Amigos Peludos`;
    const currentTotalFotos =
        existingFotos.filter((f) => !f.toBeDeleted).length + files.length;

    return (
        <React.Fragment>
            <Navbar />
            {isLoading && <Loading overlay={true} />}{" "}
            {/* Overlay durante submit */}
                <Container fluid className="page-content perfil-fondo">
                    <Row>
                        {/* Columna Izquierda: Fotos */}
                        <Col xl={3}>
                            <Card
                                className="mt-n5 "
                               
                            >
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <h5 className="fs-16 mb-3">
                                            Imágenes ({currentTotalFotos}/4)
                                            <span className="text-danger">
                                                {" "}
                                                *
                                            </span>
                                        </h5>

                                        {/* Fotos Existentes */}
                                        <div className="mb-3 d-flex flex-wrap justify-content-center">
                                            {existingFotos.map((foto) => (
                                                <div
                                                    key={foto.id}
                                                    className={`position-relative m-1 ${
                                                        foto.toBeDeleted
                                                            ? "opacity-50"
                                                            : ""
                                                    }`} // Atenuar si está marcada para borrar
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                    }}
                                                >
                                                    <img
                                                        className="img-thumbnail rounded"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                        src={foto.url}
                                                        alt={`Foto ${foto.id}`}
                                                    />
                                                    <Button
                                                        color={
                                                            foto.toBeDeleted
                                                                ? "warning"
                                                                : "danger"
                                                        } // Cambiar color si está marcada
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 m-1 rounded-circle"
                                                        style={{
                                                            lineHeight: "1",
                                                            padding:
                                                                "0.1rem 0.3rem",
                                                            fontSize: "0.7rem",
                                                        }}
                                                        onClick={() =>
                                                            handleMarkForDeletion(
                                                                foto.id
                                                            )
                                                        }
                                                        title={
                                                            foto.toBeDeleted
                                                                ? "Cancelar eliminación"
                                                                : "Marcar para eliminar"
                                                        }
                                                        disabled={isLoading} // Deshabilitar durante submit
                                                    >
                                                        {foto.toBeDeleted ? (
                                                            <i className="fas fa-undo"></i>
                                                        ) : (
                                                            <i className="fas fa-times"></i>
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                            {existingFotos.length === 0 &&
                                                files.length === 0 && (
                                                    <p className="text-muted small">
                                                        No hay imágenes
                                                        cargadas.
                                                    </p>
                                                )}
                                        </div>

                                        {/* Nuevas Fotos (FilePond) */}
                                        {currentTotalFotos < 4 && (
                                            <>
                                                <h6 className="fs-15 mb-2">
                                                    Añadir Nuevas Imágenes
                                                </h6>
                                                <FilePond
                                                    files={files}
                                                    onupdatefiles={(
                                                        fileItems
                                                    ) => {
                                                        // Validar que no exceda el límite total con las nuevas
                                                        const nuevas =
                                                            fileItems.length;
                                                        const existentesVisibles =
                                                            existingFotos.filter(
                                                                (f) =>
                                                                    !f.toBeDeleted
                                                            ).length;
                                                        if (
                                                            existentesVisibles +
                                                                nuevas <=
                                                            4
                                                        ) {
                                                            setFiles(fileItems);
                                                        } else {
                                                            setSubmitError(
                                                                `Error: Máximo 4 fotos en total. Ya tienes ${existentesVisibles} y estás intentando añadir ${nuevas}.`
                                                            );
                                                            // Opcional: No actualizar files si excede
                                                            // setFiles([]); // O mantener las anteriores si las había
                                                        }
                                                    }}
                                                    allowMultiple={true}
                                                    maxFiles={
                                                        4 -
                                                        existingFotos.filter(
                                                            (f) =>
                                                                !f.toBeDeleted
                                                        ).length
                                                    } // Limitar dinámicamente
                                                    name="files"
                                                    className="filepond-input-trigger"
                                                    labelIdle='Arrastra o <span class="filepond--label-action">busca</span> nuevas fotos'
                                                    acceptedFileTypes={[
                                                        "image/png",
                                                        "image/jpeg",
                                                        "image/gif",
                                                    ]}
                                                    labelFileTypeNotAllowed="Archivo inválido"
                                                    fileValidateTypeLabelExpectedTypes="Usa PNG, JPG o GIF"
                                                    disabled={isLoading} // Deshabilitar durante submit
                                                />
                                            </>
                                        )}
                                        {currentTotalFotos > 4 && (
                                            <Alert
                                                color="danger"
                                                className="small mt-1 p-2"
                                            >
                                                Máximo 4 imágenes en total
                                                permitidas.
                                            </Alert>
                                        )}
                                        {submitError &&
                                            !submitError
                                                .toLowerCase()
                                                .includes("validación") && ( // Mostrar errores de submit aquí también si no son de validación (esos van en el form)
                                                <Alert
                                                    color="danger"
                                                    className="mt-2"
                                                >
                                                    {submitError}
                                                </Alert>
                                            )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Columna Derecha: Formulario y Mapa */}
                        <Col xl={9}>
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
                                                onClick={() =>
                                                    handleTabChange("1")
                                                }
                                                href="#" // href="#" es necesario para que NavLink funcione como tab
                                            >
                                                <i className="fas fa-edit me-1"></i>
                                                Editar Datos y Ubicación
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    {submitError &&
                                        submitError
                                            .toLowerCase()
                                            .includes("validación") && ( // Mostrar errores de validación del backend aquí
                                            <Alert
                                                color="danger"
                                                className="mt-2 mb-3"
                                            >
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
                                                    {/* --- CAMPOS DEL FORMULARIO (Mantenidos de LostPets original) --- */}

                                                    {/* Nombre Mascota */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="nombre"
                                                                className="form-label"
                                                            >
                                                                Nombre Mascota
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                id="nombre"
                                                                className={`form-control ${
                                                                    errors.nombre
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Nombre (opcional)"
                                                                {...register(
                                                                    "nombre",
                                                                    {
                                                                        maxLength:
                                                                            {
                                                                                value: 50,
                                                                                message:
                                                                                    "Máximo 50 caracteres",
                                                                            },
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
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

                                                    {/* Tipo Mascota */}
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
                                                                            "Seleccione el tipo",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
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
                                                                            "Seleccione la raza",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    !selectedTipoIdForm ||
                                                                    razaOptions.length ===
                                                                        0 ||
                                                                    isLoading
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
                                                                Edad Aproximada{" "}
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
                                                                            "Seleccione la edad",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
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

                                                    {/* Sexo */}
                                                    <Col lg={4} md={6}>
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
                                                                            "Seleccione el sexo",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
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

                                                    {/* Castracion */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="castracion"
                                                                className="form-label"
                                                            >
                                                                Castrado/a
                                                            </Label>
                                                            <select
                                                                id="castracion"
                                                                className="form-select"
                                                                {...register(
                                                                    "castracion"
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            >
                                                                <option value="">
                                                                    No sé / No
                                                                    aplica
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
                                                                className={`form-control ${
                                                                    errors.color
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Color predominante"
                                                                {...register(
                                                                    "color",
                                                                    {
                                                                        required:
                                                                            "Ingrese el color",
                                                                        maxLength:
                                                                            {
                                                                                value: 50,
                                                                                message:
                                                                                    "Máximo 50 caracteres",
                                                                            },
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
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

                                                    {/* Fecha Perdida/Encuentro */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="fechaPerdida"
                                                                className="form-label"
                                                            >
                                                                {labelFecha}{" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="date"
                                                                id="fechaPerdida"
                                                                className={`form-control ${
                                                                    errors.fechaPerdida
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                {...register(
                                                                    "fechaPerdida",
                                                                    {
                                                                        required:
                                                                            "Seleccione la fecha",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            />
                                                            {errors.fechaPerdida && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .fechaPerdida
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    {/* Teléfono */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="telefono"
                                                                className="form-label"
                                                            >
                                                                Teléfono
                                                                Contacto
                                                                (Opcional)
                                                            </Label>
                                                            <input
                                                                type="tel"
                                                                id="telefono"
                                                                className={`form-control ${
                                                                    errors.telefono
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Ej: 3511234567"
                                                                {...register(
                                                                    "telefono",
                                                                    {
                                                                        pattern:
                                                                            {
                                                                                value: /^[0-9]{8,15}$/,
                                                                                message:
                                                                                    "Solo números (8-15 dígitos)",
                                                                            },
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            />
                                                            {errors.telefono && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors
                                                                            .telefono
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    {/* Ciudad (Deshabilitado) */}
                                                    <Col lg={4} md={6}>
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
                                                                {...register(
                                                                    "ciudadId"
                                                                )}
                                                                value="Cordoba"
                                                                disabled
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Barrio */}
                                                    <Col lg={4} md={6}>
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
                                                                {...register(
                                                                    "barrioId",
                                                                    {
                                                                        required:
                                                                            "Seleccione el barrio",
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            >
                                                                <option value="">
                                                                    Seleccione...
                                                                </option>
                                                                {barrioOptions.map(
                                                                    (
                                                                        barrio
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                barrio.id
                                                                            }
                                                                            value={
                                                                                barrio.id
                                                                            }
                                                                        >
                                                                            {
                                                                                barrio.nombre
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

                                                    {/* Calle */}
                                                    <Col lg={4} md={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="calle"
                                                                className="form-label"
                                                            >
                                                                Calle y Nro
                                                                (Aprox){" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="text"
                                                                id="calle"
                                                                className={`form-control ${
                                                                    errors.calle
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Ej: Av. Colón 1500"
                                                                {...register(
                                                                    "calle",
                                                                    {
                                                                        required:
                                                                            "Ingrese la calle",
                                                                        maxLength:
                                                                            {
                                                                                value: 100,
                                                                                message:
                                                                                    "Máximo 100 caracteres",
                                                                            },
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
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

                                                    {/* Descripción */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="descripcion"
                                                                className="form-label"
                                                            >
                                                                Descripción
                                                                Adicional
                                                            </Label>
                                                            <textarea
                                                                id="descripcion"
                                                                rows="4"
                                                                className={`form-control ${
                                                                    errors.descripcion
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                placeholder="Señas particulares, carácter, cómo/dónde se perdió/encontró..."
                                                                maxLength={600}
                                                                {...register(
                                                                    "descripcion",
                                                                    {
                                                                        maxLength:
                                                                            {
                                                                                value: 600,
                                                                                message:
                                                                                    "Máximo 600 caracteres",
                                                                            },
                                                                    }
                                                                )}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            />
                                                            <div className="d-flex justify-content-between">
                                                                {errors.descripcion && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {
                                                                            errors
                                                                                .descripcion
                                                                                .message
                                                                        }
                                                                    </div>
                                                                )}
                                                                <small className="text-muted ms-auto mt-1">
                                                                    Restantes:{" "}
                                                                    {charCount}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    {/* Mapa */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="location"
                                                                className="form-label"
                                                            >
                                                                Ubicación en el
                                                                Mapa (Ajustar si
                                                                es necesario){" "}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <LeafletMaps
                                                                latitud={
                                                                    posteo.latitud
                                                                }
                                                                longitud={
                                                                    posteo.longitud
                                                                }
                                                                isClickeable={
                                                                    true
                                                                }
                                                                onCoordsChange={
                                                                    handleMapChange
                                                                }
                                                                mapHeight="300px"
                                                            />
                                                            {/* Validación simple: advertir si no hay coords iniciales ni nuevas */}
                                                            {!mapCoords &&
                                                                !posteo.latitud &&
                                                                !posteo.longitud && (
                                                                    <p className="text-warning small mt-1">
                                                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                                                        Asegúrate
                                                                        de
                                                                        marcar
                                                                        la
                                                                        ubicación
                                                                        en el
                                                                        mapa
                                                                        haciendo
                                                                        clic.
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </Col>

                                                    {/* Botones */}
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end mt-3">
                                                            <Button
                                                                type="submit"
                                                                color="success"
                                                                className="d-inline-flex align-items-center"
                                                                disabled={
                                                                    isLoading ||
                                                                    currentTotalFotos >
                                                                        4 ||
                                                                    currentTotalFotos ===
                                                                        0
                                                                }
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <Spinner
                                                                            size="sm"
                                                                            className="me-2"
                                                                        />{" "}
                                                                        Guardando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-save me-1"></i>{" "}
                                                                        Guardar
                                                                        Cambios
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                color="secondary"
                                                                className="d-inline-flex align-items-center"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/perfil/${userData?.mail}`
                                                                    )
                                                                }
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            >
                                                                <i className="fas fa-arrow-left me-1"></i>{" "}
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
            <Footer />
        </React.Fragment>
    );
};

export default SettingsLostPets;
