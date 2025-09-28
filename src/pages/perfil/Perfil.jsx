import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Grid,
    Tabs,
    Tab,
    Typography,
    CircularProgress,
} from "@mui/material";
import PerfilInfo from "./PerfilInfo";
import MascotasTab from "./tabs/MascotasTab";
import PublicacionesTab from "./tabs/PublicacionesTab";
import ServiciosTab from "./tabs/ServiciosTab";
import QrTab from "./tabs/QrTab";
import { useAuth } from "../../auth/AuthProvider";
import { getUserMail } from "../../api/userApi";
import CustomLoader from "../../components/CustomLoader";
import FloatingActionButton from "../../components/FloatingActionButton";

const Perfil = () => {
    const { user } = useAuth(); // Firebase user desde el contexto
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                const res = await getUserMail(user.email);
                if (res) {
                    const data = res;
                    const direccionCompleta =
                        `${data.calle || ""} ${data.nroCalle || ""}`.trim();
                    setUserData({ ...data, direccionCompleta });
                }
            } catch (err) {
                console.error("Error al obtener datos del usuario:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    if (!userData) {
        return (
            <Container>
                <Typography color="error" align="center" mt={4}>
                    No se pudo cargar la información del perfil. Iniciá sesión
                    nuevamente.
                </Typography>
            </Container>
        );
    }

    const showServicios =
        userData.esPaseador ||
        userData.esCuidador ||
        userData.esVeterinaria ||
        userData.esFundacion;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {/* Columna izquierda: datos del usuario */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <PerfilInfo userData={userData} />
                    </Grid>

                    {/* Columna derecha: tabs */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Mis Mascotas" />
                            <Tab label="Mis Publicaciones" />
                            <Tab label="Mi QR" />
                            {showServicios && <Tab label="Mis Servicios" />}
                        </Tabs>

                        <Box mt={2}>
                            {activeTab === 0 && (
                                <MascotasTab
                                    userData={userData}
                                    userId={userData.id}
                                />
                            )}
                            {activeTab === 1 && (
                                <PublicacionesTab userId={userData.id} />
                            )}
                            {activeTab === 2 && <QrTab userData={userData} />}
                            {activeTab === 3 && showServicios && (
                                <ServiciosTab userId={userData.id} />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <FloatingActionButton
                destino="/agregar-mascota"
                tooltip="Agregar Mascota"
            />
        </>
    );
};

export default Perfil;
