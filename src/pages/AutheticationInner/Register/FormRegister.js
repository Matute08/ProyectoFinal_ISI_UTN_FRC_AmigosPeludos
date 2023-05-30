import React, { useState } from "react";
import { Form, Input, Button, Alert } from "reactstrap";
import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";

export const FormRegister = ({ handleSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento:null,
        mail: "",
        password: "",
        login: "hola",
        tieneMascota: false,
        mailVerificado: false,
        habilitada: false,
        generoId: 1,
        barrioId: 1,
        celular: "",
        calle: "",
        codigoPostal: "",
        rolId: 1,
        cuentaVerificada: 0,
        tipoAutenticacionId: 1,
    });

    //formato mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //ver contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    //manejo de errores
    const [alertText, setAlertText] = useState(
        "Registrese gratuitamente en Amigos Peludos"
    );
    const [alertClass, setAlertClass] = useState("text-dark alert-dark");

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const _handleSubmit = async (e) => {
        //metodo privado de este componente
        e.preventDefault();
        if (formData.password.length < 8) {
            setAlertText("La contraseña debe tener al menos 8 caracteres.");
            setAlertClass("text-danger alert-danger");

        }else{
            try {
                await signup(formData.mail, formData.password);
                handleSubmit({ ...formData });
    
                navigate("/");
            } catch (error) {
                if (!emailRegex.test(formData.mail)) {
                    setAlertText("Ingrese un mail correcto");
                }
                if (error.code === "auth/email-already-in-use") {
                    setAlertText(
                        "El correo electronico ya se encuentra registrado."
                    );
                }
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                setAlertClass("text-danger alert-danger");
            }
        }
    };

    return (
        <Form onSubmit={_handleSubmit} className="needs-validation" action="#">
            <Alert
                className={
                    "alert-borderless text-center mb-2 mx-2 " + alertClass
                }
                role="alert"
            >
                {alertText}
            </Alert>
            <div className="mb-3">
                <label htmlFor="mail" className="form-label">
                    Email <span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="mail"
                    placeholder="Ingrese su correo electronico"
                    required
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                />
                <div className="invalid-feedback"></div>
            </div>

            <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    placeholder="Ingrese su nombre"
                    required
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su nombre
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                    Apellido <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="apellido"
                    placeholder="Ingrese su apellido"
                    required
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su apellido
                </div>
            </div>

            {/* <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">
                    Fecha de Nacimiento <span className="text-danger">*</span>
                </label>
                <input
                    type="date"
                    className="form-control"
                    placeholder="Ingrese su fecha de nacimiento"
                    required
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    options={{
                        dateFormat: "Y, M, d",
                    }}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su fecha de nacimiento
                </div>
            </div> */}

            <div className="mb-3">
                <label className="form-label" htmlFor="password-input">
                    Contraseña <span className="text-danger">*</span>
                </label>
                <div className="position-relative auth-pass-inputgroup">
                    <Input
                        type={passwordShow ? "text" : "password"}
                        className="form-control pe-5 password-input"
                        placeholder="Ingrese su contraseña"
                        id="password-input"
                        name="password"
                        value={formData.password}
                        required
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
                        className="btn btn-primary btn-icon waves-effect waves-light"
                    >
                        <i className="ri-facebook-fill fs-16"></i>
                    </button>{" "}
                    <button
                        type="button"
                        className="btn btn-danger btn-icon waves-effect waves-light"
                    >
                        <i className="ri-google-fill fs-16"></i>
                    </button>{" "}
                </div>
            </div>
        </Form>
    );
};
