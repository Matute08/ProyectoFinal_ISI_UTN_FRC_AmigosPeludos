import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { getUsersByMonth } from "../../api/statsApi";

export default function UsersByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getUsersByMonth(months).then(setRows).catch(e => setErr(e.message)); }, [months]);

  const data = useMemo(() => rows.map(r => ({
    month: new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".",""),
    usuarios: r.usuarios,
    mail: r.mailVerificado,
    cuenta: r.cuentaVerificada
  })), [rows]);

  if (err) return <Card><CardHeader title="Altas de usuarios por mes"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  // Gradientes lindos
  const defs = (
    <defs>
      <linearGradient id="gUsuarios" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity="0.5"/>
      </linearGradient>
      <linearGradient id="gMail" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.palette.info.main} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={theme.palette.info.main} stopOpacity="0.5"/>
      </linearGradient>
      <linearGradient id="gCuenta" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.palette.success.main} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity="0.5"/>
      </linearGradient>
    </defs>
  );

  return (
    <Card>
      <CardHeader title="Altas de usuarios por mes" subheader="Incluye verificación de mail y de cuenta"/>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            {defs}
            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
            <XAxis dataKey="month" tickMargin={8}/>
            <YAxis allowDecimals={false}/>
            <Tooltip contentStyle={{ borderRadius: 10, borderColor: theme.palette.divider }}/>
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }}/>
            <Bar dataKey="usuarios" name="Usuarios" fill="url(#gUsuarios)" radius={[8,8,0,0]} maxBarSize={44}/>
            <Bar dataKey="mail" name="Mail verificado" fill="url(#gMail)" radius={[8,8,0,0]} maxBarSize={44}/>
            <Bar dataKey="cuenta" name="Cuenta verificada" fill="url(#gCuenta)" radius={[8,8,0,0]} maxBarSize={44}/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
