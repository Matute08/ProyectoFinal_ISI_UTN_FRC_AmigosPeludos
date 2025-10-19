import { useEffect, useMemo, useState } from "react";
import {
  Card, CardHeader, CardContent, Stack, ToggleButton, ToggleButtonGroup, Box, Typography, Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from "recharts";
import { motion } from "framer-motion";
import { getPublicationsByMonth } from "../../api/statsApi";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const fmtMonth = (d) => {
  const date = new Date(d);
  // Asegurar que usamos UTC para evitar problemas de zona horaria
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                     'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  return `${monthNames[month]} ${year.toString().slice(-2)}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          minWidth: 200
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: entry.color
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: <strong>{entry.value}</strong>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

export default function PublisByMonthChart({ months = 13 }) {
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
    return idx % 2 === 0 ? lbl : "";
  };

  const empty = data.length === 0 || data.every(d => !d.adopcion && !d.encontrada && !d.perdida);

  const totalAdopcion = data.reduce((sum, item) => sum + item.adopcion, 0);
  const totalEncontrada = data.reduce((sum, item) => sum + item.encontrada, 0);
  const totalPerdida = data.reduce((sum, item) => sum + item.perdida, 0);
  const totalPublicaciones = totalAdopcion + totalEncontrada + totalPerdida;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card 
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(244, 162, 97, 0.1)',
          overflow: 'hidden'
        }}
      >
        <CardHeader 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.05) 0%, rgba(231, 111, 81, 0.05) 100%)',
            pb: 1
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Publicaciones por Tipo
              </Typography>
              <Chip 
                icon={<ArticleRoundedIcon />}
                label={`Total: ${totalPublicaciones}`}
                size="small"
                sx={{ 
                  background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {mode === "bars" ? "Distribución mensual por categorías" : "Tendencia temporal de publicaciones"}
            </Typography>
          }
          action={
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={displayMode}
                onChange={(_, v) => v && setDisplayMode(v)}
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    border: '1px solid rgba(244, 162, 97, 0.3)',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E76F51 0%, #D2691E 100%)',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="auto">
                  <AutoGraphRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Auto
                </ToggleButton>
                <ToggleButton value="bars">
                  <BarChartRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Barras
                </ToggleButton>
                <ToggleButton value="lines">
                  <AutoGraphRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Líneas
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          }
        />
        <CardContent sx={{ pt: 2, pb: 3 }}>
          {empty ? (
            <Box sx={{ 
              padding: 4, 
              textAlign: 'center',
              opacity: 0.7,
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.05) 0%, rgba(231, 111, 81, 0.05) 100%)',
              borderRadius: 2,
              border: '2px dashed rgba(244, 162, 97, 0.3)'
            }}>
              <ArticleRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Sin publicaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay publicaciones en el período seleccionado
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              {mode === "bars" ? (
                <BarChart
                  data={data}
                  margin={{ top: 30, right: 40, left: 30, bottom: 40 }}
                  barCategoryGap="25%"
                  barGap={12}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="label"
                    tickMargin={16}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tickFormatter={tickFmt}
                    tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                    tickLine={{ stroke: theme.palette.divider }}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    wrapperStyle={{ paddingBottom: 20 }}
                    iconType="circle"
                  />
                  <Bar dataKey="adopcion" name="Adopción" fill="#FF9800" radius={[6, 6, 0, 0]} barSize={25}>
                    {data.map((entry, index) => (
                      <Cell key={`adopcion-${index}`} fill="#FF9800" />
                    ))}
                  </Bar>
                  <Bar dataKey="encontrada" name="Encontrada" fill="#2E7D32" radius={[6, 6, 0, 0]} barSize={25}>
                    {data.map((entry, index) => (
                      <Cell key={`encontrada-${index}`} fill="#2E7D32" />
                    ))}
                  </Bar>
                  <Bar dataKey="perdida" name="Perdida" fill="#E53935" radius={[6, 6, 0, 0]} barSize={25}>
                    {data.map((entry, index) => (
                      <Cell key={`perdida-${index}`} fill="#E53935" />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 30, right: 40, left: 30, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="label"
                    tickMargin={16}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tickFormatter={tickFmt}
                    tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                    tickLine={{ stroke: theme.palette.divider }}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    wrapperStyle={{ paddingBottom: 20 }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="adopcion" 
                    name="Adopción" 
                    stroke="#FF9800" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: "#FF9800", strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: "#FF9800" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="encontrada" 
                    name="Encontrada" 
                    stroke="#2E7D32" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: "#2E7D32", strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: "#2E7D32" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="perdida" 
                    name="Perdida" 
                    stroke="#E53935" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: "#E53935", strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: "#E53935" }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
