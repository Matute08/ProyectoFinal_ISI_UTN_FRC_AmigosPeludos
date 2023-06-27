import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/footer";
import { Col, Container, Row, Card, CardBody, CardHeader } from "reactstrap";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
    Scrollbar,
    EffectFade,
    EffectCreative,
    Mousewheel,
    EffectFlip,
    EffectCoverflow,
    Autoplay,
} from "swiper";
import "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";

import LeafletMaps from "../components/maps/LeafletMaps";
import { getPublicacionesId } from "../../services/api";

const ConsultPosts = () => {
    const [isLoading, setIsLoading] = useState();
    const { posteoId } = useParams();
    const [datosPublicacion, setDatosPublicacion] = useState();
    const [url, setUrl] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPublicData = async () => {
            const publicData = await getPublicacionesId(posteoId);
            const updatedPublicData = { ...publicData }; // Copia del objeto publicData
            updatedPublicData.fechaPerdida = new Date(
                publicData.fechaPerdida
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

    const openWhatsApp = () => {
        // Número de teléfono al que enviar el mensaje
        const phoneNumber = datosPublicacion && datosPublicacion.telefono;

        // Mensaje predeterminado
        const message = "¡Hola! Encontre a tu mascota perdida! ";

        // Crear la URL de WhatsApp con el número de teléfono y el mensaje
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        // Redireccionar al usuario a la URL de WhatsApp
        window.open(whatsappUrl, "_blank");
    };

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return (
                '<span className="' + className + '">' + (index + 1) + "</span>"
            );
        },
    };
    const keyMap = {
        nombre: "Nombre",
        tipoMascotaNombre: "Tipo de mascota",
        edadMascota: "Edad",
        razaNombre: "Raza",
        castracion: "Castrado/a",
        sexoMascota: "Sexo",
        color: "Color",
        descripcion: "Descripción",
        calle: "Calle",
        barrioPublicacion: "Barrio",
        ciudadPublicacion: "Cordoba",
        fechaPerdida: "Fecha de perdida",

        //fotos: "Foto de la mascota",
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
    ];

    document.title = "Consultar Posteo | Amigos Peludos";
    return (
        <React.Fragment>
            <Navbar></Navbar>
            {!isLoading ? (
                <>
                    <div className="page-content perfil-fondo">
                        <Container fluid>
                            {/* Fila 1 titulo */}
                            <Row>
                                <Col className=" d-flex justify-content-center titulo-consult-pest ">
                                    <h1>
                                        Detalles de la Mascota Perdida{" "}
                                        
                                    </h1>
                                </Col>
                            </Row>

                            {/* Fila 2 contenido */}
                            <div className="container-consult-post">
                                {/* Columna 1 datos */}
                                <div className="consult-post">
                                    <Row className="fila-consult">
                                        <Col lg={6} sm={12} className="col">
                                            <Row className="w-100 justify-content-center">
                                                <Card className="card-consult-post">
                                                    <CardHeader>
                                                        <h4 className="card-title card-title-post mb-0">
                                                            Datos de la mascota{" "}
                                                        </h4>
                                                    </CardHeader>
                                                    <CardBody className=" p-1">
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
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                key.id
                                                                            }
                                                                            className=" container-datos-mascotas w-100 "
                                                                        >
                                                                            <div className="flex-column  datos-mascotas ">
                                                                                <div className="m-2">
                                                                                    <p className=" m-0">
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
                                                    </CardBody>
                                                </Card>
                                                <Card className="card-consult-post">
                                                    <CardHeader>
                                                        <h4 className="card-title card-title-post mb-0">
                                                            Datos de Contacto
                                                        </h4>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="container-button-contact">
                                                            <button
                                                                class="social-button whatsapp"
                                                                onClick={
                                                                    openWhatsApp
                                                                }
                                                            >
                                                                <i class="ri-whatsapp-line"></i>
                                                                <span>
                                                                    WhatsApp
                                                                </span>
                                                            </button>

                                                            <button class="social-button mail">
                                                                <i class=" ri-mail-fill"></i>
                                                                <span>
                                                                    Mail
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Row>
                                        </Col>

                                        <Col lg={6} sm={12} className="col">
                                            <Row className="w-100 justify-content-center fila-imgubi">
                                                <div className="consult-post col">
                                                    <Card className="card-consult-post">
                                                        <CardHeader>
                                                            <h4 className="card-title card-title-post mb-0">
                                                                Fotos de la
                                                                Mascota
                                                            </h4>
                                                        </CardHeader>
                                                        <CardBody>
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
                                                </div>
                                                <div className="consult-post col">
                                                    <Card className="card-consult-post">
                                                        <CardHeader>
                                                            <h4 className="card-title card-title-post mb-0">
                                                                Ubicacion
                                                            </h4>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <LeafletMaps
                                                                latitud={
                                                                    datosPublicacion &&
                                                                    datosPublicacion.latitud
                                                                }
                                                                longitud={
                                                                    datosPublicacion &&
                                                                    datosPublicacion.longitud
                                                                }
                                                                isClickeable={
                                                                    false
                                                                }
                                                            ></LeafletMaps>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </Row>
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

export default ConsultPosts;
