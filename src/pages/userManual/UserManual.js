import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";

const sections = [
    {
        id: "Registro",
        title: "Registro",
        link: "https://amigos-peludos.vercel.app/registrar",
        steps: [
            {
                subtitle: "1. Hacer clic en el botón 'Regístrate' en la página principal de la aplicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ea92f0ed-712c-44e9-9d37-605a252ebfce/099c273e-7281-4c17-a852-294abab45690.png",
                alt: "Hacer clic en el botón 'Regístrate' en la página principal de la aplicación."
            },
            {
                subtitle: "2. Ingresar información de registro y hacer clic en 'Registrarse'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9091db70-66a0-4231-90a5-82f06e77f243/10280200-652d-4ccd-9e0e-4442ce67cadb.png",
                alt: "Ingresar información de registro y hacer clic en 'Registrarse'",
                description: (
                    <div className="text-start w-100 d-flex justify-content-center">
                        <ul className="user-manual-lista">
                            <li>
                                <p className="user-manual-paragraph">
                                    <strong>Email:</strong> ingresa la dirección de tu correo electrónico. Este será tu nombre de usuario para iniciar sesión en la aplicación.
                                </p>
                            </li>
                            <li>
                                <p className="user-manual-paragraph">
                                    <strong>Nombre Completo:</strong> Proporciona tu nombre y apellido separados por un espacio.
                                </p>
                            </li>
                            <li>
                                <p className="user-manual-paragraph">
                                    <strong>Contraseña:</strong> Elige una contraseña segura que contenga al menos 8 caracteres. Debe combinar letras mayúsculas, minúsculas, números y caracteres especiales.
                                </p>
                            </li>
                            <p className="user-manual-paragraph">
                                Todos los campos son obligatorios para continuar. Una vez que hayas ingresado la información requerida, haz clic en el botón 'Registrarse' para completar el proceso de registro.
                            </p>
                        </ul>
                    </div>
                )
            }
        ]
    },
    {
        id: "RecuperarContraseña",
        title: "Recuperar Contraseña",
        link: "https://amigos-peludos.vercel.app/restablecer-contraseña",
        steps: [
            {
                subtitle: "1. Desde la página principal de la aplicación, haz clic en el botón 'Iniciar Sesión'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/14d9495a-119d-4fc2-8308-b019bb85b9d0/d15d5573-dda1-4c61-be46-537c46741fe6.png",
                alt: "Desde la página principal de la aplicación, haz clic en el botón 'Iniciar Sesión'"
            },
            {
                subtitle: "2. En la sección donde se solicita la contraseña, notarás un enlace de texto que dice '¿Olvidó su contraseña?'. Haz clic en ese enlace.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1f8e57ff-e93b-4b81-9453-9f0be16fc3d5/5628cf57-5fbd-4337-8418-d944c805a1d1.png",
                alt: "En la sección donde se solicita la contraseña, notarás un enlace de texto que dice '¿Olvidó su contraseña?'. Haz clic en ese enlace."
            },
            {
                subtitle: "3. Ingresa tu dirección de correo electrónico en el campo proporcionado y asegúrate de que sea la misma que utilizaste al registrarte en la aplicación. Después de ingresar tu correo electrónico, haz clic en el botón 'Restablecer Contraseña'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9e2466a0-e40d-4f42-8c19-ceaf93fd5fce/8d962a3a-fde5-49fa-a5b3-2ed6331dd826.png",
                alt: "Ingresa tu dirección de correo electrónico en el campo proporcionado y haz clic en 'Restablecer Contraseña'."
            },
            {
                subtitle: "4. La aplicación enviará un correo electrónico a la dirección que proporcionaste con instrucciones para restablecer tu contraseña."
            }
        ]
    },
    {
        id: "PerfilDeUsuario",
        title: "Perfil de Usuario",
        link: "https://amigos-peludos.vercel.app/perfil/2023amigospeludos@gmail.com",
        steps: [
            {
                subtitle: "1. Para revisar tus datos de perfil, haz clic en el botón 'Perfil'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/fde4871a-d5d6-4893-8f01-5d7bb346715e/3b9f7d4a-bae1-491f-ac17-548f7188e2a1.png",
                alt: "Para revisar tus datos de perfil, haz clic en el botón 'Perfil'"
            },
            {
                subtitle: "2. Allí podrás verificar tus datos personales.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/3873fbb9-d6d7-43ee-bcd8-b10965dd0cfa/2e15d869-8f3e-4131-bd55-41dc2ca0deff.png",
                alt: "Allí podrás verificar tus datos personales."
            },
            {
                subtitle: "3. Si necesitas actualizar o modificar la información en tu perfil de usuario, haz clic en el botón 'Modificar perfil'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1bb94349-49ce-4901-8587-96482637d128/17781494-8985-434d-b45d-3ee44451706a.png",
                alt: "Haz clic en el botón 'Modificar perfil'",
                description: (
                    <p className="m-3 user-manual-paragraph">
                        Esto te llevará a una página de edición donde podrás cambiar los detalles de tu perfil. Una vez que hayas realizado los cambios deseados, asegúrate de guardar los cambios haciendo clic en un botón de "Actualizar".
                    </p>
                )
            },
            {
                subtitle: "4. Si deseas eliminar tu perfil de usuario, haz clic sobre la opción 'Eliminar Perfil'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/eec0f512-83a4-4b1e-9f08-bccfd2c8ece0/d9cc3d14-605d-44e8-99cc-6d0fa71321de.png",
                alt: "Haz clic sobre la opción 'Eliminar Perfil'"
            }
        ]
    },
    {
        id: "MisMascotas",
        title: "Mis Mascotas",
        link: "https://amigos-peludos.vercel.app/perfil/2023amigospeludos@gmail.com",
        steps: [
            {
                subtitle: "1. Ve a tu nombre de usuario en la esquina superior derecha de la pantalla y selecciona 'Perfil'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/9dc9dace-4279-4134-b63f-7aab5f949379/883a15e7-8c08-4551-aeda-043d1839b6b5.png",
                alt: "Ve a tu nombre de usuario y selecciona 'Perfil'"
            },
            {
                subtitle: "2. En la sección de 'Mis Mascotas', busca y haz clic en el botón '+ Agregar Mascota'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/13747159-67f7-4571-a6d5-b6df7a1d1c26/0cf74878-994f-4029-bae2-ecd81c165cbb.png",
                alt: "Haz clic en el botón '+ Agregar Mascota'"
            },
            {
                subtitle: "3. Completa todos los datos obligatorios para tu mascota y haz clic en el botón 'Agregar Mascota' para registrar a tu mascota en la aplicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/c7bbacc7-0c16-4dd4-9082-74a08ff92e25/4ceb1141-f060-4c3e-8eb7-715a4d7e9615.png",
                alt: "Completa los datos y haz clic en 'Agregar Mascota'"
            },
            {
                subtitle: "4. Serás redirigido a la sección 'Mis Mascotas', donde podrás ver la mascota que acabas de registrar."
            },
            {
                subtitle: "5. Para ver los detalles de una mascota registrada, busca la mascota de la cual deseas ver los datos y haz clic sobre la foto de la mascota.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/3204898b-325c-404e-be95-c00542351ae7/851b0504-3868-48c6-a78d-81e4b6a43e41.png",
                alt: "Haz clic sobre la foto de la mascota para ver detalles"
            },
            {
                subtitle: "6. Si necesitas actualizar la información de una mascota que has registrado previamente, haz clic en el botón de edición (ícono de lápiz) que está junto a la mascota.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/209cbe4f-4cdf-4f81-983a-cb4857b0b70a/191bd58c-6a1a-4153-ae69-4c0d2ec83828.png",
                alt: "Haz clic en el ícono de lápiz para editar"
            },
            {
                subtitle: "7. Esto te llevará a una página de edición donde podrás cambiar los detalles de tu mascota. Una vez que hayas realizado los cambios deseados, asegúrate de guardar los cambios haciendo clic en un botón de 'Actualizar'"
            },
            {
                subtitle: "8. Si deseas eliminar una mascota registrada de tu perfil, haz clic en el botón de eliminar (ícono de tachito) junto a la mascota.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/1025c1ec-f8c1-4f6e-bf52-9dc799b3fb6a/32464b49-ecc7-420f-9a1b-ad9f40a422fd.png",
                alt: "Haz clic en el ícono de tachito para eliminar"
            },
            {
                subtitle: "9. Serás redirigido a una página de confirmación de eliminación, donde deberás confirmar tu acción."
            }
        ]
    },
    {
        id: "Perdidas",
        title: "Mascotas Perdidas",
        link: "https://amigos-peludos.vercel.app/mascotas-perdidas",
        steps: [
            {
                subtitle: "1. Para ver las publicaciones de mascotas perdidas, desde la página principal, haz clic en la sección 'Mascotas' y selecciona la opción 'Perdidas'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/258abf80-6a06-4ee3-92c7-8b9c82a16093/74c33500-bd74-4fa8-b628-b6bbc32d6ed0.png",
                alt: "Selecciona 'Mascotas' y luego 'Perdidas'"
            },
            {
                subtitle: "2. Serás redirigido a una pantalla que muestra todas las publicaciones de mascotas perdidas. Verás distintas opciones de filtro, donde puedes seleccionar uno, varios o ninguno, según tus preferencias de búsqueda y aplicarlos haciendo clic en el botón 'Aplicar'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/759973ad-618c-4f94-8998-c4907393b81e/430003ab-16fc-42c0-aadc-05575f0ba96c.png",
                alt: "Pantalla de publicaciones de mascotas perdidas con filtros"
            },
            {
                subtitle: "3. En la lista de publicaciones de mascotas perdidas, busca la mascota de la cual deseas obtener más información y haz clic en el icono de desplegar, junto a la publicación para ver una vista resumida de los detalles.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/5769bcb7-a510-451a-8aac-20805c54bc2a/bde2b1a5-1e45-4629-92c1-ebe1cbd6a808.png",
                alt: "Haz clic en el icono de desplegar"
            },
            {
                subtitle: "4. Si deseas obtener información completa, haz clic en el botón 'Conocer Más'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/75fe1000-9d3f-4296-aca8-58eedfa4a6f5/cc97b600-8381-4dd9-8591-4d4f934437a7.png",
                alt: "Haz clic en 'Conocer Más'"
            },
            {
                subtitle: "5. Se te mostrarán todos los detalles disponibles sobre la mascota y la información de contacto para comunicarte con el usuario que realizó la publicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/0b493472-881d-470e-865a-35a398dd6274/db52f269-f9a8-493c-999a-3fe9fd792eb5.png",
                alt: "Detalles completos de la mascota perdida",
                description: (
                    <p className="m-3 user-manual-paragraph">
                        Haciendo clic en el icono de WhatsApp o correo electrónico, serás redirigido a la aplicación correspondiente para iniciar una conversación
                    </p>
                )
            },
            {
                subtitle: "6. Si deseas crear una publicación sobre una mascota perdida, haz clic en el botón 'Crear Posteo'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ed670793-0538-4216-aac8-2dce48804d24/c6a9140b-cd89-4df5-afce-5a62e88db2ee.png",
                alt: "Haz clic en 'Crear Posteo'"
            },
            {
                subtitle: "7. Serás dirigido a un formulario donde deberás completar todos los datos obligatorios relacionados con la mascota perdida. Una vez que hayas ingresado toda la información requerida, presiona el botón 'Publicar' para crear la publicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/c8d977b7-31fd-481d-9cb5-7d804cb5dfdb/f42ec157-b0ed-46aa-8c20-d260a806316b.png",
                alt: "Completa el formulario y haz clic en 'Publicar'"
            }
        ]
    },
    {
        id: "Encontradas",
        title: "Mascotas Encontradas",
        link: "https://amigos-peludos.vercel.app/mascotas-encontradas",
        steps: [
            {
                subtitle: "1. Para ver las publicaciones de mascotas encontradas, desde la página principal, haz clic en la sección 'Mascotas' y selecciona la opción 'Encontradas'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/ce60c2ae-e1c3-421d-adc2-ed94dc28c1e5/be0e3c64-0f2e-44c6-984f-0f2d52b4af70.png",
                alt: "Selecciona 'Mascotas' y luego 'Encontradas'"
            },
            {
                subtitle: "2. Serás redirigido a una pantalla que muestra todas las publicaciones de mascotas encontradas. Verás distintas opciones de filtro, donde puedes seleccionar uno, varios o ninguno, según tus preferencias de búsqueda y aplicarlos haciendo clic en el botón 'Aplicar'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/001b6d3f-bb57-4ce6-bb02-a8753de8ee7e/21febd85-5ddc-40ab-ae85-adea7705d0a2.png",
                alt: "Pantalla de publicaciones de mascotas encontradas con filtros"
            },
            {
                subtitle: "3. En la lista de publicaciones de mascotas encontradas, busca la mascota de la cual deseas obtener más información y haz clic en el icono de desplegar, junto a la publicación para ver una vista resumida de los detalles.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/52b7165b-240a-4831-9dc3-1d99e78f2c5c/7d7dd90c-5e47-468d-9e96-e8f20fc92456.png",
                alt: "Haz clic en el icono de desplegar"
            },
            {
                subtitle: "4. Si deseas obtener información completa, haz clic en el botón 'Conocer Más'.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/cd8ab774-65a8-467b-bf0f-3217668b9a10/e8a847de-db46-45f8-ab59-a7d7fec08c89.png",
                alt: "Haz clic en 'Conocer Más'"
            },
            {
                subtitle: "5. Se te mostrarán todos los detalles disponibles sobre la mascota y la información de contacto para comunicarte con el usuario que realizó la publicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/5133f3d1-e903-40a7-809d-259a17467dcd/47d0d540-af01-4642-86ab-6284949d8c5e.png",
                alt: "Detalles completos de la mascota encontrada",
                description: (
                    <p className="m-3 user-manual-paragraph">
                        Haciendo clic en el icono de WhatsApp o correo electrónico, serás redirigido a la aplicación correspondiente para iniciar una conversación
                    </p>
                )
            },
            {
                subtitle: "6. Si deseas crear una publicación sobre una mascota encontrada haz clic en el botón 'Crear Posteo'",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/13c4bb2d-ed31-4d66-b19e-cab87bd270eb/e781e0bf-5e1c-475a-84fb-f0070d834249.png",
                alt: "Haz clic en 'Crear Posteo'"
            },
            {
                subtitle: "7. Serás dirigido a un formulario donde deberás completar todos los datos obligatorios relacionados con la mascota encontrada. Una vez que hayas ingresado toda la información requerida, presiona el botón 'Publicar' para crear la publicación.",
                image: "https://images.tango.us/workflows/237f66e0-0921-4081-b3a0-5cd731751727/steps/2bf9aca1-7b64-417c-b7c4-8dd05a96b283/6f7e09b6-be21-46af-acc7-442a69de5295.png",
                alt: "Completa el formulario y haz clic en 'Publicar'"
            }
        ]
    }
];


const SectionContent = ({ section }) => (
    <div>
        <h2 className="user-manual-title text-center">
            <a href={section.link}>{section.title}</a>
        </h2>
        {section.steps.map((step, index) => (
            <div key={index} className="text-center m-5">
                <h3 className="user-manual-subtitle m-3">{step.subtitle}</h3>
                {step.image && (
                    <img
                        className="user-manual-image"
                        src={step.image}
                        width="600"
                        alt={step.alt}
                    />
                )}
                {step.description && <div className="m-3">{step.description}</div>}
            </div>
        ))}
    </div>
);

const UserManual = () => {
    const [selectedSection, setSelectedSection] = useState("Registro");

    document.title = "Manual de Usuario | Amigos Peludos";

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
                        {sections.map((section) => (
                            <Col key={section.id}>
                                <button
                                    className={`beautiful-button ${selectedSection === section.id ? "active" : ""}`}
                                    onClick={() => setSelectedSection(section.id)}
                                >
                                    {section.title}
                                    <span></span>
                                </button>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="d-flex justify-content-center contenedor-manual">
                    <div className="user-manual-section">
                        {sections.map(
                            (section) =>
                                selectedSection === section.id && (
                                    <SectionContent key={section.id} section={section} />
                                )
                        )}
                    </div>
                </div>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default UserManual;