import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Step,
    StepLabel,
    Stepper,
    Typography,
    Paper,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { updateCuidador, getCuidadoresId } from "../../api/cuidadoresApi";
import { useAuth } from "../../auth/AuthProvider";
import Paso1Cuidador from "./agregarCuidador/Paso1Cuidador";
import Paso2Cuidador from "./agregarCuidador/Paso2Cuidador";
import Paso3Cuidador from "./agregarCuidador/Paso3Cuidador";
import Paso4Cuidador from "./agregarCuidador/Paso4Cuidador";
import Paso5CuidadorEdicion from "./agregarCuidador/Paso5CuidadorEdicion";
import CustomLoader from "../../components/CustomLoader";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../utils/showAlert";
import { deleteFileStorage } from "../../api/firebaseUploads";

const pasos = [
    "Datos personales",
    "Vivienda",
    "Experiencia",
    "Horarios y precio",
    "Fotos",
];

const camposPorPaso = [
    [
        "nombreCompleto",
        "mail",
        "fechaNacimiento",
        "barrioId",
        "calle",
        "nroCalle",
    ],
    ["tipoViviendaId"],
    ["titulo", "presentacion", "experienciaId"],
    ["precioCuidado", "grilla"],
    ["fotos"],
];

const EditarCuidador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [fotosOriginales, setFotosOriginales] = useState([]);
    const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

    const methods = useForm({
        defaultValues: {
            nombreCompleto: "",
            mail: "",
            fechaNacimiento: "",
            generoId: "",
            barrioId: "",
            calle: "",
            nroCalle: "",
            piso: "",
            tipoViviendaId: "",
            patioBalcon: false,
            transportePropio: false,
            titulo: "",
            presentacion: "",
            experienciaId: "",
            precioCuidado: "",
            fotos: [],
            grilla: {
                lunes: { manana: false, tarde: false, noche: false },
                martes: { manana: false, tarde: false, noche: false },
                miercoles: { manana: false, tarde: false, noche: false },
                jueves: { manana: false, tarde: false, noche: false },
                viernes: { manana: false, tarde: false, noche: false },
                sabado: { manana: false, tarde: false, noche: false },
                domingo: { manana: false, tarde: false, noche: false },
            },
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener datos del cuidador
                const cuidadorResponse = await getCuidadoresId(id);
                const cuidadorData = cuidadorResponse.data;
                
                setInitialData(cuidadorData);
                setUser(userData);

                // Pre-llenar el formulario con los datos existentes
                // Extraer URLs de las fotos existentes y eliminar duplicados
                const fotosExistentes = cuidadorData.fotos ? 
                    [...new Set(cuidadorData.fotos.map(fotoObj => fotoObj.foto))] : [];

                
                // Guardar las fotos originales para poder eliminarlas después
                setFotosOriginales(fotosExistentes);

                methods.reset({
                    nombreCompleto: userData?.nombreCompleto || "",
                    mail: userData?.mail || userData?.email || "",
                    fechaNacimiento: cuidadorData.fechaNacimiento ? cuidadorData.fechaNacimiento.split('T')[0] : "",
                    generoId: userData?.generoId || "",
                    barrioId: cuidadorData.barrioId || "",
                    calle: cuidadorData.calle || "",
                    nroCalle: cuidadorData.nroCalle || "",
                    piso: cuidadorData.piso || "",
                    tipoViviendaId: cuidadorData.tipoViviendaId || "",
                    patioBalcon: cuidadorData.patioBalcon || false,
                    transportePropio: cuidadorData.transportePropio || false,
                    titulo: cuidadorData.titulo || "",
                    presentacion: cuidadorData.presentacion || "",
                    experienciaId: cuidadorData.experienciaId || "",
                    precioCuidado: cuidadorData.precioCuidado || "",
                    fotos: fotosExistentes,
                    grilla: cuidadorData.grilla?.scheduleData || {
                        lunes: { manana: false, tarde: false, noche: false },
                        martes: { manana: false, tarde: false, noche: false },
                        miercoles: { manana: false, tarde: false, noche: false },
                        jueves: { manana: false, tarde: false, noche: false },
                        viernes: { manana: false, tarde: false, noche: false },
                        sabado: { manana: false, tarde: false, noche: false },
                        domingo: { manana: false, tarde: false, noche: false },
                    },
                });

            } catch (error) {
                console.error("Error al cargar datos del cuidador:", error);
                mostrarAlertaError("Error al cargar los datos del cuidador");
                navigate("/perfil");
            } finally {
                setLoading(false);
            }
        };

        if (userData && id) {
            fetchData();
        }
    }, [userData, id, methods, navigate]);

    const onSubmit = async (data) => {
        try {
            setSubmitLoading(true);

            // Validar que haya fotos en el formulario
            if (!data.fotos || data.fotos.length === 0) {
                mostrarAlertaError("Debes subir al menos una imagen para continuar");
                return;
            }


            // Usar las fotos del formulario (ya procesadas por el componente)
            const fotosUnicas = [...new Set(data.fotos || [])];

            // Eliminar fotos originales de Firebase que ya no están en el formulario
            const fotosAEliminar = fotosOriginales.filter(fotoOriginal => 
                !fotosUnicas.includes(fotoOriginal)
            );
            
            
            // Eliminar fotos de Firebase en paralelo
            if (fotosAEliminar.length > 0) {
                await Promise.all(
                    fotosAEliminar.map(foto => deleteFileStorage(foto))
                );
            }

            // Datos finales Cuidador
            const payload = {
                id: Number(id), // ID del cuidador desde los parámetros de la URL
                fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
                titulo: data.titulo,
                presentacion: data.presentacion,
                experienciaId: Number(data.experienciaId),
                barrioId: Number(data.barrioId),
                calle: data.calle,
                nroCalle: Number(data.nroCalle),
                piso: data.piso || "",
                tipoViviendaId: Number(data.tipoViviendaId),
                patioBalcon: Boolean(data.patioBalcon),
                transportePropio: Boolean(data.transportePropio),
                precioCuidado: Number(data.precioCuidado),
                fotos: fotosUnicas.map((f) => ({ foto: f })),
                grilla: { scheduleData: data.grilla },
            };


            await updateCuidador(id, payload);
            mostrarAlertaExito("Cuidador actualizado exitosamente", "/perfil");
        } catch (error) {
            console.error("Error al actualizar cuidador:", error);
            mostrarAlertaError("Ocurrió un error al actualizar el cuidador");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleNext = async () => {
        const campos = camposPorPaso[activeStep];
        const valid = await methods.trigger(campos);
        if (!valid) return;

        if (activeStep === pasos.length - 1) {
            methods.handleSubmit(onSubmit)();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <Paso1Cuidador user={user} />;
            case 1:
                return <Paso2Cuidador />;
            case 2:
                return <Paso3Cuidador />;
            case 3:
                return <Paso4Cuidador />;
            case 4:
                return <Paso5CuidadorEdicion onUploadingChange={setIsUploadingPhotos} />;
            default:
                return null;
        }
    };

    if (loading) return <CustomLoader />;

    return (
        <Container
            maxWidth="md"
            sx={{
                mt: 4,
                mb: 4,
                backgroundColor: "#e0d0b8",
                borderRadius: 4,
            }}
        >
            <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Box
                    sx={{
                        backgroundColor: "primary.main",
                        p: 2,
                        borderRadius: 2,
                        textAlign: "center",
                        boxShadow: 2,
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" color="primary.contrastText">
                        Editar Cuidador
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel>
                    {pasos.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Box my={4}>{renderStepContent(activeStep)}</Box>

                        <Box display="flex" justifyContent="space-between">
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Atrás
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                disabled={submitLoading || isUploadingPhotos}
                            >
                                {submitLoading ? "Guardando..." : 
                                 activeStep === pasos.length - 1
                                    ? "Guardar cambios"
                                    : "Siguiente"}
                            </Button>
                        </Box>
                    </form>
                </FormProvider>
            </Paper>
        </Container>
    );
};

export default EditarCuidador;
