import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UiContent from "../../assets/scss/components/Common/UiContent";
import {
    Card,
    Table,
    CardBody,
    Col,
    Container,
    Row,
    Button,
    ModalHeader,
    ModalFooter,
    Modal,
    ModalBody,
} from "reactstrap";
import { useAuth } from "../../services/AuthContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
} from "../../services/Api";
//Images
import avatar1 from "../../assets/images/user/user-random.jpg";
import Loading from "../loading/Loading";
import ModalLogin from "../autheticationInner/login/ModalLogin";

const AsideLeft = () => {
    const navigate = useNavigate();
    const { user, deleteAccount } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [showModalLogin, setShowModalLogin] = useState(false);
   
    const handleCloseModalLogin = () => {
        setShowModalLogin(false);
    }



    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getUserMail(user.email);
            setUserData(userData);
            setIsLoading(false);
        };

        fetchUserData();
    }, [user]);

    const tableData = [
        {
            title: "Nombre Completo",
            value: userData ? userData.nombreCompleto : "",
        },
        {
            title: "Correo Electrónico",
            value: userData ? userData.mail : "",
        },
        {
            title: "Número de Celular",
            value: userData ? userData.celular : "",
        },
        {
            title: "Género",
            value: userData ? userData.generoId : "-",
        },
        {
            title: "Provincia",
            value: "Córdoba",
        },
        {
            title: "Ciudad",
            value: "Córdoba",
        },
        {
            title: "Barrio",
            value: userData ? userData.barrioId : "-",
        },
        {
            title: "Dirección",
            value:
                !userData || userData.calle === null
                    ? " "
                    : userData.calle + " " + userData.nroCalle,
        },
    ];

    //funcion para eliminar a la mascota
    const handleDeleteUser = async () => {
        const deleteResponse = await deleteAccount();
        if (deleteResponse.success) {
            userData.habilitada = false;
            await updateUser(userData.id, userData);
            navigate("/");
        } else {
            console.log(deleteResponse.error.code);
            toggle();
            setShowModalLogin(true);
        }
    };

    return (
        <React.Fragment>
            <UiContent></UiContent>
            {!isLoading ? (
                <>
                    <Col xxl={3} lg={4} md={12}>
                        <Card className="mt-n5">
                            <CardBody className="p-4">
                                <div className="text-center">
                                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                        <div className="col-auto">
                                            <div className="img-profile">
                                                <img
                                                    src={
                                                        userData.foto
                                                            ? userData.foto
                                                            : avatar1
                                                    }
                                                    alt="user-img"
                                                    className="img-thumbnail rounded-circle"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="fs-16 mb-1">
                                        {userData && (
                                            <>{userData.nombreCompleto}</>
                                        )}
                                    </h5>
                                    <p className="text-muted mb-0">Usuario</p>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="p-4 mb-4">
                                <h5 className="card-title mb-3 text-center">
                                    Datos Personales
                                </h5>
                                <div className="table-responsive">
                                    <Table className="table-borderless mb-0">
                                        <tbody>
                                            {tableData.map((elemento) => (
                                                <tr key={elemento.title}>
                                                    <th
                                                        className="ps-0"
                                                        scope="row"
                                                    >
                                                        {elemento.title}
                                                    </th>
                                                    <td className="text-muted">
                                                        {elemento.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="d-flex button-profile">
                                    <Link
                                        to="/modificar-perfil"
                                        className="btn btn-success btn-editar"
                                    >
                                        <i className="ri-edit-box-line align-bottom"></i>{" "}
                                        Editar Perfil
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-danger btn-delete"
                                        onClick={toggle}
                                    >
                                        <i className="ri-edit-box-line align-bottom"></i>{" "}
                                        Eliminar Perfil
                                    </Link>
                                </div>

                                <div>
                                    {/* MODAL CONFIRMAR ELIMINACION */}
                                    <Modal isOpen={modal} toggle={toggle}>
                                        <div className="container-modal">
                                            <div className="container-modal-header row">
                                                <div className="warning-icon col-2"></div>
                                                <div className=" col-10 ">
                                                    <ModalHeader
                                                        toggle={toggle}
                                                        className="modal-header "
                                                    >
                                                        ¡Atención!
                                                    </ModalHeader>
                                                </div>
                                            </div>
                                            <ModalBody className="modal-body">
                                                La cuenta sera dada de baja. Si
                                                deseas volver solo registrate
                                                nuevamente.
                                            </ModalBody>
                                            <ModalFooter className="modal-footer-button">
                                                <Button
                                                    color="danger"
                                                    onClick={() =>
                                                        handleDeleteUser()
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

                                    {/* MODAL LOGIN */}
                                    {showModalLogin && (

                                    <ModalLogin onClose={handleCloseModalLogin} ></ModalLogin>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default AsideLeft;
