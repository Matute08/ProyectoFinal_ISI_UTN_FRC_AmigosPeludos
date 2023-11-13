import React, { useState, useEffect } from "react";
import {
    getVeterinarias,
    getUserMail,
    getFundacion,
    deleteFundacion,
    updateUser
} from "../../../services/api";
import { Col, Row, Table, Card, CardHeader, CardBody } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

const ServicioFundacion = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fundacion, setFundacion] = useState();
    const { handleSweetAlertDeleteFundacion } = Modal();


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
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
        const fetchServicios = async () => {
            if (userData) {
                try {
                    const dataFundacion = await getFundacion();

                    //Filtrar paseadores, cuidadores y veterinarias según el userData.id
                    const fundacionFiltrados = dataFundacion.filter(
                        (funda) =>
                            funda.datosUsuario &&
                            funda.datosUsuario.id === userData.id
                    );
                    setFundacion(fundacionFiltrados);

                    setIsLoading(false);
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
                console.log(fundacion);
            }
        };
        if (userData && userData.id) {
            fetchServicios();
        }
    }, [userData && userData.id]);

    const handleDeleteFundacion = async () => {
        const idFundacion = fundacion && fundacion[0].id;
        const deleteResponse = await deleteFundacion(idFundacion);
        const fundacionUsuario = fundacion.filter(
            (funda) => funda.usuarioId === userData.id
          );

        if (
             fundacionUsuario.length === 1
            
            
        ) {

            const actualizarUser = {
                esFundacion: false,
            };
            await updateUser(userData.id, actualizarUser);
            
            console.log(deleteResponse);
            return deleteResponse.success;
        }else{
            return deleteResponse.success;
        }

    };
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    {fundacion.length > 0 && (
                        <Row className="mt-4">
                            <Col>
                                <div className="live-preview">
                                    <div className="table-responsive tabla-formularios">
                                        <Table className="table-bordered align-middle table-nowrap mb-0 table-responsive-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        Nombre Fundación
                                                    </th>
                                                    <th scope="col">
                                                        Fecha Solicitud
                                                    </th>
                                                    <th scope="col">
                                                        Telefono
                                                    </th>
                                                    <th scope="col">
                                                        Dirección
                                                    </th>
                                                    <th scope="col">CUIT</th>
                                                    <th scope="col">
                                                        Estado Fundación
                                                    </th>

                                                    <th scope="col">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* MAPEO DE DATOS */}
                                            <tbody>
                                                {fundacion &&
                                                fundacion.length > 0 ? (
                                                    fundacion
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
                                                                //Si los estados son iguales o ninguno es "Revision", ordenar por fecha decreciente
                                                                return (
                                                                    new Date(
                                                                        b.fechaAlta
                                                                    ) -
                                                                    new Date(
                                                                        a.fechaAlta
                                                                    )
                                                                );
                                                            }
                                                        })
                                                        .map((item) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    {
                                                                        item.nombre
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {formatDate(
                                                                        item.fechaAlta
                                                                    )}
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
                                                                    {item.cuit}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.estado
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Link
                                                                            to={`/modificar-fundacion/${item.id}`}
                                                                            className="btn btn-success btn-formulario"
                                                                        >
                                                                            <i className="ri-edit-2-fill"></i>
                                                                        </Link>

                                                                        <td>
                                                                            <div className="d-flex justify-content-center">
                                                                                <Link
                                                                                    to={`/donacion-fundacion/${item.id}`}
                                                                                    className="btn btn-info btn-formulario "
                                                                                >
                                                                                    <i className="ri-eye-fill"></i>
                                                                                </Link>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex justify-content-center">
                                                                                <Link
                                                                                    onClick={() =>
                                                                                        handleSweetAlertDeleteFundacion(
                                                                                            handleDeleteFundacion
                                                                                        )
                                                                                    }
                                                                                    className="btn btn-danger btn-formulario "
                                                                                >
                                                                                    <i className=" ri-delete-bin-fill"></i>
                                                                                </Link>
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
                            </Col>
                        </Row>
                    )}
                </>
            ) : (
                <>
                    <h2>Cargando...</h2>
                </>
            )}
        </React.Fragment>
    );
};

export default ServicioFundacion;
