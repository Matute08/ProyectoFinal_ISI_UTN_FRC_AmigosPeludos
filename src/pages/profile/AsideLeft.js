import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UiContent from "../../assets/scss/components/Common/UiContent";
import Swal from "sweetalert2";
import { Card, Table, CardBody, Col } from "reactstrap";
import { useAuth } from "../../services/AuthContext";
import {
    getUserMail,
    getBarrioUser,
    getCiudadUser,
    updateUser,
    getGenero,
    getGeneroId,
    getRol,
} from "../../services/api";
//Images
import avatar1 from "../../assets/images/user/user-random.jpg";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

const AsideLeft = () => {
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
            // Obtener los datos del usuario desde el localStorage
            const cachedUserData = localStorage.getItem("userData");

            if (cachedUserData) {
                // Parsear los datos almacenados en el localStorage
                const dataLocalStorage = JSON.parse(cachedUserData);

                // Acceder al correo electrónico del usuario
                const userEmail = dataLocalStorage.email;

                const datosUsuario = await getUserMail(userEmail);
                datosUsuario.calle = `${datosUsuario.calle + " " + datosUsuario.nroCalle}`;
                setUserData(datosUsuario);
                setIsLoading(false);
            }
        };

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
    ];

    //funcion para eliminar al usuario
    const handleDeleteUser = async () => {
        const deleteResponse = await deleteAccount();
        if (deleteResponse.success.success) {
            userData.habilitada = false;
            await updateUser(userData.id, userData);
        } else {
            //console.log(deleteResponse.error.code);
        }
        return deleteResponse.success;
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
                                <div className="d-flex button-profile">
                                    <Link
                                        class="button-pz btn-pz-success"
                                        to={"/modificar-perfil"}
                                    >
                                        <span class="span-pz text-pz">
                                            Modificar Perfil
                                        </span>
                                        <span class="span-pz icon-pz">
                                            <svg
                                                viewBox="0 0 490 490"
                                                className="svg-pz-modificar"
                                            >
                                                <g
                                                    transform="translate(0,490) scale(0.1,-0.1)"
                                                    fill="#ffff"
                                                >
                                                    <path
                                                        d="M4107 4670 c-32 -12 -77 -32 -100 -47 -23 -14 -181 -164 -352 -334
                                                            l-310 -309 318 -317 318 -318 313 315 c293 295 315 320 352 394 38 79 39 82
                                                            39 190 -1 91 -5 121 -23 166 -44 111 -142 209 -252 252 -81 31 -226 35 -303 8z"
                                                    />
                                                    <path
                                                        d="M2442 3077 c-424 -424 -772 -777 -772 -782 0 -13 612 -625 625 -625
                                                            3 0 1555 1542 1555 1555 0 13 -612 625 -625 625 -6 0 -358 -348 -783 -773z"
                                                    />
                                                    <path
                                                        d="M743 3765 c-124 -34 -213 -108 -270 -223 l-38 -76 0 -1360 0 -1361
                                                            23 -58 c34 -82 125 -178 211 -220 l66 -32 1366 0 1365 0 76 38 c121 59 204
                                                            167 228 296 6 34 10 387 10 953 l0 900 -29 29 c-38 37 -82 39 -116 4 l-25 -24
                                                            0 -904 c0 -991 2 -965 -60 -1039 -16 -20 -53 -48 -82 -62 l-52 -26 -1305 0
                                                            c-908 0 -1318 3 -1345 11 -53 15 -138 100 -154 155 -9 32 -12 350 -12 1345 l0
                                                            1304 24 51 c13 28 41 65 62 82 78 65 36 62 1034 62 l907 0 27 26 c35 36 34 77
                                                            -3 115 l-29 29 -914 -1 c-754 0 -922 -3 -965 -14z"
                                                    />
                                                    <path
                                                        d="M1432 1773 c-73 -208 -133 -386 -132 -396 0 -25 54 -77 79 -77 16 0
                                                            759 255 768 264 1 1 -129 133 -290 294 l-292 292 -133 -377z"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </Link>

                                    <Link
                                        class="button-pz btn-pz-danger"
                                        onClick={() =>
                                            handleSweetAlertDeleteUser(
                                                handleDeleteUser
                                            )
                                        }
                                    >
                                        <span class="span-pz text-pz">
                                            Eliminar Perfil
                                        </span>
                                        <span class="span-pz icon-pz">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                className="svg-pz"
                                            >
                                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                            </svg>
                                        </span>
                                    </Link>
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
