import { TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getProvincia } from "../../api/commonApi";

const SelectProvincia = ({ value, onChange, error, helperText }) => {
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    getProvincia().then((res) => setProvincias(res.data));
  }, []);

  return (
    <TextField
      select
      label="Provincia"
      fullWidth
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
    >
      {provincias.map((prov) => (
        <MenuItem key={prov.id} value={prov.id}>
          {prov.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectProvincia;
