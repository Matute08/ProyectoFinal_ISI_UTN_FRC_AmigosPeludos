import React, { useState, useEffect } from "react";
import { getVeterinarias, getUserMail } from "../../../services/api";
import { Col, Row, Table, Card, CardHeader, CardBody } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

const ServicioVeterinaria = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [veterinaria, setVeterinaria] = useState();

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
                    const dataVeterinaria = await getVeterinarias();

                    //Filtrar paseadores, cuidadores y veterinarias según el userData.id
                    const veterinariasFiltrados = dataVeterinaria.filter(
                        (vete) => vete.usuarioId === userData.id
                    );
                    setVeterinaria(veterinariasFiltrados);

                    setIsLoading(false);
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
                console.log(veterinaria);
            }
        };
        if (userData && userData.id) {
            fetchServicios();
        }
    }, [userData && userData.id]);

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    {veterinaria.length > 0 && (
                        <Row className="mt-4">
                            <Col>
                                <div className="live-preview">
                                    <div className="table-responsive tabla-formularios">
                                        <Table className="table-bordered align-middle table-nowrap mb-0 table-responsive-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        Numero Veterinaria
                                                    </th>

                                                    <th scope="col">
                                                        Nombre Veterinaria
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
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* MAPEO DE DATOS */}
                                            <tbody>
                                                {veterinaria &&
                                                veterinaria.length > 0 ? (
                                                    veterinaria.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="fw-medium">
                                                                {item.id}
                                                            </td>

                                                            <td>
                                                                {item.nombre}
                                                            </td>
                                                            <td>
                                                                {formatDate(
                                                                    item.fechaAlta
                                                                )}
                                                            </td>
                                                            <td>
                                                                {
                                                                    item.numeroTelefono
                                                                }
                                                            </td>
                                                            <td>
                                                                {item.direccion}{" "}
                                                                {
                                                                    item.numeroCalle
                                                                }
                                                            </td>
                                                            <td>{item.cuil}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-center">
                                                                    <Link
                                                                        to={`/modificar-veterinaria/${item.id}`}
                                                                        className="btn btn-success btn-formulario"
                                                                    >
                                                                        <i className="ri-edit-2-fill"></i>
                                                                    </Link>

                                                                    <td>
                                                                        <div className="d-flex justify-content-center">
                                                                            <Link
                                                                                to={`/veterinarias/perfil-veterinaria/${item.id}`}
                                                                                className="btn btn-primary btn-formulario btn-form"
                                                                            >
                                                                                <i className="ri-eye-fill"></i>
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

export default ServicioVeterinaria;
