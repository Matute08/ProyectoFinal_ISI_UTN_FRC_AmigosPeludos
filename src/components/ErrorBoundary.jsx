import React from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Error404 from './Error404';
import { Box, Alert, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorBoundary = ({ 
  children, 
  context = 'componente',
  showError404 = true,
  fallback = null 
}) => {
  const { error, handleError, clearError, isError404 } = useErrorHandler();

  // Si hay un error 404 y queremos mostrar la vista de Error404
  if (isError404 && showError404) {
    return (
      <Error404 
        title="Recurso no encontrado"
        message="El elemento que estás buscando no existe o ha sido eliminado."
        customMessage={`No se pudo encontrar la información solicitada en ${context}.`}
      />
    );
  }

  // Si hay un error pero no es 404, mostrar alerta de error
  if (error && !isError404) {
    return (
      <Box p={3} textAlign="center">
        <Alert 
          severity="error" 
          sx={{ mb: 2, textAlign: 'left' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={clearError}
              startIcon={<RefreshIcon />}
            >
              Reintentar
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            {error.message}
          </Typography>
          <Typography variant="body2">
            {error.details}
          </Typography>
        </Alert>
        
        <Button 
          variant="contained" 
          onClick={clearError}
          sx={{ mt: 2 }}
        >
          Intentar nuevamente
        </Button>
      </Box>
    );
  }

  // Si no hay error, renderizar children normalmente
  return children;
};

export default ErrorBoundary;
