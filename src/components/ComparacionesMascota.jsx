import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import { getComparacionesByPublicacion } from "../api/commonApi";

const getColorByPorcentaje = (porcentaje) => {
  if (!porcentaje || porcentaje === 0) return "error";
  if (porcentaje > 75) return "success";
  if (porcentaje >= 50) return "warning";
  return "error";
};

const getEstadoLabel = (resultado) => {
  switch (resultado) {
    case "coincide":
      return <Chip label="Coincide" color="success" variant="outlined" sx={{ fontWeight: 'bold', mr: 1 }} />;
    case "no coincide":
      return <Chip label="No coincide" color="error" variant="outlined" sx={{ fontWeight: 'bold', mr: 1 }} />;
    default:
      return <Chip label="Indeterminado" color="warning" variant="outlined" sx={{ fontWeight: 'bold', mr: 1 }} />;
  }
};

const formatFecha = (fechaISO) => {
  if (!fechaISO) return "-";
  return new Date(fechaISO).toLocaleDateString();
};

const MascotaInfo = ({ mascota, borderColor, titulo }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    sx={{ width: { xs: '100%', sm: 220 }, minWidth: 180 }}
  >
    <Typography variant="caption" fontWeight="bold" color={borderColor === '#4caf50' ? 'success.main' : 'error.main'} sx={{ mb: 0.5, letterSpacing: 1 }}>
      {titulo}
    </Typography>
    <CardMedia
      component="img"
      image={mascota?.fotoPrincipal || "/placeholder.png"}
      alt={mascota?.nombre || "Mascota"}
      sx={{
        width: 160,
        height: 160,
        objectFit: "cover",
        borderRadius: 3,
        border: `3px solid ${borderColor}`,
        mb: 1,
        background: '#fff',
      }}
    />
    <Typography variant="subtitle1" fontWeight="bold" align="center">
      {mascota?.nombre || "Mascota"}
    </Typography>
    <Typography variant="body2" color="textSecondary" align="center">
      {mascota?.raza} | {mascota?.color}
    </Typography>
    <Typography variant="body2" color="textSecondary" align="center">
      {mascota?.sexo} | {mascota?.barrio}
    </Typography>
  </Box>
);

const ComparacionesMascota = ({ publicacionId }) => {
  const [mascotaOrigen, setMascotaOrigen] = useState(null);
  const [comparaciones, setComparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getComparacionesByPublicacion(publicacionId)
      .then((data) => {
        setMascotaOrigen({ ...data.mascotaOrigen, esOrigen: true });
        setComparaciones(
          (data.comparaciones || []).sort((a, b) => {
            const aValue = a.porcentajesimilitud || 0;
            const bValue = b.porcentajesimilitud || 0;
            return bValue - aValue;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error al obtener comparaciones");
        setLoading(false);
      });
  }, [publicacionId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );

  if (error) {
    // Manejo especial para error 404
    if (error.includes('404') || error.includes('Not Found')) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" my={4}>
          <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
            No se encontraron comparaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Esta publicación aún no tiene comparaciones automáticas registradas en el sistema.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Las comparaciones se generan automáticamente cuando se registran mascotas encontradas.
          </Typography>
        </Box>
      );
    }

    // Para otros tipos de errores
    return (
      <Box display="flex" flexDirection="column" alignItems="center" my={4}>
        <Typography variant="h6" color="error" align="center" gutterBottom>
          Error al cargar comparaciones
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box my={3}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        {mascotaOrigen?.nombre
          ? `Comparaciones con ${mascotaOrigen.nombre.toUpperCase()}`
          : "Comparaciones automáticas"}
      </Typography>
      <Typography align="center" color="textSecondary" mb={2}>
        Aquí se listan las comparaciones automáticas efectuadas por el sistema.
      </Typography>
      {comparaciones.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Aún no hay comparaciones registradas para esta publicación.
        </Typography>
      ) : (
        <Stack spacing={4}>
          {comparaciones.map((comp, idx) => {
            // Color de borde según resultado
            const resultado = comp.resultado || "indeterminado";
            const borde = resultado === "coincide" ? "#4caf50" : "#e57373";
            return (
              <Card key={idx} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 4, boxShadow: 3, background: '#fff' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  {/* Mascota origen */}
                  <Grid item size={{xs:12, sm:5, md:4}}>
                    <MascotaInfo mascota={mascotaOrigen} borderColor={borde} titulo={"PERDIDA"} />
                  </Grid>
                  {/* Mascota comparada */}
                  <Grid item size={{xs:12, sm:7, md:8}} >
                    <Box
                      display="flex"
                      flexDirection={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'center', sm: 'flex-start' }}
                      gap={2}
                    >
                      <MascotaInfo mascota={comp.mascotaComparada} borderColor={borde} titulo={"ENCONTRADA"} />
                      <Box flex={1} minWidth={180}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Chip
                            label={`${(comp.porcentajesimilitud || 0).toFixed(2)} %`}
                            color={getColorByPorcentaje(comp.porcentajesimilitud || 0)}
                            sx={{ fontWeight: "bold", fontSize: 16, px: 2, py: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Distancia: {comp.distanciakm ? comp.distanciakm.toFixed(2) : "-"} km
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {getEstadoLabel(resultado)}
                          <Button
                            variant="outlined"
                            size="small"
                            href={
                              comp.mascotaComparada?.tipo === 'encontrada'
                                ? `/consultar-posteo-encontrada/${comp.mascotaComparada.id}`
                                : `/consultar-posteo-perdida/${comp.mascotaComparada.id}`
                            }
                            sx={{ ml: 1 }}
                          >
                            Ver publicación
                          </Button>
                        </Box>
                        {resultado === "no coincide" && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            El motor de comparaciones determinó incompatibilidad.
                          </Alert>
                        )}
                        {resultado === "indeterminado" && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            El motor de comparaciones no pudo determinar coincidencia.
                          </Alert>
                        )}
                        <Box mt={2}>
                          <Typography variant="body2" color="textSecondary">
                            <b>Raza:</b> {mascotaOrigen?.raza} vs {comp.mascotaComparada?.raza}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <b>Color:</b> {mascotaOrigen?.color} vs {comp.mascotaComparada?.color}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <b>Barrio:</b> {mascotaOrigen?.barrio} vs {comp.mascotaComparada?.barrio}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <b>Sexo:</b> {mascotaOrigen?.sexo} vs {comp.mascotaComparada?.sexo}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default ComparacionesMascota;