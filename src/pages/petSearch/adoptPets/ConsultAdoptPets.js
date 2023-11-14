import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Card, CardBody, CardHeader } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper";
import "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";

import Loading from "../../components/Loading";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { useAuth } from "../../../services/AuthContext";
import LeafletMaps from "../../components/maps/LeafletMaps";
import { getPublicacionesId } from "../../../services/api";
import FormAdoptPets from "./FormAdoptPets";

const ConsultAdoptPets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState();
    const { posteoId } = useParams();
    const [datosPublicacion, setDatosPublicacion] = useState();
    const [titulo, setTitulo] = useState();
    const [url, setUrl] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPublicData = async () => {
            const publicData = await getPublicacionesId(posteoId);
            const updatedPublicData = { ...publicData }; // Copia del objeto publicData
            updatedPublicData.fechaPerdida = new Date(
                publicData.fechaAlta
            ).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            updatedPublicData.castracion === true
                ? (updatedPublicData.castracion = "Si")
                : (updatedPublicData.castracion = "No");
            setDatosPublicacion(updatedPublicData);
            setIsLoading(false);
        };
        fetchPublicData();
    }, []);
    const keyMap = {
        nombre: "Nombre",
        tipoMascotaNombre: "Tipo de mascota",
        edadMascota: "Edad",
        razaNombre: "Raza",
        castracion: "Castrado/a",
        sexoMascota: "Sexo",
        descripcion: "Descripción",
        barrioPublicacion: "Barrio",
        ciudadPublicacion: "Ciudad",
        fechaPerdida: "En adopcion desde "
    };
    const excludedKeys = [
        "id",
        "edadId",
        "sexoId",
        "usuarioId",
        "razaId",
        "mailUsuario",
        "fotos",
        "latitud",
        "longitud",
        "tipoPublicacionId",
        "telefono",
        "barrioId",
        "publicacionTipo",
        "fechaAlta",
        "color",
        "calle",
    ];

    document.title = "Consultar Posteo | Amigos Peludos";
    return (
        <React.Fragment>
            <Navbar></Navbar>
            {!isLoading ? (
                <>
                    <div className="page-content perfil-fondo">
                        <Container fluid className="contenedor-fluido">
                            {/* Fila 1 titulo */}
                            <Row>
                                <Col className=" d-flex justify-content-center text-center titulo-consult-pest ">
                                    <h1>Detalle de la Mascota en Adopción</h1>
                                </Col>
                            </Row>

                            {/* Fila 2 contenido */}
                            <div className="container-consult-post">
                                {/* Columna 1 datos */}
                                <div className="consult-post">
                                    <Row className="fila-consult w-100">
                                        <Col lg={6} sm={12} className="col ">
                                            <Row className="w-100 justify-content-center">
                                            <Card className="card-consult-post">
                                                    <CardHeader>
                                                        <h4 className="card-title card-title-post mb-0">
                                                            Datos de la mascota
                                                        </h4>
                                                    </CardHeader>
                                                    <CardBody className="p-1">
                                                        {datosPublicacion &&
                                                            Object.entries(
                                                                datosPublicacion
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    value,
                                                                ]) => {
                                                                    if (
                                                                        key ===
                                                                            "fotos" ||
                                                                        excludedKeys.includes(
                                                                            key
                                                                        )
                                                                    ) {
                                                                        return null; // Omitir el título y el valor "Foto" en el lado izquierdo
                                                                    }

                                                                    const modifiedKey =
                                                                        keyMap[
                                                                            key
                                                                        ] ||
                                                                        key;

                                                                    // Si es la descripción, almacénala para mostrarla al final
                                                                    if (
                                                                        key ===
                                                                        "descripcion"
                                                                    ) {
                                                                        return null; // No renderizar la descripción aquí
                                                                    }

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                key.id
                                                                            }
                                                                            className="container-datos-mascotas w-100"
                                                                        >
                                                                            <div className="flex-column datos-mascotas">
                                                                                <div className="m-2">
                                                                                    <p className="m-0">
                                                                                        <strong>
                                                                                            {
                                                                                                modifiedKey
                                                                                            }

                                                                                            :
                                                                                        </strong>{" "}
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}

                                                        {/* Renderizar la descripción al final si existe */}
                                                        {datosPublicacion &&
                                                            datosPublicacion.descripcion && (
                                                                <div className="container-datos-mascotas w-100">
                                                                    <div className="flex-column datos-mascotas">
                                                                        <div className="m-2">
                                                                            <p className="m-0">
                                                                                <strong>
                                                                                    Descripción:
                                                                                </strong>{" "}
                                                                                {
                                                                                    datosPublicacion.descripcion
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </CardBody>
                                                </Card>
                                            </Row>
                                        </Col>

                                        <Col
                                            lg={6}
                                            sm={12}
                                            className="consult-post col d-inline"
                                        >
                                            <Card className="card-consult-post">
                                                <CardHeader>
                                                    <h4 className="card-title card-title-post mb-0">
                                                        Fotos de la Mascota
                                                    </h4>
                                                </CardHeader>
                                                <CardBody className="card-body-img">
                                                    <Swiper
                                                        scrollbar={{
                                                            hide: true,
                                                        }}
                                                        modules={[
                                                            Scrollbar,
                                                            Autoplay,
                                                        ]}
                                                        loop={true}
                                                        autoplay={{
                                                            delay: 2500,
                                                            disableOnInteraction: false,
                                                        }}
                                                        className="mySwiper swiper pagination-scrollbar-swiper rounded"
                                                    >
                                                        <div className="swiper-wrapper">
                                                            <div className="swiper-wrapper">
                                                                {datosPublicacion &&
                                                                    datosPublicacion.fotos &&
                                                                    datosPublicacion.fotos.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <SwiperSlide
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        item.foto
                                                                                    }
                                                                                    alt=""
                                                                                    className="img-fluid"
                                                                                />
                                                                            </SwiperSlide>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </Swiper>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row className="fila-consult w-100">
                                        <Col lg={12} sm={12} className="col">
                                            <Card className="card-consult-post ">
                                                <CardHeader>
                                                    <h4 className="card-title card-title-post mb-0">
                                                        Postulacion para Adoptar
                                                    </h4>
                                                </CardHeader>
                                                <CardBody>
                                                    <div className="container-button-contact">
                                                        <button class="btn-form-adopt"
                                                        onClick={() =>
                                                            setIsModalOpen(
                                                                true
                                                          )
                                                        }>
                                                            Formulario
                                                            <svg
                                                                class="svg-form-adopt"
                                                                viewBox="0 0 512 512"
                                                            >

                                                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <FormAdoptPets
                                                        isOpen={isModalOpen}
                                                        toggle={() =>
                                                            setIsModalOpen(
                                                                !isModalOpen
                                                            )
                                                        }
                                                        posteoId= {posteoId}
                                                    />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Container>
                    </div>

                    <Footer></Footer>
                </>
            ) : (
                <Loading></Loading>
            )}
        </React.Fragment>
    );
};

export default ConsultAdoptPets;
