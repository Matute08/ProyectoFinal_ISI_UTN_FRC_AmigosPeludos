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
import { updatePaseador, getPaseadorPorId } from "../../api/paseadoresApi";
import { useAuth } from "../../auth/AuthProvider";
import Paso1DatosPersonales from "./agregarPaseador/Paso1DatosPersonales";
import Paso2DescripcionEdicion from "./agregarPaseador/Paso2DescripcionEdicion";
import Paso3HorariosPrecio from "./agregarPaseador/Paso3HorariosPrecio";
import Paso4FotosEdicion from "./agregarPaseador/Paso4FotosEdicion";
import CustomLoader from "../../components/CustomLoader";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../utils/showAlert";
import { deleteFileStorage } from "../../api/firebaseUploads";

const pasos = [
    "Datos personales",
    "Presentación",
    "Horarios y Precio",
    "Fotos",
];

const EditarPaseador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            titulo: "",
            presentacion: "",
            experienciaId: "",
            barrioTrabajoId: "",
            precioPaseo: "",
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
    });

    const camposPorPaso = [
        ["nombreCompleto", "mail", "fechaNacimiento"],
        ["titulo", "presentacion", "experienciaId", "barrioTrabajoId"],
        ["precioPaseo"],
        ["fotos"],
    ];
    const { userData } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener datos del paseador
                const paseadorResponse = await getPaseadorPorId(id);
                const paseadorData = paseadorResponse.data;
                
                setInitialData(paseadorData);
                setUser(userData);

                // Pre-llenar el formulario con los datos existentes
                // Extraer URLs de las fotos existentes y eliminar duplicados
                const fotosExistentes = paseadorData.fotos ? 
                    [...new Set(paseadorData.fotos.map(fotoObj => fotoObj.foto))] : [];

                
                // Guardar las fotos originales para poder eliminarlas después
                setFotosOriginales(fotosExistentes);

                methods.reset({
                    nombreCompleto: userData?.nombreCompleto || "",
                    mail: userData?.mail || userData?.email || "",
                    fechaNacimiento: paseadorData.fechaNacimiento ? paseadorData.fechaNacimiento.split('T')[0] : "",
                    generoId: userData?.generoId || "",
                    titulo: paseadorData.titulo || "",
                    presentacion: paseadorData.presentacion || "",
                    experienciaId: paseadorData.experienciaId || "",
                    provinciaId: paseadorData.provinciaId || "",
                    ciudadId: paseadorData.ciudadId || "",
                    barrioTrabajoId: paseadorData.barrioTrabajoId || "",
                    barrioId: paseadorData.barrioTrabajoId || "", // Para el formulario
                    precioPaseo: paseadorData.precioPaseo || "",
                    fotos: fotosExistentes,
                    grilla: paseadorData.grilla?.scheduleData || {
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
                console.error("Error al cargar datos del paseador:", error);
                mostrarAlertaError("Error al cargar los datos del paseador");
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

            const payload = {
                id: Number(id), // ID del paseador desde los parámetros de la URL
                fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
                titulo: data.titulo,
                presentacion: data.presentacion,
                experienciaId: Number(data.experienciaId),
                barrioTrabajoId: Number(data.barrioId),
                precioPaseo: Number(data.precioPaseo),
                fotos: fotosUnicas.map((f) => ({ foto: f })),
                grilla: { scheduleData: data.grilla },
            };


            await updatePaseador(id, payload);
            mostrarAlertaExito("Paseador actualizado exitosamente", "/perfil");
        } catch (error) {
            console.error("Error al actualizar paseador:", error);
            mostrarAlertaError("Ocurrió un error al actualizar el paseador");
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
                return <Paso1DatosPersonales user={user} />;
            case 1:
                return <Paso2DescripcionEdicion user={user} initialData={initialData} />;
            case 2:
                return <Paso3HorariosPrecio />;
            case 3:
                return <Paso4FotosEdicion onUploadingChange={setIsUploadingPhotos} />;
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
                        Editar Paseador
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

export default EditarPaseador;
