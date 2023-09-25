import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getUserMail, getAllBarrio } from "../../../services/api";
import Loading from "../../components/Loading";
import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import GoogleMap from "../../components/mapaGoogle/GoogleMap";

const Step1 = ({ onNext }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [barrio, setBarrio] = useState([]);
    const [latitud, setLatitud] = useState();
    const [direccion, setDireccion] = useState("");
    const [altura, setAltura] = useState("");
    const [selectedBarrio, setSelectedBarrio] = useState("");
    const [direccionCompleta, setDireccionCompleta] = useState("");
    const [longitud, setLongitud] = useState();
    const [location, setLocation] = useState({
        lat: -31.41894,
        lng: -64.19353,
    }); // Coordenadas iniciales

    const handleLocationChange = (newLocation) => {
        // Aquí puedes hacer algo con las coordenadas seleccionadas, como guardarlas en el estado local o enviarlas a través de una función de devolución de llamada.
        setLocation(newLocation);

        // Obtener la latitud y longitud
        setLatitud(newLocation.lat);
        setLongitud(newLocation.lng);

        // Hacer algo con lat y lng, por ejemplo, guardarlos en el estado local.
        // Puedes usar lat y lng como necesites en tu aplicación.

        // Calcula la dirección completa en función de los valores actuales
        const nuevaDireccionCompleta = `${direccion}, ${altura}, Barrio ${selectedBarrio}`;
        setDireccionCompleta(nuevaDireccionCompleta);
    };

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
        fetchBarrio();
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
        data.nombreCompleto = userData && userData.nombreCompleto;
        onNext(); // Llama a la función onNext para avanzar al siguiente paso
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Row className="d-flex justify-content-center">
                        {/* nombre completo */}
                        <Col lg={8} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Nombre Veterinaria
                                </Label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.nombre ? "is-invalid" : ""
                                    }`}
                                    name="nombre"
                                    placeholder="Nombre Veterinaria"
                                    {...register("nombre", {
                                        validate: (value) => {
                                            if (value.trim() === "") {
                                                return "Este campo es obligatorio";
                                            }
                                        },
                                    })}
                                />
                                {errors.nombre && !userData.nombre && (
                                    <p className="invalid-feedback">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* BARRIO */}
                        <Col lg={9} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">Barrio</Label>
                                <select
                                    name="barrioId"
                                    className={`form-select ${
                                        errors.barrioId ? "is-invalid" : ""
                                    }`}
                                    {...register("barrioId", {
                                        required: "Seleccione una opción",
                                    })}
                                    onChange={(e) => {
                                        // Actualiza el barrio seleccionado en el estado
                                        setSelectedBarrio(e.target.value);
                                    }}
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
                                {/* direccion */}
                                <Col
                                    lg={6}
                                    className="d-flex justify-content-center"
                                >
                                    <div className="mb-3 w-100">
                                        <Label className="form-label">
                                            Dirección:
                                        </Label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.direccion
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            name="direccion"
                                            placeholder="Dirección"
                                            {...register("direccion", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                            onBlur={(e) => {
                                                // Actualiza la dirección en el estado
                                                setDireccion(e.target.value);
                                            }}
                                        />
                                        {errors.direccion && (
                                            <p className="invalid-feedback">
                                                {errors.direccion.message}
                                            </p>
                                        )}
                                    </div>
                                </Col>

                                {/* numero */}
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
                                                errors.numeroCalle
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            name="numeroCalle"
                                            placeholder="Altura"
                                            {...register("numeroCalle", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                            onBlur={(e) => {
                                                // Actualiza la altura en el estado
                                                setAltura(e.target.value);
                                            }}
                                        />
                                        {errors.numeroCalle && (
                                            <p className="invalid-feedback">
                                                {errors.numeroCalle.message}
                                            </p>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                        {/* Celular */}
                        <Col lg={8} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Celular de Contácto
                                </Label>
                                <input
                                    type="number"
                                    className={`form-control ${
                                        errors.numeroTelefono
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="numeroTelefono"
                                    placeholder="Celular de Contácto"
                                    {...register("numeroTelefono", {
                                        required: "Este campo es obligatorio",
                                    })}
                                />
                                {errors.numeroTelefono && (
                                    <p className="invalid-feedback">
                                        {errors.numeroTelefono.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* Cuit */}
                        <Col lg={8} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">CUIT</Label>
                                <input
                                    type="number"
                                    className={`form-control ${
                                        errors.cuil ? "is-invalid" : ""
                                    }`}
                                    name="cuil"
                                    placeholder="CUIT Veterinaria"
                                    {...register("cuil", {
                                        required: "Este campo es obligatorio",
                                    })}
                                />
                                {errors.cuil && (
                                    <p className="invalid-feedback">
                                        {errors.cuil.message}
                                    </p>
                                )}
                            </div>
                        </Col>
                        <Row className="d-flex justify-content-center">
                            <Col lg={12}>
                                <Label className="form-label">
                                    Selecciona una ubicación:
                                </Label>
                                <Label>
                                    {" "}
                                    LAT: {latitud} LONG: {longitud}
                                </Label>
                                <GoogleMap
                                    initialLocation={location}
                                    onLocationChange={handleLocationChange}
                                    direccion={direccion}
                                    altura={altura}
                                    selectedBarrio={selectedBarrio}
                                    selectedCiudad={"Cordoba"}
                                />
                            </Col>
                        </Row>
                    </Row>
                </>
            )}
        </Form>
    );
};

export default Step1;
