import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getUserMail, getAllBarrio } from "../../../services/api";
import Loading from "../../components/Loading";
import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import GoogleMap from "../../components/mapaGoogle/GoogleMap";

const Step3 = ({ onNext, onPrev, step1Data, step2Data  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const userData = await getUserMail(userEmail);
                setUserData(userData);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // Realiza la conversión de valores booleanos en el objeto "servicios"
        const servicios = {
            castraciones: data.castraciones === "true" ? true : false,
            internaciones: data.internaciones === "true" ? true : false,
            vacunaciones: data.vacunaciones === "true" ? true : false,
            equipoLaboratorio: data.equipoLaboratorio === "true" ? true : false,
            radiografias: data.radiografias === "true" ? true : false,
            ecografias: data.ecografias === "true" ? true : false,
            guardia24hs: data.guardia24hs === "true" ? true : false,
            emergencias: data.emergencias === "true" ? true : false,
            observaciones: data.observaciones === "true" ? true : false,
            otros: data.otros === "" ? null : data.otros // Incluye el valor de "otros" aquí
        };
    
        // Combina los datos de servicios con otros datos necesarios
        const sendData = {
            ...step1Data,
            ...step2Data,
            servicios
        };
    
        // Envía sendData al servidor
        onNext(sendData);
    };
    

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="d-flex justify-content-center">
                        <Row className="w-75">
                            {/* Castraciones */}
                            <Col
                                lg={3}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Castraciones
                                    </Label>
                                    <select
                                        name="castraciones"
                                        className={`form-select ${
                                            errors.castraciones
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("castraciones", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.castraciones && (
                                        <div className="invalid-feedback">
                                            {errors.castraciones.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* internaciones */}
                            <Col
                                lg={3}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Internaciones
                                    </Label>
                                    <select
                                        name="internaciones"
                                        className={`form-select ${
                                            errors.internaciones
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("internaciones", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.internaciones && (
                                        <div className="invalid-feedback">
                                            {errors.internaciones.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* vacunaciones */}
                            <Col
                                lg={3}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Vacunaciones
                                    </Label>
                                    <select
                                        name="vacunaciones"
                                        className={`form-select ${
                                            errors.vacunaciones
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("vacunaciones", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.vacunaciones && (
                                        <div className="invalid-feedback">
                                            {errors.vacunaciones.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* radiografias */}
                            <Col
                                lg={3}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Radiografias
                                    </Label>
                                    <select
                                        name="radiografias"
                                        className={`form-select ${
                                            errors.radiografias
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("radiografias", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.radiografias && (
                                        <div className="invalid-feedback">
                                            {errors.radiografias.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* ecografias */}
                            <Col
                                lg={4}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Ecografias
                                    </Label>
                                    <select
                                        name="ecografias"
                                        className={`form-select ${
                                            errors.ecografias
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("ecografias", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.ecografias && (
                                        <div className="invalid-feedback">
                                            {errors.ecografias.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* guardia24hs */}
                            <Col
                                lg={4}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Haces Guardias 24hs
                                    </Label>
                                    <select
                                        name="guardia24hs"
                                        className={`form-select ${
                                            errors.guardia24hs
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("guardia24hs", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.guardia24hs && (
                                        <div className="invalid-feedback">
                                            {errors.guardia24hs.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* emergencias */}
                            <Col
                                lg={4}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Realizas Emergencias a Domicilio
                                    </Label>
                                    <select
                                        name="emergencias"
                                        className={`form-select ${
                                            errors.emergencias
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("emergencias", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.emergencias && (
                                        <div className="invalid-feedback">
                                            {errors.emergencias.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* observaciones */}
                            <Col
                                lg={6}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Realizas Observaciones Gratis
                                    </Label>
                                    <select
                                        name="observaciones"
                                        className={`form-select ${
                                            errors.observaciones
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("observaciones", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.observaciones && (
                                        <div className="invalid-feedback">
                                            {errors.observaciones.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            {/* equipoLaboratorio */}
                            <Col
                                lg={6}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Extracciones de sangre
                                    </Label>
                                    <select
                                        name="equipoLaboratorio"
                                        className={`form-select ${
                                            errors.equipoLaboratorio
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("equipoLaboratorio", {
                                            required: "Seleccione una opción",
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value={true}>Si.</option>
                                        <option value={false}>No.</option>
                                    </select>
                                    {errors.equipoLaboratorio && (
                                        <div className="invalid-feedback">
                                            {errors.equipoLaboratorio.message}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* otros */}
                            <Col
                                lg={12}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">Otros</Label>
                                    <input
                                        type="text"
                                        name="otros"
                                        className={`form-control 
                                        }`}
                                        {...register("otros")}
                                    />

                                    
                                </div>
                            </Col>

                            <Col className="button-container">
                                {onPrev && (
                                    <button
                                        className="btn-next-paseador"
                                        onClick={onPrev}
                                    >
                                        <span className="transition transition-back"></span>
                                        <span className="gradient"></span>
                                        <span className="label">Atrás</span>
                                    </button>
                                )}

                                <button
                                    className="btn-next-paseador"
                                    type="submit"
                                >
                                    <span className="transition"></span>
                                    <span className="gradient"></span>
                                    <span className="label">Siguiente</span>
                                </button>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </Form>
    );
};

export default Step3;
