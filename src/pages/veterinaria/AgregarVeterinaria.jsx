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
import Step1DatosGenerales from "./Step1DatosGenerales";
import Step2Horarios from "./Step2Horarios";
import Step3Servicios from "./Step3Servicios";
import Step4DatosDonacion from "./Step4DatosDonacion";
import { postVeterinaria } from "../../api/commonApi"; // tu función de POST
import { mostrarAlertaExito, mostrarAlertaError } from "../../utils/showAlert";
import { getUserMail, updateUser } from "../../api/userApi";
import { uploadFilesVeterinaria } from "../../api/firebaseUploads";

const AgregarVeterinaria = () => {
    const methods = useForm({ defaultValues: { horarios: {}, servicios: {} } });
    const [activeStep, setActiveStep] = useState(0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isMobile = useMediaQuery("(max-width:600px)");

    const onNext = async () => {
        const valid = await methods.trigger();
        if (valid) setActiveStep((s) => s + 1);
    };
    const onBack = () => setActiveStep((s) => s - 1);
    const steps = isMobile
        ? ["Datos", "Horarios", "Servicios", "Donación"]
        : ["Datos Generales", "Horarios", "Servicios", "Datos de Donación"];

    // Cargar datos del usuario al inicio
    useEffect(() => {
        const fetchUserData = async () => {
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
                const dataLocalStorage = JSON.parse(cachedUserData);
                const userEmail = dataLocalStorage.email;
                const datosUsuario = await getUserMail(userEmail);
                setUserData(datosUsuario);
            }
        };
        fetchUserData();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");
        try {

            let url = null;
            if (data.foto) {
                url = await uploadFilesVeterinaria(data.foto);
                
            }
            // 1. Formatear horarios
            const horariosFormatted = {};
            Object.entries(data.horarios).forEach(([dia, value]) => {
                horariosFormatted[dia] = value || "";
            });

            // 2. Formatear servicios (por si hay booleanos undefined)
            const allServicios = [
                "ecografias",
                "emergencias",
                "internaciones",
                "radiografias",
                "vacunaciones",
                "guardia24hs",
                "equipoLaboratorio",
                "castraciones",
            ];
            const serviciosFormatted = {};
            allServicios.forEach((s) => {
                serviciosFormatted[s] = !!data.servicios?.[s];
            });
            serviciosFormatted.otros = data.servicios?.otros || "";
            serviciosFormatted.observaciones =
                data.servicios?.observaciones || "";

            // 3. Formatear datos de donación y redes
            const donacion = {
                cbu: data.cbu,
                descripcion: data.observacionesDonacion || "",
                aliasCBU: data.aliasCBU || "",
                paginaWeb: data.paginaWeb || "",
                instagramUrl: data.instagram || "",
                facebookUrl: data.facebook || "",
                fotoUrl: url || "",
            };

            // 4. datos finales veterinaria
            const veterinariaParaBack = {
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
                estadoId: 1,
                usuarioId: userData.id,
                fechaAlta: new Date().toISOString(),
                //foto: data.foto || null, // si usás url, poner url, si usás File y backend soporta, el File
            };

            // 5. Datos finales usuario
            const payloadActualizacionUsuario = {
                id: userData.id,
                nombreCompleto:
                    userData.nombreCompleto || userData.nombre || null,
                fechaNacimiento: userData.fechaNacimiento || null,
                mail: userData.mail || userData.email || null,
                username: userData.username || null,
                tieneMascota: userData.tieneMascota ?? false,
                mailVerificado: userData.mailVerificado ?? false,
                habilitada: userData.habilitada ?? true,
                foto: userData.foto || null,
                generoId: userData.generoId,
                barrioId: userData.barrioId,
                rolId: userData.rolId,
                tipoAutenticacionId: userData.tipoAutenticacionId,
                celular: userData.celular || userData.numeroTelefono || null,
                calle: userData.calle || userData.direccion || null,
                nroCalle: userData.nroCalle
                    ? parseInt(userData.nroCalle, 10)
                    : userData.numeroCalle
                      ? parseInt(userData.numeroCalle, 10)
                      : null, // Int nullable
                codigoPostal: userData.codigoPostal || null,
                cuentaVerificada: userData.cuentaVerificada ?? false,
                esPaseador: userData.esPaseador ?? null,
                esCuidador: userData.esCuidador ?? null,
                esFundacion: userData.esFundacion ?? null,
                qr: userData.qr ?? null,
                esVeterinaria: true,
            };

            // --- POST ---
            await postVeterinaria(veterinariaParaBack);
            await updateUser(userData.id, payloadActualizacionUsuario);
            mostrarAlertaExito(
                "La veterinaria fue creada exitosamente y esta pendiente de aceptación",
                "/veterinarias"
            );
        } catch (err) {
            setError(
                "Error al registrar veterinaria. Intente nuevamente.",
                err
            );
            mostrarAlertaError();
        } finally {
            setLoading(false);
        }
    };

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
                        Registrar Nueva Veterinaria
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
                        {activeStep === steps.length && (
                            <Typography
                                variant="h5"
                                color="success.main"
                                align="center"
                                py={5}
                            >
                                ¡Veterinaria registrada exitosamente!
                            </Typography>
                        )}
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
                                    disabled={loading}
                                >
                                    {activeStep === steps.length - 1
                                        ? "Registrar"
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

export default AgregarVeterinaria;
