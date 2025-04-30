import React, { useState, useEffect } from "react";
import Step1Refactored from "./Step1";
import Step2Refactored from "./Step2";
import Step3Refactored from "./Step3";
import Step4Refactored from "./Step4";
import Navbar from "../../landing/Navbar"; // Asegúrate que las rutas sean correctas
import Footer from "../../landing/Footer"; // Asegúrate que las rutas sean correctas
import Loading from "../../components/Loading"; // Asegúrate que las rutas sean correctas
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postVeterinaria } from "../../../services/commonApi"; // Asegúrate que las rutas sean correctas
import { getUserMail, updateUser } from "../../../services/userApi"; // Asegúrate que las rutas sean correctas

// Define los pasos
const steps = [
    { id: 1, component: Step1Refactored, fields: ['nombre', 'barrioId', 'direccion', 'numeroCalle', 'numeroTelefono', 'cuil', 'latitud', 'longitud'] },
    { id: 2, component: Step2Refactored, fields: ['diasDesde', 'diasHasta', 'horarios'] }, // Añade los campos que valida este paso
    { id: 3, component: Step3Refactored, fields: ['servicios'] }, // Añade los campos que valida este paso
    { id: 4, component: Step4Refactored, fields: ['aceptaTransferencias', 'cbu'] }, // Añade los campos que valida este paso
];

const AddVeterinaria = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // Para feedback de carga en submit final
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Configuración centralizada de react-hook-form
    const methods = useForm({
        mode: "onChange", // Puedes ajustar el modo de validación
        defaultValues: { // Valores iniciales si los tienes
            nombre: "",
            barrioId: "",
            direccion: "",
            numeroCalle: "",
            numeroTelefono: "",
            cuil: "",
            latitud: -31.41894, // Valor inicial Córdoba
            longitud: -64.19353, // Valor inicial Córdoba
            diasDesde: "",
            diasHasta: "",
            horarios: { // Inicializa con la estructura esperada
                lunes: "", martes: "", miercoles: "", jueves: "",
                viernes: "", sabado: "", domingo: ""
            },
            servicios: { // Inicializa con la estructura esperada
                castraciones: false, internaciones: false, vacunaciones: false,
                equipoLaboratorio: false, radiografias: false, ecografias: false,
                guardia24hs: false, emergencias: false, observaciones: false,
                otros: null
            },
            aceptaTransferencias: "", // O null / undefined según prefieras
            cbu: null,
            estadoId: 1, // Valor fijo
            usuarioId: null, // Se obtendrá del usuario logueado
        },
    });

    // Cargar datos del usuario al inicio
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
                try {
                    const dataLocalStorage = JSON.parse(cachedUserData);
                    const userEmail = dataLocalStorage.email;
                    const response = await getUserMail(userEmail);
                    setUserData(response.data);
                    methods.setValue('usuarioId', response.data.id); // Establece el ID de usuario en el form
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Manejar error (e.g., mostrar mensaje, redirigir)
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Manejar caso donde no hay usuario en localStorage (e.g., redirigir a login)
                setIsLoading(false);
                console.warn("No user data found in localStorage.");
                // navigate('/login'); // Ejemplo
            }
        };
        fetchUserData();
    }, [methods, navigate]);


    // Función para manejar el envío final del formulario
    const finalSubmit = async (data) => {
        setIsLoading(true);

        // --- Preparación final del objeto de datos ---
        const finalData = {
            nombre: data.nombre,
            barrioId: parseInt(data.barrioId, 10),
            direccion: data.direccion,
            numeroCalle: parseInt(data.numeroCalle, 10),
            numeroTelefono: String(data.numeroTelefono), // Asegurar que sea string
            cuil: String(data.cuil), // Asegurar que sea string
            // Latitud y Longitud ya deberían estar como números desde Step1
            latitud: data.latitud,
            longitud: data.longitud,
            // Dias Desde/Hasta ya deberían ser strings numéricos "1", "2", etc. desde Step2
            diasDesde: data.diasDesde,
            diasHasta: data.diasHasta,
            // Horarios ya debería tener la estructura correcta desde Step2
            horarios: data.horarios,
            // Servicios ya debería tener la estructura correcta desde Step3
            servicios: data.servicios,
             // CBU: Si aceptaTransferencias es 'Si', usa data.cbu, sino null.
            cbu: data.aceptaTransferencias === "Si" ? String(data.cbu) : null, // Asegura que cbu sea string o null
            estadoId: 1, // Estado inicial (o según tu lógica)
            usuarioId: userData.id, // ID del usuario logueado
        };

        console.log("Datos finales a enviar:", finalData);

        try {
            // Enviar datos al backend
            await postVeterinaria(finalData);
            // Actualizar el perfil del usuario (si la creación fue exitosa)
            if (userData?.id) {
                // Prepara el payload para la actualización usando los datos de 'userData'
                // y asegurando que los nombres coincidan con la clase C# 'usuario'.
                const payloadActualizacionUsuario = {
                    id: userData.id,
                    // Asegúrate que el nombre de campo aquí coincida con la clase C#
                    nombreCompleto: userData.nombreCompleto || userData.nombre || null,
                    fechaNacimiento: userData.fechaNacimiento || null, // Formatear si es necesario
                    mail: userData.mail || userData.email || null,
                    username: userData.username || null,
                    tieneMascota: userData.tieneMascota ?? false, // Default a false si no existe
                    mailVerificado: userData.mailVerificado ?? false,
                    habilitada: userData.habilitada ?? true, // Default a true si no existe? Verifica tu lógica
                    foto: userData.foto || null,
                    // Campos Int NO nuleables - Asegúrate que existan en userData
                    generoId: userData.generoId,
                    barrioId: userData.barrioId,
                    rolId: userData.rolId,
                    tipoAutenticacionId: userData.tipoAutenticacionId,
                    // ---
                    celular: userData.celular || userData.numeroTelefono || null,
                    calle: userData.calle || userData.direccion || null,
                    nroCalle: userData.nroCalle ? parseInt(userData.nroCalle, 10) : (userData.numeroCalle ? parseInt(userData.numeroCalle, 10) : null), // Int nullable
                    codigoPostal: userData.codigoPostal || null,
                    cuentaVerificada: userData.cuentaVerificada ?? false,
                    // --- Roles booleanos nullable ---
                    esPaseador: userData.esPaseador ?? null,
                    esCuidador: userData.esCuidador ?? null,
                    esFundacion: userData.esFundacion ?? null,

                    // --- *** EL CAMBIO CLAVE *** ---
                    esVeterinaria: true,

                    // --- Campos EXCLUIDOS (No enviar password, qr, [NotMapped], etc.) ---
                    // password: NO ENVIAR,
                    // qr: NO ENVIAR (a menos que la API lo espere),
                };

                 // **IMPORTANTE**: Revisa el objeto 'userData' real que recibes de tu API getUserMail
                 // y ajusta los nombres de campo (ej: userData.nombre vs userData.nombreCompleto)
                 // y los valores por defecto (??) según corresponda a tu lógica y datos reales.
                 // Elimina cualquier campo de payloadActualizacionUsuario que no exista en tu clase C# 'usuario'
                 // o que no deba enviarse en una actualización.

                console.log("Payload para actualizar usuario (Clase Usuario):", payloadActualizacionUsuario);
                console.log("ID del usuario:", userData.id);

                // Llama a la API de actualización con el payload estructurado
                await updateUser(userData.id, payloadActualizacionUsuario);
            }

            // Actualizar el perfil del usuario
            // const actualizarUser = { esVeterinaria: true };
            // console.log("Usuario actualizado:", actualizarUser);
            // console.log("ID del usuario:", userData.id);
            // await updateUser(userData.id, actualizarUser);

             // Mensaje de éxito y redirección
            handleConfirmacionVeterinaria();

        } catch (error) {
            console.error("Error al registrar la veterinaria:", error);
            setIsLoading(false);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al registrar la veterinaria. Inténtalo de nuevo.",
                icon: "error",
            });
        }
        // No necesitas llamar a onNext aquí, es el final
    };

    const handleConfirmacionVeterinaria = () => {
        Swal.fire({
            title: `La Veterinaria fue creada y se encuentra en Revisión`,
            icon: "success",
            html: "Cerrando en <b></b> segundos.",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: () => {
                const b = Swal.getHtmlContainer()?.querySelector("b");
                if (b) {
                    const timerInterval = setInterval(() => {
                        const timeLeft = Swal.getTimerLeft();
                        if (timeLeft !== undefined && b) {
                            b.textContent = (timeLeft / 1000).toFixed(1);
                        } else {
                           clearInterval(timerInterval);
                        }
                    }, 100);
                }
            },
            willClose: () => {
                setIsLoading(false); // Asegúrate de parar la carga
                navigate(`/veterinarias/`); // O a donde quieras redirigir
            },
        });
    };


    // Función para ir al siguiente paso (validando el actual)
    const handleNext = async () => {
        const currentStepFields = steps[currentStep].fields;
        // Trigger validation for the fields relevant to the current step
        const isValid = await methods.trigger(currentStepFields);

        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep((prev) => prev + 1);
            } else {
                // Si es el último paso, llama al submit final
                 methods.handleSubmit(finalSubmit)();
            }
        } else {
             console.log("Validation failed for step:", currentStep + 1, methods.formState.errors);
             // Opcional: Mostrar un mensaje al usuario indicando que revise los campos
             Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, revisa los campos marcados en rojo.",
                icon: "warning",
                });
        }
    };

    // Función para ir al paso anterior
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const StepComponent = steps[currentStep].component;

    // Detectar tamaño de pantalla (opcional, mantenido de tu código)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <React.Fragment>
            <FormProvider {...methods}> {/* Proveedor para useFormContext */}
                <Navbar />
                <Container fluid className="page-content perfil-fondo">
                    <Row>
                        <Col className="text-center mb-4">
                            <h1>REGISTRO DE VETERINARIAS</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Card className={isSmallScreen ? "w-100" : "w-75"}>
                                <CardHeader className="d-flex justify-content-center">
                                    {/* Barra de Progreso */}
                                    <div className="progress-container w-75 m-0">
                                        <div
                                            className="progress-bar-custom"
                                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        />
                                         <div className="step-indicators">
                                            {steps.map((step, index) => (
                                                <div key={step.id} className={`step-indicator ${index <= currentStep ? 'active' : ''}`}>
                                                    {/* Puedes poner números o iconos aquí si quieres */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Leyenda opcional: `Paso ${currentStep + 1} de ${steps.length}` */}
                                </CardHeader>

                                <CardBody className="card-paseador">
                                    {isLoading && <Loading />} {/* Muestra Loading si está cargando */}
                                    <form onSubmit={methods.handleSubmit(finalSubmit)} noValidate>
                                        {/* Renderiza el componente del paso actual */}
                                        <StepComponent />

                                        {/* Botones de Navegación */}
                                        <div className="d-flex justify-content-between mt-4">
                                            {currentStep > 0 && (
                                                <button
                                                    type="button" // importante que sea type="button"
                                                    className="btn-next-paseador" // Reutiliza tu clase o usa una nueva
                                                    onClick={handlePrevious}
                                                    disabled={isLoading}
                                                >
                                                    <span className="transition transition-back"></span>
                                                    <span className="gradient"></span>
                                                    <span className="label">Atrás</span>
                                                </button>
                                            )}
                                            {/* Espaciador para alinear el botón Siguiente/Finalizar a la derecha si 'Atrás' no está visible */}
                                             {currentStep === 0 && <div></div>}

                                            <button
                                                type="button" // importante que sea type="button"
                                                className="btn-next-paseador"
                                                onClick={handleNext} // Usa handleNext para validar antes de avanzar/enviar
                                                disabled={isLoading}
                                            >
                                                <span className="transition"></span>
                                                <span className="gradient"></span>
                                                <span className="label">
                                                    {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </FormProvider>
        </React.Fragment>
    );
};

export default AddVeterinaria;

// Estilos CSS para la barra de progreso (añade esto a tu archivo CSS)
/*
.progress-container {
    position: relative;
    height: 10px; // Ajusta altura
    background-color: #e9ecef; // Color de fondo de la barra
    border-radius: 5px;
    overflow: hidden;
}

.progress-bar-custom {
    height: 100%;
    background-color: #007bff; // Color de la barra de progreso
    border-radius: 5px;
    transition: width 0.4s ease;
}

.step-indicators {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px; // Pequeño padding para que los puntos no queden pegados a los bordes
}

.step-indicator {
    width: 10px; // Tamaño del punto indicador
    height: 10px; // Tamaño del punto indicador
    background-color: #adb5bd; // Color del indicador inactivo
    border-radius: 50%;
    z-index: 1; // Asegura que esté sobre la barra de progreso
    transition: background-color 0.4s ease;
}

.step-indicator.active {
    background-color: #0056b3; // Color del indicador activo/completado
}

// Tus estilos para btn-next-paseador etc.
*/