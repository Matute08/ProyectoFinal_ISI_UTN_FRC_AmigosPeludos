import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    CircularProgress,
    Alert,
    useTheme,
    Grid,
} from "@mui/material";
import {
    Campaign,
    TrendingUp,
    MonetizationOn,
    Visibility,
} from "@mui/icons-material";
import { getEstadisticasPublicidades } from "../../api/publicidadesApi";

const PublicidadesKpiCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const estadisticas = await getEstadisticasPublicidades();
                setData(estadisticas);
            } catch (err) {
                console.error(
                    "Error al cargar estadísticas de publicidades:",
                    err
                );
                setError("Error al cargar estadísticas");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Card>
        );
    }

    if (error) {
        return (
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Alert severity="error">{error}</Alert>
                </CardContent>
            </Card>
        );
    }

    const kpis = [
        {
            title: "Publicidades Activas",
            value: data?.publicidadesActivas || 0,
            icon: <Campaign />,
            color: "primary",
            suffix: "",
        },
        {
            title: "Visualizaciones",
            value: data?.totalVisualizaciones || 0,
            icon: <Visibility />,
            color: "info",
            suffix: "",
        },
        {
            title: "Clics Totales",
            value: data?.totalClics || 0,
            icon: <TrendingUp />,
            color: "success",
            suffix: "",
        },
        // {
        //   title: 'Ingresos',
        //   value: data?.ingresosTotales || 0,
        //   icon: <MonetizationOn />,
        //   color: 'warning',
        //   suffix: '$',
        //   format: 'currency'
        // }
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    {kpis.map((kpi, index) => (
                        <Card key={index} sx={{ height: "100%" }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            backgroundColor: `${kpi.color}.light`,
                                            color: `${kpi.color}.contrastText`,
                                        }}
                                    >
                                        {kpi.icon}
                                    </Box>
                                    <Box flexGrow={1}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            color="primary"
                                        >
                                            {kpi.format === "currency"
                                                ? `${kpi.suffix}${kpi.value.toLocaleString()}`
                                                : `${kpi.value.toLocaleString()}${kpi.suffix}`}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {kpi.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PublicidadesKpiCard;
