import React from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";


// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Home = () => {

    return (
        <React.Fragment>
            <section className="section pb-0 hero-section" id="hero">
                <div className="bg-overlay bg-overlay-pattern"></div>
                    <Row className="w-100 container-row ">
                        <Col  className="container-home ">
                            <div className=" mt-lg-5   div-contenido">
                                <h1 className="fw-semibold mb-3 lh-base text-title text-center">
                                    En{" "}
                                    <span className="span-title">
                                        Amigos Peludos
                                    </span>{" "}
                                    <br />
                                    te ayudamos a encontrar a tu mascota <br />
                                </h1>
                                <p className="lead text-muted lh-base text-home">
                                    Nuestra misión es ayudarte a encontrar el
                                    compañero peludo perfecto para ti. Ya sea
                                    que estés buscando adoptar o necesites
                                    servicios para tu mascota actual,{" "}
                                    <span className="span-text">
                                        ¡estamos aquí para ayudarte!
                                    </span>{" "}
                                     Además, si te apasionan los animales
                                    y quieres ser parte de nuestro equipo,{" "}
                                    <span className="span-text">
                                        ¡únete a nosotros hoy mismo y ayúdanos a
                                        hacer una diferencia en la vida de los
                                        animales!
                                    </span>
                                </p>
                                
                            </div>
                        </Col>
                    </Row>

                    
            </section>
        </React.Fragment>
    );
};

export default Home;
