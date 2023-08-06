import React from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
} from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
//import images
import logo from "../../../assets/images/logo/LogoAP.png";
import { FormRegister } from "./FormRegister";

const Register = () => {
    document.title = "Registrar - Amigos Peludos";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link
                                            to="/"
                                            className="d-inline-block auth-logo"
                                        >
                                            <img
                                                src={logo}
                                                alt=""
                                                width="100"
                                                height="100"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">
                                                Crear una nueva cuenta
                                            </h5>
                                        </div>
                                        <div className="p-2 mt-4">



                                            <FormRegister></FormRegister>
                                        
                                        
                                        
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">
                                        Ya tienes una cuenta ?{" "}
                                        <Link
                                            to="/iniciar-sesion"
                                            className="fw-semibold text-primary text-decoration-underline"
                                        >
                                            {" "}
                                            Inicia sesion{" "}
                                        </Link>{" "}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
