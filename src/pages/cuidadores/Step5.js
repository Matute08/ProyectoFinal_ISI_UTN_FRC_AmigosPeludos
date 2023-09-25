import React from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

const Step5 = ({ onNext, onPrevious, step1Data, step2Data, step3Data,step4Data }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        data.precioCuidado = parseInt(data.precioCuidado, 10);
        onNext({ ...step1Data, ...step2Data, ...step3Data, ...step4Data, ...data });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* PRECIO */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 w-50">
                        <Label className="form-label">Precio por hora de cuidado</Label>
                        <input
                            type="number"
                            className={`form-control ${
                                errors.precioCuidado ? "is-invalid" : ""
                            }`}
                            name="precioCuidado"
                            placeholder="Precio por hora de cuidado"
                            {...register("precioCuidado", {
                                required: "Este campo es obligatorio",
                            })}
                        />
                        {errors.precioCuidado && (
                            <div className="invalid-feedback">
                                {errors.precioCuidado.message}
                            </div>
                        )}
                    </div>
                </Col>

                {/* botones de navegación */}
            </Row>
            <Col className="button-container">
                {onPrevious && (
                    <button className="btn-next-paseador" onClick={onPrevious}>
                        <span className="transition transition-back"></span>
                        <span className="gradient"></span>
                        <span className="label">Atras</span>
                    </button>
                )}

                <button className="btn-next-paseador" type="submit">
                    <span className="transition"></span>
                    <span className="gradient"></span>
                    <span className="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step5;
