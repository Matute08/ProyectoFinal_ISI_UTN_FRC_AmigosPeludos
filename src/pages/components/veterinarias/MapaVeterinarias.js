import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import VeterinariaDetalle from "./VeterinariaDetalle";

class MapaVeterinaria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            veterinarias: [],
            selectedMarker: null, // Para rastrear el marcador seleccionado
        };
    }

    componentDidMount() {
        // Carga las veterinarias al inicio
        this.cargarVeterinarias(this.props.ciudad, this.props.barrio);
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.ciudad !== prevProps.ciudad ||
            this.props.barrio !== prevProps.barrio
        ) {
            this.cargarVeterinarias(this.props.ciudad, this.props.barrio);
        }
    }

    cargarVeterinarias(ciudad, barrio) {
        const { google } = this.props;
        const geocoder = new google.maps.Geocoder();

        // Busca en Argentina primero
        const ubicacionArgentina = "Argentina";

        geocoder.geocode(
            { address: ubicacionArgentina },
            (resultsArgentina, statusArgentina) => {
                if (statusArgentina === "OK" && resultsArgentina[0]) {
                    const ubicacionLatLngArgentina =
                        resultsArgentina[0].geometry.location;

                    // Combina la ciudad y el barrio para obtener la ubicación completa
                    const ubicacion = barrio
                        ? `${ciudad} ${barrio}`
                        : `${ciudad}`;

                    geocoder.geocode(
                        { address: ubicacion },
                        (results, status) => {
                            if (status === "OK" && results[0]) {
                                const ubicacionLatLng =
                                    results[0].geometry.location;

                                const map = this.map.map; // Obtén el mapa de la referencia

                                const service =
                                    new google.maps.places.PlacesService(map);
                                service.nearbySearch(
                                    {
                                        location: ubicacionLatLng,
                                        radius: 500,
                                        types: ["veterinary_care"],
                                    },
                                    (results, status) => {
                                        if (status === "OK") {
                                            this.setState({
                                                veterinarias: results,
                                            });
                                        } else {
                                            console.error(
                                                "Error al buscar veterinarias:",
                                                status
                                            );
                                        }
                                    }
                                );

                                // Actualiza el centro del mapa con las coordenadas de la ubicación completa
                                map.setCenter(ubicacionLatLng);
                            } else {
                                console.error(
                                    "Error al obtener las coordenadas de la ubicación:",
                                    status
                                );
                            }
                        }
                    );
                } else {
                    console.error(
                        "Error al obtener las coordenadas de Argentina:",
                        statusArgentina
                    );
                }
            }
        );
    }

    // Función para manejar el evento 'bounds_changed' del mapa
    handleBoundsChanged = () => {
        const map = this.map.map; // Obtén el mapa de la referencia
        const bounds = map.getBounds();

        const { google } = this.props;
        const service = new google.maps.places.PlacesService(map);

        service.nearbySearch(
            {
                bounds: bounds,
                types: ["veterinary_care"],
            },
            (results, status) => {
                if (status === "OK") {
                    this.setState({ veterinarias: results });
                } else {
                    console.error("Error al buscar veterinarias:", status);
                }
            }
        );
    };

    // Función para manejar el evento 'click' en un marcador
    handleMarkerClick = (marker) => {
        this.setState({ selectedMarker: marker });
    };

    // Función para cerrar el detalle de la veterinaria
    closeVeterinariaDetalle = () => {
        this.setState({ selectedMarker: null });
    };

    render() {
        const { veterinarias, selectedMarker } = this.state;
        const style = { width: "80%", height: "400px" };

        return (
            <div>
                <Map
                    style={style}
                    google={this.props.google}
                    zoom={15}
                    initialCenter={{ lat: -31.418645692107148, lng: -64.20073548156073 }}
                    onBoundsChanged={this.handleBoundsChanged}
                    ref={(map) => (this.map = map)}
                >
                    {veterinarias.map((veterinaria) => (
                        <Marker
                            key={veterinaria.place_id}
                            name={veterinaria.name}
                            position={veterinaria.geometry.location}
                            onClick={() => this.handleMarkerClick(veterinaria)}
                        />
                    ))}
                </Map>
                <div className="veterinarias-list">
                    <VeterinariaDetalle
                        veterinaria={selectedMarker}
                        onClose={this.closeVeterinariaDetalle}
                    />
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyBviZwq4gkJCN-F8p9IXJ2E5kFyVYuOcNA",
})(MapaVeterinaria);
