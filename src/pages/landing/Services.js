import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const Services = () => {
    return (
        <React.Fragment>
            <section className="section mt-5 mb-5" id="services">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div
                                className="text-center mb-5"
                                data-aos="flip-up"
                                data-aos-duration="500"
                                data-aos-easing="ease-in-sine"
                            >
                                <h1 className="mb-3 ff-secondary fw-semibold lh-base">
                                    Ofrecemos múltiples servicios para ayudarte
                                    con tu mascota
                                </h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-3">
                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-right"
                                data-aos-duration="600"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-search-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ">
                                    <h5 className="fs-18">Mascotas perdidas</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        ¿Perdiste a tu mascota?, no te
                                        preocupes, chequeá si alguien ya la
                                        encontró
                                    </p>
                                    <div>
                                        <Link
                                            to="/mascotas-perdidas"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-down"
                                data-aos-duration="600"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-road-map-fill fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">
                                        Mascotas encontradas
                                    </h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        Publicá esa mascota que encontraste,
                                        seguramente su dueño está buscándolo
                                    </p>
                                    <div>
                                        <Link
                                            to="#"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-left"
                                data-aos-duration="600"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-empathize-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">
                                        Mascotas en adopción
                                    </h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        No lo dudes más! Adopta a esa mascota
                                        que tanto anhelas y dale un hogar .
                                    </p>
                                    <div>
                                        <Link
                                            to="#"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-right"
                                data-aos-duration="700"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-walk-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Paseadores</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        ¿Necesitás pasear a tu perro?, encontrá
                                        aquí al paseador que más se ajuste a tus
                                        necesidades
                                    </p>
                                    <div>
                                        <Link
                                            to="/paseadores"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="zoom-out"
                                data-aos-duration="700"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-heart-2-fill fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Cuidadores</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        ¿No sabés con quien dejas tu mascota?,
                                        aquí podras encontrar a cuidadores que
                                        se encargaran de ello.{" "}
                                    </p>
                                    <div>
                                        <Link
                                            to="/cuidadores"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-left"
                                data-aos-duration="700"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-hand-coin-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Donaciones</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        Realizá donaciones a veterinarias o
                                        fundaciones de manera segura{" "}
                                    </p>
                                    <div>
                                        <Link
                                            to="#"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-right"
                                data-aos-duration="800"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-shield-cross-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Veterinarias</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        Encontrá aquí a las veterinarias de tu
                                        zona y que realicen atención gratuita
                                    </p>
                                    <div>
                                        <Link
                                            to="/veterinarias"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder{" "}
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-up"
                                data-aos-duration="800"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-home-heart-fill fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Fundaciones</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        Encontrá aquí a las fundaciones de
                                        animales que se encuentren cerca de tu
                                        zona
                                    </p>
                                    <div>
                                        <Link
                                            to="/fundaciones"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div
                                className="d-flex p-3"
                                data-aos="fade-left"
                                data-aos-duration="800"
                                data-aos-easing="ease-in-sine"
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className=" ri-car-line fs-36"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-18">Traslados</h5>
                                    <p className="text-muted my-3 ff-secondary">
                                        Nos encargamos de ponerte en contacto
                                        con usuarios disponibles para trasladar
                                        mascotas a veterinarias en situaciones
                                        de urgencia.
                                    </p>
                                    <div>
                                        <Link
                                            to="#"
                                            className="fs-13 fw-medium"
                                        >
                                            Acceder
                                            <i className="ri-arrow-right-s-line align-bottom"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Services;
