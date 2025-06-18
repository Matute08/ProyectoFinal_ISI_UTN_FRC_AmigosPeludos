// src/components/ServicioCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const ServicioCard = ({ icon, titulo, descripcion, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
                borderRadius: 4,
                cursor: "pointer",
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
            }}
        >
            <Box fontSize={40} mb={1}>
                {icon}
            </Box>
            <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {descripcion}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServicioCard;
