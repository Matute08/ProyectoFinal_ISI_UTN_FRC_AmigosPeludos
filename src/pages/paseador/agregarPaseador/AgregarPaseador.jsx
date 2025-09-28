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
import { postPaseador } from "../../../api/paseadoresApi";
import { useAuth } from "../../../auth/AuthProvider";
import Paso1DatosPersonales from "./Paso1DatosPersonales";
// Importar los siguientes pasos una vez creados
import Paso2Descripcion from "./Paso2Descripcion";
import Paso3HorariosPrecio from "./Paso3HorariosPrecio";
import Paso4Fotos from "./Paso4Fotos";
import CustomLoader from "../../../components/CustomLoader";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert";

const pasos = [
    "Datos personales",
    "Presentación",
    "Horarios y Precio",
    "Fotos",
];

const AgregarPaseador = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        ["precioPaseo"], // validación de grilla se puede implementar adicional si querés
        ["fotos"],
    ];
    const { userData } = useAuth();

    useEffect(() => {
        if (userData) {
            setUser(userData);
            setLoading(false);
        }
    }, [userData]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                idUsuario: user.id,
                fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
                titulo: data.titulo,
                presentacion: data.presentacion,
                experienciaId: Number(data.experienciaId),
                barrioTrabajoId: Number(data.barrioId),
                precioPaseo: Number(data.precioPaseo),
                fotos: data.fotos.map((f) => ({ foto: f })),
                grilla: { scheduleData: data.grilla },
            };

            // 5. Datos finales usuario
            const payloadActualizacionUsuario = {
                id: user.id,
                nombreCompleto: user.nombreCompleto || user.nombre || null,
                fechaNacimiento: new Date(user.fechaNacimiento).toISOString() || null,
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
                esCuidador: user.esCuidador ?? null,
                esFundacion: user.esFundacion ?? null,
                qr: user.qr ?? null,

                esPaseador: true,
            };


            await postPaseador(payload);
            await updateUser(user.id, payloadActualizacionUsuario);

            mostrarAlertaExito(
                "Bienvenido Paseador!..",
                "/paseadores"
            );
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
                return <Paso1DatosPersonales user={user} />;
            case 1:
                return <Paso2Descripcion user={user} />;
            case 2:
                return <Paso3HorariosPrecio />;
            case 3:
                return <Paso4Fotos />;
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
                        Registrar Paseador
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

export default AgregarPaseador;
