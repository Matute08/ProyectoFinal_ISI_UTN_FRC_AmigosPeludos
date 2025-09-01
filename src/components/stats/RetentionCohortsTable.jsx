import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from "@mui/material";
import { getRetentionCohorts } from "../../api/statsApi";

const pctChip = (pct) => {
  let color = "default";
  if (pct >= 40) color = "success";
  else if (pct >= 20) color = "warning";
  else if (pct > 0) color = "error";
  return <Chip size="small" label={`${pct}%`} color={color} variant="outlined"/>;
};
const fmtMonthUTC = (iso) =>
  new Intl.DateTimeFormat("es-AR", { year: "numeric", month: "numeric", timeZone: "UTC" })
    .format(new Date(iso));
export default function RetentionCohortsTable({ cohorts = 6 }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getRetentionCohorts(cohorts, 3).then(setRows).catch(e => setErr(e.message)); }, [cohorts]);

  if (err) return <Card><CardHeader title="Cohortes de retención"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  return (
    <Card>
      <CardHeader title="Cohortes de retención" subheader="Por mes de alta: M+1, M+2, M+3" />
      <CardContent>
        {!rows.length ? <Typography>Sin datos</Typography> :
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mes Cohorte</TableCell>
                <TableCell align="right">Nuevos</TableCell>
                <TableCell align="right">Ret M+1</TableCell>
                <TableCell align="right">Ret M+2</TableCell>
                <TableCell align="right">Ret M+3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r,i) => (
                <TableRow key={i} hover>
                  <TableCell>{fmtMonthUTC(r.cohortMes)}</TableCell>
                  <TableCell align="right">{r.nuevos}</TableCell>
                  <TableCell align="right">{r.retM1} &nbsp; {pctChip(r.retM1Pct)}</TableCell>
                  <TableCell align="right">{r.retM2} &nbsp; {pctChip(r.retM2Pct)}</TableCell>
                  <TableCell align="right">{r.retM3} &nbsp; {pctChip(r.retM3Pct)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </CardContent>
    </Card>
  );
}
