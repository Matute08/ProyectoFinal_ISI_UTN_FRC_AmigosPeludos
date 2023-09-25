import React, { useState } from "react";
import { Button, message, Steps, theme } from "antd";
import Navbar from "../../landing/Navbar";
import Footer from "../../landing/Footer";
import { Container, Col } from "reactstrap";
import Step1 from "./Step1";

const { Step } = Steps;

const AddVeterinaria = () => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const handleNext = () => {
        setCurrent(current + 1);
    };

    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: "Datos Básicos",
            content: <Step1 onNext={handleNext} />,
        },
        {
            title: "Segundo Paso",
            content: "Contenido del segundo paso",
        },
        {
            title: "Último Paso",
            content: "Contenido del último paso",
        },
    ];

    return (
        <React.Fragment>
            <Navbar />
            <Container fluid className="page-content perfil-fondo">
                <div className=" w-100">
                    <div className="d-flex justify-content-center">
                        <Steps current={current} className="w-75">
                            {steps.map((item) => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </div>

                    <div
                        style={{
                            marginTop: 24,
                        }}
                    >
                        {steps[current].content}

                        <div className="d-flex justify-content-end">
                            <Col className="button-container d-flex justify-content-end">
                                {current < steps.length - 1 && (
                                    <Button
                                        className="btn-next-paseador btn-next "
                                        type="submit"
                                        onClick={handleNext}
                                    >
                                        <span class="transition"></span>
                                        <span class="gradient"></span>
                                        <span class="label">Siguiente</span>
                                    </Button>
                                    // <Button type="primary" onClick={handleNext}>
                                    //     Siguiente
                                    // </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button
                                        className="btn-next-paseador btn-next "
                                        type="submit"
                                        onClick={() =>
                                            message.success(
                                                "¡Registro completo!"
                                            )
                                        }
                                    >
                                        <span class="transition"></span>
                                        <span class="gradient"></span>
                                        <span class="label">Finalizar</span>
                                    </Button>
                                )}
                                {current > 0 && (
                                    <Button
                                        className="btn-next-paseador"
                                        onClick={handlePrev}
                                    >
                                        <span className="transition transition-back"></span>
                                        <span className="gradient"></span>
                                        <span className="label">Atras</span>
                                    </Button>

                                    // <Button
                                    //     style={{
                                    //         margin: "0 8px",
                                    //     }}
                                    //     onClick={handlePrev}
                                    // >
                                    //     Anterior
                                    // </Button>
                                )}
                            </Col>
                        </div>
                    </div>
                </div>
            </Container>
            <Footer />
        </React.Fragment>
    );
};

export default AddVeterinaria;
