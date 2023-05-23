import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/footer";

//import images
import progileBg from "../../assets/images/user/user-random.jpg";
import avatar1 from "../../assets/images/user/user-random.jpg";

const UserProfileSetting = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  document.title = "Modificar Perfil | Amigos Peludos";
  return (
    <React.Fragment>
      <>
        <Navbar></Navbar>
      </>
      <div className="page-content">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img src={progileBg} className="profile-wid-img" alt="" />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input
                      id="profile-foreground-img-file-input"
                      type="file"
                      className="profile-foreground-img-file-input"
                    />
                    <Label
                      htmlFor="profile-foreground-img-file-input"
                      className="profile-photo-edit btn btn-light"
                    >
                      <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                      Cambiar Fondo
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col xxl={3}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      <img
                        src={avatar1}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt="user-profile"
                      />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    {/* NOMBRE USUARIO */}
                    <h5 className="fs-16 mb-1">Anna Adame</h5>
                    <p className="text-muted mb-0">Lead Designer / Developer</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                {/* TITULOS PESTAÑAS */}
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Datos Personales
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Cambiar Contraseña
                      </NavLink>
                    </NavItem>
                    
                      
                  </Nav>
                </CardHeader>

                
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      {/* FORMULARIO */}
                      <Form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                Nombre
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="firstnameInput"
                                placeholder="Ingrese su nombre"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="lastnameInput"
                                className="form-label"
                              >
                                Apellido
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="lastnameInput"
                                placeholder="Ingrese su apellido"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="phonenumberInput"
                                className="form-label"
                              >
                                Numero de Celular
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="phonenumberInput"
                                placeholder="Ingrese su numero de celular"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label"
                              >
                                Correo Electronico
                              </Label>
                              <Input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="Ingrese su email"
                                defaultValue="daveadame@velzon.com"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="JoiningdatInput"
                                className="form-label"
                              >
                                Fecha de Nacimiento
                              </Label>
                              <Flatpickr
                                className="form-control"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                              />
                            </div>
                          </Col>

                          <Col lg={2}>
                            <div className="mb-3">
                              <Label
                                htmlFor="countryInput"
                                className="form-label"
                              >
                                Pais
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="countryInput"
                                placeholder="Pais"
                              />
                            </div>
                          </Col>

                          <Col lg={2}>
                            <div className="mb-3">
                              <Label
                                htmlFor="provinceInput"
                                className="form-label"
                              >
                                Provincia
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="provinceInput"
                                placeholder="Provincia"
                              />
                            </div>
                          </Col>

                          <Col lg={2}>
                            <div className="mb-3">
                              <Label htmlFor="cityInput" className="form-label">
                                Ciudad
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="cityInput"
                                placeholder="Ciudad"
                              />
                            </div>
                          </Col>

                          <Col lg={2}>
                            <div className="mb-3">
                              <Label
                                htmlFor="barrioInput"
                                className="form-label"
                              >
                                Barrio
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="barrioInput"
                                placeholder="Barrio"
                              />
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div className="mb-3">
                              <Label
                                htmlFor="addressInput"
                                className="form-label"
                              >
                                Direccion
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="addressInput"
                                placeholder="Dirección"
                              />
                            </div>
                          </Col>

                          <Col lg={2}>
                            <div className="mb-3">
                              <Label
                                htmlFor="numberInput"
                                className="form-label"
                              >
                                Altura
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                minLength="1"
                                maxLength="6"
                                id="numberInput"
                                placeholder="Numero"
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <Link
                                to={"/perfil"}
                                type="button"
                                className="btn btn-primary"
                              >
                                Actualizar
                              </Link>
                              <Link
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancelar
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <>
        <Footer></Footer>
      </>
                              
    </React.Fragment>
  );
};

export default UserProfileSetting;
