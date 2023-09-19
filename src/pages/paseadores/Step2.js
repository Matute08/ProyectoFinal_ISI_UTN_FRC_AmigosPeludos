import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getExperiencia, getAllBarrio } from "../../services/api";
import Loading from "../components/Loading";

const Step2 = ({ onNext, onPrevious, step1Data }) => {
    const [experiencia, setExperiencia] = useState([]);
    const [barrio, setBarrio] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres

    // Función para manejar cambios en el campo de texto
    const handleTextareaChange = (e) => {
      const charCount = e.target.value.length;
      setCharCount(charCount); // Actualiza el estado con la cantidad de caracteres
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm();

    const onSubmit = async (data) => {
        // Validar antes de continuar
        const isValid = await trigger();
        if (isValid) {
            onNext({ ...step1Data, ...data });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const experienciaData = await getExperiencia();
                const barrioData = await getAllBarrio();
                setExperiencia(experienciaData);
                setBarrio(barrioData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* TITULO BREVE */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Titulo Breve</Label>
                        <input
                            type="text"
                            className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
                            name="titulo"
                            placeholder="Titulo breve que capte la atención"
                            {...register("titulo", { required: "Este campo es obligatorio" })}
                        />
                        {errors.titulo && (
                            <div className="invalid-feedback">{errors.titulo.message}</div>
                        )}
                    </div>
                </Col>
                {/* PRESENTACION PERSONAL */}
                <Col lg={12} className="d-flex justify-content-center">
      <div className="mb-3 w-100">
        <label className="form-label">Presentación Personal</label>
        <textarea
          className={`form-control ${errors.presentacion ? "is-invalid" : ""}`}
          name="presentacion"
          placeholder="Texto donde habla de su experiencia."
          {...register("presentacion", {
            required: "Este campo es obligatorio",
            maxLength: {
              value: 500,
              message: "El máximo de caracteres permitidos es 500.",
            },
          })}
          onChange={handleTextareaChange} // Agregar el manejador de cambios
        />
        {errors.presentacion && (
          <div className="invalid-feedback">{errors.presentacion.message}</div>
        )}

        {/* Contador de caracteres restantes */}
        <div className="text-muted">
          Caracteres restantes: {500 - charCount}
        </div>
      </div>
    </Col>

                {/* EXPERIENCIA */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            Experiencia en años
                        </Label>
                        <select
                            name="experienciaId"
                            className={`form-select ${errors.experienciaId ? "is-invalid" : ""}`}
                            {...register("experienciaId", { required: "Seleccione una opción" })}
                        >
                            <option value="">Seleccione...</option>
                            {experiencia.map((elemento) => (
                                <option
                                    key={elemento.id}
                                    value={parseInt(elemento.id, 10)}
                                >
                                    {elemento.descripcion}
                                </option>
                            ))}
                        </select>
                        {errors.experienciaId && (
                            <div className="invalid-feedback">{errors.experienciaId.message}</div>
                        )}
                    </div>
                </Col>
                {/* BARRIO */}
                <Col lg={6} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Barrio de trabajo</Label>
                        <select
                            name="barrioTrabajoId"
                            className={`form-select ${errors.barrioTrabajoId ? "is-invalid" : ""}`}
                            {...register("barrioTrabajoId", { required: "Seleccione una opción" })}
                        >
                            <option value="">Seleccione...</option>
                            {barrio.map((elemento) => (
                                <option
                                    key={elemento.id}
                                    value={parseInt(elemento.id, 10)}
                                >
                                    {elemento.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.barrioTrabajoId && (
                            <div className="invalid-feedback">{errors.barrioTrabajoId.message}</div>
                        )}
                    </div>
                </Col>
            </Row>
            <Col className="button-container">
                {onPrevious && (
                    <button className="btn-next-paseador" onClick={onPrevious}>
                        <span className="transition transition-back"></span>
                        <span className="gradient"></span>
                        <span className="label">Atras</span>
                    </button>
                )}

                <button className="btn-next-paseador" type="button" onClick={handleSubmit(onSubmit)}>
                    <span className="transition"></span>
                    <span className="gradient"></span>
                    <span className="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step2;
