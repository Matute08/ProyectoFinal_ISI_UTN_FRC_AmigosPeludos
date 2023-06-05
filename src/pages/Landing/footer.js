import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="custom-footer bg-dark py-5 position-relative">
                <Container>
                    <Row className="text-center text-sm-start align-items-center mt-5">
                        <Col sm={6}>
                            <div>
                                <p className="copy-rights mb-0">
                                    {new Date().getFullYear()} © Amigos Peludos
                                </p>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end mt-3 mt-sm-0">
                                <ul className="list-inline mb-0 footer-social-link">
                                    <li className="list-inline-item">
                                        <Link to="#" className="avatar-xs d-block">
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-facebook-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" className="avatar-xs d-block">
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-instagram-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" className="avatar-xs d-block">
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-twitter-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment >
    );
};

export default Footer;