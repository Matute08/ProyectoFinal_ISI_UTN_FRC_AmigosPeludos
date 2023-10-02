import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";

const UserManual = () => {
    const [selectedButton, setSelectedButton] = useState("Registro");

    document.title = "Manual de Usuario | Amigos Peludos";

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    return (
        <React.Fragment>
            <Navbar />

            <Container fluid className="page-content perfil-fondo">
                <Row>
                    <Col className="d-flex justify-content-center mb-5 text-center">
                        <h1>¿Cómo se usa nuestro sitio?</h1>
                    </Col>
                </Row>

                <div className="btn-manual-container">
                    <Row className="btn-row">
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Registro"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Registro")}
                            >
                                Registro
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Perfil" ? "active" : ""
                                }`}
                                onClick={() => handleButtonClick("Perfil")}
                            >
                                Perfil
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Adopcion"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Adopcion")}
                            >
                                Mascotas en Adopción
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Encontradas"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Encontradas")}
                            >
                                Mascotas Encontradas
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Perdidas"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Perdidas")}
                            >
                                Mascotas Perdidas
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Cuidadores"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Cuidadores")}
                            >
                                Cuidadores
                                <span></span>
                            </button>
                        </Col>
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "Paseadores"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("Paseadores")}
                            >
                                Paseadores
                                <span></span>
                            </button>
                        </Col>
                    </Row>
                </div>

                <div className="d-flex justify-content-center contenedor-manual">
                    <div className="user-manual-section">
                        {selectedButton === "Registro" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/registrar">
                                            Registro de Usuario
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Hacer clic en el botón "Regístrate"
                                        en la página principal de la aplicación.
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ea92f0ed-712c-44e9-9d37-605a252ebfce/099c273e-7281-4c17-a852-294abab45690.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.7232&fp-y=0.1962&fp-z=2.0000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=887&mark-y=82&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0yMzgmaD0xMTAmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Hacer clic en el botón "Regístrate" en la página principal de la aplicación.'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2. Ingresar información de registro y
                                        hacer clic en 'Registrarse'
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9091db70-66a0-4231-90a5-82f06e77f243/10280200-652d-4ccd-9e0e-4442ce67cadb.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4924&fp-y=0.6338&fp-z=1.3771&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=285&mark-y=3&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02MzAmaD03MzcmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Ingresar información de registro y hacer clic en &#039;Registrarse&#039;"
                                    />
                                    <p className="m-3 user-manual-paragraph">
                                        Asegúrate de proporcionar la siguiente
                                        información:
                                    </p>
                                    <div className="text-start w-100 d-flex justify-content-center">
                                        <ul className="user-manual-lista">
                                            <li class="">
                                                <p className="user-manual-paragraph">
                                                    <strong>Email:</strong>{" "}
                                                    ingresa la dirección de tu
                                                    correo electrónico. Este
                                                    será tu nombre de usuario
                                                    para iniciar sesión en la
                                                    aplicación.
                                                </p>
                                            </li>
                                            <li class="">
                                                <p className="user-manual-paragraph">
                                                    <strong>
                                                        Nombre Completo:
                                                    </strong>{" "}
                                                    Proporciona tu nombre y
                                                    apellido separados por un
                                                    espacio.
                                                </p>
                                            </li>
                                            <li class="">
                                                <p className="user-manual-paragraph">
                                                    <strong>Contraseña:</strong>{" "}
                                                    Elige una contraseña segura
                                                    que contenga al menos 8
                                                    caracteres. Debe combinar
                                                    letras mayúsculas,
                                                    minúsculas, números y
                                                    caracteres especiales.
                                                </p>
                                            </li>
                                            <p className="user-manual-paragraph">
                                                Todos los campos son
                                                obligatorios para continuar. Una
                                                vez que hayas ingresado la
                                                información requerida, haz clic
                                                en el botón 'Registrarse' para
                                                completar el proceso de
                                                registro.
                                            </p>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedButton === "Perfil" && (
                            <div>
                                <h2 className="user-manual-title text-center">
                                    <a href="https://amigos-peludos.vercel.app/perfil">
                                        Perfil de Usuario
                                    </a>
                                </h2>
                                {/* Agrega contenido para el botón "Perfil" */}
                            </div>
                        )}

                        {selectedButton === "Adopcion" && (
                            <div>
                                {/* Agrega contenido para el botón "Mascotas en Adopción" */}
                            </div>
                        )}

                        {selectedButton === "Encontradas" && (
                            <div>
                                {/* Agrega contenido para el botón "Mascotas Encontradas" */}
                            </div>
                        )}

                        {selectedButton === "Perdidas" && (
                            <div>
                                {/* Agrega contenido para el botón "Mascotas Perdidas" */}
                            </div>
                        )}

                        {selectedButton === "Cuidadores" && (
                            <div>
                                {/* Agrega contenido para el botón "Cuidadores" */}
                            </div>
                        )}

                        {selectedButton === "Paseadores" && (
                            <div>
                                {/* Agrega contenido para el botón "Paseadores" */}
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            <Footer />
        </React.Fragment>
    );
};

export default UserManual;
