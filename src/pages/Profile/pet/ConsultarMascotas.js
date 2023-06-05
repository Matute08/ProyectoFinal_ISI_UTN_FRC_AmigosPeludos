import React, { useState, useEffect, input } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Label, Row, Table } from "reactstrap";

import { useAuth } from "../../../services/AuthContext";
import {
    getMascotaId,
    getTipoMascota,
    getSexoMascota,
    getEdadMascota,
    postMascota,
    getUserMail,
    updateUser,
} from "../../../services/Api";

//import images

const ConsultarMascota = ({ onCancel, mascotaId }) => {
    const handleCancelar = () => {
        onCancel(); // Llama a la función onCancel pasada como prop
    };

    const navigate = useNavigate();

    const { user } = useAuth();
    const [mascotaData, setMascotaData] = useState();

    const [tipoMascota, setTipoMascota] = useState();
    const [tipoSexo, setTipoSexo] = useState();
    const [edadMascota, setEdadMascota] = useState();

    useEffect(() => {
        const mascota = async () => {
            const dataMascota = await getMascotaId(mascotaId);
            if (dataMascota) {
                setMascotaData(dataMascota);
            }
        };
        // const tipoMascotas = async () => {
        //     const dataTipoMascota = await getTipoMascota();
        //     if (dataTipoMascota) {
        //         setTipoMascota(dataTipoMascota);
        //     }
        // };
        // const tipoSexo = async () => {
        //     const dataTipoSexo = await getSexoMascota();
        //     if (dataTipoSexo) {
        //         setTipoSexo(dataTipoSexo);
        //     }
        // };
        // const edadMascota = async () => {
        //     const dataEdadMascota = await getEdadMascota();
        //     if (dataEdadMascota) {
        //         setEdadMascota(dataEdadMascota);
        //     }
        // };

        mascota();
        // tipoMascotas();
        // tipoSexo();
        // edadMascota();
    }, []);

    const tableData = [
        {
            title: "Nombre de la mascota",
            value: mascotaData ? mascotaData.nombre : "",
            col: 3,
        },
        {
            title: "Tipo de mascota",
            value: mascotaData ? mascotaData.tipoId : "",
            col: 6,
        },
        {
            title: "Edad aproximada",
            value: mascotaData ? mascotaData.edadId : "",
            col: 6,
        },
        {
            title: "Raza",
            value: mascotaData ? mascotaData.raza : "",
            col: 3,
        },
        {
            title: "Peso aproximado",
            value: mascotaData ? mascotaData.peso : "",
            col: 3,
        },
        {
            title: "Castrada/o",
            value: mascotaData ? mascotaData.castracion : "",
            col: 6,
        },
        {
            title: "Sexo",
            value: mascotaData ? mascotaData.sexoId : "",
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
            <Container fluid>
                {/* FORMULARIO */}
                <Form>
                    <Row className="">
                        <Row className="">
                            <Col lg={6} sm={12}>
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
                            <Col lg={6} sm={12} className="text-center">
                                <h5 className="ps-0 text-center text-foto">
                                    {
                                        tableData.find(
                                            (elemento) =>
                                                elemento.title === "Foto"
                                        ).title
                                    }
                                </h5>
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
                                    className="btn btn-primary"
                                >
                                    Volver
                                </button>
                            </div>
                        </Row>
                    </Row>
                </Form>
            </Container>
        </React.Fragment>
    );
};

export default ConsultarMascota;
