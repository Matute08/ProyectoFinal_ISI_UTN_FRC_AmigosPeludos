import React, { useState, useEffect, input } from "react";
import { Col, Container, Row } from "reactstrap";

import { getMascotaId, getTipoMascotaId } from "../../../../services/api";
import Loading from "../../../components/Loading";

//import images

const ConsultarMascota = ({ onCancel, mascotaId }) => {
    const handleCancelar = () => {
        onCancel(); // Llama a la función onCancel pasada como prop
    };
    const [mascotaData, setMascotaData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMascota = async () => {
            const dataMascota = await getMascotaId(mascotaId);
            if (dataMascota) {
                if (dataMascota.castracion === true) {
                    dataMascota.castracion = "Si";
                } else {
                    dataMascota.castracion = "No";
                }
                setMascotaData(dataMascota);
            }
            setIsLoading(false);
        };
        console.log(mascotaData);
        fetchMascota();
    }, [mascotaId]);


    const keyMap = {
        nombre: "Nombre ",
        tipoNombre: "Tipo de mascota",
        edadMascota: "Edad aproximada",
        razaNombre: "Raza",
        peso: "Peso aproximado",
        castracion: "Castrado/a",
        sexoMascota: "Sexo",
        descripcion: "Descripción",
        color: "Color",
        foto: "Foto de la mascota",
        tipoMascotaNombre: "Tipo de mascota"
    };
    const excludedKeys = [
        "id",
        "edadId",
        "sexoId",
        "idUsuario",
        "razaId",
        "mailUsuario",
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
                                    {Object.entries(mascotaData).map(
                                        ([key, value]) => {
                                            if (
                                                key === "foto" || key=== "descripcion" ||
                                                excludedKeys.includes(key)
                                            ) {
                                                return null; // Omitir el título y el valor "Foto" en el lado izquierdo
                                            }
                                            const modifiedKey =
                                                keyMap[key] || key;
                                            return (
                                                <div
                                                    key={key}
                                                    className="d-flex align-items-start  container-datos-mascotas "
                                                >
                                                    <div className="flex-column  datos-mascotas ">
                                                        <p className="p-2 m-0">
                                                            <strong>
                                                                {modifiedKey}:
                                                            </strong>{" "}
                                                            {value}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                     {/* Agregar el bloque de descripción al final */}
    {mascotaData.descripcion && (
        <div className="d-flex align-items-start container-datos-mascotas">
            <div className="flex-column datos-mascotas">
                <p className="p-2 m-0">
                    <strong>{keyMap["descripcion"]}:</strong> {mascotaData.descripcion}
                </p>
            </div>
        </div>
    )}
                                </Col>
                                <Col
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    className="text-center"
                                >
                                    <div className="container-text-foto">
                                        <h5 className="ps-0 text-center text-foto">
                                            {keyMap["foto"]}
                                        </h5>
                                    </div>
                                    <img
                                        className="img-fluid img-consultar-mascota"
                                        src={mascotaData["foto"]}
                                        alt="Imagen de la mascota"
                                    />
                                </Col>
                                <div className="d-flex justify-content-end mt-5">
                                    <button
                                        class="button-pz btn-pz-secondary"
                                        onClick={handleCancelar}
                                    >
                                        <span class="span-pz text-pz">
                                            Volver
                                        </span>
                                        <span class="span-pz icon-pz">
                                            <svg
                                                viewBox="0 0 232 217"
                                                className="svg-pz"
                                            >
                                                <g
                                                    transform="translate(0,210) scale(0.1,-0.1)"
                                                    fill="#ffff"
                                                    stroke="none"
                                                >
                                                    <path
                                                        d="M740 2163 c-27 -11 -705 -486 -717 -502 -7 -9 -15 -31 -19 -48 -13
                                                                                            -65 5 -79 399 -319 319 -195 373 -224 408 -224 31 0 47 7 70 29 42 42 38 79
                                                                                            -21 205 l-49 106 510 0 509 0 38 -34 37 -34 3 -404 c2 -441 3 -435 -57 -475
                                                                                            l-34 -23 -571 0 -572 0 -44 -22 c-55 -28 -86 -73 -95 -138 -14 -101 16 -180
                                                                                            83 -222 l37 -23 575 -3 c389 -2 597 1 642 8 187 32 350 169 417 353 l26 72 3
                                                                                            425 c3 350 0 439 -12 498 -39 187 -161 330 -342 400 l-69 27 -552 5 -552 5 45
                                                                                            108 c24 59 44 121 44 137 0 60 -85 116 -140 93z"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
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
