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
        } else if (seconds === 0) {
            navigate("/iniciar-sesion");

            return () => {
                clearInterval(timer);
            };
        }
    }, [redirectTo, seconds, navigate]);

    //actualizar/cambiar de estados
    const handleChange = ({ target: { name, value } }) =>
        setUser({ ...user, [name]: value });

    //cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!user.email || !emailRegex.test(user.email)) {
            setAlertText("Por favor Ingresa un Email");
        } else {
            await resetPassword(user.email);
            setRedirectTo(true);
            setAlertText(
                "Se envio a su casilla de correo el link para restablecer la contraseña"
            );
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
                                        "Se envio a su casilla de correo el link para restablecer la contraseña"
                                            ? `${alertText}. Seras redirigido al Login en ${seconds} segundos`
                                            : `${alertText}`}
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
