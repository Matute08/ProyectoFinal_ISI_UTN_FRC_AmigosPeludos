import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "../assets/marker.png"

// Props:
// - markers: array de objetos { latitud, longitud, label, customIcon, ... }
// - customIcon: ruta a imagen del marker (opcional, si cada marker puede tener distinto icono, incluilo en el objeto marker)
// - onMarkerClick: función(markerObj) => void
// - center: array [lat, lon]
// - zoom: número (default 13)
// - seleccionable: bool (si se permite seleccionar posición haciendo click)
// - onMapClick: función({lat, lng}) para map click (solo si seleccionable)

const DefaultIcon = L.icon({
  iconUrl: marker, 
  iconSize: [38, 45],
  iconAnchor: [19, 44],
});

const Maps = ({
  markers = [],
  customIcon = null,
  onMarkerClick,
  center = [-31.4167, -64.1833], // Córdoba por defecto
  zoom = 13,
  seleccionable = false,
  onMapClick,
  markerSeleccionado = null, // para modo seleccionable (marcar una sola posición)
}) => {
  const mapRef = useRef();

  // Permitir seleccionar punto en el mapa, útil para modo edición/carga
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        if (seleccionable && onMapClick) {
          onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", minHeight: "60vh" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers múltiples */}
      {markers.map((marker, idx) => {
        if (
          marker.latitud === undefined ||
          marker.longitud === undefined ||
          isNaN(marker.latitud) ||
          isNaN(marker.longitud)
        )
          return null;
        const icon = marker.customIcon
          ? L.icon({ iconUrl: marker.customIcon, iconSize: [38, 45], iconAnchor: [19, 44] })
          : customIcon
          ? L.icon({ iconUrl: customIcon, iconSize: [38, 45], iconAnchor: [19, 44] })
          : DefaultIcon;
        return (
          <Marker
            key={marker.id || idx}
            position={[marker.latitud, marker.longitud]}
            icon={icon}
            eventHandlers={
              onMarkerClick
                ? { click: () => onMarkerClick(marker) }
                : undefined
            }
          >
            {marker.label && (
              <Popup>
                <strong>{marker.label}</strong>
                {marker.info && <div>{marker.info}</div>}
              </Popup>
            )}
          </Marker>
        );
      })}

      {/* Marker seleccionable (modo edición) */}
      {seleccionable && markerSeleccionado && markerSeleccionado.lat && markerSeleccionado.lng && (
        <Marker
          position={[markerSeleccionado.lat, markerSeleccionado.lng]}
          icon={customIcon ? L.icon({ iconUrl: customIcon, iconSize: [38, 45], iconAnchor: [19, 44] }) : DefaultIcon}
        />
      )}

      {seleccionable && <MapClickHandler />}
    </MapContainer>
  );
};

export default Maps;
