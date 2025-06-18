// src/components/Servicios.jsx
import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupsIcon from "@mui/icons-material/Groups";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import StoreIcon from "@mui/icons-material/Store";
import FoundationIcon from "@mui/icons-material/Foundation";
import ServicioCard from "./ServicioCard";

const servicios = [
    {
        icon: <SearchIcon color="success" fontSize="inherit" />,
        titulo: "Mascotas perdidas",
        descripcion:
            "¿Perdiste a tu mascota?, no te preocupes, chequeá si alguien ya la encontró",
        ruta: "/perdidos",
    },
    {
        icon: <PetsIcon color="success" fontSize="inherit" />,
        titulo: "Mascotas encontradas",
        descripcion:
            "Publicá esa mascota que encontraste, seguramente su dueño la está buscando",
        ruta: "/encontrados",
    },
    {
        icon: <FavoriteIcon color="success" fontSize="inherit" />,
        titulo: "Mascotas en adopción",
        descripcion:
            "No lo dudes más! Adoptá a esa mascota que tanto anhelas y dale un hogar",
        ruta: "/adopcion",
    },
    {
        icon: <GroupsIcon color="success" fontSize="inherit" />,
        titulo: "Paseadores",
        descripcion:
            "¿Necesitás pasear a tu perro?, encontrá al paseador ideal para vos",
        ruta: "/paseadores",
    },
    {
        icon: <StoreIcon color="success" fontSize="inherit" />,
        titulo: "Cuidadores",
        descripcion:
            "Encontrá cuidadores que puedan hacerse cargo de tu mascota cuando lo necesites",
        ruta: "/cuidadores",
    },
    {
        icon: <VolunteerActivismIcon color="success" fontSize="inherit" />,
        titulo: "Donaciones",
        descripcion:
            "Realizá donaciones a veterinarias o fundaciones de manera segura",
        ruta: "/donaciones",
    },
    {
        icon: <LocalHospitalIcon color="success" fontSize="inherit" />,
        titulo: "Veterinarias",
        descripcion:
            "Consultá las veterinarias disponibles en tu zona para atención gratuita",
        ruta: "/veterinarias",
    },
    {
        icon: <FoundationIcon color="success" fontSize="inherit" />,
        titulo: "Fundaciones",
        descripcion:
            "Contactá fundaciones que ayudan a los animales en tu zona",
        ruta: "/fundaciones",
    },
    {
        icon: <LocalShippingIcon color="success" fontSize="inherit" />,
        titulo: "Traslados",
        descripcion:
            "Nos encargamos de poner en contacto a usuarios dispuestos a trasladar mascotas",
        ruta: "/traslados",
    },
];

const Servicios = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4, backgroundColor:"#bb9c70" }} >
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                fontWeight="bold"
                
            >
                Ofrecemos múltiples servicios para ayudarte con tu mascota
            </Typography>
            <Grid container spacing={4} mt={2}>
                {servicios.map((servicio, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <ServicioCard
                            icon={servicio.icon}
                            titulo={servicio.titulo}
                            descripcion={servicio.descripcion}
                            onClick={() => navigate(servicio.ruta)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Servicios;
