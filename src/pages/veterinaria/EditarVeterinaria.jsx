import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Typography,
    Container,
    useMediaQuery,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Step1DatosGenerales from "./Step1DatosGenerales";
import Step2Horarios from "./Step2Horarios";
import Step3Servicios from "./Step3Servicios";
import Step4DatosDonacion from "./Step4DatosDonacion";
import { updateVeterinaria, getVeterinarias } from "../../api/commonApi";
import { mostrarAlertaExito, mostrarAlertaError } from "../../utils/showAlert";
import { uploadFilesVeterinaria } from "../../api/firebaseUploads";
import { useAuth } from "../../auth/AuthProvider";
import CustomLoader from "../../components/CustomLoader";

// Función para parsear horarios de string a objeto
const parseHorarios = (horariosData) => {
    const horariosParsed = {};
    
    // Días de la semana
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    dias.forEach(dia => {
        const horarioString = horariosData[dia];
        
        if (horarioString && typeof horarioString === 'string') {
            // Parsear formato "de 08:00 a 18:00"
            const match = horarioString.match(/de (\d{2}:\d{2}) a (\d{2}:\d{2})/);
            if (match) {
                horariosParsed[dia] = {
                    corrido: true,
                    desde: match[1],
                    hasta: match[2],
                    desdeTarde: "",
                    hastaTarde: ""
                };
            } else {
                // Si no coincide el formato, valores por defecto
                horariosParsed[dia] = {
                    corrido: false,
                    desde: "",
                    hasta: "",
                    desdeTarde: "",
                    hastaTarde: ""
                };
            }
        } else {
            // Si es null o undefined, valores por defecto
            horariosParsed[dia] = {
                corrido: false,
                desde: "",
                hasta: "",
                desdeTarde: "",
                hastaTarde: ""
            };
        }
    });
    
    return horariosParsed;
};

const EditarVeterinaria = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const isMobile = useMediaQuery("(max-width:600px)");
    const { userData } = useAuth();

    const methods = useForm({ 
        defaultValues: { 
            horarios: {}, 
            servicios: {},
            nombre: "",
            telefono: "",
            direccion: "",
            numeroCalle: "",
            barrioId: "",
            provinciaId: "",
            ciudadId: "",
            cuit: "",
            latitud: null,
            longitud: null,
            cbu: "",
            aliasCBU: "",
            paginaWeb: "",
            instagram: "",
            facebook: "",
            observacionesDonacion: "",
            foto: null,
            hasValidHorarios: false
        } 
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener datos de la veterinaria
                const veterinariasResponse = await getVeterinarias();
                const veterinariaData = veterinariasResponse.data.find(v => v.id === parseInt(id));
                
                if (!veterinariaData) {
                    mostrarAlertaError("Veterinaria no encontrada");
                    navigate("/perfil");
                    return;
                }

                // Pre-llenar el formulario con los datos existentes
                const horariosParsed = parseHorarios(veterinariaData.horarios || {});
                
                // Verificar si hay horarios válidos
                const hasValidHorarios = Object.values(horariosParsed).some(horario => 
                    horario && horario.corrido && horario.desde && horario.hasta
                );
                
                methods.reset({
                    nombre: veterinariaData.nombre || "",
                    telefono: veterinariaData.numeroTelefono || "",
                    direccion: veterinariaData.direccion || "",
                    numeroCalle: veterinariaData.numeroCalle || "",
                    barrioId: veterinariaData.barrioId || "",
                    provinciaId: veterinariaData.provinciaId || "",
                    ciudadId: veterinariaData.ciudadId || "",
                    cuit: veterinariaData.cuil || "",
                    latitud: veterinariaData.latitud || null,
                    longitud: veterinariaData.longitud || null,
                    cbu: veterinariaData.cbu || "",
                    aliasCBU: veterinariaData.aliasCBU || "",
                    paginaWeb: veterinariaData.paginaWeb || "",
                    instagram: veterinariaData.instagramUrl || "",
                    facebook: veterinariaData.facebookUrl || "",
                    observacionesDonacion: veterinariaData.descripcion || "",
                    foto: veterinariaData.fotoUrl || null,
                    horarios: horariosParsed,
                    servicios: veterinariaData.servicios || {},
                    hasValidHorarios: hasValidHorarios
                });

            } catch (error) {
                console.error("Error al cargar datos de la veterinaria:", error);
                mostrarAlertaError("Error al cargar los datos de la veterinaria");
                navigate("/perfil");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, navigate]);

    const onNext = async () => {
        const valid = await methods.trigger();
        
        // Validación especial para el step de horarios (step 1)
        if (activeStep === 1) {
            const hasValidHorarios = methods.getValues("hasValidHorarios");
            if (!hasValidHorarios) {
                setError("Debe configurar al menos un día con horarios de atención (desde y hasta)");
                return;
            }
        }
        
        if (valid) {
            setError(""); // Limpiar error si la validación es exitosa
            setActiveStep((s) => s + 1);
        }
    };
    
    const onBack = () => setActiveStep((s) => s - 1);
    
    const steps = isMobile
        ? ["Datos", "Horarios", "Servicios", "Donación"]
        : ["Datos Generales", "Horarios", "Servicios", "Datos de Donación"];

    const onSubmit = async (data) => {
        setSubmitLoading(true);
        setError("");
        console.log("Datos del formulario:", data);
        console.log("Horarios del formulario:", data.horarios);
        try {
            let url = null;
            if (data.foto) {
                url = await uploadFilesVeterinaria(data.foto);
            }

            // 1. Formatear horarios
            const horariosFormatted = {};
            Object.entries(data.horarios).forEach(([dia, horarioObj]) => {
                if (horarioObj && typeof horarioObj === 'object') {
                    if (horarioObj.corrido && horarioObj.desde && horarioObj.hasta) {
                        // Horario corrido: "de 08:00 a 18:00"
                        horariosFormatted[dia] = `de ${horarioObj.desde} a ${horarioObj.hasta}`;
                    } else if (!horarioObj.corrido) {
                        // Horario partido: verificar si hay horarios de mañana o tarde
                        let horariosPartidos = [];
                        if (horarioObj.desdeM && horarioObj.hastaM) {
                            horariosPartidos.push(`de ${horarioObj.desdeM} a ${horarioObj.hastaM}`);
                        }
                        if (horarioObj.desdeT && horarioObj.hastaT) {
                            horariosPartidos.push(`de ${horarioObj.desdeT} a ${horarioObj.hastaT}`);
                        }
                        horariosFormatted[dia] = horariosPartidos.length > 0 ? horariosPartidos.join(' y ') : null;
                    } else {
                        horariosFormatted[dia] = null;
                    }
                } else if (horarioObj && typeof horarioObj === 'string') {
                    // Si ya viene como string del formulario
                    horariosFormatted[dia] = horarioObj;
                } else {
                    horariosFormatted[dia] = null;
                }
            });
            
            console.log("Horarios formateados:", horariosFormatted);

            // 2. Formatear servicios (booleanos correctos)
            const serviciosBooleanos = [
                "ecografias",
                "emergencias", 
                "internaciones",
                "radiografias",
                "vacunaciones",
                "guardia24hs",
                "equipoLaboratorio",
                "castraciones",
                "observaciones",  // ✅ También es boolean
            ];
            
            const serviciosFormatted = {};
            
            // Campos booleanos: convertir a true/false (nunca string vacío)
            serviciosBooleanos.forEach((servicio) => {
                serviciosFormatted[servicio] = Boolean(data.servicios?.[servicio]);
            });
            
            // Campos de texto: mantener como string
            serviciosFormatted.otros = data.servicios?.otros || "";
            
            console.log("Servicios formateados:", serviciosFormatted);

            // 3. Formatear datos de donación y redes
            const donacion = {
                cbu: data.cbu,
                descripcion: data.observacionesDonacion || "",
                aliasCBU: data.aliasCBU || "",
                paginaWeb: data.paginaWeb || "",
                instagramUrl: data.instagram || "",
                facebookUrl: data.facebook || "",
                fotoUrl: url || data.foto || "",
            };

            // 4. datos finales veterinaria (solo campos que existen en la tabla)
            const veterinariaParaBack = {
                id: Number(id), // ID de la veterinaria desde los parámetros de la URL
                nombre: data.nombre,
                numeroTelefono: data.telefono,
                direccion: data.direccion,
                numeroCalle: data.numeroCalle,
                barrioId: data.barrioId,
                cuil: data.cuit,
                latitud: data.latitud ?? data.lat ?? null,
                longitud: data.longitud ?? data.lng ?? null,
                horarios: horariosFormatted,
                servicios: serviciosFormatted,
                ...donacion,
                estadoId: 1
            };

            console.log("Payload final para el backend:", veterinariaParaBack);
            await updateVeterinaria(id, veterinariaParaBack);
            mostrarAlertaExito("Veterinaria actualizada exitosamente", "/perfil");
        } catch (err) {
            console.error("Error al actualizar veterinaria:", err);
            setError("Error al actualizar veterinaria. Intente nuevamente.");
            mostrarAlertaError("Error al actualizar la veterinaria");
        } finally {
            setSubmitLoading(false);
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
            <Paper sx={{ p: { xs: 1, md: 3 }, mb: 2 }}>
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
                        Editar Veterinaria
                    </Typography>
                </Box>
                <Box sx={{ width: "100%", overflowX: "auto", pb: 1 }}>
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            minWidth: isMobile ? 420 : 0,
                            mb: 3,
                        }}
                    >
                        {(isMobile
                            ? ["Datos", "Horarios", "Servicios", "Donación"]
                            : [
                                  "Datos Generales",
                                  "Horarios",
                                  "Servicios",
                                  "Datos de Donación",
                              ]
                        ).map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {activeStep === 0 && <Step1DatosGenerales />}
                        {activeStep === 1 && <Step2Horarios />}
                        {activeStep === 2 && <Step3Servicios />}
                        {activeStep === 3 && <Step4DatosDonacion />}
                        {error && (
                            <Typography color="error" align="center" mt={2}>
                                {error}
                            </Typography>
                        )}
                        {activeStep < steps.length && (
                            <Box
                                mt={3}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={onBack}
                                >
                                    Atrás
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={
                                        activeStep === steps.length - 1
                                            ? methods.handleSubmit(onSubmit)
                                            : onNext
                                    }
                                    disabled={
                                        submitLoading || 
                                        (activeStep === 1 && !methods.watch("hasValidHorarios"))
                                    }
                                >
                                    {submitLoading ? "Guardando..." :
                                     activeStep === steps.length - 1
                                        ? "Guardar cambios"
                                        : "Siguiente"}
                                </Button>
                            </Box>
                        )}
                    </form>
                </FormProvider>
            </Paper>
        </Container>
    );
};

export default EditarVeterinaria;
