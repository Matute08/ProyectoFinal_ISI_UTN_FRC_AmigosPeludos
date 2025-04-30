// ConsultPet.js (Refactorizado)

import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Row, Alert, Spinner, Button, Card, CardBody, CardTitle } from "reactstrap"; // Añadir componentes

import { getMascotaId } from "../../../../services/PetsApi"; // Verificar ruta
import Loading from "../../../components/Loading"; // Verificar ruta

// Placeholder para imagen si no hay foto
const placeholderPetImage = "/images/placeholder-pet.png"; // Ajusta esta ruta si es diferente

const ConsultarMascota = ({ onCancel, mascotaId }) => {
    // Estado para los datos de la mascota, carga y errores
    const [mascotaData, setMascotaData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cancelar (volver a la lista)
    const handleCancelar = () => {
        if (onCancel && typeof onCancel === 'function') {
            onCancel(); // Llama a la función onCancel pasada como prop
        } else {
            console.warn("Prop 'onCancel' no fue proporcionada a ConsultarMascota");
            // Opcional: navegar a una ruta por defecto si onCancel no existe
            // navigate('/ruta/por/defecto');
        }
    };

    // Efecto para cargar los datos de la mascota cuando el ID cambia
    useEffect(() => {
        // Si no hay ID, no hacer nada (o mostrar error)
        if (!mascotaId) {
            setError("No se especificó ninguna mascota para consultar.");
            setIsLoading(false);
            return;
        }

        const fetchMascota = async () => {
            setIsLoading(true);
            setError(null);
            setMascotaData(null); // Limpiar datos anteriores
            try {
                const response = await getMascotaId(mascotaId);
                // Asumiendo que la API devuelve { data: {...} }
                if (response?.data) {
                    setMascotaData(response.data);
                } else {
                    // Si la API devuelve el objeto directamente (sin data) - menos común
                    if(response && typeof response === 'object' && response.id){
                         console.warn("API getMascotaId devolvió datos directamente, sin 'data'.");
                         setMascotaData(response);
                    } else {
                        throw new Error("No se encontraron datos para la mascota especificada o la respuesta de la API es inválida.");
                    }
                }
            } catch (err) {
                console.error("Error fetching mascota:", err);
                setError(err.message || "Error al cargar los datos de la mascota.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMascota();
    }, [mascotaId]); // Dependencia ÚNICA Y CORRECTA: mascotaId


    // --- Renderizado ---

    if (isLoading) {
        return <Loading />; // Mostrar componente de carga
    }

    if (error) {
        return (
            <Container className="mt-3">
                <Alert color="danger">{error}</Alert>
                {/* Botón para volver incluso si hay error */}
                <Button color="secondary" onClick={handleCancelar} className="mt-2 d-inline-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="me-1" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
                    Volver
                </Button>
            </Container>
        );
    }

    if (!mascotaData) {
        // Si no está cargando, no hay error, pero no hay datos (raro, pero posible)
        return (
            <Container className="mt-3">
                <Alert color="warning">No hay información disponible para esta mascota.</Alert>
                 <Button color="secondary" onClick={handleCancelar} className="mt-2 d-inline-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="me-1" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
                    Volver
                </Button>
            </Container>
        );
    }

    // Si tenemos datos, mostramos la información
    // Establecer título del documento dinámicamente
    document.title = `Detalles de ${mascotaData.nombre || 'Mascota'} | Amigos Peludos`;

    return (
        <React.Fragment>
            <Container fluid className="mt-3">
                 {/* Botón Volver en la esquina superior o al final */}
                 {/* <Row><Col className="text-end mb-2"><Button ... /></Col></Row> */}
                <Card className="shadow-sm">
                    <CardBody>
                        <Row>
                            {/* Columna Izquierda: Imagen */}
                            <Col md={5} lg={4} className="text-center mb-4 mb-md-0">
                                <img
                                    className="img-fluid rounded shadow-sm" // Estilo Bootstrap
                                    style={{ maxHeight: '400px', objectFit: 'cover' }} // Limitar altura máxima
                                    src={mascotaData.foto || placeholderPetImage}
                                    alt={`Foto de ${mascotaData.nombre}`}
                                    onError={(e) => { if (e.target.src !== placeholderPetImage) { e.target.onerror = null; e.target.src = placeholderPetImage; } }}
                                />
                            </Col>

                            {/* Columna Derecha: Datos */}
                            <Col md={7} lg={8}>
                                <CardTitle tag="h2" className="mb-3">
                                    {mascotaData.nombre || "Mascota sin nombre"}
                                </CardTitle>
                                <hr/>
                                {/* Usar párrafos o lista de definición para los detalles */}
                                <Row>
                                     <Col sm={6} className="mb-2">
                                        <p className="mb-1"><strong>Tipo:</strong> {mascotaData.tipoMascotaNombre || 'No especificado'}</p>
                                    </Col>
                                    <Col sm={6} className="mb-2">
                                        <p className="mb-1"><strong>Raza:</strong> {mascotaData.razaNombre || 'No especificada'}</p>
                                    </Col>
                                    <Col sm={6} className="mb-2">
                                        <p className="mb-1"><strong>Edad Aprox.:</strong> {mascotaData.edadMascota || 'No especificada'}</p>
                                    </Col>
                                    <Col sm={6} className="mb-2">
                                        <p className="mb-1"><strong>Sexo:</strong> {mascotaData.sexoMascota || 'No especificado'}</p>
                                    </Col>
                                     <Col sm={6} className="mb-2">
                                        <p className="mb-1"><strong>Color:</strong> {mascotaData.color || 'No especificado'}</p>
                                    </Col>
                                    <Col sm={6} className="mb-2">
                                        {/* Transformación del booleano castracion */}
                                        <p className="mb-1"><strong>Castrado/a:</strong> {typeof mascotaData.castracion === 'boolean' ? (mascotaData.castracion ? 'Sí' : 'No') : 'No especificado'}</p>
                                    </Col>
                                     <Col sm={6} className="mb-2">
                                        {/* Asegurarse de que peso se muestre bien, añadir "kg" */}
                                        <p className="mb-1"><strong>Peso Aprox.:</strong> {mascotaData.peso ? `${mascotaData.peso} kg` : 'No especificado'}</p>
                                    </Col>
                                </Row>

                                {/* Descripción (si existe) */}
                                {mascotaData.descripcion && (
                                    <>
                                        <hr/>
                                        <h5 className="mt-3">Descripción:</h5>
                                        <p className="text-muted">{mascotaData.descripcion}</p>
                                    </>
                                )}

                                {/* Botón Volver al final */}
                                <div className="text-end mt-4">
                                    <Button color="secondary" onClick={handleCancelar} className="d-inline-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="me-1" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
                                        Volver
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default ConsultarMascota;