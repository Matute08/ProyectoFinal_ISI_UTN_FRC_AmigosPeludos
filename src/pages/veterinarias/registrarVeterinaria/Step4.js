import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label, Input } from "reactstrap";
import { getUserMail, postVeterinaria, updateUser } from "../../../services/api";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Step4 = ({ onNext, onPrev, step1Data, step2Data, step3Data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm();
    const showLoadingOverlay = () => {
        setIsLoading(true);
    };
    const hideLoadingOverlay = () => {
        setIsLoading(false);
    };

    const handleAsyncTask = async () => {
        showLoadingOverlay();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                const dataLocalStorage = JSON.parse(cachedUserData);
                const userEmail = dataLocalStorage.email;

                const userData = await getUserMail(userEmail);
                setUserData(userData);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data) => {
        const cbu =
            data.aceptaTransferencias === "Si" ? data.trasnferencia  : null;

        const allData = {
            ...step1Data,
            ...step2Data,
            ...step3Data,
            cbu: cbu,
            estadoId: parseInt(1,10),
            usuarioId: userData.id
        };

        try {
            //setIsLoading(true);
            console.log(allData);

            handleConfirmacionVeterinaria()
            await postVeterinaria(allData);

            const actualizarUser = {
                esVeterinaria: true
              };
              
              await updateUser(userData.id, actualizarUser);

            // setTimeout(() => {
            //     setIsLoading(false);
            //     onNext(allData);
            // }, 4000);
            // navigate("/veterinarias")

           
              
        } catch (error) {
            console.error("Error al realizar la publicación:", error);
            setIsLoading(false);
        }

       
    };

    const handleConfirmacionVeterinaria = async () => {
        // Muestra el mensaje de éxito con temporizador y barra de progreso
        Swal.fire({
            title: `La Veterinaria fue creada y se encuentra en Revisión`,
            icon: "success",
            html: "Cerrando en <b></b> segundos.",
            timer: 3000, // Tiempo en milisegundos (2 segundos)
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: () => {
                const b = Swal.getHtmlContainer().querySelector("b");
                const timerInterval = setInterval(() => {
                    b.textContent = (Swal.getTimerLeft() / 1000).toFixed(1);
                }, 100);
            },
            willClose: () => {
                showLoadingOverlay();

                navigate(`/veterinarias/`);
            },
        });
    };

    const aceptaTransferencias = watch("aceptaTransferencias");
    const handleKeyPress = (e) => {
        // Permitir solo números (0-9) y la tecla de retroceso
        const regex = /^[0-9\b]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="d-flex justify-content-center">
                    <Row className="w-75">
                        <Label className="m-4">
                            El objetivo de las transferencias, es saber si usted
                            acepta recibir donaciones de las personas, con el
                            fin de, si alguna persona no puede pagar el
                            tratamiento de una mascota, que esa mascota, reciba
                            igualmente ese tratamiento para asegurar su vida.
                        </Label>
                        <Col lg={12} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    ¿Acepta donaciones?
                                </Label>
                                <select
                                    {...register("aceptaTransferencias", {
                                        required: "Seleccione una opción",
                                    })}
                                    className={`form-select ${
                                        errors.aceptaTransferencias
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                >
                                    <option value="" selected disabled>Seleccione...</option>
                                    <option value="Si">Sí</option>
                                    <option value="No">No</option>
                                </select>
                                {errors.aceptaTransferencias && (
                                    <div className="invalid-feedback">
                                        {errors.aceptaTransferencias.message}
                                    </div>
                                )}
                            </div>
                        </Col>

                        {aceptaTransferencias === "Si" && (
                            <Col
                                lg={12}
                                className="d-flex justify-content-center"
                            >
                                <div className="mb-3 w-100">
                                    <Label className="form-label">
                                        Ingrese su CBU para recibir
                                        transferencias
                                    </Label>
                                    <input
                                        type="text"
                                        maxLength={15}
                                        {...register("trasnferencia", {
                                            required:
                                                "Este campo es obligatorio",
                                        })}
                                        placeholder="Ingrese CBU"
                                        className={`form-control ${
                                            errors.trasnferencia
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onKeyPress={handleKeyPress}
                                    />
                                    {errors.trasnferencia && (
                                        <div className="invalid-feedback">
                                            {errors.trasnferencia.message}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        )}

                        <Col className="button-container">
                            {onPrev && (
                                <button
                                    className="btn-next-paseador"
                                    onClick={onPrev}
                                >
                                    <span class="transition transition-back"></span>
                                    <span class="gradient"></span>
                                    <span class="label">Atras</span>
                                </button>
                            )}

                            <button className="btn-next-paseador" type="submit">
                                <span class="transition"></span>
                                <span class="gradient"></span>
                                <span class="label">Finalizar</span>
                            </button>
                        </Col>
                    </Row>
                </div>
            )}
        </Form>
    );
};

export default Step4;
