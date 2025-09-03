import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Box,
  Stack,
  Container,
} from "@mui/material";
import FloatingActionButton from "../../components/FloatingActionButton";
import CustomLoader from "../../components/CustomLoader";
import Denuncias from "../../components/Denuncias"; 

import { getFundacion } from "../../api/fundacionesApi";

const Fundaciones = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const res = await getFundacion();
        setFundaciones(res.data || []);
      } catch (error) {
        setFundaciones([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFundaciones();
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CustomLoader />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, backgroundColor: "#e0d0b8", borderRadius: 4 }}>
      <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: "600" }}>
        Fundaciones Asociadas
      </Typography>
      <Typography align="center" color="text.secondary" mb={5}>
        Conocé las fundaciones que trabajan junto a Amigos Peludos. Hacé
        click en “Más info” para ver cómo ayudar o contactar.
      </Typography>

      {fundaciones.filter((f) => f.estadoId === 2).length === 0 ? (
        <Grid item xs={12}>
          <Box textAlign="center" mt={8}>
            <Typography variant="h5" color="text.secondary">
              No hay fundaciones registradas aún.
            </Typography>
          </Box>
        </Grid>
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {fundaciones
            .filter((f) => f.estadoId === 2)
            .map((fund) => (
              <Grid item size={{ xs: 10, sm: 6, md: 5, lg: 4 }} key={fund.id}>
                <Card
                  sx={{
                    position: "relative", 
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
                  }}
                >
                  {/* Botón de reportar en esquina superior derecha */}
                  <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
                    <Denuncias idEntidad={fund.id} tipoEntidad="fundacion" />
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
                      src={fund.imagen || "/assets/fundacion-placeholder.jpg"}
                      alt={fund.nombre}
                      sx={{
                        maxHeight: 170,
                        maxWidth: "80%",
                        objectFit: "contain",
                        mx: "auto",
                        my: 2,
                        borderRadius: 3,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ width: "100%", px: 4, pt: 3 }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      mb={0.5}
                      textAlign="center"
                      color="primary.main"
                    >
                      {fund.nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      mb={1}
                    >
                      {fund.direccion} {fund.nroCalle}, {fund.barrio}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{
                        mb: 1.5,
                        minHeight: 46,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {fund.descripcion}
                    </Typography>
                  </CardContent>
                  <Stack direction="row" justifyContent="center" sx={{ width: "100%", pb: 3 }}>
                    <Button
                      component={Link}
                      to={`/donacion-fundacion/${fund.id}`}
                      variant="contained"
                      color="primary"
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
                      Más info
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      <FloatingActionButton destino="/agregar-fundacion" tooltip="Nueva Fundación" />
    </Container>
  );
};

export default Fundaciones;
