import React from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";

const Step2 = ({ onNext, onPrevious, step1Data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onNext({ ...step1Data, ...data });
  };


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* TITULO BREVE */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Titulo Breve</Label>
                        <input
                            type="text"
                            className="form-control"
                            name="titulo"
                            placeholder="Titulo breve que capte la atención"
                            {...register("titulo")}
                        />
                    </div>
                </Col>
                {/* PRESENTACION PERSONAL */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            Presentación Personal
                        </Label>
                        <input
                            type="textarea"
                            className="form-control"
                            name="presentacion"
                            placeholder="Texto donde habla de su experiencia."
                            {...register("presentacion")}
                        />
                    </div>
                </Col>

                

                {/* EXPERIENCIA */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            Experiencia en años
                        </Label>
                        <select
                            name="experiencia"
                            className="form-select "
                            {...register("experiencia")}
                        >
                            <option value="">Seleccione...</option>
                            <option value="1">1 año</option>
                            <option value="2">2 año</option>
                            <option value="3">3 año</option>
                            <option value="4">4 año</option>
                        </select>
                    </div>
                </Col>
                {/* BARRIO */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Barrio de trabajo</Label>
                        <select
                            name="barrio"
                            className="form-select "
                            {...register("barrio")}
                        >
                            <option value="">Seleccione...</option>
                            <option value="1">Nueva Cordoba</option>
                            <option value="2">General Paz</option>
                            <option value="3">Guemes</option>
                        </select>
                    </div>
                </Col>

               

               
            </Row>
            <Col className="button-container">
                {onPrevious && (
                    <button className="btn-next-paseador"onClick={onPrevious}>
                        <span class="transition transition-back"></span>
                        <span class="gradient"></span>
                        <span class="label">Atras</span>
                    </button>
                )}

                <button className="btn-next-paseador" type="submit">
                    <span class="transition"></span>
                    <span class="gradient"></span>
                    <span class="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step2;
