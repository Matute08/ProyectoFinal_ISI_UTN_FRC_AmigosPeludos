import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getExperiencia } from "../../api/commonApi";

const SelectExperiencia = ({ value, onChange, error, helperText }) => {
    const [exp, setExp] = useState([]);

    useEffect(() => {
        getExperiencia().then((res) => setExp(res.data));
    }, []);

    return (
        <TextField
            select
            label="Experiencia"
            fullWidth
            value={value || ""}
            onChange={onChange}
            error={error}
            helperText={helperText}
        >
            {exp.map((experiencia) => (
                <MenuItem key={experiencia.id} value={experiencia.id}>
                    {experiencia.descripcion}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SelectExperiencia;
