import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getTipoVivienda } from "../../services/api";
import Loading from "../components/Loading";

const Step2 = ({ onNext, onPrevious, step1Data }) => {
    const [experiencia, setExperiencia] = useState([]);
    const [tipoVivienda, setTipoVivienda] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [charCount, setCharCount] = useState(0); // Estado para el contador de caracteres

    // Función para manejar cambios en el campo de texto
    const handleTextareaChange = (e) => {
        const charCount = e.target.value.length;
        setCharCount(charCount); // Actualiza el estado con la cantidad de caracteres
    };
    useEffect(() => {
        const fetchDataVivienda = async () => {
            try {
                const experienciaData = await getTipoVivienda();

                setTipoVivienda(experienciaData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setIsLoading(false);
            }
        };

        fetchDataVivienda();
    }, []);
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
            data.tipoViviendaId =  parseInt(data.tipoViviendaId, 10);
            // Convierte los valores de cadena a booleano
            data.patioBalcon = data.patioBalcon === "true" ? true : false;
            data.transportePropio = data.transportePropio === "true" ? true:false;
            onNext({ ...step1Data, ...data });
        }
    };
    

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="d-flex justify-content-center">
                {/* tipo vivienda */}
                <Col lg={9} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Tipo de Vivienda</Label>
                        <select
                            name="tipoViviendaId"
                            className={`form-select ${
                                errors.barrioTrabajoId ? "is-invalid" : ""
                            }`}
                            {...register("tipoViviendaId", {
                                required: "Seleccione una opción",
                            })}
                        >
                            <option value="">Seleccione...</option>
                            {tipoVivienda &&
                                tipoVivienda.map((elemento) => (
                                    <option
                                        key={elemento.id}
                                        value={parseInt(elemento.id, 10)}
                                    >
                                        {elemento.nombre}
                                    </option>
                                ))}
                        </select>
                        {errors.tipoViviendaId && (
                            <div className="invalid-feedback">
                                {errors.tipoViviendaId.message}
                            </div>
                        )}
                    </div>
                </Col>

                {/* PATIO BALCON */}
                <Col lg={9} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            ¿Contas con Patio o Balcon?
                        </Label>
                        // Configuración de opciones para "Patio/Balcón"
                        <select
                            name="patioBalcon"
                            className={`form-select ${
                                errors.patioBalcon ? "is-invalid" : ""
                            }`}
                            {...register("patioBalcon", {
                                required: "Seleccione una opción",
                            })}
                        >
                            <option value="">Seleccione...</option>
                            <option value={true}>Si.</option>{" "}
                            {/* Valor booleano true */}
                            <option value={false}>No.</option>{" "}
                            {/* Valor booleano false */}
                        </select>
                        {errors.patioBalcon && (
                            <div className="invalid-feedback">
                                {errors.patioBalcon.message}
                            </div>
                        )}
                    </div>
                </Col>

                {/* TRANSPORTE PROPIO */}
                <Col lg={9} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            ¿Contas con transporte propio para urgencias?
                        </Label>
                        <select
                            name="transportePropio"
                            className={`form-select ${
                                errors.transportePropio ? "is-invalid" : ""
                            }`}
                            {...register("transportePropio", {
                                required: "Seleccione una opción",
                            })}
                        >
                            <option value="">Seleccione...</option>
                            <option value={true}>Si.</option>
                            <option value={false}>No.</option>
                        </select>
                        {errors.transportePropio && (
                            <div className="invalid-feedback">
                                {errors.transportePropio.message}
                            </div>
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

                <button
                    className="btn-next-paseador"
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                >
                    <span className="transition"></span>
                    <span className="gradient"></span>
                    <span className="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step2;
