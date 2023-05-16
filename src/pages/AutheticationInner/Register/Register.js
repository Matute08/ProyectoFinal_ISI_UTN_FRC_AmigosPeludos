import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Form, FormFeedback, Input, Button } from 'reactstrap';
import ParticlesAuth from '../ParticlesAuth';
import { useAuth } from '../authContext';


//import images 
import logo from "../../../assets/images/logo/LogoAP.png";
//formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
    document.title = "Registrar - Amigos Peludos";

    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
    })

    const { signup } = useAuth()
    const navigate =useNavigate()

    const handleChange = ({ target: { name, value } }) => setUser({ ...user, [name]: value })

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            await signup(user.email, user.password)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }





    const [passwordShow, setPasswordShow] = useState(false);

    const validation = useFormik({
        //enableReinitialize: true,

        initialValues: {
            password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'La contraseña debe ser mayor a 8 caracteres')
                .matches(RegExp('(.*[a-z].*)'), 'Al menos una minuscula')
                .matches(RegExp('(.*[A-Z].*)'), 'Al menos una mayuscula')
                .matches(RegExp('(.*[0-9].*)'), 'Al menos un numero')
                .required("Este campo es requerido"),
        }),
        onSubmit: (values) => {
            //console.log(values);
        }

    });

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">

                    <Container >
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div >
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logo} alt="" width="100" height="100" />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">

                                    <CardBody className="p-4" >
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Crear una nueva cuenta</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form /* onSubmit={validation.handleSubmit} */ onSubmit={handleSubmit} className="needs-validation" action="#">

                                                <div className="mb-3">
                                                    <label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></label>
                                                    <input type="email" className="form-control" id="useremail" placeholder="Ingrese su correo electronico" required name='email' onChange={handleChange} />
                                                    <div className="invalid-feedback">
                                                        Por favor, ingrese su correo electronico
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="username" className="form-label">Nombre de usuario <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" id="username" placeholder="Ingrese un nombre de usuario" required name='username' onChange={handleChange} />
                                                    <div className="invalid-feedback">
                                                        Por favor, ingrese un nombre de usuario
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="password-input">Contraseña</label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Input
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder="Ingrese su contraseña"
                                                            id="password-input"
                                                            name="password"
                                                            //value={validation.values.password}
                                                            //onBlur={validation.handleBlur}
                                                            //onChange={validation.handleChange}
                                                            //invalid={validation.errors.password && validation.touched.password ? true : false}
                                                            onChange={handleChange}
                                                        />
                                                        {validation.errors.password && validation.touched.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                        <Button color="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button"
                                                            id="password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">Al registrarse, acepta los Términos y condiciones de Amigos Peludos.<br></br>
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">Terminos y condiciones</Link></p>
                                                </div>

                                                <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                    <h5 className="fs-13">Password must contain:</h5>
                                                    <p id="pass-length" className="invalid fs-12 mb-2">Minimum <b>8 characters</b></p>
                                                    <p id="pass-lower" className="invalid fs-12 mb-2">At <b>lowercase</b> letter (a-z)</p>
                                                    <p id="pass-upper" className="invalid fs-12 mb-2">At least <b>uppercase</b> letter (A-Z)</p>
                                                    <p id="pass-number" className="invalid fs-12 mb-0">A least <b>number</b> (0-9)</p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">Registrarse</button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title text-muted">Crear cuenta con:</h5>
                                                    </div>

                                                    <div>
                                                        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">
                                        Ya tienes una cuenta ? <Link to="/iniciar-sesion" className="fw-semibold text-primary text-decoration-underline"> Inicia sesion </Link> </p>
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