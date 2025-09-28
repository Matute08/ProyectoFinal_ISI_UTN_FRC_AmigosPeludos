import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import CustomLoader from "../components/CustomLoader";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "../components/FloatingActionButton";
import { getMascotasEncontradas } from "../api/publicacionesApi";
import Denuncias from "../components/Denuncias"; 
import BotonComparaciones from "../components/BotonComparaciones";
import BadgeProcesandoIA from "../components/BadgeProcesandoIA";

export default function Encontrados() {
    const [mascotas, setMascotas] = useState([]);
    const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();

    const porPagina = 6;
    const [filtros, setFiltros] = useState({
        tipo: "Todos",
        sexo: "Todos",
        ciudad: "Todas",
        barrio: "Todos",
    });

    const valoresUnicos = (campo) => {
        const unicos = [
            ...new Set(mascotas.map((m) => m[campo]).filter(Boolean)),
        ];
        return unicos.sort();
    };

    const aplicarFiltros = () => {
        let filtradas = [...mascotas];

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
            const data = await getMascotasEncontradas();
            data.sort((a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta));
            setMascotas(data);
            setMascotasFiltradas(data);
            setLoading(false);
        };
        fetchMascotas();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [filtros]);

    const formatearFecha = (fechaISO) => moment(fechaISO).format("DD/MM/YYYY");

    const totalPaginas = Math.ceil(mascotasFiltradas.length / porPagina);
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;
    const mascotasPagina = mascotasFiltradas.slice(inicio, fin);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    return (
        <>
            <Container sx={{ mt: 4, backgroundColor: "#e0d0b8", borderRadius: 4 }}>
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
                    Mascotas Encontradas 🐶
                </Typography>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    component="span"
                    sx={{
                        fontSize: { xs: "1rem", sm: "1.4rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        mb: 3,
                    }}
                >
                    Aquí puedes encontrar mascotas que han sido reportadas como perdidas.
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
                                {valoresUnicos("tipoMascotaNombre").map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
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
                                {valoresUnicos("ciudadPublicacion").map((ciudad) => (
                                    <MenuItem key={ciudad} value={ciudad}>
                                        {ciudad}
                                    </MenuItem>
                                ))}
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
                                {valoresUnicos("barrioPublicacion").map((barrio) => (
                                    <MenuItem key={barrio} value={barrio}>
                                        {barrio}
                                    </MenuItem>
                                ))}
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

                {/* Cards */}
                <Grid container spacing={3}>
                    {mascotasPagina.map((m) => (
                        <Grid item key={m.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ position: "relative" }}>
                            <BadgeProcesandoIA publicacionId={m.id}>
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
                                        <Denuncias idEntidad={m.id} tipoEntidad="mascotaEncontrada" />
                                    </Box>

                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={m.fotos?.[0]?.foto || "/placeholder.png"}
                                        alt={m.nombre || "Mascota"}
                                        sx={{ 
                                            objectFit: "contain",
                                            width: "100%",
                                            backgroundColor: "#f5f5f5"
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography fontWeight="bold">
                                            {m.nombre || "Mascota Encontrada"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Publicado: {formatearFecha(m.fechaAlta)}
                                        </Typography>
                                        <Typography variant="body2" mt={1}>
                                            {m.descripcion?.length > 100
                                                ? m.descripcion.slice(0, 100) + "..."
                                                : m.descripcion || "Sin descripción."}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ textAlign: "left", px: 2, pb: 2 }}>
                                        <Button
                                            variant="outlined"
                                            endIcon={<span style={{ fontSize: "1rem" }}>→</span>}
                                            onClick={() => navigate(`/consultar-posteo-encontrada/${m.id}`)}
                                            sx={{ mr: 1 }}
                                        >
                                            Ver Detalles
                                        </Button>
                                        <BotonComparaciones publicacionId={m.id} />
                                    </Box>
                                </Card>
                            </BadgeProcesandoIA>
                        </Grid>
                    ))}
                </Grid>

                {/* Paginación */}
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

            <FloatingActionButton destino="/nueva-mascota-encontrada" />
        </>
    );
}
