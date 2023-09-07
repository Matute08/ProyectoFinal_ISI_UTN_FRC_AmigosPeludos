import React from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";

const Step1 = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onNext(data);
  };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            <Row>
                {/* nombre completo */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Nombre Completo</Label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombreCompleto"
                            placeholder="Nombre Completo"
                            {...register("nombreCompleto")}
                            value={"Luciano Merlo"}
                        />
                    </div>
                </Col>

                {/* DNI */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">DNI</Label>
                        <input
                            type="text"
                            className="form-control"
                            name="dni"
                            placeholder="Número de Documento"
                            {...register("dni")}
                        />
                    </div>
                </Col>

                {/* Celular */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Celular</Label>
                        <input
                            type="text"
                            className="form-control"
                            name="celular"
                            placeholder="Celular"
                            value={"351323443"}
                            {...register("celular")}
                        />
                    </div>
                </Col>

                {/* EDAD */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            Fecha de Nacimiento
                        </Label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaNacimiento"
                            {...register("fechaNacimiento")}
                        />
                    </div>
                </Col>

                {/* botones de navegación
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 ">
                        <button type="submit">Siguiente</button>
                    </div>
                </Col> */}
            </Row>
            <Col className="button-container d-flex justify-content-end  ">
                <button className="btn-next-paseador button-container " type="submit">
                    <span class="transition"></span>
                    <span class="gradient"></span>
                    <span class="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step1;
