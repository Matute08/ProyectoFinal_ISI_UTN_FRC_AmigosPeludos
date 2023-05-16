import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";
import { useState } from 'react';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';

//import images
import logo from "../../../assets/images/logo/LogoAP.png";


const Login = () => {
    document.title = "Iniciar Sesion | Amigos Peludos";

    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
    })

    const { login } = useAuth()
    const navigate = useNavigate()

    //actualizar/cambiar de estados
    const handleChange = ({ target: { name, value } }) => setUser({ ...user, [name]: value })

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            await login(user.email, user.password)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }



    const [passwordShow, setPasswordShow] = useState(false);


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
                                            <img src={logo} alt="" height="100" width="100" />
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
                                            <Form action="#" onSubmit={handleSubmit}>

                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">Corre Electronico</Label>
                                                    <Input type="email" className="form-control" id="useremail" placeholder="Ingrese su correo electronico" name='email' onChange={handleChange} />
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/auth-pass-reset-basic" className="text-muted">¿Olvido su contraseña?</Link>
                                                    </div>
                                                    <label className="form-label" htmlFor="password-input">Contraseña</label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Input
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder="Ingrese su contraseña"
                                                            id="password-input"
                                                            name="password"
                                                            onChange={handleChange}
                                                        />
                                                        <Button color="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button"
                                                            id="password-addon"><i className="ri-eye-fill align-middle"></i></Button>
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
                                            </Form>
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

export default Login;