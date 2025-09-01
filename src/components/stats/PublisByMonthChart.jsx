import { useEffect, useMemo, useState } from "react";
import { LabelList } from "recharts";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { getPublicationsByMonth } from "../../api/statsApi";
export default function PublisByMonthChart({ months = 12, stacked = false }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicationsByMonth(months).then(setRows).catch(e => setError(e.message));
  }, [months]);

  const fmtMonth = (iso) => {
    const d = new Date(iso);
    return isNaN(+d)
      ? iso
      : d.toLocaleDateString("es-AR", { month: "short", year: "numeric" }).replace(".", "");
  };

  // Pivot por mes -> tipo
  const data = useMemo(() => {
    const map = {};
    rows.forEach(r => {
      const key = new Date(r.mes).toISOString().slice(0, 7); // YYYY-MM
      map[key] ??= { month: key };
      const tipo = r.tipoPublicacion || "Sin tipo";
      map[key][tipo] = (map[key][tipo] ?? 0) + r.publicaciones;
    });
    return Object.values(map);
  }, [rows]);

  // Series dinámicas
  const series = useMemo(() => {
    const s = new Set();
    data.forEach(d => Object.keys(d).forEach(k => k !== "month" && s.add(k)));
    return Array.from(s);
  }, [data]);

  // Paleta linda basada en MUI (cubre más de 6 series si aparecen)
  const palette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.grey[600],
  ];
  const colorFor = (name, i) => {
    // Matcheos “semánticos” comunes
    if (/adop/i.test(name)) return theme.palette.primary.main;
    if (/encontr/i.test(name)) return theme.palette.success.main;
    if (/perd/i.test(name)) return theme.palette.error.main;
    return palette[i % palette.length];
  };

  if (error) {
    return (
      <Card>
        <CardHeader title="Publicaciones por tipo y mes" />
        <CardContent><Typography color="error">Error: {error}</Typography></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Publicaciones por tipo y mes"
        subheader={stacked ? "Barras apiladas" : "Barras agrupadas"}
      />
      <CardContent>
        {!rows.length ? (
          <Typography variant="body2">Cargando…</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
              barCategoryGap={stacked ? 24 : 20}
              barGap={stacked ? 2 : 8}
            >
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={fmtMonth}
                tickMargin={8}
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(v, n) => [v, n]}
                labelFormatter={(l) => fmtMonth(`${l}-01`)}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: theme.palette.divider,
                }}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 12 }} />
              {series.map((name, i) => (
                <Bar
                  key={name}
                  dataKey={name}
                  stackId={stacked ? "a" : undefined}
                  fill={colorFor(name, i)}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}                  
                />
                
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
