import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getAllBarrio } from "../../services/commonApi";
import { getUserMail } from "../../services/userApi";
import Loading from "../components/Loading";
import { format, parse } from "date-fns";
import { Link } from "react-router-dom";

const Step1 = ({ onNext }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [barrio, setBarrio] = useState([]);

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
        const fetchBarrio = async () => {
            try {
                const barrioData = await getAllBarrio();

                setBarrio(barrioData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setIsLoading(false);
            }
        };

        fetchUserData();
        fetchBarrio()
    }, []);

    
    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = parse(dateOfBirth, "yyyy-MM-dd", new Date());

        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            return age - 1;
        }

        return age;
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        //data.celular = parseInt(data.celular, 10);
        data.barrioId = parseInt(data.barrioId,10)
        data.nroCalle = parseInt(data.nroCalle, 10);

        onNext(data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            {!isLoading ? (
                <>
                    <Row className="d-flex justify-content-center">
                        {/* nombre completo */}
                        {/* <Col lg={9} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Nombre Completo
                                </Label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.nombreCompleto &&
                                        !userData.nombreCompleto
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="nombreCompleto"
                                    placeholder="Nombre Completo"
                                    value={
                                        userData && userData.nombreCompleto
                                            ? userData.nombreCompleto
                                            : ""
                                    }
                                    {...register("nombreCompleto", {
                                        validate: (value) => {
                                            if (
                                                !userData.nombreCompleto &&
                                                value.trim() === ""
                                            ) {
                                                return "Este campo es obligatorio";
                                            }
                                        },
                                    })}
                                />
                                {errors.nombreCompleto &&
                                    !userData.nombreCompleto && (
                                        <p className="invalid-feedback">
                                            {errors.nombreCompleto.message}
                                        </p>
                                    )}
                            </div>
                        </Col> */}

                        {/* Celular */}
                        {/* <Col lg={9} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">Celular</Label>
                                <input
                                    type="number"
                                    className={`form-control ${
                                        errors.celular ? "is-invalid" : ""
                                    }`}
                                    name="celular"
                                    placeholder="Celular"
                                    {...register("celular", {
                                        required: "Este campo es obligatorio",
                                    })}
                                />
                                {errors.celular && (
                                    <p className="invalid-feedback">
                                        {errors.celular.message}
                                    </p>
                                )}
                            </div>
                        </Col> */}

                        {/* EDAD */}
                        <Col lg={9} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Fecha de Nacimiento
                                </Label>
                                <input
                                    type="date"
                                    className={`form-control ${
                                        errors.fechaNacimiento
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="fechaNacimiento"
                                    {...register("fechaNacimiento", {
                                        required: "Este campo es obligatorio",
                                        validate: (value) => {
                                            const age = calculateAge(value);

                                            if (isNaN(age) || age < 18) {
                                                return "Debes tener al menos 18 años.";
                                            }
                                        },
                                    })}
                                />
                                {errors.fechaNacimiento && (
                                    <p className="invalid-feedback">
                                        {errors.fechaNacimiento.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* BARRIO */}
                        <Col lg={9} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Barrio de vivienda
                                </Label>
                                <select
                                    name="barrioId"
                                    className={`form-select ${
                                        errors.barrioId
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("barrioId", {
                                        required: "Seleccione una opción",
                                    })}
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
                                {errors.barrioId && (
                                    <div className="invalid-feedback">
                                        {errors.barrioId.message}
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <Row>
                                {/* calle donde vive */}
                                <Col
                                    lg={6}
                                    className="d-flex justify-content-center"
                                >
                                    <div className="mb-3 w-100">
                                        <Label className="form-label">
                                            Dirección de vivienda:
                                        </Label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.calle ? "is-invalid" : ""
                                            }`}
                                            name="calle"
                                            placeholder="Dirección"
                                            {...register("calle", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                        />
                                        {errors.calle && (
                                            <p className="invalid-feedback">
                                                {errors.calle.message}
                                            </p>
                                        )}
                                    </div>
                                </Col>

                                {/* numero de calle */}
                                <Col
                                    lg={3}
                                    className="d-flex justify-content-center"
                                >
                                    <div className="mb-3 w-100">
                                        <Label className="form-label">
                                            Altura:
                                        </Label>
                                        <input
                                            type="number"
                                            className={`form-control ${
                                                errors.nroCalle
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            name="nroCalle"
                                            placeholder="Nro"
                                            {...register("nroCalle", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                        />
                                        {errors.nroCalle && (
                                            <p className="invalid-feedback">
                                                {errors.nroCalle.message}
                                            </p>
                                        )}
                                    </div>
                                </Col>
                                {/* piso */}
                                <Col
                                    lg={3}
                                    className="d-flex justify-content-center"
                                >
                                    <div className="mb-3 w-100">
                                        <Label className="form-label">
                                            Piso/Depto:
                                        </Label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.piso ? "is-invalid" : ""
                                            }`}
                                            name="piso"
                                            placeholder="Piso/Depto"
                                            {...register("piso")}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Col className="button-container d-flex justify-content-end">
                        <button
                            className="btn-next-paseador btn-next "
                            type="submit"
                        >
                            <span class="transition"></span>
                            <span class="gradient"></span>
                            <span class="label">Siguiente</span>
                        </button>
                    </Col>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </Form>
    );
};

export default Step1;
