import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert } from "reactstrap";
import { useAuth } from "../../../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postUser, getGenero,getUserMail, updateUser } from "../../../services/api";
import Loading from "../../components/Loading";

export const FormRegister = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    //ver contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    //manejo de errores
    const [alertText, setAlertText] = useState(
        "Registrese gratuitamente en Amigos Peludos"
    );
    const [alertClass, setAlertClass] = useState("text-dark alert-dark");
    const { signup, registerWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const showLoadingOverlay = () =>{
        setIsLoading(true)
    }
    const hideLoadingOverlay = () => {
        setIsLoading(false);
      };
    
      const handleAsyncTask = async () => {
        showLoadingOverlay();}




    //funcion de registro por formulario
    const onSubmit = async (data) => {
        showLoadingOverlay()
        const isUser = await getUserMail(data.mail);
        data.habilitada = true;        
        //registro de usuario
        try {
            //registro en firebase
            const signUp = await signup(data.mail, data.password);
            if (signUp) { //si se registro en firebase, lo registro en la base de datos
                if (isUser) { //corroboro si es un usuario que se dio de baja, o un usuario nuevo
                    console.log("entro al es usuario");
                    await updateUser(isUser.id, data)
                }else{
                    console.log("entro a usuario nuevo");
                    data.tipoAutenticacionId = "1";
                    await postUser(data);
                }
            }
            navigate("/");
            hideLoadingOverlay()
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

            {/* NOMBRE COMPLETO */}
            <div className="mb-3">
                <label className="form-label">
                    Nombre Completo <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    name="nombreCompleto"
                    className="form-control"
                    placeholder="Nombre Completo"
                    {...register("nombreCompleto", {
                        required: {
                            value: true,
                            message: "Debe indicar nombre y apellido separado por un espacio.",
                        },
                    })}
                />
                {errors.nombreCompleto && (
                    <span className="text-danger">{errors.nombreCompleto.message}</span>
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
