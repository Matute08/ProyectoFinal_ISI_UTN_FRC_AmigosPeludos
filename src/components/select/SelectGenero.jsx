import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getGeneros } from "../../api/commonApi";

const SelectGenero = ({ value, onChange, error, helperText }) => {
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        getGeneros().then((res) => setGeneros(res.data));
    }, []);

    return (
        <TextField
            select
            label="Género"
            fullWidth
            value={value || ""}
            onChange={onChange}
            error={error}
            helperText={helperText}
        >
            {generos.map((genero) => (
                <MenuItem key={genero.id} value={genero.id}>
                    {genero.nombre}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SelectGenero;
