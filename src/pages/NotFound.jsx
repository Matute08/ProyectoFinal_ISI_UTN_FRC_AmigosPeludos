import React from 'react';
import Error404 from '../components/Error404';

const NotFound = () => {
  return (
    <Error404 
      title="Página no encontrada"
      message="La página que estás buscando no existe o ha sido movida."
      customMessage="La URL ingresada no corresponde a ninguna página de Amigos Peludos."
      showBackButton={true}
      showHomeButton={true}
    />
  );
};

export default NotFound;
