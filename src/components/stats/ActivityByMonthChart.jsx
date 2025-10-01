import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell
} from "recharts";
import { motion } from "framer-motion";
import { getActivityByMonth } from "../../api/statsApi";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

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
              {entry.name}: <strong>{entry.name.includes('Tasa') ? `${entry.value}%` : entry.value}</strong>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

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

<<<<<<< HEAD
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
=======
  const totalActivos = data.reduce((sum, item) => sum + item.activos, 0);
  const totalInactivos = data.reduce((sum, item) => sum + item.inactivos, 0);
  const promedioTasa = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.tasa, 0) / data.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
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
                Actividad de Usuarios
              </Typography>
              <Chip 
                icon={<PeopleRoundedIcon />}
                label={`Promedio: ${promedioTasa}%`}
                size="small"
                sx={{ 
                  background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Usuarios activos vs inactivos • Tasa de actividad promedio
            </Typography>
          }
        />
        <CardContent sx={{ pt: 2, pb: 3 }}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 30, right: 50, left: 40, bottom: 30 }}>
              <defs>
                <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#2E7D32" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#1B5E20" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="gInact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BDBDBD" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#9E9E9E" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#757575" stopOpacity="0.6"/>
                </linearGradient>
              </defs>

              <CartesianGrid 
                stroke={theme.palette.divider} 
                strokeDasharray="3 3"
                strokeOpacity={0.2}
              />
              <XAxis 
                dataKey="month" 
                tickMargin={16}
                tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                yAxisId="left" 
                allowDecimals={false}
                tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.divider }}
                tickMargin={8}
                label={{ 
                  value: "Usuarios", 
                  angle: -90, 
                  position: "insideLeft", 
                  style: { textAnchor: 'middle', fontSize: 12, fontWeight: 600 } 
                }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0,100]} 
                tickFormatter={(v)=>`${v}%`}
                tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.divider }}
                tickMargin={8}
                label={{ 
                  value: "Tasa (%)", 
                  angle: -90, 
                  position: "insideRight", 
                  style: { textAnchor: 'middle', fontSize: 12, fontWeight: 600 } 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                wrapperStyle={{ paddingBottom: 20 }}
                iconType="circle"
              />

              {/* Barras apiladas */}
              <Bar yAxisId="left" dataKey="inactivos" name="No activos" stackId="u" fill="url(#gInact)" radius={[8, 8, 0, 0]} maxBarSize={70}>
                {data.map((entry, index) => (
                  <Cell key={`inactivos-${index}`} fill="url(#gInact)" />
                ))}
              </Bar>
              <Bar yAxisId="left" dataKey="activos" name="Activos" stackId="u" fill="url(#gAct)" radius={[8, 8, 0, 0]} maxBarSize={70}>
                {data.map((entry, index) => (
                  <Cell key={`activos-${index}`} fill="url(#gAct)" />
                ))}
              </Bar>

              {/* Línea de tasa */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="tasa" 
                name="Tasa de actividad (%)"
                stroke="#039BE5" 
                strokeWidth={4} 
                dot={{ r: 5, fill: "#039BE5", strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: "#039BE5" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
>>>>>>> 28-09-Correcciones
  );
}
