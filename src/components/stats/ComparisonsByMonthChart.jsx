import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { getComparisonsByMonth } from "../../api/statsApi";

export default function ComparisonsByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getComparisonsByMonth(months).then(setRows).catch(e => setErr(e.message)); }, [months]);

  const byMonth = useMemo(() => {
    const map = {};
    rows.forEach(r => {
      const key = new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".","");
      map[key] ??= { month: key };
      const k = (r.resultado || "indeterminado").toLowerCase();
      map[key][k] = (map[key][k] ?? 0) + r.comparaciones;
    });
    return Object.values(map);
  }, [rows]);

  const series = useMemo(() => {
    const s = new Set();
    byMonth.forEach(d => Object.keys(d).forEach(k => k!=="month" && s.add(k)));
    return Array.from(s);
  }, [byMonth]);

  const color = (name) => {
    if (/coincide/i.test(name)) return theme.palette.success.main;
    if (/no coincide/i.test(name)) return theme.palette.error.main;
    return theme.palette.info.main;
  };

  if (err) return <Card><CardHeader title="Comparaciones IA por mes"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  return (
    <Card>
      <CardHeader title="Comparaciones IA por mes" subheader="Cantidad por resultado"/>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={byMonth} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3"/>
            <XAxis dataKey="month" tickMargin={8}/>
            <YAxis allowDecimals={false}/>
            <Tooltip contentStyle={{ borderRadius: 10, borderColor: theme.palette.divider }}/>
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }}/>
            {series.map(s =>
              <Line key={s} type="monotone" dataKey={s} name={s[0].toUpperCase()+s.slice(1)}
                    stroke={color(s)} strokeWidth={2.5} dot={{ r: 3 }}/>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
