import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { getActivityByMonth } from "../../api/statsApi";

export default function ActivityByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => { getActivityByMonth(months).then(setRows).catch(() => {}); }, [months]);

  const data = useMemo(() => rows.map(r => {
    const usuariosActivos = r.usuariosActivos ?? r.UsuariosActivos ?? 0;
    const usuariosTotales = r.usuariosTotales ?? r.UsuariosTotales ?? 0;
    const inactivos = Math.max(usuariosTotales - usuariosActivos, 0);
    const tasa = r.tasaActivosPct ?? r.TasaActivosPct ?? 0;
    return {
      month: new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".",""),
      activos: usuariosActivos,
      inactivos,
      tasa
    };
  }), [rows]);

  return (
    <Card>
      <CardHeader title="Actividad mensual" subheader="Activos vs. no activos (barras) y tasa de actividad (línea)" />
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.palette.success.main} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity="0.5"/>
              </linearGradient>
              <linearGradient id="gInact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.palette.grey[400]} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={theme.palette.grey[400]} stopOpacity="0.4"/>
              </linearGradient>
            </defs>

            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
            <XAxis dataKey="month" tickMargin={8}/>
            <YAxis yAxisId="left" allowDecimals={false} label={{ value: "Usuarios", angle: -90, position: "insideLeft" }}/>
            <YAxis yAxisId="right" orientation="right" domain={[0,100]} tickFormatter={(v)=>`${v}%`}
                   label={{ value: "Tasa (%)", angle: -90, position: "insideRight" }}/>
            <Tooltip
              formatter={(v,n) => {
                if (n === "Tasa de actividad (%)") return [`${v}%`, n];
                return [v, n];
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />

            {/* Barras apiladas = usuarios totales (activos + inactivos) */}
            <Bar yAxisId="left" dataKey="inactivos" name="No activos" stackId="u" fill="url(#gInact)" radius={[8,8,0,0]} maxBarSize={50}/>
            <Bar yAxisId="left" dataKey="activos"   name="Activos"    stackId="u" fill="url(#gAct)"   radius={[8,8,0,0]} maxBarSize={50}/>

            {/* Línea: tasa sobre total */}
            <Line yAxisId="right" type="monotone" dataKey="tasa" name="Tasa de actividad (%)"
                  stroke={theme.palette.info.main} strokeWidth={2} dot={{ r: 3 }}/>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
