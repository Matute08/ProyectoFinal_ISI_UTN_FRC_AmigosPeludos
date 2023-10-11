import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getUserMail, getAllBarrio } from "../../../services/api";
import Loading from "../../components/Loading";
import { parse } from "date-fns";
import Map from "../../components/maps/MapaUbicacionParticular";
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
    const [isGeocoding, setIsGeocoding] = useState(false); // Nuevo estado para rastrear la geocodificación

    const [location, setLocation] = useState({
        lat: -31.41894,
        lng: -64.19353,
    });

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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleMapClick = (lat, lng) => {
        setLatitud(lat);
        setLongitud(lng);
    };
    const handleLocationChange = (location) => {
        setLatitud(location.lat);
        setLongitud(location.lon);
    };
    const onSubmit = (data) => {
        if (isGeocoding) {
            // Evita enviar el formulario si la geocodificación está en curso
            return;
        }

        setIsGeocoding(true); // Indica que la geocodificación está en curso

        data.latitud = Number(latitud.toFixed(5));
        data.longitud = Number(longitud.toFixed(5));
        data.barrioId = parseInt(data.barrioId, 10);
        data.numeroCalle = parseInt(data.numeroCalle, 10);
        onNext(data); // Llama a la función onNext para avanzar al siguiente paso
    };

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
                    <Row className="w-100">
                        {/* nombre completo */}
                        <Col lg={6} className="d-flex justify-content-center">
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
                        <Col lg={6} className="d-flex justify-content-center">
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

                        {/* direccion */}
                        <Col lg={4} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">Dirección:</Label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.direccion ? "is-invalid" : ""
                                    }`}
                                    name="direccion"
                                    placeholder="Dirección"
                                    {...register("direccion", {
                                        required: "Este campo es obligatorio",
                                    })}
                                    onBlur={(e) => {
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
                        <Col lg={2} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">Altura:</Label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    
                                    className={`form-control ${
                                        errors.numeroCalle ? "is-invalid" : ""
                                    }`}
                                    name="numeroCalle"
                                    placeholder="Altura"
                                    {...register("numeroCalle", {
                                        required: "Este campo es obligatorio",
                                    })}
                                    onBlur={(e) => {
                                        setAltura(parseInt(e.target.value, 10)); // Parsea el valor a un número usando parseInt
                                    }}
                                    onKeyPress={handleKeyPress}
                                />
                                {errors.numeroCalle && (
                                    <p className="invalid-feedback">
                                        {errors.numeroCalle.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* Celular */}
                        <Col lg={3} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">
                                    Celular de Contácto
                                </Label>
                                <input
                                    type="text"
                                    maxLength={15}
                                    
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
                                    onKeyPress={handleKeyPress}
                                />
                                {errors.numeroTelefono && (
                                    <p className="invalid-feedback">
                                        {errors.numeroTelefono.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* Cuit */}
                        <Col lg={3} className="d-flex justify-content-center">
                            <div className="mb-3 w-100">
                                <Label className="form-label">CUIT</Label>
                                <input
                                    type="text"
                                    maxLength={11}
                                    className={`form-control ${
                                        errors.cuil ? "is-invalid" : ""
                                    }`}
                                    name="cuil"
                                    placeholder="CUIT Veterinaria"
                                    {...register("cuil", {
                                        required: "Este campo es obligatorio",
                                    })}
                                    onKeyPress={handleKeyPress}
                                />
                                {errors.cuil && (
                                    <p className="invalid-feedback">
                                        {errors.cuil.message}
                                    </p>
                                )}
                            </div>
                        </Col>

                        <Col lg={12}>
                            <Map
                                onMapClick={handleMapClick}
                                direccion={direccion}
                                altura={altura}
                                ciudad={"Cordoba"}
                                pais={"Argentina"}
                                barrio={selectedBarrio}
                                onLocationChange={handleLocationChange}
                            />
                        </Col>
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
                    </Row>
                </div>
            )}
        </Form>
    );
};

export default Step1;
