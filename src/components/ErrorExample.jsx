import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorBoundary from './ErrorBoundary';

// Componente de ejemplo que simula diferentes tipos de errores
const ErrorExample = () => {
  const { handleError, clearError, error } = useErrorHandler();

  const simularError404 = () => {
    const error404 = {
      response: { status: 404, data: { message: 'Recurso no encontrado' } }
    };
    handleError(error404, 'ejemplo de componente');
  };

  const simularError500 = () => {
    const error500 = {
      response: { status: 500, data: { message: 'Error interno del servidor' } }
    };
    handleError(error500, 'ejemplo de componente');
  };

  const simularErrorRed = () => {
    const errorRed = {
      message: 'Network Error'
    };
    handleError(errorRed, 'ejemplo de componente');
  };

  const simularErrorFirebase = () => {
    const errorFirebase = {
      code: 'auth/user-not-found',
      message: 'No existe una cuenta con este correo electrónico'
    };
    handleError(errorFirebase, 'ejemplo de componente');
  };

  return (
    <ErrorBoundary context="ejemplo de errores">
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Ejemplo de Manejo de Errores
        </Typography>
        
        <Typography variant="body1" paragraph>
          Este componente demuestra cómo usar el nuevo sistema de manejo de errores global.
          Haz clic en los botones para simular diferentes tipos de errores:
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={simularError404}
          >
            Simular Error 404
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={simularError500}
          >
            Simular Error 500
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={simularErrorRed}
          >
            Simular Error de Red
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={simularErrorFirebase}
          >
            Simular Error Firebase
          </Button>
        </Box>

        {error && (
          <Box mt={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Error Actual:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Tipo:</strong> {error.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Mensaje:</strong> {error.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Detalles:</strong> {error.details}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Mostrar Error404:</strong> {error.showError404 ? 'Sí' : 'No'}
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={clearError}
              sx={{ mt: 2 }}
            >
              Limpiar Error
            </Button>
          </Box>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default ErrorExample;
