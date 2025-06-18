import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getTipoMascota } from "../../api/commonApi";

const SelectTipoMascota = ({ value, onChange, error, helperText }) => {
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    getTipoMascota().then((res) => setTipos(res.data));
  }, []);

  return (
    <TextField
      select
      label="Tipo de Mascota"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
    >
      {tipos.map((tipo) => (
        <MenuItem key={tipo.id} value={tipo.id}>
          {tipo.tipo}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectTipoMascota;