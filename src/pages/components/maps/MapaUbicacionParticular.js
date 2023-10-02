import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ onMapClick, direccion, altura, ciudad, pais, barrio, onLocationChange }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([-31.41894, -64.19353]);
  const arcgisGeocodeUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

  useEffect(() => {
    if (direccion && altura && ciudad && pais && barrio) {
      geocodeAddress();
    }
  }, [direccion, altura, ciudad, pais, barrio]);

  const geocodeAddress = async () => {
    try {
      const address = `${direccion}, ${altura}, ${barrio}, ${ciudad}, ${pais}`;
      const response = await fetch(
        `${arcgisGeocodeUrl}?outSr=4326&forStorage=false&outFields=*&maxLocations=1&singleLine=${encodeURIComponent(
          address
        )}&f=json`
      );
      const data = await response.json();

      if (data.candidates.length > 0) {
        const firstCandidate = data.candidates[0];
        const lat = firstCandidate.location.y;
        const lon = firstCandidate.location.x;

        setMapCenter([lat, lon]);
        setMarkerPosition([lat, lon]);

        // Llama a la función onLocationChange para pasar las coordenadas al componente padre
        onLocationChange({ lat, lon });
      } else {
        console.error("No se pudo geocodificar la dirección.");
      }
    } catch (error) {
      console.error("Error al geocodificar la dirección:", error);
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    onMapClick(lat, lng); // Llama a la función onMapClick para pasar latitud y longitud
  };

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ width: "100%", height: "400px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={handleMapClick} />

      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>Latitud: {markerPosition[0]}, Longitud: {markerPosition[1]}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });

  return null;
};

export default Map;
