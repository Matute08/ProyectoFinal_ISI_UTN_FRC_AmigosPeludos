import React, { useState } from "react";
import {
    Input,
    Label,
    Button,
    Form,
    Alert,
} from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useForm } from "react-hook-form";


export const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [alertText, setAlertText] = useState(
        "Incia sesion para continuar en Amigos Peludos"
    );
    const [alertClass, setAlertClass] = useState("text-dark alert-dark");


    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);

    const onSubmit = async(data)=>{
        console.log(data)
        
        try {
            await login(data.mail, data.password);
            navigate("/");
        } catch (error) {
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-email"
            ) {
                setAlertText("Usuario y/o contraseña incorrecto");
            }
            if (error.code === "auth/too-many-requests") {
                setAlertText(
                    "Demasiados intentos de inicio de sesion. Intenta restableciendo tu contraseña"
                );
            }
            setAlertClass("text-danger alert-danger")
        }
    }

    const handleGoogleSignIn = async() =>{
        await loginWithGoogle();
        navigate("/");

    }

    return (
        <Form action="#" onSubmit={handleSubmit(onSubmit)}>
            <Alert
                className={"alert-borderless text-center mb-2 mx-2 " + alertClass}
                role="alert"
            >
                {alertText}
            </Alert>

            <div className="mb-3">
                <Label htmlFor="useremail" className="form-label">
                    Correo Electronico
                </Label>
                <input
                    type="text"
                    name="mail"
                    className="form-control"
                    placeholder="ejemplo@gmail.com"
                    {...register("mail", {
                        required: {
                            value: true,
                            message: "El Email es requerido",
                        },
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Escriba el email correctamente",
                        },
                    })}
                />
                {errors.mail && (
                    <span className="text-danger">{errors.mail.message}</span>
                )}
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
                <input
                        type={passwordShow ? "text" : "password"}
                        name="password"
                        placeholder="********"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "La Contraseña es requerida.",
                            },
                            minLength: {
                                value: 8,
                                message:
                                    "La contraseña debe contener al menos 8 caracteres",
                            },
                        })}
                        className="form-control pe-5 password-input"
                    />
                    {errors.password && (
                        <span className="text-danger">
                            {errors.password.message}
                        </span>
                    )}
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
                    <Button color="danger" className="btn-icon" onClick={handleGoogleSignIn}> 
                        <i className="ri-google-fill fs-16"></i>
                    </Button>{" "}
                </div>
            </div>
        </Form>
    );
};
