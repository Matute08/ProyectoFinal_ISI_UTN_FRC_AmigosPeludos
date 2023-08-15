import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../../../services/AuthContext";


const GenerateQr = () => {
    
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [qr, setQr] =useState(false);



    return (
        <React.Fragment>
            
                <>
                    {qr ? (
                        <Container fluid>
                            <Row>
                                
                            </Row>
                        </Container>
                    ) : (
                        <>
                            <div className="alert alert-primary" role="alert">
                                <h5>No generaste codigo QR.</h5>
                                <button>Generar QR</button>
                            </div>

                        </>
                    )}
                </>
            
        </React.Fragment>
    );
};

export default GenerateQr;
