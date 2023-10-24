import React, { useState, useEffect, useRef } from "react";
import { Container } from "reactstrap";
import QRCode from "react-qr-code";
import { getUserMail, updateQrUsuario } from "../../../services/api";
import { uploadQrUsuario } from "../../../services/Firebase";
import qrcode from "qrcode"; // Importa la biblioteca qrcode

const GenerateQr = () => {
    const [showQR, setShowQR] = useState(false);
    const [userData, setUserData] = useState();
    const [url, setUrl] = useState(window.location.href); // Obtén la URL actual
    const [qrDataURL, setQrDataURL] = useState(""); // Almacena el código QR en formato de URL de datos
    const [loading, setLoading] = useState(false);

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
                datosUsuario.calle = `${datosUsuario.calle} ${datosUsuario.nroCalle}`;
                setUserData(datosUsuario);

                //const newUrl = `localhost/datos-usuario/${datosUsuario.id}`;
                const newUrl = `https://amigos-peludos.vercel.app/datos-usuario/${
                    datosUsuario && datosUsuario.id
                }`;
                setUrl(newUrl);
            }
        };

        fetchUserData();
    }, []);

    const obtenerUrls = async (urlQr) => {
        if (urlQr) {
            const imageBlob = await urlDataToBlob(urlQr);
            const url = await uploadQrUsuario(imageBlob);
            console.log(url);
            return url; // Retorna la URL simulada obtenida
        }
    };

    const handleGenerateQR = async () => {
        try {
            setShowQR(true);
            const generatedQRDataURL = await generateQRDataURL(url);
            setQrDataURL(generatedQRDataURL);

            // Enviar qrDataURL al servidor
            sendQRToServer(generatedQRDataURL);
        } catch (error) {
            console.error("Error al generar el código QR:", error);
        }
    };

    const generateQRDataURL = async (data) => {
        // Generar el código QR en formato de URL de datos
        return new Promise((resolve, reject) => {
            qrcode.toDataURL(data, (error, url) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(url);
                }
            });
        });
    };

    const urlDataToBlob = async (urlData) => {
        const response = await fetch(urlData);
        const blob = await response.blob();
        return blob;
    };
    const downloadLinkRef = useRef(null);
    
    const downloadQR = () => {
        if (qrDataURL) {
            const link = downloadLinkRef.current;
            link.href = qrDataURL;
            link.download = `codigoQr-${
                userData && userData.nombreCompleto
            }.png`;
            link.click();
        }
    };

    const downloadQRBaseDatos = () => {
        if (userData.qr) {
          // Reemplaza la URL de Firebase Storage con la URL de tu servidor C#
          const serverUrl = `https://amigospeludos.azurewebsites.net/api/download-image?imageUrl=${userData.qr}`;
      
          // Realiza una solicitud al servidor
          fetch(serverUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'imagenQR.jpeg';
              link.click();
              window.URL.revokeObjectURL(link.href);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };
      
      
      

    // envio de datos al servidor
    // envío de datos al servidor
    const sendQRToServer = async (qrDataURL) => {
        const urlQr = await obtenerUrls(qrDataURL);

        // Crear un objeto con el campo 'qr' y el valor de la URL
        const data = { qr: urlQr };
        console.log(data);

        try {
            // Enviar el objeto 'data' al servidor
            await updateQrUsuario(userData && userData.id, data);
        } catch (error) {
            // Maneja cualquier error de la actualización
            console.error("Error al guardar QR:", error);
        }
    };

    return (
        <Container>
            {userData && userData.qr !== null ? (
                <div>
                    <div className="d-flex justify-content-center">
                        <img
                            src={userData&& userData.qr}
                            className="imagen-qr"
                            alt="Código QR"
                        />
                    </div>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn-descargar-qr"
                            onClick={downloadQRBaseDatos}
                            style={{ color: "black" }}
                        >
                            Descargar QR
                        </button>
                        <a ref={downloadLinkRef} style={{ display: "none" }}>
                            Descargar QR
                        </a>
                    </div>
                </div>
            ) : showQR ? (
                <div>
                    <div className="d-flex justify-content-center">
                        <img
                            src={qrDataURL}
                            className="imagen-qr"
                            alt="Código QR"
                        />
                    </div>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn-descargar-qr"
                            onClick={downloadQR}
                            style={{ color: "black" }}
                        >
                            Descargar QR
                        </button>
                        <a ref={downloadLinkRef} style={{ display: "none" }}>
                            Descargar QR
                        </a>
                    </div>
                </div>
            ) : (
                <div className="alert alert-primary" role="alert">
                    <h5 className="d-flex justify-content-center">
                        No has generado un código QR.
                    </h5>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn-descargar-qr"
                            onClick={handleGenerateQR}
                            style={{ color: "black" }}
                        >
                            Generar QR
                        </button>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default GenerateQr;
