import React, { useState,useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconUrl,
  iconUrl: iconUrl,
  shadowUrl: iconShadowUrl,
});

const Maps = ({ onMapClick,latitud,longitud, isClickable }) => {
 // const position = [-31.41893867682779, -64.19764557713724];
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [position, setPosition] = useState([-31.41893867682779, -64.19764557713724]);


  useEffect(() => {
    if ( latitud && longitud && !isClickable) {
      setMarkerPosition([latitud, longitud]);
      setPosition([latitud,longitud])
      setZoom(16)
    }
  }, [isClickable, latitud, longitud]);

  const handleMapClick = (e) => {
    if (!isClickable) {
      //setMarkerPosition([latitud, longitud]);
      //onMapClick(latitud, longitud);
      return;
    }
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    onMapClick(lat, lng);
  };

  return (
    <MapContainer center={position} zoom={zoom} className="mapa-leaflet " >
      <TileLayer
        attribution='&amp;copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>Latitud: {markerPosition[0]}, Longitud: {markerPosition[1]}</Popup>
        </Marker>
      )}

      <MapClickHandler onMapClick={handleMapClick} />
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

export default Maps;
