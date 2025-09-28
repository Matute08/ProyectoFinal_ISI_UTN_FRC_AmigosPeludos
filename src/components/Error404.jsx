import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Error404 = ({ 
  title = "Página no encontrada", 
  message = "La página que estás buscando no existe o ha sido movida.",
  showBackButton = true,
  showHomeButton = true,
  customMessage = null 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
        py={4}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: '2px solid #e0e0e0'
          }}
        >
          {/* Icono de error */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
            }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '3rem'
              }}
            >
              404
            </Typography>
          </Box>

          {/* Título */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 2
            }}
          >
            {title}
          </Typography>

          {/* Mensaje */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            {customMessage || message}
          </Typography>

          {/* Botones de acción */}
          <Box 
            display="flex" 
            gap={2} 
            justifyContent="center" 
            flexWrap="wrap"
          >
            {showBackButton && (
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{
                  borderColor: '#3498db',
                  color: '#3498db',
                  '&:hover': {
                    borderColor: '#2980b9',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)'
                  }
                }}
              >
                Volver atrás
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  backgroundColor: '#2ecc71',
                  '&:hover': {
                    backgroundColor: '#27ae60'
                  }
                }}
              >
                Ir al inicio
              </Button>
            )}
          </Box>

          {/* Información adicional */}
          <Box mt={4} pt={3} borderTop="1px solid #e0e0e0">
            <Typography variant="caption" color="text.secondary">
              Si crees que esto es un error, contacta al soporte técnico
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Error404;
