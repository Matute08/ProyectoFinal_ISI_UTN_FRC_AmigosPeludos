import React from "react";
import { Row, Container, Col } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Accordion from "react-bootstrap/Accordion";

const QuestionItem = ({ question, answer, eventKey }) => {
    return (
        <Accordion.Item eventKey={eventKey} className="item-questions">
            <Accordion.Header className="custom-header">
                {question}
            </Accordion.Header>
            <Accordion.Body className="custom-body">{answer}</Accordion.Body>
        </Accordion.Item>
    );
};

const Questions = () => {
    const questionsData = [
        {
            question:
                "¿Cómo puedo descargar e instalar la Amigos Peludos en mi dispositivo?",
            answer: "Amigos Peludos es un sitio web responsive, esto significa que no necesitás instalarlo en tu dispositivo, basta con ingresar a https://amigos-peludos.vercel.app/ desde cualquier navegador para acceder al sitio.",
            eventKey: "0",
        },
        {
            question:
                "¿Qué tipos de funciones y características ofrece Amigos Peludos?",
            answer: (
                <ol>
                    <li>
                        <b> Mascotas perdidas </b>¿Perdiste a tu mascota?, no te
                        preocupes, chequea si alguien ya la encontró
                    </li>
                    <li>
                        <b> Mascotas encontradas</b> Publicá esa mascota que
                        encontraste, seguramente su dueño esta buscandolo
                    </li>
                    <li>
                        <b> Mascotas en adopción </b>¡No lo dudes más! Adopta a
                        esa mascota que tanto anhelas y dale un hogar .
                    </li>
                    <li>
                        <b> Paseadores</b> ¿Necesitas pasear a tu perro?,
                        encontra aqui al paseador que más se ajuste a tus
                        necesidades
                    </li>
                    <li>
                        <b> Cuidadores</b> ¿No sabes con quien dejar a tu
                        mascota?, aquí podrás encontrar a cuidadores que se
                        encargaran de ello.
                    </li>
                    <li>
                        <b> Donaciones</b> Realiza donaciones a veterinarias o
                        fundaciones de manera segura
                    </li>
                    <li>
                        <b> Veterinarias</b> Encontrá aquí a las veterinarias de
                        tu zona y que realicen atención gratuita
                    </li>
                    <li>
                        <b> Fundaciones</b> Encontrá aquí a las fundaciones de
                        animales que se encuentren cerca de tu zona
                    </li>
                    <li>
                        <b> Traslados</b> Nos encargamos de ponerte en contacto
                        con usuarios disponibles para trasladar mascotas a
                        veterinarias en situaciones de urgencia.
                    </li>
                    
                </ol>
            ),
            eventKey: "1",
        },
        {
            question:
                "¿Cómo puedo usar la función de búsqueda de mascotas perdidas en el sitio web?",
            answer: "Si perdiste una mascota y quieres publicar un posteo, debes dirigirte a la sección Mascotas > Perdidas y seleccionar “Crear posteo”. Si por el contrario, encontraste una mascota y estás buscando a su dueño, puedes buscarla en la sección Mascotas > Perdidas, o, crear un posteo en la sección Mascotas > Encontradas.",
            eventKey: "2",
        },
        {
            question:
                "¿Qué información debo proporcionar para buscar a mi mascota perdida?",
            answer: "Al crear el posteo de mascota perdida se te solicitará, el nombre al que responde la mascota, el tipo de mascota (perro o gato), raza, edad aproximada, si está castrado/a, sexo, fecha de perdida; color, ciudad, barrio y calle de perdida, un numero de celular para que te contacten en caso de que alguien tenga información sobre tu mascota, y una foto de la mascota. Además, cuentas con un campo “Observaciones” para agregar cualquier detalle extra que te parezca importante.",
            eventKey: "3",
        },
        {
            question:
                "¿Cuál es el proceso para reportar una mascota perdida en el sitio web?",
            answer: "Si perdiste una mascota y querés publicar un posteo, debes dirigirte a la sección Mascotas>Perdidas y seleccionar “Crear posteo”, a continuación, deberás completar un pequeño formulario con información sobre tu mascota perdida y de contacto. Una vez publicado el posteo, tu mascota aparecerá visible en la sección mascotas>perdidas.",
            eventKey: "4",
        },
        {
            question:
                "¿Puedo filtrar la búsqueda por ubicación, tipo de mascota o características específicas?",
            answer: "Exacto! puedes filtrar por tipo de mascota (perro o gato), sexo y barrio.",
            eventKey: "5",
        },
        {
            question:
                "¿Cómo se conecta la persona que encuentra una mascota perdida con su dueño a través del sitio?",
            answer: "El contacto se dá a traves de Whatsapp o de correo electrónico, a traves de los datos de contacto suministrados, ya sea por el dueño de la mascota, o por quien la encontró.            ",
            eventKey: "6",
        },
        {
            question:
                "¿Cómo puedo marcar una mascota como encontrada en el sitio web?                ",
            answer: "Si encontraste la mascota que habías perdido, debes eliminar el posteo. De esta forma estarás ayudando a otros usuarios que están buscando a sus mascotas a que sus posteos sean más visibles. Para eliminar un posteo, debes dirigirte a tu perfil, luego a la sección “Mis posteos”, y finalmente hacer click en el botón del “tacho de basura” en el posteo que desees eliminar.",
            eventKey: "7",
        },
        {
            question:
                "¿Qué sucede si mi mascota es encontrada por otra persona y reportada en el sitio?",
            answer: "Si encontrás a tu mascota perdida en la sección mascotas>encontradas, debes ponerte en contacto con el usuario que publicó esa mascota, para eso, debes hacer click en el posteo, y luego en la sección “datos de contacto”, puedes elegir contactar por Whatsapp o Email, según tus preferencias.            ",
            eventKey: "8",
        },
        {
            question:
                "¿La plataforma ofrece opciones para actualizar o editar la información de una mascota perdida?",
            answer: "Si deseas modificar un posteo de una mascota perdida, debes dirigirte a tu perfil, luego a la sección “Mis publicaciones” y utilizar el botón del “lapicito” sobre el post que desees modificar.            ",
            eventKey: "9",
        },
        {
            question:
                "¿Cómo puedo comunicarme con la persona que encontró una mascota perdida a través del sitio?                ",
            answer: "Si encuentras a tu mascota perdida en la sección mascotas>encontradas, debes ponerte en contacto con el usuario que publicó esa mascota, para eso, debes hacer click en el posteo, y luego en la sección “datos de contacto”, puedes elegir contactar por Whatsapp o Email, según tus preferencias.",
            eventKey: "10",
        },
    ];

    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content buscador-fondo">
                <Row>
                    <Col className=" d-flex justify-content-center title-questions">
                        <h1>Preguntas Frecuentes</h1>
                    </Col>
                </Row>
                <div className="container-questions">
                    <Accordion
                        defaultActiveKey="0"
                        flush
                        className="frequent-questions"
                    >
                        {questionsData.map((data) => (
                            <QuestionItem
                                key={data.eventKey}
                                question={data.question}
                                answer={data.answer}
                                eventKey={data.eventKey}
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
