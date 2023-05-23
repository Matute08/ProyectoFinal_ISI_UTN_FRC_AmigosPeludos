import React, { useState } from "react";
import { Form, Input, Button } from "reactstrap";
import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../firebase";

export const FormRegister = (props) => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        username: "",
        date: "",
        password: "",
        rol: "usuario",
    });

    //formato mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //ver contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    //manejo de errores
    const [error, setError] = useState("");

    const { signup, context } = useAuth();
    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) =>
        setFormData({ ...formData, [name]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.password.length < 8) {
                throw new Error(
                    "La contraseña debe tener al menos 8 caracteres."
                );
            } else if (!emailRegex.test(formData.email)) {
                throw new Error("Ingrese un mail correcto");
            }
            await signup(
                formData.email,
                formData.name,
                formData.lastname,
                formData.username,
                formData.date,
                formData.password,
                formData.rol
            );
            navigate("/");
        } catch (error) {
            setError(error);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="needs-validation" action="#">
            <div className="mb-3">
                <label htmlFor="useremail" className="form-label">
                    Email <span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="useremail"
                    placeholder="Ingrese su correo electronico"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <div className="invalid-feedback"></div>
            </div>

            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Nombre <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Ingrese su nombre"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su nombre
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Apellido <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    placeholder="Ingrese su apellido"
                    required
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su apellido
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Nombre de usuario <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Ingrese un nombre de usuario"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese un nombre de usuario
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="date" className="form-label">
                    Fecha de Nacimiento <span className="text-danger">*</span>
                </label>
                <input
                    type="date"
                    className="form-control"
                    placeholder="Ingrese su fecha de nacimiento"
                    required
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    options={{
                        dateFormat: "d M, Y",
                    }}
                />
                <div className="invalid-feedback">
                    Por favor, ingrese su fecha de nacimiento
                </div>
            </div>

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
                    <p>{error.toString()}</p>
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
