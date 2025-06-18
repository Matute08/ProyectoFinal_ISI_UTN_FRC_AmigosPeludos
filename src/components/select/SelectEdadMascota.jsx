import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllEdadMascota } from "../../api/commonApi";

const SelectEdadMascota = ({ value, onChange, error, helperText }) => {
  const [edades, setEdades] = useState([]);

  useEffect(() => {
    getAllEdadMascota().then((res) => setEdades(res.data));
  }, []);

  return (
    <TextField
      select
      label="Edad"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
    >
      {edades.map((edad) => (
        <MenuItem key={edad.id} value={edad.id}>
          {edad.descripcion}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectEdadMascota;