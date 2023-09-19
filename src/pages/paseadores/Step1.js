import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { useAuth } from "../../services/AuthContext";
import { getUserMail } from "../../services/api";
import { format, parse } from 'date-fns';


const Step1 = ({ onNext }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState();

    useEffect(() => {
        const usuario = async () => {
            const dataUsuario = await getUserMail(user.email);
            if (dataUsuario) {
                setUserData(dataUsuario);
            }
            setIsLoading(false);
        };

        usuario();
    }, []);

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = parse(dateOfBirth, 'yyyy-MM-dd', new Date());
      
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
      
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
        data.nombreCompleto=userData&& userData.nombreCompleto
        onNext(data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            <Row className="d-flex justify-content-center">
                {/* nombre completo */}
                <Col lg={8} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">Nombre Completo</Label>
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
                        {errors.nombreCompleto && !userData.nombreCompleto && (
                            <p className="invalid-feedback">
                                {errors.nombreCompleto.message}
                            </p>
                        )}
                    </div>
                </Col>

                {/* Celular */}
                <Col lg={8} className="d-flex justify-content-center">
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
                </Col>

                {/* EDAD */}
                <Col lg={8} className="d-flex justify-content-center">
                    <div className="mb-3 w-100">
                        <Label className="form-label">
                            Fecha de Nacimiento
                        </Label>
                        <input
                            type="date"
                            className={`form-control ${
                                errors.fechaNacimiento ? "is-invalid" : ""
                            }`}
                            name="fechaNacimiento"
                            {...register("fechaNacimiento", {
                                required: "Este campo es obligatorio",
                                validate: (value) => {
                                    const age = calculateAge(value);
                              
                                    if (isNaN(age) || age < 18) {
                                      return 'Debes tener al menos 18 años.';
                                    }
                            }})}
                        />
                        {errors.fechaNacimiento && (
                            <p className="invalid-feedback">
                                {errors.fechaNacimiento.message}
                            </p>
                        )}
                    </div>
                </Col>
            </Row>
            <Col className="button-container d-flex justify-content-end">
                <button
                    className="btn-next-paseador button-container"
                    type="submit"
                >
                    <span class="transition"></span>
                    <span class="gradient"></span>
                    <span class="label">Siguiente</span>
                </button>
            </Col>
        </Form>
    );
};

export default Step1;
