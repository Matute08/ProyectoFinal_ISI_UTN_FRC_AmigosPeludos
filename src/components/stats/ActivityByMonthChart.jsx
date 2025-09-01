import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { getActivityByMonth } from "../../api/statsApi";

export default function ActivityByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getActivityByMonth(months).then(setRows).catch(e => setErr(e.message)); }, [months]);

  const data = useMemo(() => rows.map(r => ({
    month: new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".",""),
    activos: r.usuariosActivos,
    tasa: r.tasaActivosPct
  })), [rows]);

  if (err) return <Card><CardHeader title="Actividad mensual"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  return (
    <Card>
      <CardHeader title="Actividad mensual" subheader="% de usuarios activos sobre acumulados"/>
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
  <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
    <defs>
      <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity="0.5"/>
      </linearGradient>
      <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.palette.info.main} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={theme.palette.info.main} stopOpacity="0.05"/>
      </linearGradient>
    </defs>

    <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
    <XAxis dataKey="month" tickMargin={8}/>
    <YAxis yAxisId="left" allowDecimals={false}/>
    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
    <Tooltip
      contentStyle={{ borderRadius: 10, borderColor: theme.palette.divider }}
      formatter={(v, n) => n.includes("%") ? [`${v}%`, n] : [v, n]}
    />
    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }}/>

    {/* Barras de activos */}
    <Bar yAxisId="left" dataKey="activos" name="Activos" fill="url(#gBar)" radius={[8,8,0,0]} maxBarSize={40}/>

    {/* SOLO un Area para % Activos (con stroke para marcar la línea) */}
    <Area
      yAxisId="right" type="monotone" dataKey="tasa" name="% Activos"
      stroke={theme.palette.info.main} strokeWidth={2}
      fill="url(#gArea)" dot={{ r: 3 }}
    />
  </ComposedChart>
</ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
