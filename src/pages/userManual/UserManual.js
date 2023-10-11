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
                        {/* Registro */}
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
                        {/* Recuperar contraseña */}
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "RecuperarContraseña"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleButtonClick("RecuperarContraseña")
                                }
                            >
                                Recuperar Contraseña
                                <span></span>
                            </button>
                        </Col>
                        {/* Perfil del usuario */}
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "PerfilDeUsuario"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleButtonClick("PerfilDeUsuario")
                                }
                            >
                                Perfil de Usuario
                                <span></span>
                            </button>
                        </Col>
                        {/* Mis Mascotas */}
                        <Col>
                            <button
                                className={`beautiful-button ${
                                    selectedButton === "MisMascotas"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleButtonClick("MisMascotas")}
                            >
                                Mis Mascotas
                                <span></span>
                            </button>
                        </Col>
                        {/* Mascotas perdidas */}
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
                        {/* Mascotas Encontradas */}
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
                        {/*  */}
                        {/* <Col>
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
                        </Col> */}
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

                        {selectedButton === "RecuperarContraseña" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/restablecer-contraseña">
                                            Recuperar Contraseña
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Desde la página principal de la
                                        aplicación, haz clic en el botón
                                        'Iniciar Sesión'
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/14d9495a-119d-4fc2-8308-b019bb85b9d0/d15d5573-dda1-4c61-be46-537c46741fe6.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.7576&fp-y=0.2117&fp-z=2.3864&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=481&mark-y=94&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0zNDEmaD0xMzEmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Desde la página principal de la aplicación, haz clic en el botón &#039;Iniciar Sesión&#039; "
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2. En la sección donde se solicita la
                                        contraseña, notarás un enlace de texto
                                        que dice '¿Olvidó su contraseña?'. Haz
                                        clic en ese enlace.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1f8e57ff-e93b-4b81-9453-9f0be16fc3d5/5628cf57-5fbd-4337-8418-d944c805a1d1.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6067&fp-y=0.6646&fp-z=2.2199&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=400&mark-y=338&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz00MDEmaD02NiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt="En la sección donde se solicita la contraseña, notarás un enlace de texto que dice &#039;¿Olvidó su contraseña?&#039;. Haz clic en ese enlace."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        3. Ingresa tu dirección de correo
                                        electrónico en el campo proporcionado y
                                        asegúrate de que sea la misma que
                                        utilizaste al registrarte en la
                                        aplicación. Después de ingresar tu
                                        correo electrónico, haz clic en el botón
                                        'Restablecer Contraseña'.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9e2466a0-e40d-4f42-8c19-ceaf93fd5fce/8d962a3a-fde5-49fa-a5b3-2ed6331dd826.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.6285&fp-z=1.4685&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=264&mark-y=253&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz02NzEmaD0yMzcmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Ingresa tu dirección de correo electrónico en el campo proporcionado y asegúrate de que sea la misma que utilizaste al registrarte en la aplicación.
Después de ingresar tu correo electrónico, haz clic en el botón &#039;Restablecer Contraseña&#039;."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        4. La aplicación enviará un correo
                                        electrónico a la dirección que
                                        proporcionaste con instrucciones para
                                        restablecer tu contraseña.
                                    </h3>
                                </div>
                            </div>
                        )}

                        {selectedButton === "PerfilDeUsuario" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/perfil/2023amigospeludos@gmail.com">
                                            Perfil de usuario
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Para revisar tus datos de perfil, haz
                                        clic en el botón "Perfil"
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/fde4871a-d5d6-4893-8f01-5d7bb346715e/3b9f7d4a-bae1-491f-ac17-548f7188e2a1.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.7457&fp-y=0.1654&fp-z=2.8017&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=385&mark-y=285&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz00MjkmaD0xMTgmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Para revisar tus datos de perfil,  haz clic en el botón "Perfil"'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2. Allí podrás verificar tus datos
                                        personales.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/3873fbb9-d6d7-43ee-bcd8-b10965dd0cfa/2e15d869-8f3e-4131-bd55-41dc2ca0deff.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=7&mark-y=366&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0zODUmaD0zNDYmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Allí podrás verificar tus datos personales."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        3. Si necesitas actualizar o modificar
                                        la información en tu perfil de usuario,
                                        haz clic en el botón "Modificar perfil"
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1bb94349-49ce-4901-8587-96482637d128/17781494-8985-434d-b45d-3ee44451706a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1932&fp-y=0.6903&fp-z=2.0000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=71&mark-y=569&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yODgmaD0xMDUmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Si necesitas actualizar o modificar la información en tu perfil de usuario, haz clic en el botón "Modificar perfil"'
                                    />
                                    <p className="m-3 user-manual-paragraph">
                                        Esto te llevará a una página de edición
                                        donde podrás cambiar los detalles de tu
                                        perfil. Una vez que hayas realizado los
                                        cambios deseados, asegúrate de guardar
                                        los cambios haciendo clic en un botón de
                                        "Actualizar".
                                    </p>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        5. Si deseas eliminar tu perfil de
                                        usuario, haz clic sobre la opción
                                        "Eliminar Perfil"
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/eec0f512-83a4-4b1e-9f08-bccfd2c8ece0/d9cc3d14-605d-44e8-99cc-6d0fa71321de.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2103&fp-y=0.6439&fp-z=2.3810&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=508&mark-y=416&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zNDMmaD0xMjUmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Si deseas eliminar tu perfil de usuario, haz clic sobre la opción "Eliminar Perfil" '
                                    />
                                </div>
                            </div>
                        )}

                        {selectedButton === "MisMascotas" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/perfil/2023amigospeludos@gmail.com">
                                            {" "}
                                            Mis mascotas
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Ve a tu nombre de usuario en la
                                        esquina superior derecha de la pantalla
                                        y selecciona "Perfil".
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9dc9dace-4279-4134-b63f-7aab5f949379/883a15e7-8c08-4551-aeda-043d1839b6b5.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.7457&fp-y=0.1654&fp-z=2.8017&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=385&mark-y=285&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz00MjkmaD0xMTgmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Ve a tu nombre de usuario en la esquina superior derecha de la pantalla y selecciona "Perfil".'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2. En la sección de "Mis Mascotas",
                                        busca y haz clic en el botón "+ Agregar
                                        Mascota".
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/13747159-67f7-4571-a6d5-b6df7a1d1c26/0cf74878-994f-4029-bae2-ecd81c165cbb.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n"
                                        width="600"
                                        alt='En la sección de "Mis Mascotas", busca y haz clic en el botón "+ Agregar Mascota".'
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        3. Completa todos los datos obligatorios
                                        para tu mascota y haz clic en el botón
                                        "Agregar Mascota" para registrar a tu
                                        mascota en la aplicación.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/c7bbacc7-0c16-4dd4-9082-74a08ff92e25/4ceb1141-f060-4c3e-8eb7-715a4d7e9615.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=888&mark-y=465&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xNDcmaD01NCZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt='Completa todos los datos obligatorios para tu mascota y haz clic en el botón "Agregar Mascota" para registrar a tu mascota en la aplicación.'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        5. Serás redirigido a la sección 'Mis
                                        Mascotas', donde podrás ver la mascota
                                        que acabas de registrar.
                                    </h3>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        5. Serás redirigido a la sección 'Mis
                                        Mascotas', donde podrás ver la mascota
                                        que acabas de registrar.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/eec0f512-83a4-4b1e-9f08-bccfd2c8ece0/d9cc3d14-605d-44e8-99cc-6d0fa71321de.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2103&fp-y=0.6439&fp-z=2.3810&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=508&mark-y=416&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zNDMmaD0xMjUmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Si deseas eliminar tu perfil de usuario, haz clic sobre la opción "Eliminar Perfil" '
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        6. Para ver los detalles de una mascota
                                        registrada, busca la mascota de la cual
                                        deseas ver los datos y haz clic sobre la
                                        foto de la mascota.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/3204898b-325c-404e-be95-c00542351ae7/851b0504-3868-48c6-a78d-81e4b6a43e41.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4257&fp-y=0.3892&fp-z=1.8006&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=448&mark-y=201&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zMDUmaD0zNDImZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Para ver los detalles de una mascota registrada, busca la mascota de la cual deseas ver los datos y haz clic sobre la foto de la mascota."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        7. Si necesitas actualizar la
                                        información de una mascota que has
                                        registrado previamente, haz clic en el
                                        botón de edición (ícono de lápiz) que
                                        está junto a la mascota.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/209cbe4f-4cdf-4f81-983a-cb4857b0b70a/191bd58c-6a1a-4153-ae69-4c0d2ec83828.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3990&fp-y=0.6231&fp-z=2.6971&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=529&mark-y=301&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0xNDImaD0xNDImZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Si necesitas actualizar la información de una mascota que has registrado previamente, haz clic en el botón de edición (ícono de lápiz) que está junto a la mascota."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        8. Esto te llevará a una página de
                                        edición donde podrás cambiar los
                                        detalles de tu mascota. Una vez que
                                        hayas realizado los cambios deseados,
                                        asegúrate de guardar los cambios
                                        haciendo clic en un botón de
                                        "Actualizar"
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/209cbe4f-4cdf-4f81-983a-cb4857b0b70a/191bd58c-6a1a-4153-ae69-4c0d2ec83828.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3990&fp-y=0.6231&fp-z=2.6971&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=529&mark-y=301&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0xNDImaD0xNDImZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Si necesitas actualizar la información de una mascota que has registrado previamente, haz clic en el botón de edición (ícono de lápiz) que está junto a la mascota."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        9. Si deseas eliminar una mascota
                                        registrada de tu perfil, haz clic en el
                                        botón de eliminar (ícono de tachito)
                                        junto a la mascota.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1025c1ec-f8c1-4f6e-bf52-9dc799b3fb6a/32464b49-ecc7-420f-9a1b-ad9f40a422fd.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4524&fp-y=0.6231&fp-z=2.6971&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=529&mark-y=301&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0xNDImaD0xNDImZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Si deseas eliminar una mascota registrada de tu perfil, haz clic en el botón de eliminar (ícono de tachito) junto a la mascota."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        10. Serás redirigido a una página de
                                        confirmación de eliminación, donde
                                        deberás confirmar tu acción.
                                    </h3>
                                </div>
                            </div>
                        )}

                        {selectedButton === "Perdidas" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/mascotas-perdidas">
                                            {" "}
                                            Mascotas Perdidas
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Para ver las publicaciones de
                                        mascotas perdidas, desde la página
                                        principal, haz clic en la sección
                                        'Mascotas' y selecciona la opción
                                        'Perdidas'.
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/258abf80-6a06-4ee3-92c7-8b9c82a16093/74c33500-bd74-4fa8-b628-b6bbc32d6ed0.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3119&fp-y=0.2423&fp-z=2.3333&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=420&mark-y=295&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zNjAmaD0xNTImZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Para ver las publicaciones de mascotas perdidas, desde la página principal, haz clic en la sección &#039;Mascotas&#039; y selecciona la opción &#039;Perdidas&#039;."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2.Serás redirigido a una pantalla que
                                        muestra todas las publicaciones de
                                        mascotas perdidas. Verás distintas
                                        opciones de filtro, donde puedes
                                        seleccionar uno, varios o ninguno, según
                                        tus preferencias de búsqueda y
                                        aplicarlos haciendo clic en el botón
                                        'Aplicar'.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/759973ad-618c-4f94-8998-c4907393b81e/430003ab-16fc-42c0-aadc-05575f0ba96c.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=84&mark-y=238&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xMDI3Jmg9MTc1JmZpdD1jcm9wJmNvcm5lci1yYWRpdXM9MTA%3D"
                                        width="600"
                                        alt="Serás redirigido a una pantalla que muestra todas las publicaciones de mascotas perdidas.
Verás distintas opciones de filtro, donde puedes seleccionar uno, varios o ninguno, según tus preferencias de búsqueda y aplicarlos haciendo clic en el botón &#039;Aplicar&#039;."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        3. En la lista de publicaciones de
                                        mascotas perdidas, busca la mascota de
                                        la cual deseas obtener más información y
                                        haz clic en el icono de desplegar, junto
                                        a la publicación para ver una vista
                                        resumida de los detalles.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/5769bcb7-a510-451a-8aac-20805c54bc2a/bde2b1a5-1e45-4629-92c1-ebe1cbd6a808.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2688&fp-y=0.5825&fp-z=1.8621&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=404&mark-y=466&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz02OCZoPTY4JmZpdD1jcm9wJmNvcm5lci1yYWRpdXM9MTA%3D"
                                        width="600"
                                        alt="En la lista de publicaciones de mascotas perdidas, busca la mascota de la cual deseas obtener más información y haz clic en el icono de desplegar, junto a la publicación para ver una vista resumida de los detalles."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        4. Si deseas obtener información
                                        completa, haz clic en el botón
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/75fe1000-9d3f-4296-aca8-58eedfa4a6f5/cc97b600-8381-4dd9-8591-4d4f934437a7.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4141&fp-y=0.5976&fp-z=1.2105&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=69&mark-y=587&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yMjEmaD02MiZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt="Si deseas obtener información completa, haz clic en el botón &#039;Conocer Más&#039;."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        5. Se te mostrarán todos los detalles
                                        disponibles sobre la mascota y la
                                        información de contacto para comunicarte
                                        con el usuario que realizó la
                                        publicación.
                                    </h3>
                                    <p className="m-3 user-manual-paragraph">
                                        Haciendo clic en el icono de WhatsApp o
                                        correo electrónico, serás redirigido a
                                        la aplicación correspondiente para
                                        iniciar una conversación
                                    </p>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/0b493472-881d-470e-865a-35a398dd6274/db52f269-f9a8-493c-999a-3fe9fd792eb5.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=537&mark-y=765&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xNDEmaD03NSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt="Se te mostrarán todos los detalles disponibles sobre la mascota y la información de contacto para comunicarte con el usuario que realizó la publicación."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        6. Si deseas crear una publicación sobre
                                        una mascota perdida, haz clic en el
                                        botón "Crear Posteo"
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ed670793-0538-4216-aac8-2dce48804d24/c6a9140b-cd89-4df5-afce-5a62e88db2ee.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.7503&fp-y=0.8174&fp-z=2.0000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=924&mark-y=630&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yNDYmaD05OCZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt='Si deseas crear una publicación sobre una mascota perdida, haz clic en el botón "Crear Posteo"'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        8. Serás dirigido a un formulario donde
                                        deberás completar todos los datos
                                        obligatorios relacionados con la mascota
                                        perdida. Una vez que hayas ingresado
                                        toda la información requerida, presiona
                                        el botón "Publicar" para crear la
                                        publicación.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/c8d977b7-31fd-481d-9cb5-7d804cb5dfdb/f42ec157-b0ed-46aa-8c20-d260a806316b.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=938&mark-y=678&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xMjImaD00NSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt='Serás dirigido a un formulario donde deberás completar todos los datos obligatorios relacionados con la mascota perdida.
                            Una vez que hayas ingresado toda la información requerida, presiona el botón "Publicar" para crear la publicación.'
                                    />
                                </div>
                            </div>
                        )}

                        {selectedButton === "Encontradas" && (
                            <div>
                                <div>
                                    <h2 className="user-manual-title text-center">
                                        <a href="https://amigos-peludos.vercel.app/mascotas-encontradas">
                                            {" "}
                                            Mascotas encontradas
                                        </a>
                                    </h2>
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        1. Para ver las publicaciones de
                                        mascotas encontradas, desde la página
                                        principal, haz clic en la sección
                                        'Mascotas' y selecciona la opción
                                        'Encontradas'.
                                    </h3>

                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ce60c2ae-e1c3-421d-adc2-ed94dc28c1e5/be0e3c64-0f2e-44c6-984f-0f2d52b4af70.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3848&fp-y=0.1846&fp-z=2.4249&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=436&mark-y=258&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zMjcmaD0xNTAmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Para ver las publicaciones de mascotas encontradas, desde la página principal, haz clic en la sección &#039;Mascotas&#039; y selecciona la opción &#039;Encontradas&#039;."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        2.Serás redirigido a una pantalla que
                                        muestra todas las publicaciones de
                                        mascotas encontradas. Verás distintas
                                        opciones de filtro, donde puedes
                                        seleccionar uno, varios o ninguno, según
                                        tus preferencias de búsqueda y
                                        aplicarlos haciendo clic en el botón
                                        'Aplicar'.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/001b6d3f-bb57-4ce6-bb02-a8753de8ee7e/21febd85-5ddc-40ab-ae85-adea7705d0a2.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=303&mark-y=295&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xNzkmaD03OSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt="Serás redirigido a una pantalla que muestra todas las publicaciones de mascotas encontradas.
                                Verás distintas opciones de filtro, donde puedes seleccionar uno, varios o ninguno, según tus preferencias de búsqueda y aplicarlos haciendo clic en el botón &#039;Aplicar&#039;."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        3. En la lista de publicaciones de
                                        mascotas encontradas, busca la mascota
                                        de la cual deseas obtener más
                                        información y haz clic en el icono de
                                        desplegar, junto a la publicación para
                                        ver una vista resumida de los detalles.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/52b7165b-240a-4831-9dc3-1d99e78f2c5c/7d7dd90c-5e47-468d-9e96-e8f20fc92456.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6233&fp-y=0.7336&fp-z=2.8125&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=782&mark-y=385&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0xMTYmaD0xMTYmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="En la lista de publicaciones de mascotas encontradas, busca la mascota de la cual deseas obtener más información y haz clic en el icono de desplegar, junto a la publicación para ver una vista resumida de los detalles."
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        4. Si deseas obtener información
                                        completa, haz clic en el botón 'Conocer
                                        Más'.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/cd8ab774-65a8-467b-bf0f-3217668b9a10/e8a847de-db46-45f8-ab59-a7d7fec08c89.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6000&fp-y=0.3852&fp-z=2.1212&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=416&mark-y=514&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz00MzYmaD0xMjEmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt="Si deseas obtener información completa, haz clic en el botón &#039;Conocer Más&#039;."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        5. Se te mostrarán todos los detalles
                                        disponibles sobre la mascota y la
                                        información de contacto para comunicarte
                                        con el usuario que realizó la
                                        publicación.
                                    </h3>
                                    <p className="m-3 user-manual-paragraph">
                                        Haciendo clic en el icono de WhatsApp o
                                        correo electrónico, serás redirigido a
                                        la aplicación correspondiente para
                                        iniciar una conversación
                                    </p>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/5133f3d1-e903-40a7-809d-259a17467dcd/47d0d540-af01-4642-86ab-6284949d8c5e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=228&mark-y=678&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz03NTAmaD01NSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt="Se te mostrarán todos los detalles disponibles sobre la mascota y la información de contacto para comunicarte con el usuario que realizó la publicación."
                                    />
                                </div>
                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        6. Si deseas crear una publicación sobre
                                        una mascota encontrada haz clic en el
                                        botón "Crear Posteo"
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/13c4bb2d-ed31-4d66-b19e-cab87bd270eb/e781e0bf-5e1c-475a-84fb-f0070d834249.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.9143&fp-y=0.9431&fp-z=4.0000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=514&mark-y=464&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz01NDkmaD0yMTkmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D"
                                        width="600"
                                        alt='Si deseas crear una publicación sobre una mascota encontrada haz clic en el botón "Crear Posteo"'
                                    />
                                </div>

                                <div className="text-center m-5">
                                    <h3 className="user-manual-subtitle m-3">
                                        8. Serás dirigido a un formulario donde
                                        deberás completar todos los datos
                                        obligatorios relacionados con la mascota
                                        encontrada. Una vez que hayas ingresado
                                        toda la información requerida, presiona
                                        el botón "Publicar" para crear la
                                        publicación.
                                    </h3>
                                    <img
                                        className="user-manual-image"
                                        src="https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/2bf9aca1-7b64-417c-b7c4-8dd05a96b283/6f7e09b6-be21-46af-acc7-442a69de5295.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=937&mark-y=648&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTQlMkNGRjc0NDImdz0xMjImaD00NSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw"
                                        width="600"
                                        alt='Serás dirigido a un formulario donde deberás completar todos los datos obligatorios relacionados con la mascota encontrada.
Una vez que hayas ingresado toda la información requerida, presiona el botón "Publicar" para crear la publicación.'
                                    />
                                </div>
                            </div>
                        )}

                        {/* {selectedButton === "Paseadores" && (
                            <div>
                            </div>
                        )} */}
                    </div>
                </div>
            </Container>

            <Footer />
        </React.Fragment>
    );
};

export default UserManual;
