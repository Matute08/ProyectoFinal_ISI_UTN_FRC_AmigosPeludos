import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";

//import images
import logo from "../../../assets/images/logo/LogoAP.png";
import { FormLogin } from "./FormLogin";

const Login = () => {
    document.title = "Iniciar Sesion | Amigos Peludos";

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
                                                height="100"
                                                width="100"
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
                                                Bienvenido de nuevo !
                                            </h5>
                                        </div>
                                        <div className="p-2 mt-4">


                                            <FormLogin></FormLogin>


                                            
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">
                                        ¿No tienes una cuenta?{" "}
                                        <Link
                                            to="/registrar"
                                            className="fw-semibold text-primary text-decoration-underline"
                                        >
                                            {" "}
                                            Registrate{" "}
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

export default Login;
