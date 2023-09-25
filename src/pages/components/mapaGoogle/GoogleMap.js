import React, { useEffect, useRef, useState } from "react";

const GoogleMap = ({ initialLocation, onLocationChange, direccion, altura, selectedBarrio, selectedCiudad }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window.google === "undefined") {
      console.error("La API de Google Maps no se ha cargado correctamente.");
      return;
    }

    if (!map) {
      const mapOptions = {
        center: initialLocation,
        zoom: 13,
      };
      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(googleMap);

      // Crear el marcador en la ubicación inicial
      const initialMarker = new window.google.maps.Marker({
        position: initialLocation,
        map: googleMap,
        draggable: true, // Permitir arrastrar el marcador
      });
      markerRef.current = initialMarker;

      googleMap.addListener("click", (e) => {
        const { latLng } = e;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const location = { lat, lng };

        // Mover el marcador a la nueva ubicación
        markerRef.current.setPosition(location);

        onLocationChange(location, direccion, altura);
      });

      // Agregar un listener para obtener la ubicación cuando se arrastra el marcador
      googleMap.addListener("dragend", () => {
        const newLocation = markerRef.current.getPosition();
        const lat = newLocation.lat();
        const lng = newLocation.lng();
        const location = { lat, lng };
        onLocationChange(location, direccion, altura);
      });
    } else {
      // Utilizar la API de Geocodificación para centrar el mapa en la dirección especificada
      const geocoder = new window.google.maps.Geocoder();
      const direccionCompleta = `${direccion}, ${altura}, ${selectedBarrio}, ${selectedCiudad}`;

      geocoder.geocode({ address: direccionCompleta }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;

          // Mover el mapa y el marcador a la ubicación
          map.setCenter(location);
          markerRef.current.setPosition(location);

          onLocationChange(location, direccion, altura);
        } else {
          console.error("No se pudo geocodificar la dirección.");
        }
      });
    }
  }, [initialLocation, direccion, altura, selectedBarrio, selectedCiudad, onLocationChange]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default GoogleMap;
