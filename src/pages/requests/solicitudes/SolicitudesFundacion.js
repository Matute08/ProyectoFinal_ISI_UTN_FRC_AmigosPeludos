import { React, useState, useEffect } from "react";
import { Card, CardBody, Col, Table } from "reactstrap";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { useNavigate } from "react-router-dom";

import {
    getUserMail,
    getEstadosVeterinaria,
    getFundacion,
} from "../../../services/api";
import { useAuth } from "../../../services/AuthContext";
import Loading from "../../components/Loading";

const SolicitudesFundacion = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("1");
    const [formularioSolicitado, setFormularioSolicitado] = useState();
    const [fundacionSolicitado, setFundacionSolicitado] = useState();
    const [pdfItemId, setPDFItemId] = useState(null);
    const [userData, setUserData] = useState();
    const [estados, setEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFormDetails, setSelectedFormDetails] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const navigate = useNavigate();

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFormData, setSelectedFormData] = useState(null);

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${
                    datosUsuario.calle + " " + datosUsuario.nroCalle
                }`;
                setUserData(datosUsuario);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchFormDataSolicitado = async () => {
            try {
                // Obtener datos de veterinarias
                const fundacionData = await getFundacion();
                setFundacionSolicitado(fundacionData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener datos de fundaciones:", error);
            }
        };
        // Verificar si hay un usuario válido antes de hacer la solicitud
        if (userData && userData.id) {
            fetchFormDataSolicitado();
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
                const publicData = await getEstadosVeterinaria();
                setEstados(publicData);
            } catch (error) {
                console.error("Error al obtener estados:", error);
            }
        };
        fetchState();
    }, []);

    const handleUpdateState = async (formId) => {
        const { value: estadoId } = await Swal.fire({
            title: `¿Vas a modificar el estado de la fundación: ${formId}? `,
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
                const formData = {
                    estadoId: parseInt(estadoId, 10),
                };
                console.log(formId);
                console.log(formData);
                // Llama a tu función de actualización de estado aquí
                //await updateEstadoVeterinaria(formId, formData);

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
    const handleViewPDF = (itemId) => {
        const newTab = window.open(
            `/ver-formulario-solicitud-fundacion/${itemId}`,
            "_blank"
        );
        newTab.focus();
    };
    return (
        <>
            {!isLoading ? (
                <>
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                <div className="live-preview">
                                    <div className="table-responsive tabla-formularios">
                                        <Table className="table-bordered align-middle table-nowrap mb-0 ">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        Numero Solicitud
                                                    </th>
                                                    <th scope="col">
                                                        Fecha de Creación
                                                    </th>
                                                    <th scope="col">
                                                        Nombre Fundación
                                                    </th>
                                                    <th scope="col">
                                                        Telefono
                                                    </th>
                                                    <th scope="col">
                                                        Dirección
                                                    </th>
                                                    <th scope="col">CUIT</th>
                                                    <th scope="col">
                                                        Estado de Solicitud
                                                    </th>

                                                    <th scope="col">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* MAPEO DE DATOS */}
                                            <tbody>
                                                {fundacionSolicitado &&
                                                fundacionSolicitado.length >
                                                    0 ? (
                                                    fundacionSolicitado
                                                        .sort((a, b) => {
                                                            // Ordenar por estado primero
                                                            if (
                                                                a.estado ===
                                                                    "Revision" &&
                                                                b.estado !==
                                                                    "Revision"
                                                            ) {
                                                                return -1; // a va antes que b
                                                            } else if (
                                                                a.estado !==
                                                                    "Revision" &&
                                                                b.estado ===
                                                                    "Revision"
                                                            ) {
                                                                return 1; // b va antes que a
                                                            } else {
                                                                // Si los estados son iguales o ninguno es "Revision", ordenar por fecha decreciente
                                                                // return (
                                                                //     new Date(
                                                                //         b.fechaAlta
                                                                //     ) -
                                                                //     new Date(
                                                                //         a.fechaAlta
                                                                //     )
                                                                // );
                                                            }
                                                        })
                                                        .map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="fw-medium">
                                                                    {item.id}
                                                                </td>
                                                                <td className="fw-medium">
                                                                    12/10/2023
                                                                    {/* {formatDate(
                                                                                                            item.fechaAlta
                                                                                                        )} */}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.nombre
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.telefono
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.direccion
                                                                    }{" "}
                                                                    {
                                                                        item.nroCalle
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        231232322323
                                                                        // item.cuil
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        item.estado
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
                                                                            }
                                                                        >
                                                                            <i className="ri-edit-2-fill"></i>
                                                                        </button>

                                                                        {/* Botón para mostrar el PDF */}
                                                                        <td>
                                                                            <div className="d-flex justify-content-center">
                                                                                <button
                                                                                    className="btn btn-primary btn-formulario btn-form"
                                                                                    onClick={() =>
                                                                                        handleViewPDF(
                                                                                            item.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <i className="ri-eye-fill"></i>
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="7"
                                                            className="text-center "
                                                        >
                                                            <h1>
                                                                No tienes
                                                                solicitudes
                                                            </h1>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </>
    );
};
export default SolicitudesFundacion;
