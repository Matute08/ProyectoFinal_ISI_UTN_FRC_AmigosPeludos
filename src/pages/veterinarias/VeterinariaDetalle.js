import React from "react";

const VeterinariaDetalle = ({ veterinaria, onClose }) => {
  if (!veterinaria) {
    return null;
  }

  return (
    <div className="veterinaria-detail">
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <h3>{veterinaria.name}</h3>
      <p>Dirección: {veterinaria.vicinity}</p>
      <p>Valoración: {veterinaria.rating}</p>
      {/* Agrega más detalles de la veterinaria aquí */}
    </div>
  );
};

export default VeterinariaDetalle;
