import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  TabContent,
  Table,
  TabPane,
  UncontrolledCollapse,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import Navbar from "../Landing/Navbar";

//Images
import profileBg from "../../assets/images/user/user-random.jpg";
import avatar1 from "../../assets/images/user/user-random.jpg";
import imgCard from "../../assets/images/pets/gato.jpg";

const Profile = () => {
  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleActivityTab = (tab) => {
    if (activityTab !== tab) {
      setActivityTab(tab);
    }
  };

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <>
        <Navbar></Navbar>
      </>

      <div className="page-content">
        <Container fluid>
          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg">
              <img src={profileBg} alt="" className="profile-wid-img" />
            </div>
          </div>
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img
                    src={avatar1}
                    alt="user-img"
                    className="img-thumbnail rounded-circle"
                  />
                </div>
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1">Anna Adame</h3>
                  <p className="text-white-75">Owner & Founder</p>
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Col lg={12}>
              <div>
                <div className="d-flex profile-wrapper">
                  <Nav
                    pills
                    className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        href="#mis-datos"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          toggleTab("1");
                        }}
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Datos
                        </span>
                      </NavLink>
                    </NavItem>

                    {/* POR LO PRONTO NO ES NECESARIO */}

                    
                    {/* <NavItem>
                      <NavLink
                        href="#mis-publicaciones"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          toggleTab("2");
                        }}
                      >
                        <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Publicaciones
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#mis-mascotas"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          toggleTab("3");
                        }}
                      >
                        <i className="ri-price-tag-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Mascotas
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#mis-documentos"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          toggleTab("4");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Documentos
                        </span>
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                  <div className="flex-shrink-0">
                    <Link
                      to="/modificar-perfil"
                      className="btn btn-success"
                    >
                      <i className="ri-edit-box-line align-bottom"></i> Editar
                      Perfil
                    </Link>
                  </div>
                </div>

                <TabContent activeTab={activeTab} className="pt-4">
                  <TabPane tabId="1">
                    <Row className="d-flex justify-content-center">
                      <Col xxl={6}>
                        <Card>
                          <CardBody>
                            <h5 className="card-title mb-3">Mis Datos</h5>
                            <div className="table-responsive">
                              <Table className="table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <th className="ps-0" scope="row">
                                      Nombre y Apellido:
                                    </th>
                                    <td className="text-muted">Anna Adame</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">
                                      Numero de Celular :
                                    </th>
                                    <td className="text-muted">
                                      +(1) 987 6543
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">
                                     Correo Electronico:
                                    </th>
                                    <td className="text-muted">
                                      daveadame@velzon.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">
                                      Direccion:
                                    </th>
                                    <td className="text-muted">
                                      California, United States
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">
                                      Fecha de Nacimiento:
                                    </th>
                                    <td className="text-muted">24 Nov 2021</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                   
                    </Row>
                  </TabPane>

                  <TabPane tabId="2">
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-3">Activities</h5>
                        <div className="acitivity-timeline">
                          <div className="acitivity-item d-flex">
                            <div className="flex-shrink-0">
                              <img
                                src={avatar1}
                                alt=""
                                className="avatar-xs rounded-circle acitivity-avatar"
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">
                                Oliver Phillips{" "}
                                <span className="badge bg-soft-primary text-primary align-middle">
                                  New
                                </span>
                              </h6>
                              <p className="text-muted mb-2">
                                We talked about a project on linkedin.
                              </p>
                              <small className="mb-0 text-muted">Today</small>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </TabPane>

                  <TabPane tabId="3">



                  </TabPane>

                  <TabPane tabId="4">
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Documents
                          </h5>
                          <div className="flex-shrink-0">
                            <Input
                              className="form-control d-none"
                              type="file"
                              id="formFile"
                            />
                            <Label
                              htmlFor="formFile"
                              className="btn btn-danger"
                            >
                              <i className="ri-upload-2-fill me-1 align-bottom"></i>{" "}
                              Upload File
                            </Label>
                          </div>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Size</th>
                                    <th scope="col">Upload Date</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody></tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Profile;
