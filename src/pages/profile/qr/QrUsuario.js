import React, { useContext, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    Table,
    CardHeader,
    TabContent,
    TabPane,
} from "reactstrap";
import { Tooltip } from "react-tooltip";
import { getUserId, getuse } from "../../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const QrUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const datosUsuario = await getUserId(id);
            setUserData(datosUsuario.data);
            setIsLoading(false)
        };

        if (id) {
            fetchUserData();
        }
    }, []);

    const openWhatsApp = () => {
        // Número de teléfono al que enviar el mensaje
        const phoneNumber = userData && userData.celular;

        // Mensaje predeterminado
        const message = "¡Hola! Encontre a tu mascota! ";

        // Crear la URL de WhatsApp con el número de teléfono y el mensaje
        const whatsappUrl = `https://wa.me/+54${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        // Redireccionar al usuario a la URL de WhatsApp
        window.open(whatsappUrl, "_blank");
    };

    document.title = "Datos Usuario | Amigos Peludos";

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
            <Container fluid className="page-content perfil-fondo">
                <div className="fondo-datos data-container">
                    <div className="">
                        <h1 className="data-title">
                            Pertenezco a {userData && userData.nombreCompleto}
                        </h1>
                        <img
                            src={userData && userData.foto}
                            className="img-qr"
                            alt="imagen dueño"
                        />
                    </div>

                    <div className="">
                        <hr />
                        <h2 className="data-title">
                            Mi Domicilio es: {userData && userData.calle}{" "}
                            {userData && userData.nroCalle}
                        </h2>
                        <hr />
                        {/* <button
                            class="social-button whatsapp"
                            
                        >
                            <i class="ri-whatsapp-line"></i>
                            <span>WhatsApp</span>
                        </button> */}


                        <button
                            className="btn-whatsapp-qr "
                            onClick={openWhatsApp}
                            style={{ color: "black" }}
                        >
                            WhatsApp
                        </button>
                        {/* <button className="data-button">Contactame</button> */}
                    </div>
                </div>
            </Container>
            </>
            ) : (
                <Loading></Loading>
            )}
        </React.Fragment>
    );
};

export default QrUsuario;
