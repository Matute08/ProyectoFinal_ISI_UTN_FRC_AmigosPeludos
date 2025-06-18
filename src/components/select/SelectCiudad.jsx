import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getCiudadesPorProvincia } from "../../api/commonApi";

const SelectCiudad = ({ provinciaId, value, onChange, error, helperText }) => {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    if (provinciaId) {
      getCiudadesPorProvincia(provinciaId).then((res) => setCiudades(res.data));
    } else {
      setCiudades([]);
    }
  }, [provinciaId]);

  return (
    <TextField
      select
      label="Ciudad"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={!provinciaId}
    >
      {ciudades.map((ciudad) => (
        <MenuItem key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectCiudad;
