import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getEstadisticasPublicacionesFinalizadas } from '../../api/publicacionesApi';

const PublicacionesFinalizadasChart = ({ months = 13 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getEstadisticasPublicacionesFinalizadas(months);
        setData(result);
      } catch (err) {
        console.error('Error cargando estadísticas de publicaciones finalizadas:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [months]);

  const formatTooltip = (value, name) => {
    const labels = {
      finalizadas: 'Finalizadas',
      canceladas: 'Canceladas',
      total: 'Total'
    };
    return [value, labels[name] || name];
  };

  if (loading) {
    return (
      <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando estadísticas de publicaciones finalizadas...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Publicaciones Finalizadas por Mes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Evolución de publicaciones finalizadas y canceladas en los últimos {months} meses
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: '#333' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="finalizadas"
                stroke="#4caf50"
                strokeWidth={3}
                dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
                name="Finalizadas"
              />
              <Line
                type="monotone"
                dataKey="canceladas"
                stroke="#f44336"
                strokeWidth={3}
                dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f44336', strokeWidth: 2 }}
                name="Canceladas"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2196f3"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#2196f3', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#2196f3', strokeWidth: 2 }}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PublicacionesFinalizadasChart;
