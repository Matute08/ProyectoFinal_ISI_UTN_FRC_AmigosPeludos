import { useEffect, useMemo, useState } from "react";
import {
  Card, CardHeader, CardContent, Stack, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { getPublicationsByMonth } from "../../api/statsApi";

const fmtMonth = (d) =>
  new Date(d).toLocaleDateString("es-AR", { month: "short", year: "2-digit" }).replace(".", "");

export default function PublisByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  // displayMode: 'auto' | 'bars' | 'lines'
  const [displayMode, setDisplayMode] = useState("auto");

  useEffect(() => { getPublicationsByMonth(months).then(setRows).catch(() => {}); }, [months]);

  const data = useMemo(() => rows.map((r, i) => ({
    i,
    label: fmtMonth(r.mes),
    adopcion:   r.adopcion   ?? r.Adopcion   ?? 0,
    encontrada: r.encontrada ?? r.Encontrada ?? 0,
    perdida:    r.perdida    ?? r.Perdida    ?? 0,
  })), [rows]);

  // Auto: si hay muchos meses, usamos líneas por defecto
  const mode = useMemo(() => {
    if (displayMode !== "auto") return displayMode;
    return data.length > 18 ? "lines" : "bars";
  }, [displayMode, data.length]);

  // mostrar tick cada 2 meses para evitar ruido
  const indexByLabel = useMemo(() => {
    const m = new Map();
    data.forEach((d, i) => m.set(d.label, i));
    return m;
  }, [data]);

  const tickFmt = (lbl) => {
    const idx = indexByLabel.get(lbl) ?? 0;
    // mostrás 1 de cada 2; si te parece, cambialo a 3
    return idx % 2 === 0 ? lbl : "";
  };

  const empty = data.length === 0 || data.every(d => !d.adopcion && !d.encontrada && !d.perdida);

  return (
    <Card>
      <CardHeader
        title="Publicaciones por tipo y mes"
        subheader={mode === "bars" ? "Barras agrupadas" : "Serie temporal"}
        action={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={displayMode}
              onChange={(_, v) => v && setDisplayMode(v)}
            >
              <ToggleButton value="auto">Auto</ToggleButton>
              <ToggleButton value="bars">Barras</ToggleButton>
              <ToggleButton value="lines">Líneas</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />
      <CardContent>
        {empty ? (
          <div style={{ padding: 12, opacity: 0.7 }}>
            No hay publicaciones en el período seleccionado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            {mode === "bars" ? (
              <BarChart
                data={data}
                margin={{ top: 10, right: 8, left: 0, bottom: 28 }}
                barCategoryGap="28%"
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickMargin={10}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={tickFmt}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
                <Bar dataKey="adopcion"   name="Adopción"   fill={theme.palette.warning.main} radius={[6,6,0,0]} barSize={12} />
                <Bar dataKey="encontrada" name="Encontrada" fill={theme.palette.success.main} radius={[6,6,0,0]} barSize={12} />
                <Bar dataKey="perdida"    name="Perdida"    fill={theme.palette.error.main}   radius={[6,6,0,0]} barSize={12} />
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{ top: 10, right: 8, left: 0, bottom: 28 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickMargin={10}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={tickFmt}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
                <Line type="monotone" dataKey="adopcion"   name="Adopción"   stroke={theme.palette.warning.main} strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="encontrada" name="Encontrada" stroke={theme.palette.success.main} strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="perdida"    name="Perdida"    stroke={theme.palette.error.main}   strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
