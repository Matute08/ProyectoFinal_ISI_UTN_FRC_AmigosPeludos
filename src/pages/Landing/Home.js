import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";


const Home = () => {
    return (
        <React.Fragment>
            <section className="section pb-0 hero-section" id="hero">
                <div className="bg-overlay bg-overlay-pattern"></div>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} sm={10}>
                            <div className="text-center mt-lg-5 pt-5">
                                <h1 className="display-6 fw-semibold mb-3 lh-base">La mejor plataforma para su mascota es <span
                                    className="text-success">Amigos Peludos </span></h1>
                                <p className="lead text-muted lh-base text-home">Nuestra misión es ayudarte a encontrar el compañero peludo perfecto para ti. Ya sea que estés buscando adoptar o necesites servicios para tu mascota actual, ¡estamos aquí para ayudarte! Además, si te apasionan los animales y quieres ser parte de nuestro equipo, ¡únete a nosotros hoy mismo y ayúdanos a hacer una diferencia en la vida de los animales!</p>

                                <div className="d-flex gap-2 justify-content-center mt-4">
                                    <Link to="/register" className="btn btn-primary">¡Adopta una mascota! <i className="ri-search-eye-line align-middle ms-1"></i></Link>
                                    <Link to="/pages-pricing" className="btn btn-danger">¡Trabaja con nosotros! <i className="ri-information-fill align-middle ms-1"></i></Link>
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Home;