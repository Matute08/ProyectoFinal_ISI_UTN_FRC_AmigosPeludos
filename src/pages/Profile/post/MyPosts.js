import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../../../services/AuthContext";
import {
    getUserMail,
    getPublicacionesUser,
    deletePost
} from "../../../services/Api";

import { deleteFileStorage } from "../../../services/Firebase";
import Modal from "../../components/Modal";


const MyPosts = () => {
    
    const { user } = useAuth();
    const { handleSweetAlertDeletePost } = Modal();
    const [userData, setUserData] = useState();
    const [publicacionUser, setPublicacionesUser] = useState([]);

    useEffect(() => {
        const filterPublicacionesByUser = async () => {
            // Obtener todas las publicaciones del usuario
            setPublicacionesUser(await getPublicacionesUser(user.email));
        };
    
        filterPublicacionesByUser()
    }, [user]);
          //accion al hacer click en eliminar mascota
          const handleDeleteButtonClick = (id, fotos) => {
            handleSweetAlertDeletePost(id, fotos, handleDeletePet);
        };
    
        //funcion para eliminar a la mascota
        const handleDeletePet = async (id, fotos) => {
            try {
                await deletePost(id);
                fotos.forEach((foto) => {
                    deleteFileStorage(foto.foto);
                });
                return true;
                // window.location.reload();
            } catch (error) {
                console.log(error);
                return false;
            }
        };



    return (
        <React.Fragment>
            
                <>
                    {publicacionUser.length !== 0 ? (
                        <Container fluid>
                            <Row>
                                {publicacionUser.map((elemento) => (
                                    <Col sm={4} xl={3} key={elemento.id}>
                                        <Card>
                                            <Link className="button-consultar"
                                                to={`/consultar-posteo/${elemento.id}`}
                                            >
                                                <img
                                                    className="card-img-top img-fluid img-mascota"
                                                    src={
                                                        elemento
                                                            .fotos[0]
                                                            .foto
                                                    }
                                                    alt="Imagen de la mascota"
                                                />
                                            </Link>
                                            <CardBody className="d-flex flex-column justify-content-between align-items-center">
                                                <h4 className="card-title-pets">
                                                    {elemento.nombre}
                                                </h4>

                                                <div className="d-flex justify-content-center ">

                                                    <Link
                                                        className="button-pets"
                                                        to={`/modificar-posteo/${elemento.id}`}
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
                                                                elemento.id,
                                                                elemento.fotos
                                                            );
                                                        }
                                                    }
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
                                <h5>No tienes publicaciones realizadas.</h5>
                            </div>
                        </>
                    )}
                </>
            
        </React.Fragment>
    );
};

export default MyPosts;
