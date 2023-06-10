import React, { useState, useEffect, input, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Col,
    Container,
    Form,
    Label,
    Row,
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
} from "reactstrap";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import {
    getMascotaId,
    getTipoMascota,
    getSexoMascota,
    getAllEdadMascota,
    getAllRazaId,
    updatePets,
} from "../../../../services/Api";
import Navbar from "../../../landing/Navbar";
import Footer from "../../../landing/Footer";
import Loading from "../../../loading/Loading";
import {
    deleteFileStorage,
    uploadFilePetsUser,
} from "../../../../services/Firebase";

const SettingsPet = () => {

    //ESTADOS 
    
    const { mascotaId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");
    const [mascotaData, setMascotaData] = useState();
    const [raza, setRaza] = useState();
    const [tipoMascota, setTipoMascota] = useState();
    const [tipoSexo, setTipoSexo] = useState();
    const [edadMascota, setEdadMascota] = useState();

    const navigate = useNavigate();
    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };


    useEffect(() => {
        const mascota = async () => {
            const dataMascota = await getMascotaId(mascotaId);
            if (dataMascota) {
                setMascotaData(dataMascota);
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
        mascota();
        tipoMascotas();
        tipoSexo();
        edadMascota();
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (mascotaData) {
            console.log(mascotaData);
            setValue("nombre", `${mascotaData.nombre}`);
            setValue("tipoId", mascotaData.tipoId);
            setValue("edadId", mascotaData.edadId);
            setValue("sexoId", mascotaData.sexoId);
            const castrado = mascotaData.castracion ? "1" : "0";
            setValue("castracion", castrado);
            setValue("peso", mascotaData.peso);
            setValue("descripcion", mascotaData.descripcion);
            setValue("foto", mascotaData.foto);
            setValue("idUsuario", mascotaData.idUsuario);
            setValue("color", mascotaData.color);
            obtenerRazasPorTipo(mascotaData.tipoId);
        }
    }, [mascotaData, setValue]);

    const obtenerRazasPorTipo = async (tipoId) => {
        const razas = await getAllRazaId(tipoId);
        setRaza(razas);
        setValue("razaId", mascotaData.razaId);
    };
    const handleGetRazaChange = async (e) => {
        const tipoId = e.target.value;
        obtenerRazasPorTipo(tipoId);
    };

    const onSubmit = async (data) => {
        console.log(data);
        if (data.castracion === "1") {
            data.castracion = true;
        } else {
            data.castracion = false;
        }

        try {
            console.log(data);
            console.log(data.foto);
            deleteFileStorage(mascotaData.foto)
            const url = await uploadFilePetsUser(data.foto[0]);
            data.foto = url;
            setMascotaData(data);
            await updatePets(mascotaId, data); // Llama a la función de la API para actualizar los datos del usuario
            navigate("/perfil");
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al actualizar la mascota:", error);
        }
    };

    document.title = "Actualizar mascota| Amigos Peludos";
    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                    <Navbar></Navbar>

                    <div className="page-content perfil-fondo">
                        <Container fluid>
                            <Row>
                                <Col xxl={3}>
                                    <Card className="mt-n5">
                                        <CardBody className="p-4">
                                            <div className="text-center">
                                                <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                    <img
                                                        src={mascotaData.foto}
                                                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                        alt="user-profile"
                                                    />
                                                    <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                        <input
                                                            id="profile-img-file-input"
                                                            type="file"
                                                            className="profile-img-file-input"

                                                            
                                                            {...register(
                                                                "foto"
                                                            )}
                                                        />
                                                        <Label
                                                            htmlFor="profile-img-file-input"
                                                            className="profile-photo-edit avatar-xs"
                                                        >
                                                            <span className="avatar-title rounded-circle bg-light text-body">
                                                                <i className="ri-camera-fill"></i>
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>
                                                {/* NOMBRE MASCOTA */}
                                                <h5 className="fs-16 mb-1">
                                                    {mascotaData.nombre}
                                                </h5>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xxl={9}>
                                    <Card className="mt-xxl-n5">
                                        {/* TITULOS PESTAÑAS */}
                                        <CardHeader>
                                            <Nav
                                                className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                                role="tablist"
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active:
                                                                activeTab ===
                                                                "1",
                                                        })}
                                                        onClick={() => {
                                                            tabChange("1");
                                                        }}
                                                    >
                                                        <i className="fas fa-home"></i>
                                                        Datos de la mascota
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </CardHeader>

                                        <CardBody className="p-4">
                                            <TabContent activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    {/* FORMULARIO */}
                                                    <Form
                                                        onSubmit={handleSubmit(
                                                            onSubmit
                                                        )}
                                                    >
                                                        <Row>
                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Nombre
                                                                        de la
                                                                        mascota
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="nombre"
                                                                        placeholder="Nombre de la mascota"
                                                                        {...register(
                                                                            "nombre",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "El nombre de la mascota es requerido",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    />
                                                                    {errors.nombre && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .nombre
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Tipo de
                                                                        Mascota{" "}
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <select
                                                                        name="tipoId"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "tipoId",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "El tipo de la mascota es requerido.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                        onChange={
                                                                            handleGetRazaChange
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Seleccione
                                                                            un
                                                                            tipo
                                                                            de
                                                                            mascota
                                                                        </option>
                                                                        {tipoMascota &&
                                                                            tipoMascota.map(
                                                                                (
                                                                                    elemento
                                                                                ) => (
                                                                                    <option
                                                                                        className="form-control"
                                                                                        key={
                                                                                            elemento.id
                                                                                        }
                                                                                        value={
                                                                                            elemento.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            elemento.tipo
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                    {errors.tipoId && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .tipoId
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Edad
                                                                        aproximada
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <select
                                                                        name="edadId"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "edadId",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "La edad de la mascota es requerida.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        {edadMascota &&
                                                                            edadMascota.map(
                                                                                (
                                                                                    elemento
                                                                                ) => (
                                                                                    <option
                                                                                        className="form-control"
                                                                                        key={
                                                                                            elemento.id
                                                                                        }
                                                                                        value={
                                                                                            elemento.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            elemento.descripcion
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                    {errors.edadId && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .edadId
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Raza
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <select
                                                                        name="raza"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "razaId",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "La raza de la mascota es requerida.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        {raza &&
                                                                            raza.map(
                                                                                (
                                                                                    elemento
                                                                                ) => (
                                                                                    <option
                                                                                        className="form-control"
                                                                                        key={
                                                                                            elemento.id
                                                                                        }
                                                                                        value={
                                                                                            elemento.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            elemento.nombre
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                    {errors.raza && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .raza
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={2}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Peso
                                                                        aproximado
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="peso"
                                                                        placeholder="Peso aproximado"
                                                                        {...register(
                                                                            "peso",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "El peso de la mascota es requerido",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    />
                                                                    {errors.peso && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .peso
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={2}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Castrada/o
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <select
                                                                        name="castracion"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "castracion",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "Debe seleccionar si se encuentra castrada/o.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        <option value="1">
                                                                            Si
                                                                        </option>
                                                                        <option value="0">
                                                                            No
                                                                        </option>
                                                                    </select>
                                                                    {errors.castracion && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .castracion
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col lg={2}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Sexo
                                                                        Mascota
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <select
                                                                        name="sexoId"
                                                                        className="form-select "
                                                                        {...register(
                                                                            "sexoId",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "El sexo de la mascota es requerido.",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    >
                                                                        <option value="">
                                                                            Seleccione...
                                                                        </option>
                                                                        {tipoSexo &&
                                                                            tipoSexo.map(
                                                                                (
                                                                                    elemento
                                                                                ) => (
                                                                                    <option
                                                                                        className="form-control"
                                                                                        key={
                                                                                            elemento.id
                                                                                        }
                                                                                        value={
                                                                                            elemento.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            elemento.nombre
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                    {errors.sexoId && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .sexoId
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={3}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Color
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="color"
                                                                        placeholder="Color"
                                                                        {...register(
                                                                            "color",
                                                                            {
                                                                                required:
                                                                                    {
                                                                                        value: true,
                                                                                        message:
                                                                                            "El color de la mascota es requerido",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    />
                                                                    {errors.color && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .color
                                                                                    .message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Label className="form-label">
                                                                        Descripcion
                                                                        de la
                                                                        mascota
                                                                    </Label>
                                                                    <textarea
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="descripcion"
                                                                        {...register(
                                                                            "descripcion",
                                                                            {
                                                                                maxLength:
                                                                                    {
                                                                                        value: 400,
                                                                                        message:
                                                                                            "El maximo de caracteres es 400",
                                                                                    },
                                                                            }
                                                                        )}
                                                                    />
                                                                    {errors.descripcion && (
                                                                        <span className="text-danger">
                                                                            {
                                                                                errors
                                                                                    .descripcion
                                                                                    .message
                                                                            }
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
                                                                        Modificar Datos
                                                                    </button>
                                                                    <Link
                                                                        to={
                                                                            "/perfil"
                                                                        }
                                                                        type="button"
                                                                        className="btn btn-soft-success"
                                                                    >
                                                                        Cancelar
                                                                    </Link>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>

                    <Footer></Footer>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default SettingsPet;
