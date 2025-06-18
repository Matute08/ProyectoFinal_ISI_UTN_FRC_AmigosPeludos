import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    Alert,
    Button,
    CircularProgress,
    Stack,
    Container,
} from "@mui/material";
import { useAuth } from "../../../auth/AuthProvider";
import QrDescargable from "../../../components/qr/QrDescargable";
//import QRCode from "react-qr-code";
import QRCode from "qrcode";

import { updateUser, getUserMail } from "../../../api/userApi";
import { subirQRUsuario } from "../../../api/firebaseUploads";
import CustomLoader from "../../../components/CustomLoader";

const QrTab = () => {
    const user = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef();
    const [qrGenerado, setQrGenerado] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user.user?.email) return;
            try {
                const res = await getUserMail(user.user.email);
                const data = res;
                const direccionCompleta =
                    `${data.calle || ""} ${data.nroCalle || ""}`.trim();
                setUserData({ ...data, direccionCompleta });
                if (data.qr) {
                    setQrGenerado(data.qr);
                }

                if (qrGenerado != null && canvasRef.current) {
                    // QRCode.toCanvas(
                    //     canvasRef.current,
                    //     `https://amigos-peludos.vercel.app/datos-usuario/${data.id}`,
                    //     { width: 200 },
                    //     function (error) {
                    //         if (error) console.error(error);
                    //     }
                    // );

                     QRCode.toCanvas(
                        canvasRef.current,
                        `localhost:5173/datos-usuario/${data.id}`,
                        { width: 200 },
                        function (error) {
                            if (error) console.error(error);
                        }
                    );
                }
            } catch (err) {
                console.error("Error al obtener datos del usuario:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, qrGenerado]);

const handleGenerarQR = async () => {
  setLoading(true);
  try {
    // const qrDataUrl = await QRCode.toDataURL(
    //   `https://amigos-peludos.vercel.app/datos-usuario/${userData.id}`,
    //   { width: 300, margin: 2 }
    // );

    const qrDataUrl = await QRCode.toDataURL(
      `localhost:5173/datos-usuario/${userData.id}`,
      { width: 300, margin: 2 }
    );

    const qrFirebaseUrl = await subirQRUsuario(qrDataUrl, `qr_${userData.id}.png`);
    await updateUser(userData.id, { ...userData, qr: qrFirebaseUrl });

    localStorage.setItem("user", JSON.stringify({ ...userData, qr: qrFirebaseUrl }));
    setQrGenerado(qrFirebaseUrl);
  } catch (err) {
    console.error("Error al generar QR:", err);
  } finally {
    setLoading(false);
  }
};


    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }
    return (
        <Box mt={3} textAlign="center">
            <Typography variant="h5" gutterBottom>
                Tu código QR personal
            </Typography>

            {qrGenerado ? (
                <QrDescargable
                    qrUrl={qrGenerado}
                    nombre={userData?.nombreCompleto}
                />
            ) : (
                <>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Todavía no generaste tu código QR.
                    </Alert>

                    <Box
                        mt={3}
                        display="inline-block"
                        p={2}
                        borderRadius={2}
                        sx={{
                            position: "absolute",
                            width: 0,
                            height: 0,
                            overflow: "hidden",
                        }}
                    >
                        <canvas ref={canvasRef} />
                    </Box>

                    <Stack direction="row" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleGenerarQR}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Generar QR"
                            )}
                        </Button>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default QrTab;
