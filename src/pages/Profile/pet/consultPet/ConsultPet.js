import React, { useState, useEffect, input } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import {
    getMascotaId,
    getEdadMascotaId,
    getRazaId,
    getTipoMascotaId,
} from "../../../../services/Api";
import Loading from "../../../loading/Loading";

//import images

const ConsultarMascota = ({ onCancel, mascotaId }) => {
    const handleCancelar = () => {
        onCancel(); // Llama a la función onCancel pasada como prop
    };
    const [mascotaData, setMascotaData] = useState();
    const [tipoMascota, setTipoMascota] = useState();
    const [edadMascota, setEdadMascota] = useState();
    const [nameRaza, setNameRaza] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMascota = async () => {
            const dataMascota = await getMascotaId(mascotaId);
            if (dataMascota) {
                setMascotaData(dataMascota);
            }
            setIsLoading(false);
        };

        fetchMascota();
    }, [mascotaId]);

    useEffect(() => {
        const fetchEdadMascota = async () => {
            if (mascotaData && mascotaData.edadId) {
                const dataEdadMascota = await getEdadMascotaId(
                    mascotaData.edadId
                );
                if (dataEdadMascota) {
                    setEdadMascota(dataEdadMascota);
                }
            }
        };

        fetchEdadMascota();
    }, [mascotaData]);

    useEffect(() => {
        const fetchTipoMascota = async () => {
            if (mascotaData && mascotaData.tipoId) {
                const dataTipo = await getTipoMascotaId(mascotaData.tipoId);
                if (dataTipo) {
                    setTipoMascota(dataTipo);
                }
            }
        };

        fetchTipoMascota();
    }, [mascotaData]);

    useEffect(() => {
        const fetchRaza = async () => {
            if (mascotaData && mascotaData.razaId) {
                const dataRaza = await getRazaId(mascotaData.razaId);
                if (dataRaza) {
                    setNameRaza(dataRaza);
                }
            }
        };

        fetchRaza();
    }, [mascotaData]);

    const tableData = [
        {
            title: "Nombre de la mascota",
            value: mascotaData ? mascotaData.nombre : "",
            col: 3,
        },
        {
            title: "Tipo de mascota",
            value: tipoMascota ? tipoMascota.tipo : "",
            col: 6,
        },
        {
            title: "Edad aproximada",
            value: edadMascota ? edadMascota.descripcion : "",
            col: 6,
        },
        {
            title: "Raza",
            value: nameRaza ? nameRaza.nombre : "",
            col: 3,
        },
        {
            title: "Peso aproximado",
            value: mascotaData ? mascotaData.peso : "",
            col: 3,
        },
        {
            title: "Castrada/o",
            value: mascotaData
                ? `${mascotaData.castracion === 1 ? "No" : "Si"}`
                : "",
            col: 6,
        },
        {
            title: "Sexo",
            value: mascotaData
                ? `${
                      mascotaData.sexoId === 1
                          ? "Macho"
                          : mascotaData.sexoId === 2
                          ? "Hembra"
                          : "Nose"
                  }`
                : "",
            col: 6,
        },
        {
            title: "Descripción",
            value: mascotaData ? mascotaData.descripcion : "",
            col: 12,
        },
        {
            title: "Foto",
            value: mascotaData ? mascotaData.foto : "",
            col: 12,
        },
    ];

    document.title = "Agregar Mascota | Amigos Peludos";
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Container fluid>
                        <Row className="">
                            <Row className="">
                                <Col
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    className="container-texto"
                                >
                                    {tableData.map((elemento) => {
                                        if (elemento.title === "Foto") {
                                            return null; // Omitir el título y el valor "Foto" en el lado izquierdo
                                        }
                                        return (
                                            <div
                                                key={elemento.title}
                                                className="d-flex align-items-start  container-datos-mascotas "
                                            >
                                                <div className="flex-column  datos-mascotas ">
                                                    <p className="p-2 m-0">
                                                        <strong>
                                                            {elemento.title}:
                                                        </strong>{" "}
                                                        {elemento.value}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Col>
                                <Col
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    className="text-center"
                                >
                                    <div className="container-text-foto">
                                        <h5 className="ps-0 text-center text-foto">
                                            {
                                                tableData.find(
                                                    (elemento) =>
                                                        elemento.title ===
                                                        "Foto"
                                                ).title
                                            }
                                        </h5>
                                    </div>
                                    <img
                                        className="img-fluid img-consultar-mascota"
                                        src={
                                            tableData.find(
                                                (elemento) =>
                                                    elemento.title === "Foto"
                                            ).value
                                        }
                                        alt="Imagen de la mascota"
                                    />
                                </Col>
                                <div className="text-end">
                                    <button
                                        className="btn btn-success"
                                        onClick={handleCancelar}
                                    >
                                        Volver
                                    </button>
                                </div>
                            </Row>
                        </Row>
                    </Container>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default ConsultarMascota;
