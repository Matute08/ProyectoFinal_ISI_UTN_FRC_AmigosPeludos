// GenerateQr.js (Refactorizado y Mejorado)

import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Spinner, Alert, Row, Col } from "reactstrap";
import qrcode from "qrcode"; // Usar 'qrcode' para generar Data URL
import { getUserMail, updateQrUsuario } from "../../../services/userApi"; // Asume que estas funciones están correctas
import { uploadQrUsuario } from "../../../services/Firebase"; // Asume que esta función está correcta y devuelve la URL de Firebase
import Loading from "../../components/Loading";

// Hook para obtener datos del usuario (similar a otros componentes, considera centralizarlo)
const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedUserData = localStorage.getItem("userData");
            if (!cachedUserData) throw new Error("No hay sesión de usuario activa.");
            const dataLocalStorage = JSON.parse(cachedUserData);
            const userEmail = dataLocalStorage?.email;
            if (!userEmail) throw new Error("No se pudo obtener el email del usuario.");

            const response = await getUserMail(userEmail);
             // Asumiendo que la API devuelve { data: {...} }
            if (!response?.data) throw new Error("Respuesta inválida al obtener datos del usuario.");
            setUserData(response.data);

        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.message || "Error al cargar datos del usuario.");
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { userData, isLoading, error, refetch: fetchData, setUserData }; // Devolver setUserData para actualizar localmente
};


const GenerateQr = () => {
    const { userData, isLoading, error, refetch, setUserData } = useUserData();
    const [qrDataURL, setQrDataURL] = useState(""); // Data URL del QR recién generado (temporal)
    const [isProcessing, setIsProcessing] = useState(false); // Para indicar generación/subida/guardado
    const [processError, setProcessError] = useState(null); // Errores específicos del proceso de QR
    const [isDownloading, setIsDownloading] = useState(false);

    // URL base para el contenido del QR
    const getQrContentUrl = (userId) => {
        // Asegúrate de que la URL sea la correcta y esté en producción si es necesario
        return `https://amigos-peludos.vercel.app/datos-usuario/${userId}`;
        // return `http://localhost:5173/datos-usuario/${userId}`; // Para pruebas locales
    };

    // Función para generar Data URL, convertir a Blob, subir y guardar
    const handleGenerateAndSaveQR = async () => {
        if (!userData?.id) {
            setProcessError("No se pueden generar QR sin datos de usuario.");
            return;
        }

        setIsProcessing(true);
        setProcessError(null);
        setQrDataURL(""); // Limpiar QR temporal anterior

        const contentUrl = getQrContentUrl(userData.id);

        try {
            // 1. Generar QR como Data URL
            const generatedDataUrl = await qrcode.toDataURL(contentUrl, {
                errorCorrectionLevel: 'H', // Nivel de corrección de errores (L, M, Q, H)
                type: 'image/png',
                quality: 0.9, // Calidad (0 a 1)
                margin: 1, // Margen blanco
                // width: 256 // Ancho opcional
            });
            setQrDataURL(generatedDataUrl); // Mostrar QR temporalmente

            // 2. Convertir Data URL a Blob
            const response = await fetch(generatedDataUrl);
            const blob = await response.blob();

            if (!blob) throw new Error("No se pudo convertir el QR a Blob.");

            // 3. Subir Blob a Firebase
            const firebaseStorageUrl = await uploadQrUsuario(blob, `qr_${userData.id}.png`); // Pasar blob y nombre de archivo
            if (!firebaseStorageUrl) throw new Error("Error al subir QR a Firebase.");

            // 4. Guardar URL de Firebase en la base de datos
            const payload = { qr: firebaseStorageUrl };
            await updateQrUsuario(userData.id, payload);

            // 5. Éxito: Actualizar estado local y limpiar QR temporal
            setUserData(prevData => ({ ...prevData, qr: firebaseStorageUrl })); // Actualizar userData local
            setQrDataURL(""); // Ya no necesitamos el temporal, se usará userData.qr

        } catch (err) {
            console.error("Error en el proceso de generación/guardado de QR:", err);
            setProcessError(err.message || "Error al generar o guardar el código QR.");
            // Mantener el qrDataURL visible si falló el guardado para posible descarga manual? O limpiarlo?
            // setQrDataURL(""); // Opción: Limpiar si falla el guardado
        } finally {
            setIsProcessing(false);
        }
    };

     // Función unificada para descargar el QR
     const handleDownloadQR = async () => {
        const sourceUrl = userData?.qr || qrDataURL; // URL de Firebase o Data URL temporal

        if (!sourceUrl) {
            console.error("No hay URL de QR para descargar.");
            alert("No se encontró el código QR para descargar."); // Feedback al usuario
            return;
        }

        setIsDownloading(true); // Iniciar estado de descarga
        const fileName = `codigo-qr-${userData?.nombreCompleto?.replace(/\s+/g, '_') || userData?.id || 'usuario'}.png`;

        try {
            // Crear enlace de descarga
            const link = document.createElement('a');

            if (sourceUrl.startsWith('data:')) {
                // --- Manejo de Data URL (simple) ---
                link.href = sourceUrl;
                link.download = fileName;
                console.log("Descargando desde Data URL...");
            } else {
                // --- Manejo de URL externa (Firebase) ---
                console.log("Intentando descargar desde URL externa:", sourceUrl);
                // 1. Fetch de la imagen (requiere CORS configurado en Firebase)
                const response = await fetch(sourceUrl); // Considerar añadir { mode: 'cors' } si hay problemas específicos
                if (!response.ok) {
                    throw new Error(`Error al obtener la imagen: ${response.statusText}`);
                }
                // 2. Convertir a Blob
                const blob = await response.blob();
                // 3. Crear Object URL
                const objectUrl = URL.createObjectURL(blob);
                // 4. Asignar al enlace y configurar descarga
                link.href = objectUrl;
                link.download = fileName;
                console.log("Object URL creado para descarga:", objectUrl);

                // Programar la revocación del Object URL después de un tiempo prudencial
                // para dar tiempo a que inicie la descarga antes de liberar memoria.
                 setTimeout(() => URL.revokeObjectURL(objectUrl), 60000); // Revocar después de 1 minuto
                 // NOTA: La revocación es importante para liberar memoria.
            }

            // 5. Simular click para iniciar la descarga
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Limpiar el DOM
            console.log("Descarga iniciada.");

        } catch (err) {
            console.error("Error al descargar el QR:", err);
            alert(`No se pudo descargar el código QR. Error: ${err.message}. Asegúrate de que Firebase Storage permita el acceso desde este sitio web (CORS).`); // Feedback al usuario
        } finally {
            setIsDownloading(false); // Finalizar estado de descarga
        }
    };

    // --- Renderizado ---

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Container><Alert color="danger">{error}</Alert></Container>;
    }

    // Determinar qué URL de QR mostrar (la guardada o la recién generada)
    const qrToShow = userData?.qr || qrDataURL;

    return (
        <Container className="text-center mt-4">
            <h4>Tu Código QR de Contacto</h4>

            {processError && <Alert color="warning" className="mt-3">{processError}</Alert>}

            <Row className="justify-content-center mt-3">
                <Col xs="10" sm="8" md="6" lg="4">
                    {qrToShow ? (
                        // Mostrar QR (desde BD o recién generado)
                        <div className="qr-container p-3 border rounded bg-light">
                            <img
                                src={qrToShow}
                                alt="Código QR del Usuario"
                                style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }}
                            />
                        </div>
                    ) : !isProcessing ? (
                        // Mostrar mensaje si no hay QR y no se está procesando
                         <Alert color="info">Aún no has generado tu código QR.</Alert>
                    ) : (
                         // Mostrar placeholder mientras se genera/guarda
                         <div className="qr-container p-3 border rounded bg-light placeholder-glow" style={{minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                             <Spinner/> Generando...
                         </div>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col xs="auto">
                    {userData?.qr ? (
                        // Si YA existe un QR guardado, solo mostrar Descargar
                        <Button color="primary" onClick={handleDownloadQR} disabled={isProcessing}>
                            <i className="fas fa-download me-2"></i>Descargar QR
                        </Button>
                    ) : (
                         // Si NO existe QR guardado
                        <>
                            {qrDataURL && !isProcessing && (
                                // Si se generó uno temporalmente Y NO falló el proceso, permitir descarga
                                // (Podría fallar el guardado, pero el usuario puede querer descargarlo igual)
                                <Button color="secondary" onClick={handleDownloadQR} className="me-2">
                                    <i className="fas fa-download me-2"></i>Descargar QR (Generado)
                                </Button>
                            )}
                             <Button
                                color="success"
                                onClick={handleGenerateAndSaveQR}
                                disabled={isProcessing} // Deshabilitar mientras se procesa
                            >
                                {isProcessing ? (
                                    <>
                                        <Spinner size="sm" className="me-2"></Spinner>
                                        Generando y Guardando...
                                    </>
                                ) : (
                                     <>
                                        <i className="fas fa-qrcode me-2"></i>
                                        Generar y Guardar QR
                                     </>
                                )}
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default GenerateQr;