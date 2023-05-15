import React, { useState, useEffect } from "react";
import { Collapse, Container, NavbarToggler, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Scrollspy from "react-scrollspy";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo/LogoAP.png";
import Landing from ".";

const Navbar = ({ direction, ...args }) => {
    //DROPDOWN
    const [dropdownOpenBusqueda, setDropdownOpenBusqueda] = useState(false);
    const [dropdownOpenServicios, setDropdownOpenServicios] = useState(false);

    const toggleBusqueda = () => setDropdownOpenBusqueda((prevState) => !prevState);    
    const toggleServicios = () => setDropdownOpenServicios((prevState) => !prevState);

    const [isOpenMenu, setisOpenMenu] = useState(false);
    const [navClass, setnavClass] = useState("");
    const toggle = () => setisOpenMenu(!isOpenMenu);

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    const scrollNavigation = () => {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setnavClass("is-sticky");
        } else {
            setnavClass("");
        }
    }

    return (
        <React.Fragment>
            <nav className={"navbar navbar-expand-lg navbar-landing fixed-top " + navClass} id="navbar">
                <Container>
                    <Link className="navbar-brand" to="/index">
                        <img src={logo} className="card-logo card-logo-dark" alt="logo dark" height="90" width="90" />
                    </Link>

                    <NavbarToggler className="navbar-toggler py-0 fs-20 text-body" onClick={toggle} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <i className="mdi mdi-menu"></i>
                    </NavbarToggler>

                    <Collapse
                        isOpen={isOpenMenu}
                        className="navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <Scrollspy
                            currentClassName="active"
                            className="navbar-nav mx-auto mt-2 mt-lg-0"
                        >
                            <li className="nav-item">
                                <NavLink href="/">Inicio</NavLink>
                            </li>

                            <li className="nav-item">
                                <Dropdown isOpen={dropdownOpenBusqueda} toggle={toggleBusqueda} direction={direction}>
                                    <DropdownToggle className="dropdownmenu" caret>Busqueda</DropdownToggle>
                                    <DropdownMenu {...args} >
                                        <DropdownItem><NavLink href="#mascotasencontradas"> Mascotas Encontradas</NavLink></DropdownItem>
                                        <DropdownItem><NavLink href="#mascotasperdidas"> Mascotas Perdidas</NavLink></DropdownItem>
                                        <DropdownItem><NavLink href="#mascotasadopcion"> Mascotas en Adopción</NavLink></DropdownItem>

                                    </DropdownMenu>
                                </Dropdown>
                            </li>

                            <li className="nav-item">
                                <Dropdown isOpen={dropdownOpenServicios} toggle={toggleServicios} direction={direction}>
                                    <DropdownToggle className="dropdownmenu" caret>Servicios</DropdownToggle>
                                    <DropdownMenu {...args} >
                                        <DropdownItem><NavLink href="#paseadores">Paseadores</NavLink></DropdownItem>
                                        <DropdownItem><NavLink href="#cuidadores">Cuidadores</NavLink></DropdownItem>
                                        <DropdownItem><NavLink href="#veterinarias">Veterinarias</NavLink></DropdownItem>
                                        <DropdownItem><NavLink href="#fundaciones">Fundaciones</NavLink></DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>

                            <li className="nav-item">
                                <NavLink href="#trabajaconnosotros">Trabaja con nosotros</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink href="#contacto">Contacto</NavLink>
                            </li>
                        </Scrollspy>

                        <div className="">
                            <Link to="/iniciar-sesion" className="btn btn-link fw-medium text-decoration-none text-dark">Inicia Sesion</Link>
                            <Link to="/registrar" className="btn btn-primary">Registrate</Link>
                        </div>
                    </Collapse>
                </Container>
            </nav>
        </React.Fragment>
    );
};

export default Navbar;