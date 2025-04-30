import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import markerVetes from '../../../assets/images/marker/marker.png'; // Asegúrate que la ruta sea correcta

// Configuración del icono personalizado
const vetIcon = L.icon({
    iconUrl: markerVetes,
    iconSize: [50, 50], // Tamaño ajustado (era 80x80, puede ser muy grande)
    iconAnchor: [25, 50], // Punto del icono que corresponde a la coordenada (centro inferior)
    popupAnchor: [0, -50], // Punto donde se abrirá el popup relativo al anchor
});

// Componente para centrar mapa en marcador seleccionado
const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom()); // Usa zoom si se pasa, o el actual
        }
    }, [center, zoom, map]);
    return null;
};

const MapaVeterinaria = ({ veterinariasRegistradas = [], onMarkerClick, selectedVeterinaria }) => {
    const mapRef = useRef(null);
    const defaultCenter = [-31.417, -64.183]; // Centro inicial (Córdoba)
    const defaultZoom = 13;
    

    // Calcular centro y zoom basado en la selección
    const getMapCenter = () => {
        if (selectedVeterinaria?.latitud && selectedVeterinaria?.longitud) {
             const lat = parseFloat(selectedVeterinaria.latitud);
             const lng = parseFloat(selectedVeterinaria.longitud);
             if (!isNaN(lat) && !isNaN(lng)) {
                 return [lat, lng];
             }
        }
        return defaultCenter;
    };

    const getMapZoom = () => {
         return selectedVeterinaria ? 16 : defaultZoom; // Más zoom si hay selección
    };


    return (
        <MapContainer
            center={defaultCenter} // Centro inicial
            zoom={defaultZoom}
            style={{ width: '100%', height: '600px' }} // Ocupar todo el contenedor padre
            ref={mapRef}
            scrollWheelZoom={true} // Permitir zoom con rueda del mouse
        >
            <ChangeMapView center={getMapCenter()} zoom={getMapZoom()} />

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marcadores para veterinarias registradas */}
            {veterinariasRegistradas.map((veterinaria) => {
                const lat = parseFloat(veterinaria.latitud);
                const lng = parseFloat(veterinaria.longitud);

                // Validar coordenadas antes de renderizar
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn(`Coordenadas inválidas para veterinaria ID: ${veterinaria.id}, Nombre: ${veterinaria.nombre}`);
                    return null;
                }

                return (
                    <Marker
                        key={veterinaria.id}
                        position={[lat, lng]}
                        icon={vetIcon} // Usar el icono personalizado
                        eventHandlers={{
                            click: () => {
                                console.log("Marker clicked:", veterinaria.nombre); // Log para depuración
                                onMarkerClick(veterinaria); // Llama al callback del padre
                            },
                        }}
                    >
                        {/* Popup opcional al hacer clic (se puede quitar si usas VeterinariaDetalle) */}
                        <Popup>
                            <strong>{veterinaria.nombre}</strong><br />
                            {veterinaria.direccion} {veterinaria.numeroCalle}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapaVeterinaria;