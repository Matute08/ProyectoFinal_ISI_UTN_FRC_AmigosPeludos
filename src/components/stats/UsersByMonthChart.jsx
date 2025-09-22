import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getUsersByMonth } from "../../api/statsApi";

export default function UsersByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => { getUsersByMonth(months).then(setRows).catch(() => {}); }, [months]);

  const data = useMemo(() => rows.map(r => ({
    month: new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".",""),
    usuarios: r.usuarios ?? r.Usuarios ?? 0
  })), [rows]);

  return (
    <Card>
      <CardHeader title="Altas de usuarios por mes" subheader="Nuevos usuarios registrados" />
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.palette.warning.main} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={theme.palette.warning.main} stopOpacity="0.5"/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
            <XAxis dataKey="month" tickMargin={8} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v) => [`${v}`, "Usuarios"]} />
            <Bar dataKey="usuarios" name="Usuarios" fill="url(#gUsers)" radius={[8,8,0,0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
