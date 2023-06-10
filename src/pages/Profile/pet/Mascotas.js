import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../../../services/AuthContext";
import {
    getUserMail,
    getMascotasUsuario,
    deletePet,
    updateUser,
} from "../../../services/Api";
import AgregarMascota from "./addPet/AddPets";
import ConsultarMascota from "../pet/consultPet/ConsultPet";
import { deleteFileStorage } from "../../../services/Firebase";

const Mascota = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState();
    const [mostrarAgregarMascota, setMostrarAgregarMascota] = useState(false);
    const [mostrarConsultarMascota, setMostrarContultarMascota] = useState(0);
    const [userMascota, setUserMascota] = useState([]);
    const [countPetUser, setCountPetUser] = useState([]);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const handleMostrarComponenteConsultarMascota = (id) => {
        setMostrarContultarMascota(id);
    };
    const handleCancelar = () => {
        setMostrarAgregarMascota(false);
        setMostrarContultarMascota(0);
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
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const usuario = async () => {
            setUserData(await getUserMail(user.email));
        };
        usuario();
    }, [user]);

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
                                            <img
                                                className="card-img-top img-fluid img-mascota"
                                                src={elemento.foto}
                                                alt="Imagen de la mascota"
                                            />
                                            <CardBody className="d-flex flex-column justify-content-between align-items-center">
                                                <h4 className="card-title-pets">
                                                    {elemento.nombre}
                                                </h4>

                                                <div className="d-flex justify-content-center ">
                                                    <Link
                                                        to="#"
                                                        className="button-pets button-consultar"
                                                        onClick={() =>
                                                            handleMostrarComponenteConsultarMascota(
                                                                elemento.id
                                                            )
                                                        }
                                                    ></Link>
                                                    <Link
                                                        to={`/modificar-mascota/${elemento.id}`}
                                                        className="button-pets button-modificar"
                                                    ></Link>
                                                    <Link
                                                        to="#"
                                                        className="button-pets button-eliminar"
                                                        onClick={toggle}
                                                    ></Link>
                                                </div>
                                            </CardBody>
                                            <div>
                                                <Modal
                                                    isOpen={modal}
                                                    toggle={toggle}
                                                >
                                                    <div className="container-modal">
                                                        <div className="container-modal-header row">
                                                            <div className="warning-icon col-2"></div>
                                                            <div className="col-10">
                                                                <ModalHeader
                                                                    toggle={
                                                                        toggle
                                                                    }
                                                                    className="modal-header"
                                                                >
                                                                    ¡Atención!
                                                                </ModalHeader>
                                                            </div>
                                                        </div>
                                                        <ModalBody className="modal-body">
                                                            {`¿Estás seguro/a de que quieres eliminar a ${elemento.nombre}?`}
                                                        </ModalBody>
                                                        <ModalFooter className="modal-footer-button">
                                                            <Button
                                                                color="danger"
                                                                onClick={() =>
                                                                    handleDeletePet(
                                                                        elemento.id,
                                                                        elemento.foto
                                                                    )
                                                                }
                                                            >
                                                                Eliminar
                                                            </Button>{" "}
                                                            <Button
                                                                color="success"
                                                                onClick={toggle}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </ModalFooter>
                                                    </div>
                                                </Modal>
                                            </div>
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
