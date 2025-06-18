import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getTipoVivienda } from "../../api/commonApi";

const SelectTipoVivienda = ({ value, onChange, error, helperText }) => {
    const [vivienda, setVivienda] = useState([]);

    useEffect(() => {
        getTipoVivienda().then((res) => setVivienda(res.data));
    }, []);

    return (
        <TextField
            select
            label="Tipo de Vivienda"
            fullWidth
            value={value || ""}
            onChange={onChange}
            error={error}
            helperText={helperText}
        >
            {vivienda.map((viv) => (
                <MenuItem key={viv.id} value={viv.id}>
                    {viv.nombre}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SelectTipoVivienda;
