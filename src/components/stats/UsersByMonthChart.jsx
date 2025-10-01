import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import { getUsersByMonth } from "../../api/statsApi";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

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
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)'
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Usuarios: <strong>{payload[0].value}</strong>
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

export default function UsersByMonthChart({ months = 12 }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => { getUsersByMonth(months).then(setRows).catch(() => {}); }, [months]);

  const data = useMemo(() => rows.map(r => ({
    month: new Date(r.mes).toLocaleDateString("es-AR",{month:"short",year:"numeric"}).replace(".",""),
    usuarios: r.usuarios ?? r.Usuarios ?? 0
  })), [rows]);

  const totalUsers = data.reduce((sum, item) => sum + item.usuarios, 0);
  const averageUsers = data.length > 0 ? Math.round(totalUsers / data.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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
                Registro de Usuarios
              </Typography>
              <Chip 
                icon={<TrendingUpRoundedIcon />}
                label={`Total: ${totalUsers}`}
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
              Nuevos usuarios registrados por mes • Promedio: {averageUsers} usuarios/mes
            </Typography>
          }
        />
        <CardContent sx={{ pt: 2, pb: 3 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data} 
              margin={{ top: 30, right: 40, left: 30, bottom: 30 }}
            >
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F4A261" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#F4A261" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#E76F51" stopOpacity="0.6"/>
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
                allowDecimals={false}
                tick={{ fontSize: 13, fill: theme.palette.text.secondary, fontWeight: 500 }}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.divider }}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="usuarios" 
                name="Usuarios" 
                fill="url(#gUsers)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gUsers)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
