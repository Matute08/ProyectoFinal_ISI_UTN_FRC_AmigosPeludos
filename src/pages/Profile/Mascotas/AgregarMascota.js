import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Col, Container, Form, Label, Row } from "reactstrap";

import { useAuth } from "../../autheticationInner/AuthContext";
import {
    getTipoMascota,
    getSexoMascota,
    getEdadMascota,
    postMascota,
    getUserMail,
    updateUser,
} from "../../../services/Api";
import { uploadFilePetsUser } from "../../autheticationInner/Firebase";

//import images

const AgregarMascota = ({ onCancel }) => {
    const handleCancelar = () => {
        onCancel(); // Llama a la función onCancel pasada como prop
    };

    const navigate = useNavigate();

    const { user } = useAuth();
    const [userData, setUserData] = useState();
    // const [userId, setUserId] = useState();

    const [tipoMascota, setTipoMascota] = useState();
    const [tipoSexo, setTipoSexo] = useState();
    const [edadMascota, setEdadMascota] = useState();

    useEffect(() => {
        const usuario = async () => {
            const dataUsuario = await getUserMail(user.email);
            if (dataUsuario) {
                setUserData(dataUsuario);
            }
        };
        const tipoMascotas = async () => {
            const dataTipoMascota = await getTipoMascota();
            if (dataTipoMascota) {
                setTipoMascota(dataTipoMascota);
            }
        };
        const tipoSexo = async () => {
            const dataTipoSexo = await getSexoMascota();
            if (dataTipoSexo) {
                setTipoSexo(dataTipoSexo);
            }
        };
        const edadMascota = async () => {
            const dataEdadMascota = await getEdadMascota();
            if (dataEdadMascota) {
                setEdadMascota(dataEdadMascota);
            }
        };
        usuario();
        tipoMascotas();
        tipoSexo();
        edadMascota();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        data.idUsuario = `${userData.id}`;
        console.log(userData.tieneMascota);
        userData.tieneMascota = true;

        if (data.castracion === "1") {
            data.castracion = true;
        } else {
            data.castracion = false;
        }

        try {
            if (data.foto) {
                const url = await uploadFilePetsUser(data.foto[0])
                data.foto = url;
            }
            await postMascota(data);
            await updateUser(userData.id, userData);
            window.location.reload();
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar el usuario:", error);
        }
    };

    document.title = "Agregar Mascota | Amigos Peludos";
    return (
        <React.Fragment>
            <Container fluid>
                {/* FORMULARIO */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Nombre de la mascota
                                </Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    placeholder="Nombre de la mascota"
                                    {...register("nombre", {
                                        required: {
                                            value: true,
                                            message:
                                                "El nombre de la mascota es requerido",
                                        },
                                    })}
                                />
                                {errors.nombre && (
                                    <span className="text-danger">
                                        {errors.nombre.message}
                                    </span>
                                )}
                            </div>
                        </Col>


                        <Col lg={3}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Tipo de Mascota{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="tipoId"
                                    className="form-select "
                                    {...register("tipoId", {
                                        required: {
                                            value: true,
                                            message:
                                                "El tipo de la mascota es requerido.",
                                        },
                                    })}
                                >
                                    <option value="">
                                        Seleccione un tipo de mascota
                                    </option>
                                    {tipoMascota &&
                                        tipoMascota.map((elemento) => (
                                            <option
                                                className="form-control"
                                                key={elemento.id}
                                                value={elemento.id}
                                            >
                                                {elemento.tipo}
                                            </option>
                                        ))}
                                </select>
                                {errors.tipoId && (
                                    <span className="text-danger">
                                        {errors.tipoId.message}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Edad aproximada
                                </Label>
                                <select
                                    name="edadId"
                                    className="form-select "
                                    {...register("edadId", {
                                        required: {
                                            value: true,
                                            message:
                                                "La edad de la mascota es requerida.",
                                        },
                                    })}
                                >
                                    <option value="">Seleccione...</option>
                                    {edadMascota &&
                                        edadMascota.map((elemento) => (
                                            <option
                                                className="form-control"
                                                key={elemento.id}
                                                value={elemento.id}
                                            >
                                                {elemento.descripcion}
                                            </option>
                                        ))}
                                </select>
                                {errors.edadId && (
                                    <span className="text-danger">
                                        {errors.edadId.message}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">Raza</Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="raza"
                                    placeholder="Raza"
                                    {...register("raza", {
                                        required: {
                                            value: true,
                                            message: "La raza es requerida",
                                        },
                                    })}
                                />
                                {errors.raza && (
                                    <span className="text-danger">
                                        {errors.raza.message}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Peso aproximado
                                </Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="peso"
                                    placeholder="Peso aproximado"
                                    {...register("peso", {
                                        required: {
                                            value: true,
                                            message:
                                                "El peso de la mascota es requerido",
                                        },
                                    })}
                                />
                                {errors.peso && (
                                    <span className="text-danger">
                                        {errors.peso.message}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">Castrada/o</Label>
                                <select
                                    name="castracion"
                                    className="form-select "
                                    {...register("castracion", {
                                        required: {
                                            value: true,
                                            message:
                                                "Debe seleccionar si se encuentra castrada/o.",
                                        },
                                    })}
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="1">Si</option>
                                    <option value="0">No</option>
                                </select>
                                {errors.castracion && (
                                    <span className="text-danger">
                                        {errors.castracion.message}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Sexo Mascota
                                </Label>
                                <select
                                    name="sexoId"
                                    className="form-select "
                                    {...register("sexoId", {
                                        required: {
                                            value: true,
                                            message:
                                                "El sexo de la mascota es requerido.",
                                        },
                                    })}
                                >
                                    <option value="">Seleccione...</option>
                                    {tipoSexo &&
                                        tipoSexo.map((elemento) => (
                                            <option
                                                className="form-control"
                                                key={elemento.id}
                                                value={elemento.id}
                                            >
                                                {elemento.nombre}
                                            </option>
                                        ))}
                                </select>
                                {errors.sexoId && (
                                    <span className="text-danger">
                                        {errors.sexoId.message}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Foto de la mascota
                                </Label>
                                <input
                                    id="profile-img-file-input"
                                    type="file"
                                    className="form-control"
                                    {...register("foto",{
                                        required:{
                                            value:true,
                                            message:"La foto de la mascota es obligatoria"
                                        }
                                    })}
                                />
                                {errors.foto && (
                                    <span className="text-danger">
                                        {errors.foto.message}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col lg={12}>
                            <div className="mb-3">
                                <Label className="form-label">
                                    Descripcion de la mascota
                                </Label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    name="descripcion"
                                    {...register("descripcion", {
                                        maxLength: {
                                            value: 400,
                                            message:
                                                "El maximo de caracteres es 400",
                                        },
                                    })}
                                />
                                {errors.descripcion && (
                                    <span className="text-danger">
                                        {errors.descripcion.message}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Agregar Mascota
                                </button>
                                <Link
                                    onClick={handleCancelar}
                                    type="button"
                                    className="btn btn-soft-success"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </React.Fragment>
    );
};

export default AgregarMascota;
