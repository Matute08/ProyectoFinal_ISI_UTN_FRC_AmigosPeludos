import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getSexos } from "../../api/commonApi";

const SelectSexoMascota = ({ value, onChange, error, helperText }) => {
  const [sexos, setSexos] = useState([]);

  useEffect(() => {
    getSexos().then((res) => setSexos(res.data));
  }, []);

  return (
    <TextField
      select
      label="Sexo"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
    >
      {sexos.map((sexo) => (
        <MenuItem key={sexo.id} value={sexo.id}>
          {sexo.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectSexoMascota;