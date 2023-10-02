import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import VeterinariaDetalle from "../../veterinarias/VeterinariaDetalle";
import markerVetes from "../../../assets/images/marker/marker.png";
import { getVeterinarias } from "../../../services/api";
import axios from "axios";

const MapaVeterinaria = (props) => {
  const [veterinariasPositionStack, setVeterinariasPositionStack] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [veterinariasRegistradas, setVeterinariasRegistradas] = useState([]);
  const [mapCenter, setMapCenter] = useState([-31.41894, -64.19353]); // Define las coordenadas iniciales aquí
  const mapRef = useRef(null);
  const positionStackAPIKey = "63e57ac880f8901361290e0566840383"; // Reemplaza con tu clave de API de PositionStack

  useEffect(() => {
    cargarVeterinariasRegistradas(); // Carga las veterinarias registradas una vez al principio
  }, []);

  // Función para cargar las veterinarias proporcionadas por PositionStack cercanas a las coordenadas dadas
  const cargarVeterinariasPositionStack = (coordenadas) => {
    const [lat, lng] = coordenadas;
    axios
      .get("https://api.positionstack.com/v1/reverse", {
        params: {
          access_key: positionStackAPIKey,
          query: `${lat},${lng}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setVeterinariasPositionStack(data);
      })
      .catch((error) => {
        console.error(
          "Error al obtener las veterinarias de PositionStack:",
          error
        );
      });
  };

  const cargarVeterinariasRegistradas = () => {
    // Utiliza la función getVeterinarias para obtener las veterinarias registradas
    getVeterinarias()
      .then((data) => {
        // Agregar la propiedad "fuente" para distinguir la fuente del marcador
        const veterinariasRegistradas = data.map((veterinaria) => ({
          ...veterinaria,
          fuente: "registrada",
        }));
        setVeterinariasRegistradas(veterinariasRegistradas);
      })
      .catch((error) => {
        console.error(
          "Error al obtener las veterinarias registradas:",
          error
        );
      });
  };

  // Maneja el evento de movimiento del mapa
  const handleMapMove = (e) => {
    // Actualiza las coordenadas actuales del mapa cuando se mueve
    setMapCenter(e.target.getCenter());

    // Llama a la función para cargar las veterinarias proporcionadas por PositionStack
    cargarVeterinariasPositionStack(e.target.getCenter());
  };

  const handleMarkerClick = (veterinaria) => {
    // Llama a la función proporcionada por las props para mostrar los detalles
    if (props.onMarkerClick) {
      props.onMarkerClick(veterinaria);
    }
  };

  return (
    <div>
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ width: "100%", height: "500px" }}
        ref={mapRef}
        onMoveend={handleMapMove} // Maneja el evento de movimiento del mapa
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Renderiza los marcadores en el mapa */}
        {/* Veterinarias proporcionadas por PositionStack */}
        {veterinariasPositionStack.map((veterinaria) => (
          <Marker
            key={veterinaria.id}
            position={[
              parseFloat(veterinaria.latitude),
              parseFloat(veterinaria.longitude),
            ]}
          />
        ))}

        {/* Veterinarias registradas */}
        {veterinariasRegistradas.map((veterinaria) => (
          <Marker
            key={veterinaria.id}
            position={[
              parseFloat(veterinaria.latitud),
              parseFloat(veterinaria.longitud),
            ]}
            icon={L.icon({
              iconUrl: markerVetes,
              iconSize: [80, 80],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(veterinaria),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaVeterinaria;
