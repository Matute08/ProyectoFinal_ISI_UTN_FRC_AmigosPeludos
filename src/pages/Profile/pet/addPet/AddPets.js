import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";

import classnames from "classnames";
import Navbar from "../../../landing/Navbar";
import Footer from "../../../landing/Footer";
import AsideLeft from "../../AsideLeft";
import FormAddPets from "./FormAddPets";

//import images 

const AddPets = () => {


    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Agregar Mascota | Amigos Peludos";
    return (
        <React.Fragment>

            <Navbar></Navbar>

            <Container fluid className="page-content perfil-fondo">
                <Row>
                    <AsideLeft></AsideLeft>

                    <Col xxl={9} lg={8} md={12}>
                        <Card className="mt-n5">
                            <CardHeader>
                                <Nav
                                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                    role="tablist"
                                >
                                    <NavItem>
                                        <NavLink
                                            to="#"
                                            className={classnames({
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => {
                                                tabChange("1");
                                            }}
                                            type="button"
                                        >
                                            Agregar Mascota
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody>
                                
                                <FormAddPets></FormAddPets>



                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer></Footer>

        </React.Fragment>
    );
};

export default AddPets;
