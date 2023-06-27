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
import Navbar from "../../../Landing/Navbar";
import Footer from "../../../Landing/footer";
import AsideLeft from "../../AsideLeft";
import FormAddPets from "./FormAddPets";

//import images

const AddPets = () => {
   
    document.title = "Agregar Mascota | Amigos Peludos";
    return (
        <React.Fragment>
            <Navbar></Navbar>

            <FormAddPets></FormAddPets>

            <Footer></Footer>
        </React.Fragment>
    );
};

export default AddPets;
