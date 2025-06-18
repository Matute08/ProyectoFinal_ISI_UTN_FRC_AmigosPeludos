import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getRazasPorTipo } from "../../api/mascotasApi";

const SelectRaza = ({ tipoMascotaId, value, onChange, error, helperText }) => {
  const [razas, setRazas] = useState([]);

  useEffect(() => {
    if (tipoMascotaId) {
      getRazasPorTipo(tipoMascotaId).then((res) => setRazas(res.data));
    } else {
      setRazas([]);
    }
  }, [tipoMascotaId]);

  return (
    <TextField
      select
      label="Raza"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={!tipoMascotaId}
    >
      {razas.map((raza) => (
        <MenuItem key={raza.id} value={raza.id}>
          {raza.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectRaza;