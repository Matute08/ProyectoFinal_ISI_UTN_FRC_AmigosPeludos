import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Input, Label, Row,Button } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";


//import images
import logo from "../../../assets/images/logo/LogoAP.png";


const BasicSignIn = () => {
document.title="Basic SignIn | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">                
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logo} alt="" height="100" width="100"/>
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
                                            <h5 className="text-primary">Bienvenido de nuevo !</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <form action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">Nombre de usuario</Label>
                                                    <Input type="text" className="form-control" id="username" placeholder="Ingrese su nombre de usuario" />
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/auth-pass-reset-basic" className="text-muted">¿Olvido su contraseña?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input">Contraseña</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input type="password" className="form-control pe-5 password-input" placeholder="Ingrese su contraseña" id="password-input" />
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Recuerdame</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" className="btn btn-success w-100" type="submit">Iniciar Sesión</Button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Iniciar sesión con: </h5>
                                                    </div>
                                                    <div>
                                                        <Button color="primary" className="btn-icon"><i className="ri-facebook-fill fs-16"></i></Button>{" "}
                                                        <Button color="danger" className="btn-icon"><i className="ri-google-fill fs-16"></i></Button>{" "}
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">¿No tienes una cuenta?  <Link to="/registrar" className="fw-semibold text-primary text-decoration-underline"> Registrate </Link> </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default BasicSignIn;