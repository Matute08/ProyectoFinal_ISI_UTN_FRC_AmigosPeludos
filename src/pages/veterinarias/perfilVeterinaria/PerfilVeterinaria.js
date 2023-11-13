import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Footer from "../../landing/Footer";
import Loading from "../../components/Loading";
import Navbar from "../../landing/Navbar";
import { getVeterinariaId } from "../../../services/api";
import { useParams } from "react-router-dom";
import guardia from "../../../assets/images/servicesVet/24hs.jpeg";
import castra from "../../../assets/images/servicesVet/castracion_1.jpg";
import eco from "../../../assets/images/servicesVet/ecografia.png";
import emerg from "../../../assets/images/servicesVet/emergencia.jpg";
import obser from "../../../assets/images/servicesVet/observacion.png";
import opera from "../../../assets/images/servicesVet/operacion_1.jpg";
import radio from "../../../assets/images/servicesVet/radiografia.jpg";
import sangre from "../../../assets/images/servicesVet/sangre.jpg";
import vacuna from "../../../assets/images/servicesVet/vacunacion.jpg";
import otros from "../../../assets/images/servicesVet/otros.jpg";

const PerfilVeterinaria = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [veterinarias, setVeterinarias] = useState();
    const { id } = useParams();

    useEffect(() => {
        const fetchVeterinarias = async () => {
            try {
                const dataVeterinarias = await getVeterinariaId(id);
                setVeterinarias(dataVeterinarias);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener veterinarias:", error);
            }
            console.log(veterinarias);
        };
        fetchVeterinarias();
    }, []);

    const openWhatsApp = () => {
        // Número de teléfono al que enviar el mensaje
        const phoneNumber = veterinarias && veterinarias.numeroTelefono;

        // Mensaje predeterminado
        const message = "¡Hola! Encontre a tu mascota perdida! ";

        // Crear la URL de WhatsApp con el número de teléfono y el mensaje
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        // Redireccionar al usuario a la URL de WhatsApp
        window.open(whatsappUrl, "_blank");
    };

    // Objeto que asocia servicios con imágenes
    const servicioImagenes = {
        castraciones: castra,
        internaciones: opera,
        vacunaciones: vacuna,
        equipoLaboratorio: sangre,
        radiografias: radio,
        ecografias: eco,
        guardia24hs: guardia,
        emergencias: emerg,
        observaciones: obser,
        otros: otros,
    };
    const nombreServicios = {
        castraciones: "Castraciones",
        internaciones: "Internaciones",
        vacunaciones: "Vacunaciones",
        equipoLaboratorio: "Extracciones de Sangre",
        radiografias: "Radiografías",
        ecografias: "Ecografías",
        guardia24hs: "Guardia 24hs",
        emergencias: "Emergencias a Domicilio",
        observaciones: "Observaciones",
        otros: "Otros",
    };

    // Función para renderizar las tarjetas de servicios
    const renderServicios = () => {
        const servicios = veterinarias && veterinarias.servicios;
        console.log(servicios);
        // Verificar si servicios es null o undefined
        if (!servicios) {
            // Si no existe, mostrar un mensaje
            return (
                <Col>
                    <h1 className="text-center">
                    Contáctate con la veterinaria para conocer los servicios que ofrecen.
                    </h1>
                </Col>
            );
        }

        const serviciosKeys = Object.keys(servicios);

        // Filtrar los servicios con valor true
        const serviciosActivos = serviciosKeys.filter(
            (servicio) => servicios[servicio] === true
        );

        if (serviciosActivos.length === 0) {
            // Si no hay servicios activos, mostrar un mensaje
            return (
                <Col>
                    <h1 className="text-center">
                    Contáctate con la veterinaria para conocer los servicios que ofrecen
                    </h1>
                </Col>
            );
        }

        return (
            serviciosActivos &&
            serviciosActivos.map((servicio, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100">
                        <CardHeader className="d-flex justify-content-center">
                            <img
                                src={servicioImagenes[servicio]}
                                alt=""
                                className="imagen-servicio-vet"
                            />
                        </CardHeader>
                        <CardBody>
                            <h1 className="text-center">
                                {nombreServicios[servicio]}
                            </h1>
                        </CardBody>
                    </Card>
                </Col>
            ))
        );
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar />
                    <Container fluid className="page-content buscador-fondo">
                        <div>
                            <h1 className="text-center mb-5">
                                Detalles sobre Veterinaria{" "}
                                {veterinarias && veterinarias.nombre}
                            </h1>
                        </div>

                        <div>
                            <Row className="d-flex justify-content-center">
                                {veterinarias ? (
                                    <Col
                                        sm={9}
                                        md={12}
                                        lg={9}
                                        xl={9}
                                        className="mb-4 "
                                    >
                                        <Card
                                            className="h-100"
                                            key={
                                                veterinarias && veterinarias.id
                                            }
                                        >
                                            <CardHeader className="d-flex justify-content-center">
                                                <h2 className="text-center">
                                                    Datos Veterinaria
                                                </h2>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col lg={4} md={4}>
                                                        <div className="text-start wrap">
                                                            <h5>
                                                                Dirección:{" "}
                                                                {
                                                                    veterinarias.direccion
                                                                }{" "}
                                                                {
                                                                    veterinarias.numeroCalle
                                                                }
                                                            </h5>
                                                            <h5>
                                                                Numero de
                                                                Contácto:
                                                                {
                                                                    veterinarias.numeroTelefono
                                                                }
                                                            </h5>
                                                            <h5>
                                                                Cuit
                                                                Veterinaria:
                                                                {
                                                                    veterinarias.cuil
                                                                }
                                                            </h5>
                                                        </div>
                                                    </Col>
                                                    <Col lg={5} md={4}>
                                                        <div>
                                                            <h5 className="text-center">
                                                                Horarios
                                                            </h5>
                                                            <ul className="wrap">
                                                                <li>
                                                                    Lunes:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .lunes
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .lunes
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Martes:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .martes
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .martes
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Miércoles:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .miercoles
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .miercoles
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Jueves:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .jueves
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .jueves
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Viernes:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .viernes
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .viernes
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Sábado:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .sabado
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .sabado
                                                                        : "Cerrado"}
                                                                </li>
                                                                <li>
                                                                    Domingo:{" "}
                                                                    {veterinarias.horarios &&
                                                                    veterinarias
                                                                        .horarios
                                                                        .domingo
                                                                        ? veterinarias
                                                                              .horarios
                                                                              .domingo
                                                                        : "Cerrado"}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </Col>

                                                    <Col
                                                        lg={3}
                                                        md={3}
                                                        className=""
                                                    >
                                                        <Row>
                                                            <h5 className="text-center">
                                                                Contácto
                                                            </h5>
                                                            <div className="container-button-contact">
                                                                <button
                                                                    class="social-button whatsapp"
                                                                    onClick={
                                                                        openWhatsApp
                                                                    }
                                                                >
                                                                    <i class="ri-whatsapp-line "></i>
                                                                    <span>
                                                                        WhatsApp
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </Row>
                                                        {veterinarias &&
                                                        veterinarias.cbu ? (
                                                            <Row>
                                                                <h5 className="text-center">
                                                                    Transferencia
                                                                </h5>
                                                                <div className="container-button-contact">
                                                                    <button class="social-button mercado-pago ">
                                                                        <i class=" ri-bank-card-fill"></i>
                                                                        <span>
                                                                            Transferencia
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </Row>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ) : (
                                    <>
                                        <Card>
                                            <h3>...</h3>
                                        </Card>
                                    </>
                                )}
                            </Row>
                        </div>

                        <div>
                            <h2 className="text-center m-5">
                                Servicios que ofrece
                            </h2>
                            <Row>{renderServicios()}</Row>

                            <h2 className="text-center m-5">
                                Otros Servicios que ofrece:
                            </h2>

                            <h4 className=" p-5">
                                {'- '}{veterinarias && veterinarias.servicios.otros}
                            </h4>
                        </div>
                        
                    </Container>
                    <Footer />
                </>
            ) : (
                <Loading />
            )}
        </React.Fragment>
    );
};

export default PerfilVeterinaria;
