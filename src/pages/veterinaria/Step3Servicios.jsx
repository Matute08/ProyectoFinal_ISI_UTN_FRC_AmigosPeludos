import React from "react";
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

    // Actualiza el objeto servicios en el form al checkear/descheckear
    const handleCheck = (name, checked) => {
        setValue(`servicios.${name}`, checked, {
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
                    render={({ field }) => (
                        <TextField
                            label="Otros servicios (especifique)"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                            {...field}
                        />
                    )}
                />
            </Box>
            
        </Box>
    );
};

export default Step3Servicios;
