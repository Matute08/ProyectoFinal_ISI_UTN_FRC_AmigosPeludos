import { TextField, MenuItem } from "@mui/material";

const SelectCastracion = ({ value, onChange, error, helperText }) => {
  return (
    <TextField
      select
      label="¿Está castrado/a?"
      fullWidth
      value={value ?? ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
    >
      <MenuItem value={"0"}>Sí</MenuItem>
      <MenuItem value={"1"}>No</MenuItem>
    </TextField>
  );
};

export default SelectCastracion;
