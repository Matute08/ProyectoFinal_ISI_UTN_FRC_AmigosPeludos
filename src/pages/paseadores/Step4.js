import React from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

const Step4 = ({ onNext, onPrevious, step1Data, step2Data, step3Data }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        data.precioPaseo = parseInt(data.precioPaseo, 10); 
        onNext({ ...step1Data, ...step2Data, ...step3Data, ...data });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* PRECIO */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 w-50">
                        <Label className="form-label">Precio por paseo</Label>
                        <input
                            type="number"
                            className={`form-control ${errors.precioPaseo ? 'is-invalid' : ''}`}
                            name="precioPaseo"
                            placeholder="Precio por paseo"
                            {...register("precioPaseo", { required: "Este campo es obligatorio" })}
                        />
                        {errors.precioPaseo && (
                            <div className="invalid-feedback">
                                {errors.precioPaseo.message}
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

export default Step4;
