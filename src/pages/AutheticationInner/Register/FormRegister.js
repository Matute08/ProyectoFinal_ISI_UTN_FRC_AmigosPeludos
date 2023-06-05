import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert } from "reactstrap";
import { useAuth } from "../../../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postUser, getGenero } from "../../../services/Api";

export const FormRegister = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [genero, setGenero] = useState([]);

    useEffect(() => {
        const getGeneros = async () => {
            const data = await getGenero();
            if (data) {
                setGenero(data);
            }
        };
        getGeneros();
    }, []);

    //ver contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    //manejo de errores
    const [alertText, setAlertText] = useState(
        "Registrese gratuitamente en Amigos Peludos"
    );
    const [alertClass, setAlertClass] = useState("text-dark alert-dark");
    const { signup, registerWithGoogle } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        data.fechaNacimiento = new Date(data.fechaNacimiento).toISOString();
        data.tipoAutenticacionId = "1";
        console.log(data);
        try {
            const signUp = await signup(data.mail, data.password);
            if (signUp) {
                await postUser(data);
            }
            navigate("/");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setAlertText(
                    "El correo electronico ya se encuentra registrado."
                );
            }

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setAlertClass("text-danger alert-danger");
        }
    };

    const handleGoogleSignIn = async () => {
        await registerWithGoogle();
        navigate("/");
    };

    

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            className="needs-validation"
            action="#"
        >
            <Alert
                className={
                    "alert-borderless text-center mb-2 mx-2 " + alertClass
                }
                role="alert"
            >
                {alertText}
            </Alert>

            {/* MAIL */}
            <div className="mb-3">
                <label className="form-label">
                    Email <span className="text-danger">*</span>
                </label>
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

            {/* NOMBRE */}
            <div className="mb-3">
                <label className="form-label">
                    Nombre <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Nombre"
                    {...register("nombre", {
                        required: {
                            value: true,
                            message: "El nombre es requerido",
                        },
                    })}
                />
                {errors.nombre && (
                    <span className="text-danger">{errors.nombre.message}</span>
                )}
            </div>

            {/* APELLIDO */}
            <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                    Apellido <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    placeholder="Apellido"
                    {...register("apellido", {
                        required: {
                            value: true,
                            message: "El Apellido es requerido",
                        },
                    })}
                />
                {errors.apellido && (
                    <span className="text-danger">
                        {errors.apellido.message}
                    </span>
                )}
            </div>

            {/* GENERO */}
            <div className="mb-3">
                <label htmlFor="generoId" className="form-label">
                    Genero <span className="text-danger">*</span>
                </label>
                <select
                    name="generoId"
                    className="form-select "
                    placeholder="Ingrese su genero"
                    {...register("generoId", {
                        required: {
                            value: true,
                            message: "El campo Genero es requerido.",
                        },
                    })}
                >
                    <option value="">Seleccione un género</option>
                    {genero &&
                        genero.map((elemento) => (
                            <option
                                className="form-control"
                                key={elemento.id}
                                value={elemento.id}
                            >
                                {elemento.nombre}
                            </option>
                        ))}
                </select>
                {errors.generoId && (
                    <span className="text-danger">
                        {errors.generoId.message}
                    </span>
                )}
            </div>

            {/* FECHA NACIMIENTO */}
            <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">
                    Fecha de Nacimiento <span className="text-danger">*</span>
                </label>
                <input
                    type="date"
                    className="form-control"
                    placeholder="Ingrese su fecha de nacimiento"
                    name="fechaNacimiento"
                    {...register("fechaNacimiento", {
                        required: {
                            value: true,
                            message: "La fecha de nacimiento es requerida",
                        },
                    })}
                />
                {errors.fechaNacimiento && (
                    <span className="text-danger">
                        {errors.fechaNacimiento.message}
                    </span>
                )}
            </div>

            {/* CONTRASEÑA */}
            <div className="mb-3">
                <label className="form-label" htmlFor="password-input">
                    Contraseña <span className="text-danger">*</span>
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

            <div className="mb-4">
                <p className="mb-0 fs-12 text-muted fst-italic">
                    Al registrarse, acepta los Términos y condiciones de Amigos
                    Peludos.<br></br>
                    <Link
                        to="#"
                        className="text-primary text-decoration-underline fst-normal fw-medium"
                    >
                        Terminos y condiciones
                    </Link>
                </p>
            </div>

            <div className="mt-4">
                <button className="btn btn-success w-100" type="submit">
                    Registrarse
                </button>
            </div>

            <div className="mt-4 text-center">
                <div className="signin-other-title">
                    <h5 className="fs-13 mb-4 title text-muted">
                        Crear cuenta con:
                    </h5>
                </div>

                <div>
                    <button
                        type="button"
                        className="btn btn-danger btn-icon waves-effect waves-light"
                        onClick={handleGoogleSignIn}
                    >
                        <i className="ri-google-fill fs-16"></i>
                    </button>{" "}
                </div>
            </div>
        </Form>
    );
};
