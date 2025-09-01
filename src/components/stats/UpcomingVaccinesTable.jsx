import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Table, TableHead, TableBody, TableRow, TableCell, Chip, Typography } from "@mui/material";
import { getUpcomingVaccines } from "../../api/statsApi";
const fmtDate = iso => {
  const d = new Date(iso);
  return isNaN(+d) ? "-" : d.toLocaleDateString();
};

export default function UpcomingVaccinesTable({ days = 30 }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUpcomingVaccines(days).then(setRows).catch(e => setError(e.message));
  }, [days]);

  return (
    <Card>
      <CardHeader title={`Vacunas próximas (${days} días)`} />
      <CardContent>
        {error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : rows.length === 0 ? (
          <Typography>No hay vacunas próximas en {days} días.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mascota ID</TableCell>
                <TableCell>Vacuna</TableCell>
                <TableCell>Aplicación</TableCell>
                <TableCell>Próxima</TableCell>
                <TableCell>Días</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.mascotaId}</TableCell>
                  <TableCell>{r.vacuna}</TableCell>
                  <TableCell>{fmtDate(r.fechaAplicacion)}</TableCell>
                  <TableCell>{fmtDate(r.fechaProxima)}</TableCell>
                  <TableCell>
                    <Chip
  label={r.diasParaVencer}
  size="small"
  sx={{
    fontWeight: 600,
    bgcolor: r.diasParaVencer <= 7 ? "error.light" :
            r.diasParaVencer <= 14 ? "warning.light" : "success.light",
    color: r.diasParaVencer <= 7 ? "error.dark" :
           r.diasParaVencer <= 14 ? "warning.dark" : "success.dark"
  }}
/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
