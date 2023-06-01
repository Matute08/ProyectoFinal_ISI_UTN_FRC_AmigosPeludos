import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import img from "../../assets/images/pets/gato2.jpeg";

const Mascota = () => {
    document.title = "Gallery | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col sm={6} xl={3}>
                        <Card>
                            <img
                                className="card-img-top img-fluid"
                                src={img}
                                alt="Card cap"
                            />
                            <CardBody className="d-flex justify-content-between align-items-center">
                                <h4 className="card-title-pets">
                                    Apolo
                                </h4>
                           
                                <div className="text-end">
                                    <Link to="#" className="btn btn-primary">
                                        Ver Información
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Mascota;
