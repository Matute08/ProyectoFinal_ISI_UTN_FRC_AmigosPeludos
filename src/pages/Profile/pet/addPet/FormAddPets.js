import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Label,
    Row,
} from "reactstrap";
import { useAuth } from "../../../../services/AuthContext";
import {
    getTipoMascota,
    getSexoMascota,
    getAllEdadMascota,
    postMascota,
    getUserMail,
    updateUser,
    getAllRazaId,
} from "../../../../services/Api";
import { uploadFilePetsUser } from "../../../../services/Firebase";
import Loading from "../../../loading/Loading";

const FormAddPets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [tipoMascota, setTipoMascota] = useState();
    const [tipoSexo, setTipoSexo] = useState();
    const [edadMascota, setEdadMascota] = useState();
    const [raza, setRaza] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const showLoadingOverlay = () =>{
        setIsLoading(true)
    }
    const hideLoadingOverlay = () => {
        setIsLoading(false);
      };
    
      const handleAsyncTask = async () => {
        showLoadingOverlay();}


    useEffect(() => {
        const usuario = async () => {
            const dataUsuario = await getUserMail(user.email);
            if (dataUsuario) {
                setUserData(dataUsuario);
            }
            setIsLoading(false);
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
            const dataEdadMascota = await getAllEdadMascota();
            if (dataEdadMascota) {
                setEdadMascota(dataEdadMascota);
            }
        };
        usuario();
        tipoMascotas();
        tipoSexo();
        edadMascota(); 
    }, []);

    const getRaza = async (e) => {
        const op = e.target.value;
        setRaza(await getAllRazaId(op));
        if (raza) {
            console.log(raza);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const onSubmit = async (data) => {
        showLoadingOverlay()
        data.idUsuario = `${userData.id}`;
        userData.tieneMascota = true;

        if (data.castracion === "1") {
            data.castracion = true;
        } else {
            data.castracion = false;
        }

        try {
            if (data.foto) {
                const url = await uploadFilePetsUser(data.foto[0]);
                data.foto = url;
            }
            await postMascota(data);
            await updateUser(userData.id, userData);
            hideLoadingOverlay()
            navigate("/perfil");
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar el usuario:", error);
        }
    };
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    {/* FORMULARIO */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Nombre de la mascota
                                        <span className="text-danger">*</span>
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
                                        onChange={getRaza}
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
                                        <span className="text-danger">*</span>
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
                                    <Label className="form-label">
                                        Raza
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <select
                                        name="raza"
                                        className="form-select "
                                        {...register("razaId", {
                                            required: {
                                                value: true,
                                                message:
                                                    "La raza de la mascota es requerida.",
                                            },
                                        })}
                                    >
                                        <option value="">Seleccione...</option>
                                        {raza &&
                                            raza.map((elemento) => (
                                                <option
                                                    className="form-control"
                                                    key={elemento.id}
                                                    value={elemento.id}
                                                >
                                                    {elemento.nombre}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.raza && (
                                        <span className="text-danger">
                                            {errors.raza.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            <Col lg={2}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Peso
                                        <span className="text-danger">*</span>
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

                            <Col lg={2}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Castrada/o
                                        <span className="text-danger">*</span>
                                    </Label>
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
                            <Col lg={2}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Sexo Mascota
                                        <span className="text-danger">*</span>
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
                                        Color
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="color"
                                        placeholder="Color"
                                        {...register("color", {
                                            required: {
                                                value: true,
                                                message:
                                                    "El color de la mascota es requerido",
                                            },
                                        })}
                                    />
                                    {errors.color && (
                                        <span className="text-danger">
                                            {errors.color.message}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label className="form-label">
                                        Foto de la mascota
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                        id="profile-img-file-input"
                                        type="file"
                                        className="form-control"
                                        {...register("foto", {
                                            required: {
                                                value: true,
                                                message:
                                                    "La foto de la mascota es obligatoria",
                                            },
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
                                        to={"/perfil"}
                                        type="button"
                                        className="btn btn-soft-success"
                                    >
                                        Cancelar
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </>
            ) : (
                <>
                <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default FormAddPets;
