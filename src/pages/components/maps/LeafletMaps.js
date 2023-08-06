import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

//Import maps
import Maps from "./Maps";

const LeafletMaps = ({latitud, longitud, isClickeable}) => {
    return (
        <div id="leaflet-map" className="leaflet-map">
            <Maps latitud={latitud} longitud={longitud} isClickeable={isClickeable}></Maps>
        </div>
    );
};

export default LeafletMaps;
