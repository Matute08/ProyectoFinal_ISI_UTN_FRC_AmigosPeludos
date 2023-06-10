import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, ModalBody, Button, Alert } from "reactstrap";
import { useAuth } from "../../../services/AuthContext";
import { useForm } from "react-hook-form";

const ModalLogin = ({ onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [alertText, setAlertText] = useState(
        "Para eliminar su cuenta, primero debe verificar que es usted. Al confirmar, podra eliminar su cuenta"
    );
    const { login } = useAuth();
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    const [alertClass, setAlertClass] = useState("text-dark alert-dark");

    const handleCloseModal = (event) => {
        event.preventDefault(); // O event.stopPropagation();
        onClose();
    };

    const onSubmit = async (data) => {
        console.log(data);

        try {
            await login(data.mail, data.password);
            window.location.reload()
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
            setAlertClass("text-danger alert-danger");
        }
    };

    return (
        <div>
            <Modal
                id="loginModals"
                tabIndex="-1"
                isOpen={true}
                onRequestClose={onClose}
                centered
            >
                <div className="modal-content border-0 overflow-hidden">
                    <ModalBody className="login-modal p-5"></ModalBody>
                    <ModalBody className="p-2">
                        <p
                            className={
                                "alert-borderless text-center mb-2 mx-2 " +
                                alertClass
                            }
                            role="alert"
                        >
                            {alertText}
                        </p>
                        <form className="w-75" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-2 w-100">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    placeholder="Ingrese su Email"
                                    {...register("mail", {
                                        required: {
                                            value: true,
                                            message: "El Email es requerido",
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message:
                                                "Escriba el email correctamente",
                                        },
                                    })}
                                />
                                {errors.mail && (
                                    <span className="text-danger">
                                        {errors.mail.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-3">
                                <div className="float-end">
                                    <Link
                                        to="/restablecer-contraseña"
                                        className="text-muted fs-6"
                                    >
                                        ¿Olvido su contraseña?
                                    </Link>
                                </div>
                                <label
                                    className="form-label"
                                    htmlFor="password-input"
                                ></label>
                                <div className="position-relative auth-pass-inputgroup">
                                    <input
                                        type={
                                            passwordShow ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Ingrese su contraseña"
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message:
                                                    "La Contraseña es requerida.",
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
                                        onClick={() =>
                                            setPasswordShow(!passwordShow)
                                        }
                                        className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                        type="button"
                                        id="password-addon"
                                    >
                                        <i className="ri-eye-fill align-middle"></i>
                                    </Button>
                                </div>
                            </div>
                            <div className="d-flex">
                                
                                    <Button
                                        color="success"
                                        className="btn btn-success w-100 m-2"
                                        type="submit"
                                    >
                                        Confirmar
                                    </Button>
                                    <button
                                        className="btn btn-primary w-100 m-2"
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                
                            </div>
                        </form>
                    </ModalBody>
                </div>
            </Modal>
        </div>
    );
};

export default ModalLogin;
