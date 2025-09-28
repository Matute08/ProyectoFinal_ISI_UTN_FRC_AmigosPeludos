import React, { useRef , useEffect} from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
} from "@mui/material";

const Step4DatosDonacion = () => {
    const { control, setValue, watch } = useFormContext();
    const fileInputRef = useRef(null);
    const foto = watch("foto");

    useEffect(() => {
    let url;
    if (foto instanceof File) {
        url = URL.createObjectURL(foto);
    }
    return () => {
        if (url) URL.revokeObjectURL(url); // 👈 Limpia al desmontar o cambiar
    };
}, [foto]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("foto", file, { shouldDirty: true });
    };

    return (
        <>
            <Box>
                <Typography variant="h6" m={4} textAlign="center">
                    Datos para recibir donaciones
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="cbu"
                            control={control}
                            rules={{
                                required: "El CBU es obligatorio",
                                pattern: {
                                    value: /^\d{22}$/,
                                    message:
                                        "CBU inválido (debe tener 22 dígitos)",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="CBU"
                                    fullWidth
                                    required
                                    inputProps={{
                                        maxLength: 22,
                                        inputMode: 'numeric'
                                    }}
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                    }}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ||
                                        "Son 22 dígitos, sin guiones"
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="aliasCBU"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Alias CBU"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <Controller
                            name="observacionesDonacion"
                            control={control}
                            rules={{
                                maxLength: {
                                    value: 500,
                                    message: "Máximo 500 caracteres"
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Observaciones para la donación"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    inputProps={{
                                        maxLength: 500
                                    }}
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ||
                                        `${field.value?.length || 0}/500 caracteres`
                                    }
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Typography variant="h6" m={4} textAlign="center">
                    Redes Sociales
                </Typography>
                <Grid container spacing={2} mt={4}>
                    <Grid item size={{ xs: 12, sm: 4 }}>
                        <Controller
                            name="paginaWeb"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    placeholder="www.paginaWeb.com"
                                    label="Página Web"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 4 }}>
                        <Controller
                            name="instagram"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    placeholder="www.instagram.com/tuVeterinaria"
                                    label="Instagram"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 4 }}>
                        <Controller
                            name="facebook"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    placeholder="www.facebook.com/tuVeterinaria"
                                    label="Facebook"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box>
                    <Typography variant="h6" m={4} textAlign="center">
                        Foto de la veterinaria (opcional):
                    </Typography>
                    <Grid container spacing={2} mt={4}>
                        <Grid
                            size={{ xs: 12 }}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Button
                                variant="outlined"
                                component="label"
                                size="big"
                            >
                                {foto ? "Cambiar Imagen" : "Subir Imagen"}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                        <Grid
                            item
                            size={{ xs: 12 }}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            {foto instanceof File && (
    <Box mt={1}>
        <Avatar
            src={URL.createObjectURL(foto)}
            alt="logo"
            sx={{ width: 200, height: 200 }}
        />
    </Box>
)}

                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default Step4DatosDonacion;
