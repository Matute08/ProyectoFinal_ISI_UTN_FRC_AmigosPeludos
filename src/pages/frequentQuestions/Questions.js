import React, { useState, useEffect } from "react";
import { Row, Container,Col } from "reactstrap";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import Accordion from "react-bootstrap/Accordion";

const Questions = () => {
    return (
        <React.Fragment>
            <Navbar />

            <Container fluid className="page-content buscador-fondo">
                <Row>
                    <Col className=" d-flex justify-content-center title-questions">
                        <h1>Preguntas Frecuentes</h1>
                    </Col>
                </Row>
                <div className="container-questions">
                    <Accordion
                        defaultActiveKey="0"
                        flush
                        className="frequent-questions"
                    >
                        <Accordion.Item eventKey="0" className="item-questions">
                            <Accordion.Header className="custom-header">
                                Accordion Item #1
                            </Accordion.Header>
                            <Accordion.Body className="custom-body">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="item-questions">
                            <Accordion.Header className="custom-header">
                                Accordion Item #1
                            </Accordion.Header>
                            <Accordion.Body className="custom-body">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item> <Accordion.Item eventKey="2" className="item-questions">
                            <Accordion.Header className="custom-header">
                                Accordion Item #1
                            </Accordion.Header>
                            <Accordion.Body className="custom-body">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item> <Accordion.Item eventKey="3" className="item-questions">
                            <Accordion.Header className="custom-header">
                                Accordion Item #1
                            </Accordion.Header>
                            <Accordion.Body className="custom-body">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item> <Accordion.Item eventKey="4" className="item-questions">
                            <Accordion.Header className="custom-header">
                                Accordion Item #1
                            </Accordion.Header>
                            <Accordion.Body className="custom-body">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Container>

            <Footer />
        </React.Fragment>
    );
};

export default Questions;
