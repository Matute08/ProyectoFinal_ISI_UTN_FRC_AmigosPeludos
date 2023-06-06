import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import img from "../../../assets/images/pets/gato2.jpeg";
import { useAuth } from "../../../services/AuthContext";
import { getUserMail, getMascotasUsuario } from "../../../services/Api";
import AgregarMascota from "./AgregarMascota";
import ConsultarMascota from "./ConsultarMascotas";

const Mascota = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [mostrarAgregarMascota, setMostrarAgregarMascota] = useState(false);
    const [mostrarConsultarMascota, setMostrarContultarMascota] = useState(0);

    const [userMascota, setUserMascota] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleMostrarComponenteAgregarMascota = () => {
        setMostrarAgregarMascota(true);
    };

    const handleMostrarComponenteConsultarMascota = (id) => {
        setMostrarContultarMascota(id);

    };
    const handleCancelar = () => {
        setMostrarAgregarMascota(false);
        setMostrarContultarMascota(0)
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


    return (
<React.Fragment>
            {mostrarAgregarMascota ? (
                <AgregarMascota onCancel={handleCancelar} />
            ) : mostrarConsultarMascota !== 0 ? (
                <ConsultarMascota onCancel={handleCancelar} mascotaId={mostrarConsultarMascota} />
            ) : (
                <>
                    {tieneMascota ? (
                        <Container fluid>
                            <Row>
                                {userMascota.map((elemento) => (
                                    <Col sm={4} xl={3} key={elemento.id}>
                                        <Card>
                                            <img
                                                className="card-img-top img-fluid img-mascota"
                                                src={elemento.foto}
                                                alt="Imagen de la mascota"
                                            />
                                            <CardBody className="d-flex flex-column justify-content-between align-items-center">
                                                <h4 className="card-title-pets">
                                                    {elemento.nombre}
                                                </h4>

                                                <div className="text-end">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-primary"
                                                        style={{ width: "100%" }}
                                                        onClick={() => handleMostrarComponenteConsultarMascota(elemento.id)}
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
                    ) : (
                        <>
                            <div className="alert alert-primary" role="alert">
                                <h5>No tienes mascotas agregadas.</h5>
                            </div>
                        </>
                    )}
                    <div
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            zIndex: "9999",
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
