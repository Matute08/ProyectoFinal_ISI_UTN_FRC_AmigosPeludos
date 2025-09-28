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
import { updateUser } from "../../../api/userApi";
import { postCuidador } from "../../../api/cuidadoresApi";
import { useAuth } from "../../../auth/AuthProvider";
import Paso1Cuidador from "./Paso1Cuidador";
import Paso2Cuidador from "./Paso2Cuidador";
import Paso3Cuidador from "./Paso3Cuidador";
import Paso4Cuidador from "./Paso4Cuidador";
import Paso5Cuidador from "./Paso5Cuidador";
import CustomLoader from "../../../components/CustomLoader";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert";

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

const AgregarCuidador = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        if (userData) {
            setUser(userData);
            setLoading(false);
        }
    }, [userData]);

    const onSubmit = async (data) => {
        try {
            // Validar que haya fotos
            if (!data.fotos || data.fotos.length === 0) {
                mostrarAlertaError("Debes subir al menos una imagen para continuar");
                return;
            }



            // Datos finales Cuidador

            const payload = {
                idUsuario: user.id,
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
                fotos: data.fotos ? data.fotos.map((f) => ({ foto: f })) : [],
                grilla: { scheduleData: data.grilla },
            };



            // Datos finales usuario
            const payloadActualizacionUsuario = {
                id: user.id,
                nombreCompleto: user.nombreCompleto || user.nombre || null,
                fechaNacimiento: user.fechaNacimiento || null,
                mail: user.mail || user.email || null,
                username: user.username || null,
                tieneMascota: user.tieneMascota ?? false,
                mailVerificado: user.mailVerificado ?? false,
                habilitada: user.habilitada ?? true,
                foto: user.foto || null,
                generoId: user.generoId,
                barrioId: user.barrioId,
                rolId: user.rolId,
                tipoAutenticacionId: user.tipoAutenticacionId,
                celular: user.celular || user.numeroTelefono || null,
                calle: user.calle || user.direccion || null,
                nroCalle: user.nroCalle
                    ? parseInt(user.nroCalle, 10)
                    : user.numeroCalle
                      ? parseInt(user.numeroCalle, 10)
                      : null, // Int nullable
                codigoPostal: user.codigoPostal || null,
                cuentaVerificada: user.cuentaVerificada ?? false,
                esVeterinaria: user.veterinaria ?? null,
                esPaseador: user.esPaseador ?? null,
                esFundacion: user.esFundacion ?? null,
                qr: user.qr ?? null,

                esCuidador: true,
            };

            await postCuidador(payload);
            await updateUser(user.id, payloadActualizacionUsuario);

            mostrarAlertaExito("Bienvenido Cuidador!..", "/cuidadores");
        } catch (error) {
            mostrarAlertaError(
                "Ocurrió un error al enviar tu solicitud",
                error
            );
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
                return <Paso5Cuidador />;
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
                        Registrar Cuidador
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
                            >
                                {activeStep === pasos.length - 1
                                    ? "Enviar solicitud"
                                    : "Siguiente"}
                            </Button>
                        </Box>
                    </form>
                </FormProvider>
            </Paper>
        </Container>
    );
};

export default AgregarCuidador;
