import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    cambiarEstadoPublicacion,
    getEstadosPublicacion,
    getEstadisticasLanding,
    getEstadisticasPublicacionesFinalizadas
} from '../api/publicacionesApi';

const TestIntegracion = () => {
    const [resultados, setResultados] = useState({});
    const [cargando, setCargando] = useState({});

    const ejecutarTest = async (nombreTest, funcion) => {
        setCargando(prev => ({ ...prev, [nombreTest]: true }));
        try {
            const resultado = await funcion();
            setResultados(prev => ({ ...prev, [nombreTest]: { exito: true, datos: resultado } }));
        } catch (error) {
            setResultados(prev => ({ ...prev, [nombreTest]: { exito: false, error: error.message } }));
        } finally {
            setCargando(prev => ({ ...prev, [nombreTest]: false }));
        }
    };

    const tests = [
        {
            nombre: 'Estados Publicación',
            funcion: getEstadosPublicacion,
            descripcion: 'Obtener estados disponibles'
        },
        {
            nombre: 'Estadísticas Landing',
            funcion: getEstadisticasLanding,
            descripcion: 'Obtener estadísticas para landing page'
        },
        {
            nombre: 'Estadísticas Admin',
            funcion: () => getEstadisticasPublicacionesFinalizadas(6),
            descripcion: 'Obtener estadísticas de admin (6 meses)'
        }
    ];

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                🧪 Test de Integración con Backend
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Prueba las nuevas APIs implementadas en el backend
            </Typography>

            {tests.map((test) => (
                <Card key={test.nombre} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography variant="h6">{test.nombre}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {test.descripcion}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                onClick={() => ejecutarTest(test.nombre, test.funcion)}
                                disabled={cargando[test.nombre]}
                                startIcon={cargando[test.nombre] ? <CircularProgress size={20} /> : null}
                            >
                                {cargando[test.nombre] ? 'Probando...' : 'Probar'}
                            </Button>
                        </Box>

                        {resultados[test.nombre] && (
                            <Alert 
                                severity={resultados[test.nombre].exito ? 'success' : 'error'}
                                sx={{ mt: 1 }}
                            >
                                {resultados[test.nombre].exito ? (
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            ✅ Prueba exitosa
                                        </Typography>
                                        <Typography variant="caption" component="pre" sx={{ 
                                            backgroundColor: 'rgba(0,0,0,0.1)', 
                                            p: 1, 
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            overflow: 'auto',
                                            maxHeight: 200
                                        }}>
                                            {JSON.stringify(resultados[test.nombre].datos, null, 2)}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2">
                                        ❌ Error: {resultados[test.nombre].error}
                                    </Typography>
                                )}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            ))}

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        📝 Notas Importantes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Estas pruebas verifican la conectividad con el backend<br/>
                        • Si alguna prueba falla, revisa que el backend esté funcionando<br/>
                        • Los datos mostrados son reales del sistema<br/>
                        • Para probar el cambio de estado, usa la funcionalidad en el perfil
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TestIntegracion;
