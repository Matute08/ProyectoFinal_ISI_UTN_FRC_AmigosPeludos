import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const Services = () => {
    const services = [
        {
            title: "Mascotas perdidas",
            description:
                "¿Perdiste a tu mascota?, no te preocupes, chequeá si alguien ya la encontró",
            icon: "ri-search-line",
            link: "/mascotas-perdidas",
            animation: { type: "fade-right", duration: 600 },
        },
        {
            title: "Mascotas encontradas",
            description:
                "Publicá esa mascota que encontraste, seguramente su dueño está buscándolo",
            icon: "ri-road-map-fill",
            link: "/mascotas-encontradas",
            animation: { type: "fade-down", duration: 600 },
        },
        {
            title: "Mascotas en adopción",
            description:
                "No lo dudes más! Adopta a esa mascota que tanto anhelas y dale un hogar.",
            icon: "ri-empathize-line",
            link: "/mascotas-adopcion",
            animation: { type: "fade-left", duration: 600 },
        },
        {
            title: "Paseadores",
            description:
                "¿Necesitás pasear a tu perro?, encontrá aquí al paseador que más se ajuste a tus necesidades",
            icon: "ri-walk-line",
            link: "/paseadores",
            animation: { type: "fade-right", duration: 700 },
        },
        {
            title: "Cuidadores",
            description:
                "¿No sabés con quien dejas tu mascota?, aquí podras encontrar a cuidadores que se encargaran de ello.",
            icon: "ri-heart-2-fill",
            link: "/cuidadores",
            animation: { type: "zoom-out", duration: 700 },
        },
        {
            title: "Donaciones",
            description:
                "Realizá donaciones a veterinarias o fundaciones de manera segura",
            icon: "ri-hand-coin-line",
            link: "#",
            animation: { type: "fade-left", duration: 700 },
        },
        {
            title: "Veterinarias",
            description:
                "Encontrá aquí a las veterinarias de tu zona y que realicen atención gratuita",
            icon: "ri-shield-cross-line",
            link: "/veterinarias",
            animation: { type: "fade-right", duration: 800 },
        },
        {
            title: "Fundaciones",
            description:
                "Encontrá aquí a las fundaciones de animales que se encuentren cerca de tu zona",
            icon: "ri-home-heart-fill",
            link: "/fundaciones",
            animation: { type: "fade-up", duration: 800 },
        },
        {
            title: "Traslados",
            description:
                "Nos encargamos de ponerte en contacto con usuarios disponibles para trasladar mascotas a veterinarias en situaciones de urgencia.",
            icon: "ri-car-line",
            link: "#",
            animation: { type: "fade-left", duration: 800 },
        },
    ];

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
                        {services.map((service, index) => (
                            <Col lg={4} key={index}>
                                <div
                                    className="d-flex p-3"
                                    data-aos={service.animation.type}
                                    data-aos-duration={service.animation.duration}
                                    data-aos-easing="ease-in-sine"
                                >
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm icon-effect">
                                            <div className="avatar-title bg-transparent text-success rounded-circle">
                                                <i className={`${service.icon} fs-36`}></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">{service.title}</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            {service.description}
                                        </p>
                                        {service.link && (
                                            <div>
                                                <Link
                                                    to={service.link}
                                                    className="fs-13 fw-medium"
                                                >
                                                    Acceder{" "}
                                                    <i className="ri-arrow-right-s-line align-bottom"></i>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Services;