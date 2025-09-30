import { useMemo } from "react";
import {
  Card, CardContent, Stack, FormControl, InputLabel, Select, MenuItem, Typography
} from "@mui/material";

export default function StatsToolbar({ months, setMonths }) {
  const options = useMemo(() => [3, 6, 12, 24], []);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Rango de tiempo</Typography>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="months-label">Mostrar</InputLabel>
            <Select
              labelId="months-label"
              label="Mostrar"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              {options.map((m) => (
                <MenuItem key={m} value={m}>Últimos {m} meses</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
