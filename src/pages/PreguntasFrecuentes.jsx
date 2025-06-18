import React from "react";
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const preguntas = [
    {
        pregunta: "¿Cómo puedo usar Amigos Peludos?",
        respuesta:
            "Amigos Peludos es una web responsive. No hace falta instalarla: solo ingresá a https://amigos-peludos.vercel.app/ desde cualquier navegador.",
    },
    {
        pregunta: "¿Qué funciones ofrece?",
        respuesta: (
            <ul>
                <li>
                    <b>Mascotas perdidas:</b> buscá o publicá mascotas
                    extraviadas.
                </li>
                <li>
                    <b>Mascotas encontradas:</b> ayudá a reunir mascotas con sus
                    dueños.
                </li>
                <li>
                    <b>Adopciones:</b> ofrecé o encontrá un hogar a una mascota.
                </li>
                <li>
                    <b>Veterinarias, paseadores y más:</b> conectate con
                    servicios cercanos.
                </li>
            </ul>
        ),
    },
    {
        pregunta: "¿Cómo publico una mascota perdida?",
        respuesta:
            "Andá a Mascotas > Perdidas > Crear publicación, completá el formulario y listo.",
    },
    {
        pregunta: "¿Puedo filtrar publicaciones?",
        respuesta:
            "Sí. Podés filtrar por tipo de mascota, sexo, ciudad y barrio.",
    },
    {
        pregunta: "¿Cómo contacto al usuario de un posteo?",
        respuesta:
            "Desde la sección 'Datos de contacto' del posteo, podés escribirle por WhatsApp o email.",
    },
    {
        pregunta: "¿Cómo marco como resuelta una publicación?",
        respuesta:
            "Entrá a tu perfil, sección 'Mis publicaciones', y eliminá la publicación.",
    },
];

const PreguntasFrecuentes = () => {
    return (
        <Container sx={{ mt: 6, mb: 6, backgroundColor:"#e0d0b8", borderRadius: 4 }} >
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                fontWeight="bold"
            >
                Preguntas Frecuentes
            </Typography>
            <Box mt={4} >
                {preguntas.map((item, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="bold">
                                {item.pregunta}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="div">
                                {item.respuesta}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Container>
    );
};

export default PreguntasFrecuentes;
