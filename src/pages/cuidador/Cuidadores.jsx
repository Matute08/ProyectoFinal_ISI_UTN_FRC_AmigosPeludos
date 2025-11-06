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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { getCuidadores } from "../../api/cuidadoresApi";
import CustomLoader from "../../components/CustomLoader";
import FloatingActionButton from "../../components/FloatingActionButton";
import PromedioValoracion from "../../components/PromedioValoracion";
import Denuncias from "../../components/Denuncias";

const Cuidadores = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [cuidadores, setCuidadores] = useState([]);
  const [cuidadoresFiltrados, setCuidadoresFiltrados] = useState([]);
  const [puedePublicar, setPuedePublicar] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [filtros, setFiltros] = useState({
    ciudad: "Todas",
    barrio: "Todos",
    valoracionMinima: 0,
    valoracionMaxima: 5,
    precioMinimo: 0,
    precioMaximo: 10000,
  });

  // Estados locales para los inputs de precio (permiten valores vacíos)
  const [precioMinInput, setPrecioMinInput] = useState("0");
  const [precioMaxInput, setPrecioMaxInput] = useState("10000");
  
  // Estados locales para los inputs de valoración (permiten valores vacíos)
  const [valoracionMinInput, setValoracionMinInput] = useState("0");
  const [valoracionMaxInput, setValoracionMaxInput] = useState("5");

  // Función para obtener valores únicos de un campo
  const valoresUnicos = (campo) => {
    const unicos = [
      ...new Set(cuidadores.map((c) => c[campo]).filter(Boolean)),
    ];
    return unicos.sort();
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let filtradas = [...cuidadores];

    // Filtrar por ciudad
    if (filtros.ciudad !== "Todas") {
      filtradas = filtradas.filter((c) => c.ciudadPublicacion === filtros.ciudad);
    }

    // Filtrar por barrio
    if (filtros.barrio !== "Todos") {
      filtradas = filtradas.filter((c) => c.barrioPublicacion === filtros.barrio);
    }

    // Filtrar por rango de valoración
    filtradas = filtradas.filter((c) => {
      const valoracion = c.promedioValoracion || 0;
      return valoracion >= filtros.valoracionMinima && valoracion <= filtros.valoracionMaxima;
    });

    // Filtrar por rango de precios
    filtradas = filtradas.filter((c) => 
      c.precioCuidado >= filtros.precioMinimo && c.precioCuidado <= filtros.precioMaximo
    );

    setCuidadoresFiltrados(filtradas);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    // Calcular el precio máximo real de los cuidadores
    const precios = cuidadores.map(c => c.precioCuidado || 0);
    const precioMaxReal = precios.length > 0 ? Math.max(...precios) : 10000;
    
    setFiltros({
      ciudad: "Todas",
      barrio: "Todos",
      valoracionMinima: 0,
      valoracionMaxima: 5,
      precioMinimo: 0,
      precioMaximo: precioMaxReal,
    });
    setPrecioMinInput("0");
    setPrecioMaxInput(String(precioMaxReal));
    setValoracionMinInput("0");
    setValoracionMaxInput("5");
  };

  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        setLoading(true);
        const res = await getCuidadores();
        setCuidadores(res.data || []);
        
        // Calcular precio máximo dinámicamente
        const precios = (res.data || []).map(c => c.precioCuidado || 0);
        const precioMax = precios.length > 0 ? Math.max(...precios) : 10000;
        
        setFiltros(prev => ({
          ...prev,
          precioMaximo: precioMax
        }));
        setPrecioMaxInput(String(precioMax));
        
      } catch (e) {
        console.error("Error cargando cuidadores:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCuidadores();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (cuidadores.length > 0) {
      aplicarFiltros();
    }
  }, [filtros, cuidadores]);

  useEffect(() => {
    if (userData?.id) {
      const yaRegistrado = cuidadoresFiltrados.some((c) => c.idUsuario === userData.id);
      setPuedePublicar(!yaRegistrado);
    } else {
      setPuedePublicar(false);
    }
  }, [userData, cuidadoresFiltrados]);

  if (loading) return <CustomLoader />;

  return (
    <Container sx={{ mt: 4, backgroundColor: "#e0d0b8", borderRadius: 4 }}>
      <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: "600" }}>
        Publicaciones de Cuidadores
      </Typography>
      <Typography align="center" color="text.secondary" mb={3}>
        Conocé a los cuidadores registrados y encontrá el que mejor se adapte a tu mascota.
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Ciudad</InputLabel>
            <Select
              value={filtros.ciudad}
              label="Ciudad"
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ciudad: e.target.value,
                })
              }
            >
              <MenuItem value="Todas">Todas</MenuItem>
              {valoresUnicos("ciudadPublicacion").map((ciudad) => (
                <MenuItem key={ciudad} value={ciudad}>
                  {ciudad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Barrio</InputLabel>
            <Select
              value={filtros.barrio}
              label="Barrio"
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  barrio: e.target.value,
                })
              }
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {valoresUnicos("barrioPublicacion").map((barrio) => (
                <MenuItem key={barrio} value={barrio}>
                  {barrio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Valoración (estrellas)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="medium"
                label="Mín"
                type="text"
                value={valoracionMinInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Permitir campo vacío o solo números
                  if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                    // Si hay un valor, validar que esté en el rango 0-5
                    if (inputValue !== '') {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue)) {
                        // No permitir valores menores a 0 ni mayores a 5
                        if (numValue < 0 || numValue > 5) {
                          return; // Rechazar la entrada
                        }
                        // No permitir que el mínimo sea mayor al máximo
                        if (numValue > filtros.valoracionMaxima) {
                          return; // Rechazar la entrada
                        }
                      }
                    }
                    setValoracionMinInput(inputValue);
                    // Actualizar filtro solo si hay un valor válido
                    if (inputValue !== '') {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue)) {
                        const valor = Math.max(0, Math.min(numValue, filtros.valoracionMaxima));
                        setFiltros({
                          ...filtros,
                          valoracionMinima: valor,
                        });
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  // Validar y normalizar al perder el foco
                  const numValue = parseFloat(e.target.value);
                  if (isNaN(numValue) || e.target.value === '') {
                    setValoracionMinInput("0");
                    setFiltros({
                      ...filtros,
                      valoracionMinima: 0,
                    });
                  } else {
                    const valor = Math.max(0, Math.min(numValue, Math.min(filtros.valoracionMaxima, 5)));
                    setValoracionMinInput(String(valor));
                    setFiltros({
                      ...filtros,
                      valoracionMinima: valor,
                    });
                  }
                }}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={{ width: "100%" }}
              />
              <Typography variant="body2">-</Typography>
              <TextField
                size="medium"
                label="Máx"
                type="text"
                value={valoracionMaxInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Permitir campo vacío o solo números
                  if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                    // Si hay un valor, validar que esté en el rango 0-5
                    if (inputValue !== '') {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue)) {
                        // No permitir valores menores a 0 ni mayores a 5
                        if (numValue < 0 || numValue > 5) {
                          return; // Rechazar la entrada
                        }
                        // No permitir que el máximo sea menor al mínimo
                        if (numValue < filtros.valoracionMinima) {
                          return; // Rechazar la entrada
                        }
                      }
                    }
                    setValoracionMaxInput(inputValue);
                    // Actualizar filtro solo si hay un valor válido
                    if (inputValue !== '') {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue)) {
                        const valor = Math.max(filtros.valoracionMinima, Math.min(numValue, 5));
                        setFiltros({
                          ...filtros,
                          valoracionMaxima: valor,
                        });
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  // Validar y normalizar al perder el foco
                  const numValue = parseFloat(e.target.value);
                  if (isNaN(numValue) || e.target.value === '') {
                    setValoracionMaxInput("5");
                    setFiltros({
                      ...filtros,
                      valoracionMaxima: 5,
                    });
                  } else {
                    const valor = Math.max(filtros.valoracionMinima, Math.min(numValue, 5));
                    setValoracionMaxInput(String(valor));
                    setFiltros({
                      ...filtros,
                      valoracionMaxima: valor,
                    });
                  }
                }}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={{ width: "100%" }}
              />
            </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <TextField
                size="medium"
                label="Mín"
                type="text"
                value={precioMinInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Permitir campo vacío o solo números
                  if (inputValue === '' || /^\d*$/.test(inputValue)) {
                    setPrecioMinInput(inputValue);
                    // Actualizar filtro solo si hay un valor válido
                    if (inputValue !== '') {
                      const numValue = parseInt(inputValue);
                      if (!isNaN(numValue)) {
                        const valor = Math.max(0, Math.min(numValue, filtros.precioMaximo));
                        setFiltros({
                          ...filtros,
                          precioMinimo: valor,
                        });
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  // Validar y normalizar al perder el foco
                  const numValue = parseInt(e.target.value);
                  if (isNaN(numValue) || e.target.value === '') {
                    setPrecioMinInput("0");
                    setFiltros({
                      ...filtros,
                      precioMinimo: 0,
                    });
                  } else {
                    const valor = Math.max(0, Math.min(numValue, filtros.precioMaximo));
                    setPrecioMinInput(String(valor));
                    setFiltros({
                      ...filtros,
                      precioMinimo: valor,
                    });
                  }
                }}
                inputProps={{ min: 0, max: filtros.precioMaximo }}
                sx={{ width: "100%" }}
              />
              <Typography variant="body2">-</Typography>
              <TextField
                size="medium"
                label="Máx"
                type="text"
                value={precioMaxInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Permitir campo vacío o solo números
                  if (inputValue === '' || /^\d*$/.test(inputValue)) {
                    setPrecioMaxInput(inputValue);
                    // Actualizar filtro solo si hay un valor válido
                    if (inputValue !== '') {
                      const numValue = parseInt(inputValue);
                      if (!isNaN(numValue)) {
                        const valor = Math.max(filtros.precioMinimo, Math.min(numValue, 50000));
                        setFiltros({
                          ...filtros,
                          precioMaximo: valor,
                        });
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  // Validar y normalizar al perder el foco
                  const numValue = parseInt(e.target.value);
                  if (isNaN(numValue) || e.target.value === '') {
                    setPrecioMaxInput(String(filtros.precioMaximo));
                  } else {
                    const valor = Math.max(filtros.precioMinimo, Math.min(numValue, 50000));
                    setPrecioMaxInput(String(valor));
                    setFiltros({
                      ...filtros,
                      precioMaximo: valor,
                    });
                  }
                }}
                inputProps={{ min: filtros.precioMinimo, max: 50000 }}
                sx={{ width: "100%" }}
              />
            </Box>
        </Grid>

        <Grid size={{ xs: 12 }} sx={{ textAlign: { xs: "center", sm: "right" } }}>
          <Button variant="outlined" onClick={limpiarFiltros}>
            🧹 Limpiar Filtros
          </Button>
        </Grid>
      </Grid>

      {cuidadoresFiltrados.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
          <Typography variant="h6" color="text.secondary">
            No hay cuidadores registrados aún.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
          {cuidadoresFiltrados.map((cuidador) => (
            <Grid size={{ xs: 12, sm: 6, md: 5, lg: 4 }} key={cuidador.id}>
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
                      objectFit: "contain",
                      mx: "auto",
                      my: 2,
                      mt: 4,
                      borderRadius: 3,
                      boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                      backgroundColor: "#f5f5f5"
                    }}
                  />
                </Box>
                <CardContent sx={{ width: "100%", px: 4, pt: 3, flex: 1, display: "flex", flexDirection: "column" }}>
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
                      minHeight: "4.5em", // Altura mínima para 3 líneas
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
                  sx={{ width: "100%", pb: 3, mt: "auto" }}
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
