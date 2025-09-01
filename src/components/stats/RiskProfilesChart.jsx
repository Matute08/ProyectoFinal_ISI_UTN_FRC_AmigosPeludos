import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Grid, Typography, LinearProgress, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { getRiskProfiles } from "../../api/statsApi";

export default function RiskProfilesChart() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getRiskProfiles().then(setRows).catch(e => setErr(e.message)); }, []);

  const data = useMemo(() => rows.map(r => ({
    perfil: r.perfil,
    denuncias: r.denuncias,
    desestimadas: r.desestimadas,
    pct: r.pctDesestimadas
  })), [rows]);

  if (err) return <Card><CardHeader title="Riesgo / denuncias"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  return (
    <Card>
      <CardHeader title="Riesgo / denuncias" subheader="Totales y % desestimadas por perfil"/>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="gDen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.palette.error.main} stopOpacity="0.9"/>
                    <stop offset="100%" stopColor={theme.palette.error.main} stopOpacity="0.5"/>
                  </linearGradient>
                  <linearGradient id="gDes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.palette.warning.main} stopOpacity="0.9"/>
                    <stop offset="100%" stopColor={theme.palette.warning.main} stopOpacity="0.5"/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
                <XAxis dataKey="perfil"/>
                <YAxis allowDecimals={false}/>
                <Tooltip contentStyle={{ borderRadius: 10, borderColor: theme.palette.divider }}/>
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }}/>
                <Bar dataKey="denuncias" name="Denuncias" fill="url(#gDen)" radius={[8,8,0,0]} maxBarSize={48}/>
                <Bar dataKey="desestimadas" name="Desestimadas" fill="url(#gDes)" radius={[8,8,0,0]} maxBarSize={48}/>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" gutterBottom>% Desestimadas</Typography>
            {data.map((d) => (
              <Box key={d.perfil} sx={{ mb: 1.5 }}>
                <Box sx={{ display:"flex", justifyContent:"space-between", mb: 0.5 }}>
                  <Typography variant="body2">{d.perfil}</Typography>
                  <Typography variant="body2" fontWeight={600}>{d.pct}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={d.pct}
                  sx={{
                    height: 8, borderRadius: 10,
                    "& .MuiLinearProgress-bar": { backgroundColor: theme.palette.warning.main }
                  }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
