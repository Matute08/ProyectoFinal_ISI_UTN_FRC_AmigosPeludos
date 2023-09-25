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

                                <div className="text-center">
                                    <h3 className="user-manual-subtitle">
                                        1. Registrate
                                    </h3>
                                    <p className="user-manual-paragraph">
                                        Haz clic en el botón 'Regístrate' para
                                        acceder al formulario de registro.
                                    </p>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ff803eca-4674-427b-9a00-e512ae862eff/08fbfaec-fcff-486d-bf10-5839ae7ad6d2.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.8924&fp-y=0.0923&fp-z=2.6749&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=696&mark-y=110&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0zMTgmaD0xNDcmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        alt="Registrate"
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="user-manual-subtitle">
                                        2. Email
                                    </h3>
                                    <p className="user-manual-paragraph">
                                        Ingresa tu dirección de correo
                                        electrónico. Se utilizará como nombre de
                                        usuario.
                                    </p>
                                    <img
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/20ebe8ed-7065-4ea3-978b-f5cc0b955cf9/88f1c605-548c-412c-9af1-72c06fd23536.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4924&fp-y=0.4400&fp-z=1.4685&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02NzEmaD04MSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        alt="Email"
                                        className="user-manual-image"
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="user-manual-subtitle">
                                        3. Nombre Completo *
                                    </h3>
                                    <p className="user-manual-paragraph">
                                        Proporciona tu nombre completo
                                    </p>
                                    <img
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/978b07c2-d351-4ff4-9a1f-c25ecf377633/7a7ad4a4-a8c5-4ed6-8019-7293b6bef30a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4924&fp-y=0.5723&fp-z=1.4685&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02NzEmaD04MSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        alt="Nombre Completo *"
                                        className="user-manual-image"
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="user-manual-subtitle">
                                        4. Contraseña
                                    </h3>
                                    <p className="user-manual-paragraph">
                                        Elige una contraseña segura. Debe
                                        contener al menos ocho caracteres
                                    </p>
                                    <img
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/d0664ec6-5464-4e89-a118-cd43525fb811/628fc9f0-a4c8-429c-8690-110596281448.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4924&fp-y=0.7031&fp-z=1.4685&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02NzEmaD04MSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        alt="Contraseña"
                                        className="user-manual-image"
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="user-manual-subtitle text-center">
                                        5. Registrarse
                                    </h3>
                                    <p className="user-manual-paragraph">
                                        Haz clic en el botón 'Registrarse' para
                                        completar el proceso de registro y crear
                                        tu cuenta
                                    </p>
                                    <img
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/363c53f0-9143-4f40-b699-da099e5da639/d5c61d9a-c2af-458a-95c6-23a7a7bd0c3d.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4924&fp-y=0.8800&fp-z=1.4685&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02NzEmaD04MSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        alt="Registrarse"
                                        className="user-manual-image"
                                    />
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
