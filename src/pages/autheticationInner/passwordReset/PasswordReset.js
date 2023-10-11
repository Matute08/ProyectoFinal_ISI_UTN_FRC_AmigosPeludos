import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Alert,
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Form,
    Label,
    Input,
} from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
import { useAuth } from "../../../services/AuthContext";
import logoLight from "../../../assets/images/logo/LogoAP.png";

const PasswordReset = () => {
    document.title = "Restablecer contraseña | Amigos Peludos";

    const [showCountdown, setShowCountdown] = useState(false);
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [redirectTo, setRedirectTo] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const [user, setUser] = useState({ email: "" });
    const [alertText, setAlertText] = useState(
        "¡Ingresa tu correo electrónico y se te enviarán las instrucciones!"
    );

    //tiempo restante para volver al login despues de enviar el mail
    useEffect(() => {
        let timer;

        if (redirectTo && seconds > 0) {
            timer = setTimeout(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            // Mostrar el contador después de 1 segundo
            setTimeout(() => {
                setShowCountdown(true);
            }, 1000);
        } else if (seconds === 0) {
            // Hacer la redirección solo cuando el temporizador llega a cero
            navigate("/iniciar-sesion");
        }

        // Limpiar el temporizador cuando el componente se desmonta
        return () => {
            clearInterval(timer);
        };
    }, [redirectTo, seconds, navigate]);

    //actualizar/cambiar de estados
    const handleChange = ({ target: { name, value } }) =>
        setUser({ ...user, [name]: value });

    //cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!user.email || !emailRegex.test(user.email)) {
            setAlertText("Por favor ingresa un email válido.");
        } else {
            try {
                await resetPassword(user.email);
                setRedirectTo(true);
                setAlertText(
                    "Se envió a su casilla de correo el enlace para restablecer la contraseña."
                );
            } catch (error) {
                if (error.code === "auth/user-not-found") {
                    setAlertText(
                        "Correo electrónico incorrecto. Por favor, verifícalo."
                    );
                } else {
                    // Otros errores, manejar según sea necesario
                    setAlertText(
                        "Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo."
                    );
                }
            }
        }
    };

    return (
        <ParticlesAuth>
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                    <Link
                                        to="/#"
                                        className="d-inline-block auth-logo"
                                    >
                                        <img
                                            src={logoLight}
                                            alt=""
                                            height="100"
                                            width="100"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">
                                            Olvido su Contraseña?
                                        </h5>

                                        <lord-icon
                                            src="https://cdn.lordicon.com/rhvddzym.json"
                                            trigger="loop"
                                            colors="primary:#0ab39c"
                                            className="avatar-xl"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                            }}
                                        ></lord-icon>
                                    </div>

                                    <Alert
                                        className="alert-borderless alert-warning text-center mb-2 mx-2"
                                        role="alert"
                                    >
                                        {alertText ===
                                        "Se envió a su casilla de correo el enlace para restablecer la contraseña."
                                            ? showCountdown
                                                ? `${alertText}. Serás redirigido al Login en ${seconds} segundos`
                                                : alertText
                                            : alertText}
                                    </Alert>
                                    <div className="p-2">
                                        <Form>
                                            <div className="mb-4">
                                                <Label className="form-label">
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    className="form-control"
                                                    id="useremail"
                                                    placeholder="Ingrese su correo electronico"
                                                    name="email"
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="text-center mt-4">
                                                <button
                                                    className="btn btn-success w-100"
                                                    onClick={
                                                        handleResetPassword
                                                    }
                                                >
                                                    Restablecer Contaseña
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-4 text-center">
                                <p className="mb-0">
                                    Espera, recuerdo mi contraseña...{" "}
                                    <Link
                                        to="/iniciar-sesion"
                                        className="fw-bold text-primary text-decoration-underline"
                                    >
                                        {" "}
                                        Iniciar Sesion
                                    </Link>{" "}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ParticlesAuth>
    );
};

export default PasswordReset;
