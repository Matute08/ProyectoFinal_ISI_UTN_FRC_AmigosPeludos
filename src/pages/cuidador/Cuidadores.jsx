import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserMail } from "../../api/userApi";
import { getCuidadores } from "../../api/cuidadoresApi";
import CustomLoader from "../../components/CustomLoader";
import FloatingActionButton from "../../components/FloatingActionButton";
import PromedioValoracion from "../../components/PromedioValoracion";
import Denuncias from "../../components/Denuncias";

const Cuidadores = () => {
  const navigate = useNavigate();
  const [cuidadores, setCuidadores] = useState([]);
  const [userData, setUserData] = useState(null);
  const [puedePublicar, setPuedePublicar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const cached = localStorage.getItem("userData");
      if (!cached) return;
      const { email } = JSON.parse(cached);
      const res = await getUserMail(email);
      setUserData(res);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        const res = await getCuidadores();
        setCuidadores(res.data || []);
      } catch (e) {
        console.error("Error cargando cuidadores:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCuidadores();
  }, []);

  useEffect(() => {
    if (userData?.id && cuidadores.length > 0) {
      const yaRegistrado = cuidadores.some((c) => c.idUsuario === userData.id);
      setPuedePublicar(!yaRegistrado);
    }
  }, [userData, cuidadores]);

  if (loading) return <CustomLoader />;

  return (
    <Container sx={{ mt: 4, backgroundColor: "#e0d0b8", borderRadius: 4 }}>
      <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: "600" }}>
        Publicaciones de Cuidadores
      </Typography>
      <Typography align="center" color="text.secondary" mb={5}>
        Conocé a los cuidadores registrados y encontrá el que mejor se adapte a tu mascota.
      </Typography>

      {cuidadores.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
          <Typography variant="h6" color="text.secondary">
            No hay cuidadores registrados aún.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {cuidadores.map((cuidador) => (
            <Grid item size={{ xs: 10, sm: 6, md: 5, lg: 4 }} key={cuidador.id}>
              <Card
                sx={{
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 6,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
                  },
                  minHeight: "100%",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  position: "relative",
                }}
              >
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
                  <Denuncias idEntidad={cuidador.id} tipoEntidad="cuidador" />
                </Box>

                <Box
                  sx={{
                    width: "90%",
                    height: 180,
                    bgcolor: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #eee",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    src={cuidador.datosUsuario?.foto || "/placeholder.png"}
                    alt={cuidador.datosUsuario?.nombreCompleto || "Cuidador"}
                    sx={{
                      maxHeight: 170,
                      maxWidth: "80%",
                      objectFit: "cover",
                      mx: "auto",
                      my: 2,
                      mt: 4,
                      borderRadius: 3,
                      boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                    }}
                  />
                </Box>
                <CardContent sx={{ width: "100%", px: 4, pt: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    color="primary.main"
                    sx={{ mb: 0.5 }}
                  >
                    {cuidador.datosUsuario?.nombreCompleto || "Nombre no disponible"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{
                      mb: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
                    {cuidador.presentacion}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="primary"
                    textAlign="center"
                    sx={{ mb: 2 }}
                  >
                    ${cuidador.precioCuidado} / hora
                  </Typography>
                  
                  <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#f5f5f5",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: 180,
                    mx: "auto",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    mb: 2,
                  }}
                >
                  <PromedioValoracion promedio={cuidador.promedioValoracion || 0} size="medium" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mt={0.5}
                    textAlign="center"
                  >
                    {cuidador.promedioValoracion > 0
                      ? `Promedio: ${cuidador.promedioValoracion.toFixed(1)}`
                      : "Aún no tiene valoraciones."}
                  </Typography>
                </Box>
                </CardContent>
                <Stack
                  direction="row"
                  justifyContent="center"
                  sx={{ width: "100%", pb: 3 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/perfil-cuidador/${cuidador.id}`)}
                    sx={{
                      fontWeight: 600,
                      px: 4,
                      borderRadius: 999,
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Ver Perfil
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {puedePublicar && (
        <FloatingActionButton
          destino="/agregar-cuidador"
          tooltip="Registrate como Cuidador"
        />
      )}
    </Container>
  );
};

export default Cuidadores;
