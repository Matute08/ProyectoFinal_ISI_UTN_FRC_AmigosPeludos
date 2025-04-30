import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: "ri-facebook-fill", link: "#" },
        { icon: "ri-instagram-fill", link: "#" },
        { icon: "ri-twitter-fill", link: "#" },
    ];

    return (
        <footer className="custom-footer bg-dark py-5 position-relative">
            <Container>
                <Row className="text-center text-sm-start align-items-center mt-5">
                    <Col sm={6}>
                        <p className="copy-rights mb-0">
                            {currentYear} © Amigos Peludos
                        </p>
                    </Col>
                    <Col sm={6}>
                        <div className="text-sm-end mt-3 mt-sm-0">
                            <ul className="list-inline mb-0 footer-social-link">
                                {socialLinks.map((social, index) => (
                                    <li className="list-inline-item" key={index}>
                                        <Link to={social.link} className="avatar-xs d-block">
                                            <div className="avatar-title rounded-circle">
                                                <i className={social.icon}></i>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;