import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import VeterinariaDetalle from "./VeterinariaDetalle";
import { getVeterinarias } from "../../services/api";
import markerVetes from "../../assets/images/marker/marker.png";

class MapaVeterinaria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      veterinarias: [], // Veterinarias de Google Places
      veterinariasRegistradas: [], // Veterinarias registradas con latitud y longitud
      selectedMarker: null, // Para rastrear el marcador seleccionado
    };
  }

  componentDidMount() {
    // Carga las veterinarias de Google Places al inicio
    this.cargarVeterinariasGoogle(this.props.ciudad, this.props.barrio);

    // Carga las veterinarias registradas al inicio
    this.cargarVeterinariasRegistradas(this.props.ciudad, this.props.barrio);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.ciudad !== prevProps.ciudad ||
      this.props.barrio !== prevProps.barrio
    ) {
      // Cargar las veterinarias de Google Places cuando cambia la ciudad o el barrio
      this.cargarVeterinariasGoogle(this.props.ciudad, this.props.barrio);

      // Cargar las veterinarias registradas cuando cambia la ciudad o el barrio
      this.cargarVeterinariasRegistradas(this.props.ciudad, this.props.barrio);
    }
  }

  

  // Función para cargar las veterinarias registradas desde el servidor
  cargarVeterinariasRegistradas() {
    // Llama a la función getVeterinarias para obtener las veterinarias registradas
    getVeterinarias()
      .then((data) => {
        // Agregar la propiedad "fuente" para distinguir la fuente del marcador
        const veterinariasRegistradas = data.map((veterinaria) => ({
          ...veterinaria,
          fuente: "registrada",
        }));

        this.setState({
          veterinariasRegistradas: veterinariasRegistradas, // Supongamos que `getVeterinarias` devuelve un arreglo de veterinarias registradas
        });
      })
      .catch((error) => {
        console.error("Error al obtener las veterinarias registradas:", error);
      });
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
          // Agregar la propiedad "fuente" para distinguir la fuente del marcador
          const veterinariasGoogle = results.map((veterinaria) => ({
            ...veterinaria,
            fuente: "google",
          }));

          this.setState({ veterinarias: veterinariasGoogle });
        } else {
          console.error("Error al buscar veterinarias:", status);
        }
      }
    );
  };

  // Función para manejar el evento 'click' en un marcador
  handleMarkerClick = (marker) => {
    this.setState({ selectedMarker: marker }, () => {
      // Llamar a la función de devolución de llamada para enviar la información a Veterinarias
      if (this.props.onMarkerClick) {
        this.props.onMarkerClick(marker);
      }
    });
  };

  // // Función para cerrar el detalle de la veterinaria
  // closeVeterinariaDetalle = () => {
  //   this.setState({ selectedMarker: null });
  // };

  render() {
    const { veterinarias, veterinariasRegistradas, selectedMarker } =
      this.state;
    const style = { width: "100%", height: "500px" };

    // Define el icono de marcador personalizado para las veterinarias registradas
    const markerIconRegistered = {
      url: markerVetes, // Proporciona la URL de la imagen directamente
      scaledSize: new this.props.google.maps.Size(80, 80), // Tamaño personalizado del marcador
    };

    return (
      <div>
        <Map
          style={style}
          google={this.props.google}
          zoom={15}
          initialCenter={{
            lat: -31.418645692107148,
            lng: -64.20073548156073,
          }}
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

          {veterinariasRegistradas.map((veterinaria) => (
            <Marker
              key={veterinaria.id}
              name={veterinaria.name}
              position={{
                lat: parseFloat(veterinaria.latitud),
                lng: parseFloat(veterinaria.longitud),
              }}
              icon={markerIconRegistered}
              onClick={() => this.handleMarkerClick(veterinaria)}
            />
          ))}
        </Map>
        {/* <div className="veterinarias-list">
          <VeterinariaDetalle
            veterinaria={selectedMarker}
            onClose={this.closeVeterinariaDetalle}
          />
        </div> */}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBviZwq4gkJCN-F8p9IXJ2E5kFyVYuOcNA",
})(MapaVeterinaria);
