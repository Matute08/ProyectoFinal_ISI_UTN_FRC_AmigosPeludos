import { React, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Table,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    DropdownMenu,
    DropdownItem,
    CardHeader,
} from "reactstrap";
import Swal from "sweetalert2"; // Importa SweetAlert2
import classnames from "classnames";

import { Link } from "react-router-dom";

import Footer from "../landing/Footer";

import Navbar from "../landing/Navbar";
import ViewAdoptForm from "./ViewAdoptForm";
import {
    getFormulariosDuenoPosteo,
    getFormulariosPosibleAdoptante,
    getUserMail,
    getUserId,
    getEstadosFormularios,
    updateForm,
} from "../../services/api";
import { useAuth } from "../../services/AuthContext";
import Loading from "../components/Loading";

const ConsultAdoptForm = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("1");
    const [formularioSolicitado, setFormularioSolicitado] = useState();
    const [formularioSolicitante, setFormularioSolicitante] = useState();
    const [userData, setUserData] = useState();
    const [estados, setEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFormDetails, setSelectedFormDetails] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFormData, setSelectedFormData] = useState(null);

    const handleViewFormClick = (id) => {
        setSelectedFormData(id);
        setIsViewModalOpen(true);
    };

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userData = await getUserMail(user.email);
                setUserData(userData);
                setIsLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    useEffect(() => {
        const fetchFormDataSolicitado = async () => {
            if (userData && userData.id) {
                const publicData = await getFormulariosDuenoPosteo(userData.id);
                setFormularioSolicitado(publicData);
            }
        };

        if (userData && userData.id) {
            fetchFormDataSolicitado();
        }
    }, [userData]);

    useEffect(() => {
        const fetchFormDataSolicitante = async () => {
            if (userData && userData.id) {
                const publicDataForm = await getFormulariosPosibleAdoptante(
                    userData.id
                );
                setFormularioSolicitante(publicDataForm);
            }
        };

        if (userData && userData.id) {
            fetchFormDataSolicitante();
        }
    }, [userData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
    };

    //MODAL
    useEffect(() => {
        const fetchState = async () => {
            try {
                const publicData = await getEstadosFormularios();
                setEstados(publicData);
            } catch (error) {
                console.error("Error al obtener estados:", error);
            }
        };
        fetchState();
    }, []);

    const handleUpdateState = async (formId) => {
        const { value: estadoId } = await Swal.fire({
            title: `¿Vas a modificar el estado del formulario: ${formId}? `,
            text: "Seleccione el nuevo estado",
            input: "select",
            icon: "warning",
            inputOptions: estados.reduce((options, estado) => {
                options[estado.id] = estado.nombre;
                return options;
            }, {}),
            inputPlaceholder: "Seleccione...",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        });

        if (estadoId) {
            try {
                Swal.fire({
                    title: "Procesando...",
                    icon: "info", // Cambia el ícono a "info" para mostrar el ícono de carga giratorio
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });

                // Llama a tu función de actualización de estado aquí
                await updateForm(formId, { estadoFormularioId: estadoId });

                // Cierra el mensaje de "Cargando"
                Swal.close();

                // Muestra el mensaje de éxito con temporizador y barra de progreso
                Swal.fire({
                    title: `Estado actualizado correctamente para formulario ${formId}`,
                    icon: "success",
                    html: "Cerrando en <b></b> segundos.",
                    timer: 2000, // Tiempo en milisegundos (2 segundos)
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didOpen: () => {
                        const b = Swal.getHtmlContainer().querySelector("b");
                        const timerInterval = setInterval(() => {
                            b.textContent = (
                                Swal.getTimerLeft() / 1000
                            ).toFixed(1);
                        }, 100);
                    },
                    willClose: () => {
                        window.location.reload();
                    },
                });
            } catch (error) {
                console.error("Error al actualizar el estado:", error);
                Swal.fire("Error al actualizar el estado", "", "error");
            }
        }
    };

    document.title = "Solicitudes de Adopcion | Amigos Peludos";

    return (
        <>
            {!isLoading ? (
                <>
                    <Navbar></Navbar>

                    <div className="page-content perfil-fondo">
                        <Container fluid className="contenedor-form">
                            {/* Fila 1 titulo */}
                            <Row>
                                <Col className=" d-flex justify-content-center titulo-consult-pest ">
                                    <h1>Solicitudes de Adopción</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <Nav
                                                className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                                role="tablist"
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        href="#mis-mascotas"
                                                        className={classnames({
                                                            active:
                                                                activeTab ===
                                                                "1",
                                                        })}
                                                        onClick={() => {
                                                            toggleTab("1");
                                                        }}
                                                    >
                                                        <span className=" d-md-inline-block">
                                                            Formularios
                                                            Recibidos
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#mis-publicaciones"
                                                        className={classnames({
                                                            active:
                                                                activeTab ===
                                                                "2",
                                                        })}
                                                        onClick={() => {
                                                            toggleTab("2");
                                                        }}
                                                    >
                                                        <span className=" d-md-inline-block">
                                                            Formularios Enviados
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </CardHeader>

                                        <CardBody>
                                            <TabContent activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    <Col lg={12}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className="live-preview">
                                                                    <div className="table-responsive tabla-formularios">
                                                                        <Table className="table-bordered align-middle table-nowrap mb-0 ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col">
                                                                                        Numero
                                                                                        Formulario
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Fecha
                                                                                        de
                                                                                        Creación
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Nombre
                                                                                        del
                                                                                        Adoptante
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Telefono
                                                                                        del
                                                                                        Solicitante
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Estado
                                                                                        de
                                                                                        Adopción
                                                                                    </th>

                                                                                    <th scope="col">
                                                                                        Acciones
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>

                                                                            {/* MAPEO DE DATOS */}
                                                                            <tbody>
                                                                                {formularioSolicitado &&
                                                                                    formularioSolicitado.map(
                                                                                        (
                                                                                            item
                                                                                        ) => (
                                                                                            <tr
                                                                                                key={
                                                                                                    item.id
                                                                                                }
                                                                                            >
                                                                                                <td className="fw-medium">
                                                                                                    {
                                                                                                        item.id
                                                                                                    }
                                                                                                </td>
                                                                                                <td className="fw-medium">
                                                                                                    {formatDate(
                                                                                                        item.fechaAlta
                                                                                                    )}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.nombre
                                                                                                    }{" "}
                                                                                                    {
                                                                                                        item.apellido
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.celular
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.estadoFormulario
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="d-flex justify-content-center">
                                                                                                        <button
                                                                                                            className="btn btn-success btn-formulario"
                                                                                                            onClick={() =>
                                                                                                                handleUpdateState(
                                                                                                                    item.id
                                                                                                                )
                                                                                                            } // Llama a la función handleUpdateState
                                                                                                        >
                                                                                                            <i className=" ri-edit-2-fill"></i>
                                                                                                        </button>
                                                                                                       

                                                                                                        <button
                                                                                                            className="btn btn-primary btn-formulario btn-form"
                                                                                                            onClick={() =>
                                                                                                                handleViewFormClick(
                                                                                                                    item.id
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <i className="  ri-eye-fill"></i>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    )}
                                                                            </tbody>
                                                                            {/* Agrega el modal de ver formulario */}
                                                                            <ViewAdoptForm
                                                                                isOpen={
                                                                                    isViewModalOpen
                                                                                }
                                                                                toggle={() =>
                                                                                    setIsViewModalOpen(
                                                                                        !isViewModalOpen
                                                                                    )
                                                                                }
                                                                                selectedFormData={
                                                                                    selectedFormData
                                                                                }
                                                                            />
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </TabPane>

                                                {/* FORMULARIOS ENVIADOS */}
                                                <TabPane tabId="2">
                                                    <Col lg={12}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className="live-preview">
                                                                    <div className="table-responsive tabla-formularios">
                                                                        <Table className="table-bordered align-middle table-nowrap mb-0 ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col">
                                                                                        Numero
                                                                                        Formulario
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Fecha
                                                                                        de
                                                                                        Creación
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Nombre
                                                                                        del
                                                                                        Dueño
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Telefono
                                                                                        del
                                                                                        Solicitado
                                                                                    </th>
                                                                                    <th scope="col">
                                                                                        Estado
                                                                                        de
                                                                                        Formulario
                                                                                    </th>

                                                                                    <th scope="col">
                                                                                        Acciones
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            {/* MAPEO DE DATOS */}
                                                                            <tbody>
                                                                                {formularioSolicitante &&
                                                                                    formularioSolicitante.map(
                                                                                        (
                                                                                            item
                                                                                        ) => (
                                                                                            <tr
                                                                                                key={
                                                                                                    item.id
                                                                                                }
                                                                                            >
                                                                                                <td className="fw-medium">
                                                                                                    {
                                                                                                        item.id
                                                                                                    }
                                                                                                </td>
                                                                                                <td className="fw-medium">
                                                                                                    {formatDate(
                                                                                                        item.fechaAlta
                                                                                                    )}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.nombreDueño
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.celular
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        item.estadoFormulario
                                                                                                    }
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="d-flex justify-content-center">
                                                                                                        
                                                                                                        <button
                                                                                                            className="btn btn-primary btn-formulario btn-form"
                                                                                                            onClick={() =>
                                                                                                                handleViewFormClick(
                                                                                                                    item.id
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <i className="  ri-eye-fill"></i>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    )}
                                                                            </tbody>
                                                                            {/* Agrega el modal de ver formulario */}
                                                                            <ViewAdoptForm
                                                                                isOpen={
                                                                                    isViewModalOpen
                                                                                }
                                                                                toggle={() =>
                                                                                    setIsViewModalOpen(
                                                                                        !isViewModalOpen
                                                                                    )
                                                                                }
                                                                                selectedFormData={
                                                                                    selectedFormData
                                                                                }
                                                                            />
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <Footer></Footer>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </>
    );
};

export default ConsultAdoptForm;
