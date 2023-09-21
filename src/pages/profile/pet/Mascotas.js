import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../../../services/AuthContext";
import {
    getUserMail,
    getMascotasUsuario,
    deletePet,
    updateUser,
} from "../../../services/api";
import AgregarMascota from "./addPet/AddPets";
import ConsultarMascota from "../pet/consultPet/ConsultPet";
import { deleteFileStorage } from "../../../services/Firebase";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const Mascota = () => {
    const { user } = useAuth();
    const { handleSweetAlertDeletePet } = Modal();
    const [userData, setUserData] = useState();
    const [mostrarAgregarMascota, setMostrarAgregarMascota] = useState(false);
    const [mostrarConsultarMascota, setMostrarContultarMascota] = useState(0);
    const [userMascota, setUserMascota] = useState([]);
    const [countPetUser, setCountPetUser] = useState([]);

    const handleMostrarComponenteConsultarMascota = (id) => {
        setMostrarContultarMascota(id);
    };
    const handleCancelar = () => {
        setMostrarAgregarMascota(false);
        setMostrarContultarMascota(0);
    };

    //accion al hacer click en eliminar mascota
    const handleDeleteButtonClick = (nombre, id, foto) => {
        handleSweetAlertDeletePet(nombre, id, foto, handleDeletePet);
    };

    //funcion para eliminar a la mascota
    const handleDeletePet = async (id, foto) => {
        console.log(countPetUser);
        if (countPetUser === 1) {
            console.log("entro");
            userData.tieneMascota = false;
            console.log(userData.tieneMascota);
        }
        try {
            await deletePet(id);
            await updateUser(userData.id, userData);
            await deleteFileStorage(foto);
            return true;
            // window.location.reload();
        } catch (error) {
            console.log(error);
            return false;
        }
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

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${
                    datosUsuario.calle + " " + datosUsuario.nroCalle
                }`;
                setUserData(datosUsuario);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            const mascota = async () => {
                setUserMascota(await getMascotasUsuario(userData.id));
            };
            mascota();
        }
    }, [userData]);

    useEffect(() => {
        if (userMascota) {
            setCountPetUser(userMascota.length);
        }
    }, [userMascota]);

    const tieneMascota = userData?.tieneMascota;

    return (
        <React.Fragment>
            {mostrarAgregarMascota ? (
                <AgregarMascota onCancel={handleCancelar} />
            ) : mostrarConsultarMascota !== 0 ? (
                <ConsultarMascota
                    onCancel={handleCancelar}
                    mascotaId={mostrarConsultarMascota}
                />
            ) : (
                <>
                    {tieneMascota ? (
                        <Container fluid>
                            <Row>
                                {userMascota.map((elemento) => (
                                    <Col sm={4} xl={3} key={elemento.id}>
                                        <Card>
                                            <a
                                                className="button-consultar"
                                                onClick={() =>
                                                    handleMostrarComponenteConsultarMascota(
                                                        elemento.id
                                                    )
                                                }
                                            >
                                                <img
                                                    className="card-img-top img-fluid img-mascota"
                                                    src={elemento.foto}
                                                    alt="Imagen de la mascota"
                                                />
                                            </a>
                                            <CardBody className="d-flex flex-column justify-content-between align-items-center">
                                                <h4 className="card-title-pets">
                                                    {elemento.nombre}
                                                </h4>

                                                <div className="d-flex justify-content-center ">
                                                    <Link
                                                        className="button-pets"
                                                        to={`/modificar-mascota/${elemento.id}`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="icon icon-tabler icon-tabler-edit icon-tabler-info-circle"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="#125E03"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                            />
                                                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415zM16 5l3 3" />
                                                        </svg>
                                                    </Link>

                                                    <Link
                                                        className="button-pets"
                                                        onClick={() => {
                                                            handleDeleteButtonClick(
                                                                elemento.nombre,
                                                                elemento.id,
                                                                elemento.foto
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="icon icon-tabler icon-tabler-trash-x icon-tabler-info-circle"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="#e62222"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                                className="path"
                                                            />
                                                            <path d="M4 7h16M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3M10 12l4 4m0 -4l-4 4" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </CardBody>
                                            <div></div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    ) : (
                        <>
                            <div className="alert alert-primary" role="alert">
                                <h5>No tienes mascotas agregadas.</h5>
                            </div>
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    );
};

export default Mascota;
