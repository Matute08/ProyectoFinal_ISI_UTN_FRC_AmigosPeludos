import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getBarriosPorCiudad } from "../../api/commonApi";

const SelectBarrio = ({ ciudadId, value, onChange, error, helperText }) => {
  const [barrios, setBarrios] = useState([]);

  useEffect(() => {
    if (ciudadId) {
      getBarriosPorCiudad(ciudadId).then((res) => setBarrios(res.data));
    } else {
      setBarrios([]);
    }
  }, [ciudadId]);

  return (
    <TextField
      select
      label="Barrio"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={!ciudadId}
    >
      {barrios.map((barrio) => (
        <MenuItem key={barrio.id} value={barrio.id}>
          {barrio.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectBarrio;
