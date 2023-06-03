import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import img from "../../../assets/images/pets/gato2.jpeg";
import { useAuth } from "../../AutheticationInner/authContext";
import { getUserMail, getMascotasUsuario } from "../../../services/api";
import AgregarMascota from "./AgregarMascota";


const Mascota = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [mostrarAgregarMascota, setMostrarAgregarMascota] = useState(false);
    const [userMascota, setUserMascota] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleMostrarComponenteAgregarMascota = () => {
        setMostrarAgregarMascota(true);
    };
    const handleCancelar = () => {
        setMostrarAgregarMascota(false);
    };

    useEffect(() => {
        const usuario = async () => {
            setUserData(await getUserMail(user.email));
        };
        usuario();
    }, [user]);

    useEffect(() => {
        if (userData) {
            const mascota = async () => {
                setUserMascota(await getMascotasUsuario(userData.id));
            };

            mascota();
        }
    }, [userData]);

    const tieneMascota = userData?.tieneMascota;

    document.title = "Gallery | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            {tieneMascota ? (
                <Container fluid>
                    <Row>
                        {userMascota.map((elemento) => (
                            <Col sm={6} xl={3} key={elemento.id}>
                                <Card>
                                    <img
                                        className="card-img-top img-fluid"
                                        src={img}
                                        alt="Card cap"
                                    />
                                    <CardBody className="d-flex justify-content-between align-items-center">
                                        <h4 className="card-title-pets">
                                            {elemento.nombre}
                                        </h4>

                                        <div className="text-end">
                                            <Link
                                                to="#"
                                                className="btn btn-primary"
                                            >
                                                Ver Información
                                            </Link>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            
                        ))}
                        
                    </Row>
                </Container>
            ) : mostrarAgregarMascota ? (
                <AgregarMascota onCancel={handleCancelar} />
            ) : (
                <>
                    <h1>NO HAY MASCOTAS AGREGADAS</h1>
                    <div
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                        }}
                        className="floating-button-container"
                    >
                        <button
                            type="button"
                            variant="primary"
                            id="floating-button"
                            className="boton-flotante"
                            onClick={handleMostrarComponenteAgregarMascota}
                            data-tooltip-id="botonTooltip"
                            data-tooltip-place="top"
                            data-tooltip-variant="info"
                        >
                            +
                        </button>
                        <Tooltip id="botonTooltip">Agregar Mascota</Tooltip>
                    </div>
                </>
            )}
        </React.Fragment>
    );
};

export default Mascota;
