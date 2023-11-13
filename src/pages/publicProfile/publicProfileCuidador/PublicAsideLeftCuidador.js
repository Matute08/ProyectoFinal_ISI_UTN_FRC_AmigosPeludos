import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UiContent from "../../../assets/scss/components/Common/UiContent";
import Swal from "sweetalert2";
import { Card, Table, CardBody, Col } from "reactstrap";
import { useAuth } from "../../../services/AuthContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
    getGenero,
    getGeneroId,
    getRol,
} from "../../../services/api";
//Images
import avatar1 from "../../../assets/images/user/user-random.jpg";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";

const PublicAsideLeftCuidador = ({ correoElectronico }) => {
    const { handleSweetAlertDeleteUser } = Modal();
    const navigate = useNavigate();
    const { user, deleteAccount } = useAuth();
    const [userData, setUserData] = useState(null);
    const [barrioData, setBarrioData] = useState(null);
    const [generoData, setGeneroData] = useState(null);
    const [nombreRol, setNombreRol] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData =
                correoElectronico && (await getUserMail(correoElectronico));
            userData.calle = `${userData.calle + " " + userData.nroCalle}`;
            setUserData(userData);
            setIsLoading(false);
        };
        console.log(correoElectronico);
        console.log(userData);
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchRol = async () => {
            const roles = await getRol();
            setNombreRol(roles);
        };

        fetchRol();
    }, []);

    const keyMap = {
        nombreCompleto: "Nombre Completo",
        mail: "Correo Electronico",
        celular: "Número de Celular",
        generoUsuario: "Género",
        provincia: "Provincia",
        ciudadUsuario: "Ciudad",
        barrioUsuario: "Barrio",
        calle: "Calle",
    };
    const excludedKeys = [
        "id",
        "foto",
        "tipoAutenticacionId",
        "tieneMascota",
        "rolId",
        "password",
        "mailVerificado",
        "habilitada",
        "generoId",
        "fechaNacimiento",
        "cuentaVerificada",
        "codigoPostal",
        "username",
        "barrioId",
        "nroCalle",
        "rolUsuario",
        "qr",
        "esPaseador",
        "esCuidador",
        "esVeterinaria",
        "esFundacion",
    ];

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
                                    <p className="text-muted mb-0">
                                        {userData &&
                                            nombreRol &&
                                            userData.rolId &&
                                            // Encuentra el objeto de rol con el mismo id en nombreRol
                                            nombreRol.data.find(
                                                (rol) =>
                                                    rol.id === userData.rolId
                                            )?.nombre}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="p-2 mb-4">
                                <h5 className="card-title mb-3 text-center">
                                    Datos Personales
                                </h5>
                                <div className="table-responsive">
                                    <Table className="table-borderless mb-0">
                                        {userData &&
                                            Object.entries(userData).map(
                                                ([key, value]) => {
                                                    if (
                                                        key === "fotos" ||
                                                        excludedKeys.includes(
                                                            key
                                                        )
                                                    ) {
                                                        return null; // Omitir el título y el valor "Foto" en el lado izquierdo
                                                    }
                                                    const modifiedKey =
                                                        keyMap[key] || key;
                                                    return (
                                                        <div key={key.id}>
                                                            <div className="m-0">
                                                                <p className=" m-0 p-2 ">
                                                                    <strong>
                                                                        {
                                                                            modifiedKey
                                                                        }
                                                                        :
                                                                    </strong>{" "}
                                                                    {value}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </Table>
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

export default PublicAsideLeftCuidador;
