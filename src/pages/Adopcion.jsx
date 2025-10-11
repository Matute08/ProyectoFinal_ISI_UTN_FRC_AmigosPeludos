import { useEffect, useState } from "react";
import { getMascotasEnAdopcion } from "../api/publicacionesApi";
import { registrarVisualizacionPublicidad, registrarClicPublicidad } from "../api/publicidadesApi";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import CustomLoader from "../components/CustomLoader";

import Grid from "@mui/material/Grid";
import FloatingActionButton from "../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Denuncias from "../components/Denuncias";
import PublicidadCarouselNuevo from "../components/PublicidadCarouselNuevo";

export default function Adopcion() {
    const [mascotasOriginales, setMascotasOriginales] = useState([]);
    const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const porPagina = 16;
    const totalPaginas = Math.ceil(mascotasFiltradas.length / porPagina);
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;
    const mascotasPagina = mascotasFiltradas.slice(inicio, fin);

    const navigate = useNavigate();

    // Filtros
    const [filtros, setFiltros] = useState({
        tipo: "Todos",
        sexo: "Todos",
        ciudad: "Todas",
        barrio: "Todos",
    });

    // Extraer valores únicos de campos para armar selects
    const valoresUnicos = (campo) => {
        const unicos = [
            ...new Set(mascotasOriginales.map((m) => m[campo]).filter(Boolean)),
        ];
        return unicos.sort();
    };

    const aplicarFiltros = () => {
        let filtradas = [...mascotasOriginales];

        if (filtros.tipo !== "Todos") {
            filtradas = filtradas.filter(
                (m) => m.tipoMascotaNombre === filtros.tipo
            );
        }
        if (filtros.sexo !== "Todos") {
            filtradas = filtradas.filter((m) => m.sexoMascota === filtros.sexo);
        }
        if (filtros.ciudad !== "Todas") {
            filtradas = filtradas.filter(
                (m) => m.ciudadPublicacion === filtros.ciudad
            );
        }
        if (filtros.barrio !== "Todos") {
            filtradas = filtradas.filter(
                (m) => m.barrioPublicacion === filtros.barrio
            );
        }

        setMascotasFiltradas(filtradas);
        setPaginaActual(1);
    };

    const limpiarFiltros = () => {
        setFiltros({
            tipo: "Todos",
            sexo: "Todos",
            ciudad: "Todas",
            barrio: "Todos",
        });
    };

    useEffect(() => {
        const fetchMascotas = async () => {
            const data = await getMascotasEnAdopcion();
            data.sort((a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta));
            setMascotasOriginales(data);
            setMascotasFiltradas(data);
            setLoading(false);
        };
        fetchMascotas();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [filtros]);

    const formatearFecha = (fechaISO) => moment(fechaISO).format("DD/MM/YYYY");

    // Función para manejar clics en publicidades (si hay alguna visible)
    const handleClicPublicidad = async (publicidadId) => {
        try {
            await registrarClicPublicidad(publicidadId);
        } catch (error) {
            console.error(`Error al registrar clic para publicidad ${publicidadId}:`, error);
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
        <>
        {/* Sección de Publicidades - Arriba del todo */}
        <Box sx={{ mt: 2, mb: 2 }}>
                <PublicidadCarouselNuevo ubicacion="adopcion" onClicPublicidad={handleClicPublicidad} />
            </Box>
            <Container sx={{ mt: 4 , backgroundColor:"#e0d0b8", borderRadius: 4 }}>
                {/* Titulo */}
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1.8rem", sm: "2.4rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    Mascotas en Adopción
                    <Box
                        component="span"
                        fontSize={{ xs: "1.4rem", sm: "1.6rem" }}
                    >
                        🐾
                    </Box>
                </Typography>

                {/* Filtros */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={filtros.tipo}
                                label="Tipo"
                                onChange={(e) =>
                                    setFiltros({
                                        ...filtros,
                                        tipo: e.target.value,
                                    })
                                }
                            >
                                <MenuItem value="Todos">Todos</MenuItem>
                                {valoresUnicos("tipoMascotaNombre").map(
                                    (tipo) => (
                                        <MenuItem key={tipo} value={tipo}>
                                            {tipo}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel>Sexo</InputLabel>
                            <Select
                                value={filtros.sexo}
                                label="Sexo"
                                onChange={(e) =>
                                    setFiltros({
                                        ...filtros,
                                        sexo: e.target.value,
                                    })
                                }
                            >
                                <MenuItem value="Todos">Todos</MenuItem>
                                {valoresUnicos("sexoMascota").map((sexo) => (
                                    <MenuItem key={sexo} value={sexo}>
                                        {sexo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
                                {valoresUnicos("ciudadPublicacion").map(
                                    (ciudad) => (
                                        <MenuItem key={ciudad} value={ciudad}>
                                            {ciudad}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
                                {valoresUnicos("barrioPublicacion").map(
                                    (barrio) => (
                                        <MenuItem key={barrio} value={barrio}>
                                            {barrio}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        size={{ xs: 12 }}
                        sx={{ textAlign: { xs: "center", sm: "right" } }}
                    >
                        <Button variant="outlined" color="#fff" onClick={limpiarFiltros}>
                            🧹 Limpiar Filtros
                        </Button>
                    </Grid>
                </Grid>

                {/* Lista de Cards y Sidebar */}
                <Grid container spacing={3}>
                    <Grid size={{xs:12, md:12}}>
                        <Grid
                            container
                            columnSpacing={3}
                            rowSpacing={4}
                        >
                    {mascotasPagina.map((mascota) => (
                        <Grid key={mascota.id} size={{xs:12, sm:6, md:4}}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    position: "relative",  // importante para el menú denuncia
                                }}
                            >
                                {/* Aquí se agrega el menú de denuncia */}
                                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
                                    <Denuncias idEntidad={mascota.id} tipoEntidad="mascotaEnAdopcion" />
                                </Box>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={
                                        mascota.fotos?.[0]?.foto ||
                                        "/placeholder.png"
                                    }
                                    alt={mascota.nombre || "Mascota"}
                                    sx={{ 
                                        objectFit: "contain",
                                        width: "100%",
                                        backgroundColor: "#f5f5f5"
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography fontWeight="bold">
                                        {mascota.nombre || "Mascota Encontrada"}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        En Adopcion desde:{" "}
                                        {formatearFecha(mascota.fechaAlta)}
                                    </Typography>
                                    <Typography variant="body2" mt={1}>
                                        {mascota.descripcion?.length > 100
                                            ? mascota.descripcion.slice(
                                                  0,
                                                  100
                                              ) + "..."
                                            : mascota.descripcion ||
                                              "Sin descripción."}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ textAlign: "left", px: 2, pb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        endIcon={
                                            <span style={{ fontSize: "1rem" }}>
                                                →
                                            </span>
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/consultar-posteo-adopcion/${mascota.id}`
                                            )
                                        }
                                    >
                                        Ver Detalles
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                        </Grid>
                    </Grid>
                    
                </Grid>
                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={totalPaginas}
                        page={paginaActual}
                        onChange={(e, value) => setPaginaActual(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                    />
                </Box>
            </Container>

            <FloatingActionButton destino="/nueva-mascota-adopcion" />
        </>
    );
}
