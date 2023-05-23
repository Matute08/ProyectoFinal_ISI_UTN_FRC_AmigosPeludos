import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Button,
    Form,
    Alert,
} from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../authContext";

export const FormLogin = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [alertText, setAlertText] = useState(
        "Incia sesion para continuar en Amigos Peludos"
    );

    const { login } = useAuth();
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);

    //actualizar/cambiar de estados
    const handleChange = ({ target: { name, value } }) =>
        setUser({ ...user, [name]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(user.email, user.password);
            navigate("/");
        } catch (error) {
            if (user.email === "" || user.password === "") {
                setAlertText("Complete todos los campos");
            }
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-email" ||
                !emailRegex.test(user.email)
            ) {
                setAlertText("Usuario y/o contraseña incorrecto");
            }
            if (error.code === "auth/too-many-requests") {
                setAlertText(
                    "Demasiados intentos de inicio de sesion. Intenta restableciendo tu contraseña"
                );
            }
        }
    };

    return (
        <Form action="#" onSubmit={handleSubmit}>
            <Alert
                className="alert-borderless alert-warning text-center mb-2 mx-2"
                role="alert"
            >
                {alertText}
            </Alert>

            <div className="mb-3">
                <Label htmlFor="useremail" className="form-label">
                    Corre Electronico
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

            <div className="mb-3">
                <div className="float-end">
                    <Link to="/restablecer-contraseña" className="text-muted">
                        ¿Olvido su contraseña?
                    </Link>
                </div>
                <label className="form-label" htmlFor="password-input">
                    Contraseña
                </label>
                <div className="position-relative auth-pass-inputgroup">
                    <Input
                        type={passwordShow ? "text" : "password"}
                        className="form-control pe-5 password-input"
                        placeholder="Ingrese su contraseña"
                        id="password-input"
                        name="password"
                        onChange={handleChange}
                    />
                    <Button
                        color="link"
                        onClick={() => setPasswordShow(!passwordShow)}
                        className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                        type="button"
                        id="password-addon"
                    >
                        <i className="ri-eye-fill align-middle"></i>
                    </Button>
                </div>
            </div>

            <div className="form-check">
                <Input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="auth-remember-check"
                />
                <Label
                    className="form-check-label"
                    htmlFor="auth-remember-check"
                >
                    Recuerdame
                </Label>
            </div>

            <div className="mt-4">
                <Button
                    color="success"
                    className="btn btn-success w-100"
                    type="submit"
                >
                    Iniciar Sesión
                </Button>
            </div>

            <div className="mt-4 text-center">
                <div className="signin-other-title">
                    <h5 className="fs-13 mb-4 title">Iniciar sesión con: </h5>
                </div>
                <div>
                    <Button color="primary" className="btn-icon">
                        <i className="ri-facebook-fill fs-16"></i>
                    </Button>{" "}
                    <Button color="danger" className="btn-icon">
                        <i className="ri-google-fill fs-16"></i>
                    </Button>{" "}
                </div>
            </div>
        </Form>
    );
};
