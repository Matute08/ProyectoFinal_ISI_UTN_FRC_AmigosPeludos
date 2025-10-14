import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Grid,
} from "@mui/material";

const SERVICIOS = [
    { name: "ecografias", label: "Ecografías" },
    { name: "emergencias", label: "Emergencias" },
    { name: "internaciones", label: "Internaciones" },
    { name: "radiografias", label: "Radiografías" },
    { name: "vacunaciones", label: "Vacunaciones" },
    { name: "guardia24hs", label: "Guardia 24hs" },
    { name: "equipoLaboratorio", label: "Laboratorio" },
    { name: "castraciones", label: "Castraciones" },
    { name: "observaciones", label: "Controles Gratuitos" },

];

const Step3Servicios = () => {
    const { control, watch, setValue } = useFormContext();
    const servicios = watch("servicios") || {};

    // Inicializar todos los servicios como booleanos
    useEffect(() => {
        SERVICIOS.forEach(serv => {
            const currentValue = servicios[serv.name];
            if (currentValue === undefined || currentValue === "" || typeof currentValue !== 'boolean') {
                setValue(`servicios.${serv.name}`, false);
            }
        });
    }, [servicios, setValue]);

    // Actualiza el objeto servicios en el form al checkear/descheckear
    const handleCheck = (name, checked) => {
        setValue(`servicios.${name}`, Boolean(checked), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <Box>
            <Typography variant="h6" mb={2} textAlign="center">
                Servicios que brinda la veterinaria
            </Typography>
            <FormGroup row>
                <Grid container spacing={2}>
                    {SERVICIOS.map((serv) => (
                        <Grid item size={{xs:12,sm:6,md:4}}  key={serv.name}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!servicios[serv.name]}
                                        onChange={(e) =>
                                            handleCheck(
                                                serv.name,
                                                e.target.checked
                                            )
                                        }
                                        color="primary"
                                    />
                                }
                                label={serv.label}
                            />
                        </Grid>
                    ))}
                </Grid>
            </FormGroup>
            <Box mt={2}>
                <Controller
                    name="servicios.otros"
                    control={control}
                    rules={{
                        maxLength: {
                            value: 100,
                            message: "Máximo 100 caracteres"
                        }
                    }}
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Otros servicios (especifique)"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                            inputProps={{
                                maxLength: 100
                            }}
                            {...field}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                    field.onChange(e);
                                }
                            }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || `${field.value?.length || 0}/100 caracteres`}
                        />
                    )}
                />
            </Box>
            
        </Box>
    );
};

export default Step3Servicios;
