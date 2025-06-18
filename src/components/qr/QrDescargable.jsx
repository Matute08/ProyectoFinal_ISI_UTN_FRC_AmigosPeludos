// src/components/qr/QrDescargable.jsx

import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const QrDescargable = ({ qrUrl, nombre = "usuario" }) => {
    const handleDescargarPDF = async () => {
        // const qrDataUrl = await QRCode.toDataURL(
        //     `https://amigos-peludos.vercel.app/datos-usuario/${nombre}`,
        //     { width: 300, margin: 2 }
        // );

        const qrDataUrl = await QRCode.toDataURL(
            `localhost:5173/datos-usuario/${nombre}`,
            { width: 300, margin: 2 }
        );

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(16);
        doc.text("Código QR de mi/s mascota", pageWidth / 2, 20, {
            align: "center",
        });

        doc.addImage(qrDataUrl, "PNG", (pageWidth - 100) / 2, 30, 100, 100);

        doc.setFontSize(12);
        doc.text(nombre, pageWidth / 2, 140, { align: "center" });
        doc.save(`qr_${nombre}.pdf`);
    };

    return (
        <Box textAlign="center" mt={3}>
            <Box p={2} display="inline-block" bgcolor="#fff" borderRadius={2}>
                <img
                    src={qrUrl}
                    alt="QR del usuario"
                    style={{ width: 200, height: 200, objectFit: "contain" }}
                />
                <Typography mt={1} variant="subtitle2">
                    {nombre}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                <Button variant="outlined" onClick={handleDescargarPDF}>
                    Descargar como PDF
                </Button>
            </Stack>
        </Box>
    );
};

export default QrDescargable;
