import React from "react";
import { Row, Container, Col } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Accordion from "react-bootstrap/Accordion";

const QuestionItem = ({ question, answer, eventKey }) => (
    <Accordion.Item eventKey={eventKey} className="item-questions">
        <Accordion.Header className="custom-header">{question}</Accordion.Header>
        <Accordion.Body className="custom-body">{answer}</Accordion.Body>
    </Accordion.Item>
);

const Questions = () => {
    const questionsData = [
        {
            question: "¿Cómo puedo descargar e instalar Amigos Peludos en mi dispositivo?",
            answer: "Amigos Peludos es un sitio web responsive, esto significa que no necesitás instalarlo en tu dispositivo, basta con ingresar a https://amigos-peludos.vercel.app/ desde cualquier navegador para acceder al sitio.",
            eventKey: "0",
        },
        {
            question: "¿Qué tipos de funciones y características ofrece Amigos Peludos?",
            answer: (
                <ol>
                    <li><b>Mascotas perdidas:</b> ¿Perdiste a tu mascota? No te preocupes, chequeá si alguien ya la encontró.</li>
                    <li><b>Mascotas encontradas:</b> Publicá esa mascota que encontraste, seguramente su dueño está buscándola.</li>
                    <li><b>Mascotas en adopción:</b> ¡No lo dudes más! Adoptá a esa mascota que tanto anhelás y dale un hogar.</li>
                    <li><b>Paseadores:</b> ¿Necesitás pasear a tu perro? Encontrá aquí al paseador que más se ajuste a tus necesidades.</li>
                    <li><b>Cuidadores:</b> ¿No sabés con quién dejar a tu mascota? Aquí podrás encontrar cuidadores que se encargarán de ello.</li>
                    <li><b>Donaciones:</b> Realizá donaciones a veterinarias o fundaciones de manera segura.</li>
                    <li><b>Veterinarias:</b> Encontrá aquí a las veterinarias de tu zona que realicen atención gratuita.</li>
                    <li><b>Fundaciones:</b> Encontrá aquí a las fundaciones de animales que se encuentren cerca de tu zona.</li>
                    <li><b>Traslados:</b> Nos encargamos de ponerte en contacto con usuarios disponibles para trasladar mascotas a veterinarias en situaciones de urgencia.</li>
                </ol>
            ),
            eventKey: "1",
        },
        {
            question: "¿Cómo puedo usar la función de búsqueda de mascotas perdidas en el sitio web?",
            answer: "Si perdiste una mascota y querés publicar un posteo, dirigite a la sección Mascotas > Perdidas y seleccioná 'Crear posteo'. Si encontraste una mascota y estás buscando a su dueño, podés buscarla en la sección Mascotas > Perdidas o crear un posteo en Mascotas > Encontradas.",
            eventKey: "2",
        },
        {
            question: "¿Qué información debo proporcionar para buscar a mi mascota perdida?",
            answer: "Al crear el posteo de mascota perdida, se te solicitará información como el nombre de la mascota, tipo (perro o gato), raza, edad aproximada, sexo, fecha de pérdida, color, ubicación, un número de contacto y una foto. También podés agregar detalles adicionales en el campo 'Observaciones'.",
            eventKey: "3",
        },
        {
            question: "¿Cuál es el proceso para reportar una mascota perdida en el sitio web?",
            answer: "Si perdiste una mascota y querés publicar un posteo, dirigite a Mascotas > Perdidas y seleccioná 'Crear posteo'. Completá el formulario con la información requerida y publicá el posteo. Tu mascota aparecerá visible en la sección Mascotas > Perdidas.",
            eventKey: "4",
        },
        {
            question: "¿Puedo filtrar la búsqueda por ubicación, tipo de mascota o características específicas?",
            answer: "¡Exacto! Podés filtrar por tipo de mascota (perro o gato), sexo y barrio.",
            eventKey: "5",
        },
        {
            question: "¿Cómo se conecta la persona que encuentra una mascota perdida con su dueño a través del sitio?",
            answer: "El contacto se realiza a través de WhatsApp o correo electrónico, utilizando los datos de contacto proporcionados por el dueño de la mascota o quien la encontró.",
            eventKey: "6",
        },
        {
            question: "¿Cómo puedo marcar una mascota como encontrada en el sitio web?",
            answer: "Si encontraste a tu mascota, eliminá el posteo para ayudar a otros usuarios. Para hacerlo, dirigite a tu perfil, luego a 'Mis posteos' y hacé clic en el ícono del 'tacho de basura' en el posteo correspondiente.",
            eventKey: "7",
        },
        {
            question: "¿Qué sucede si mi mascota es encontrada por otra persona y reportada en el sitio?",
            answer: "Si encontrás a tu mascota en la sección Mascotas > Encontradas, contactá al usuario que publicó el posteo a través de WhatsApp o correo electrónico desde la sección 'Datos de contacto'.",
            eventKey: "8",
        },
        {
            question: "¿La plataforma ofrece opciones para actualizar o editar la información de una mascota perdida?",
            answer: "Sí, podés modificar un posteo desde tu perfil en la sección 'Mis publicaciones', utilizando el botón del 'lapicito' en el posteo que desees editar.",
            eventKey: "9",
        },
        {
            question: "¿Cómo puedo comunicarme con la persona que encontró una mascota perdida a través del sitio?",
            answer: "Si encontrás a tu mascota en Mascotas > Encontradas, contactá al usuario que publicó el posteo desde la sección 'Datos de contacto', ya sea por WhatsApp o correo electrónico.",
            eventKey: "10",
        },
    ];

    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content buscador-fondo">
                <Row>
                    <Col className="d-flex justify-content-center title-questions">
                        <h1>Preguntas Frecuentes</h1>
                    </Col>
                </Row>
                <div className="container-questions">
                    <Accordion defaultActiveKey="0" flush className="frequent-questions">
                        {questionsData.map(({ question, answer, eventKey }) => (
                            <QuestionItem
                                key={eventKey}
                                question={question}
                                answer={answer}
                                eventKey={eventKey}
                            />
                        ))}
                    </Accordion>
                </div>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default Questions;