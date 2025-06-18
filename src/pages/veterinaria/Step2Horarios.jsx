import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
    Box,
    Typography,
    Grid,
    Checkbox,
    TextField,
    IconButton,
    Tooltip,
    useMediaQuery,
    Paper,
    Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const DIAS = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
];

const HORAS = Array.from({ length: 15 }, (_, i) => {
    const h = i + 7;
    return `${h.toString().padStart(2, "0")}:00`;
});

const Step2Horarios = () => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const { setValue, trigger } = useFormContext();
    const [local, setLocal] = React.useState(() =>
        DIAS.map((dia) => ({
            dia: dia.key,
            corrido: false,
            desdeC: "",
            hastaC: "",
            desdeM: "",
            hastaM: "",
            desdeT: "",
            hastaT: "",
        }))
    );

    useEffect(() => {
        const horarios = {};
        local.forEach(
            ({
                dia,
                corrido,
                desdeC,
                hastaC,
                desdeM,
                hastaM,
                desdeT,
                hastaT,
            }) => {
                let str = "";
                if (corrido && desdeC && hastaC) {
                    str = `de ${desdeC} a ${hastaC}`;
                } else {
                    let arr = [];
                    if (desdeM && hastaM) arr.push(`de ${desdeM} a ${hastaM}`);
                    if (desdeT && hastaT) arr.push(`de ${desdeT} a ${hastaT}`);
                    str = arr.join(" y ");
                }
                horarios[dia] = str;
            }
        );
        setValue("horarios", horarios, { shouldValidate: true });
        trigger("horarios");
    }, [local, setValue, trigger]);

    const handleChange = (i, field, value) => {
        setLocal((prev) => {
            const updated = [...prev];
            if (field === "corrido") {
                updated[i].corrido = value;
                if (value) {
                    updated[i].desdeM =
                        updated[i].hastaM =
                        updated[i].desdeT =
                        updated[i].hastaT =
                            "";
                } else {
                    updated[i].desdeC = updated[i].hastaC = "";
                }
            } else {
                updated[i][field] = value;
            }
            return updated;
        });
    };

    const handleCopy = (i) => {
        setLocal((prev) => {
            const from = prev[i];
            return prev.map((d, idx) => (idx > i ? { ...d, ...from } : d));
        });
    };

    // DESKTOP TABLE
    const DesktopTable = () => (
        <>
            <Grid
                container
                spacing={1}
                alignItems="center"
                sx={{ mb: 1, fontWeight: 600 }}
            >
                <Grid item size={{ xs: 2 }}>
                    Día
                </Grid>
                <Grid item size={{ xs: 1 }} textAlign="center">
                    Corrido
                </Grid>
                <Grid item size={{ xs: 2 }}>
                    Desde
                </Grid>
                <Grid item size={{ xs: 2 }}>
                    Hasta
                </Grid>
                <Grid item size={{ xs: 2 }}>
                    Desde (Tarde)
                </Grid>
                <Grid item size={{ xs: 2 }}>
                    Hasta (Tarde)
                </Grid>
                <Grid item size={{ xs: 1 }}></Grid>
            </Grid>
            {local.map((row, i) => (
                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    key={row.dia}
                    sx={{ mb: 1 }}
                >
                    <Grid item size={{ xs: 2 }} sx={{ fontWeight: 600 }}>
                        {DIAS[i].label}
                    </Grid>
                    <Grid item size={{ xs: 1 }} textAlign="center">
                        <Checkbox
                            checked={row.corrido}
                            onChange={(e) =>
                                handleChange(i, "corrido", e.target.checked)
                            }
                            color="success"
                        />
                    </Grid>
                    {/* Desde corrido o mañana */}
                    <Grid item size={{ xs: 2 }}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={row.corrido ? row.desdeC : row.desdeM}
                            onChange={(e) =>
                                handleChange(
                                    i,
                                    row.corrido ? "desdeC" : "desdeM",
                                    e.target.value
                                )
                            }
                            SelectProps={{ native: true }}
                        >
                            <option value="">-</option>
                            {HORAS.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    {/* Hasta corrido o mañana */}
                    <Grid item size={{ xs: 2 }}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={row.corrido ? row.hastaC : row.hastaM}
                            onChange={(e) =>
                                handleChange(
                                    i,
                                    row.corrido ? "hastaC" : "hastaM",
                                    e.target.value
                                )
                            }
                            SelectProps={{ native: true }}
                        >
                            <option value="">-</option>
                            {HORAS.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    {/* Desde tarde (si no es corrido) */}
                    <Grid item size={{ xs: 2 }}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={row.corrido ? "" : row.desdeT}
                            onChange={(e) =>
                                handleChange(i, "desdeT", e.target.value)
                            }
                            disabled={row.corrido}
                            SelectProps={{ native: true }}
                        >
                            <option value="">-</option>
                            {HORAS.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    {/* Hasta tarde (si no es corrido) */}
                    <Grid item size={{ xs: 2 }}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={row.corrido ? "" : row.hastaT}
                            onChange={(e) =>
                                handleChange(i, "hastaT", e.target.value)
                            }
                            disabled={row.corrido}
                            SelectProps={{ native: true }}
                        >
                            <option value="">-</option>
                            {HORAS.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={{ xs: 1 }} textAlign="center">
                        {i < local.length - 1 && (
                            <Tooltip title="Copiar este horario a los días siguientes">
                                <IconButton
                                    onClick={() => handleCopy(i)}
                                    size="small"
                                    color="primary"
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );

    // MOBILE COLUMN CARDS
    const MobileCards = () => (
        <Stack spacing={2}>
            {local.map((row, i) => (
                <Paper key={row.dia} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography fontWeight={700} flex={1}>
                            {DIAS[i].label}
                        </Typography>
                        <Tooltip title="Corrido">
                        Corrido
                            <Checkbox
                                checked={row.corrido}
                                onChange={(e) =>
                                    handleChange(i, "corrido", e.target.checked)
                                }
                                color="success"
                                
                            />
                            
                        </Tooltip>
                        {i < local.length - 1 && (
                            <Tooltip title="Copiar este horario a los días siguientes">
                                <IconButton
                                    onClick={() => handleCopy(i)}
                                    size="small"
                                    color="primary"
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {row.corrido ? (
                        <Grid container spacing={1}>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Desde"
                                    size="small"
                                    fullWidth
                                    value={row.desdeC}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "desdeC",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Hasta"
                                    size="small"
                                    fullWidth
                                    value={row.hastaC}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "hastaC",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={1}>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Desde (Mañana)"
                                    size="small"
                                    fullWidth
                                    value={row.desdeM}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "desdeM",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Hasta (Mañana)"
                                    size="small"
                                    fullWidth
                                    value={row.hastaM}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "hastaM",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Desde (Tarde)"
                                    size="small"
                                    fullWidth
                                    value={row.desdeT}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "desdeT",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Hasta (Tarde)"
                                    size="small"
                                    fullWidth
                                    value={row.hastaT}
                                    onChange={(e) =>
                                        handleChange(
                                            i,
                                            "hastaT",
                                            e.target.value
                                        )
                                    }
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">-</option>
                                    {HORAS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            ))}
        </Stack>
    );

    return (
        <Box>
            <Typography variant="h6" textAlign="center" mb={2}>
                Horarios de atención
            </Typography>
            {isMobile ? <MobileCards /> : <DesktopTable />}
        </Box>
    );
};

export default Step2Horarios;
