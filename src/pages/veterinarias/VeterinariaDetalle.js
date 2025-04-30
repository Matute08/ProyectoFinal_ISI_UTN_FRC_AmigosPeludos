import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Badge } from 'reactstrap'; // Importar componentes necesarios
import { RiMapPinLine, RiPhoneLine, RiTimeLine, RiExternalLinkLine } from 'react-icons/ri'; // Importar iconos

// Helper para formatear horarios de forma más limpia
const formatHorario = (horarioStr) => {
    if (!horarioStr || typeof horarioStr !== 'string') {
        return <Badge color="secondary" pill className="ms-2">No disponible</Badge>;
    }
    // Intenta dividir por turnos si existe " y "
    const turnos = horarioStr.split(' y ');
    if (turnos.length > 1) {
        return (
            <span className="ms-2">
                {turnos[0].replace("Turno mañana desde", "Mañana:")} <br />
                <span className="ms-3">{turnos[1].replace("Turno tarde desde", "Tarde:")}</span>
            </span>
        );
    }
    // Si no, muestra como viene (podría ser "Turno mañana..." o "Cerrado")
    return <span className="ms-2">{horarioStr.replace("Turno mañana desde", "Mañana:").replace("Turno tarde desde", "Tarde:")}</span>;
};

// Helper para obtener el día actual (0=Domingo, 1=Lunes...)
const getTodayIndex = () => {
    return new Date().getDay();
};

const VeterinariaDetalle = ({ veterinaria, onClose }) => {
    if (!veterinaria) {
        return null; // O un mensaje indicando que no hay selección
    }

    const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const hoyIndex = getTodayIndex();

    return (
        // Usar animación suave al aparecer/desaparecer (requiere CSS adicional o librería como framer-motion)
        <Card className="veterinaria-detail-card shadow-sm border-light d-flex flex-column h-100"> {/* Añadir h-100 si quieres que ocupe altura */}
             <CardHeader className="d-flex justify-content-between align-items-center bg-light flex-shrink-0"> {/* Encabezado no crece ni se encoge */}
                <h5 className="mb-0 text-primary">{veterinaria.nombre}</h5>
                <Button close onClick={onClose} aria-label="Cerrar" />
            </CardHeader>
            <CardBody className="flex-grow-1" style={{ overflowY: 'auto' }}>

                {/* Imagen de la Veterinaria (si existe) */}
                {veterinaria.foto && (
                    <img
                        src={veterinaria.foto}
                        alt={`Foto de ${veterinaria.nombre}`}
                        className="img-fluid rounded mb-3 shadow-sm"
                        style={{ maxHeight: '180px', width: '100%', objectFit: 'cover' }}
                    />
                )}

                {/* Información de Contacto */}
                <div className="mb-3">
                    <p className="mb-1 d-flex align-items-center">
                        <RiMapPinLine className="me-2 text-secondary flex-shrink-0" size="1.2em" />
                        <span>{veterinaria.direccion} {veterinaria.numeroCalle}</span>
                    </p>
                    <p className="mb-0 d-flex align-items-center">
                        <RiPhoneLine className="me-2 text-secondary flex-shrink-0" size="1.2em" />
                        <span>{veterinaria.numeroTelefono || 'No disponible'}</span>
                    </p>
                </div>

                {/* Horarios */}
                <div className="mb-3">
                    <h6 className="d-flex align-items-center mb-2">
                        <RiTimeLine className="me-2 text-secondary flex-shrink-0" size="1.2em" /> Horarios:
                    </h6>
                    {/* Usar lista de definición para mejor semántica y estilo */}
                    <dl className="dl-horarios ms-1" style={{ fontSize: '0.9em' }}>
                        {diasSemana.map((dia, index) => {
                             // Capitalizar primera letra del día
                            const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
                            // Determinar si es hoy
                            const esHoy = index === hoyIndex;
                            return (
                                <React.Fragment key={dia}>
                                    <dt className={esHoy ? 'fw-bold text-success' : ''}>
                                        {diaCapitalizado}{esHoy ? ' (Hoy)' : ''}:
                                    </dt>
                                    <dd className={`mb-1 ${esHoy ? 'fw-bold text-success' : 'text-muted'}`}>
                                        {formatHorario(veterinaria.horarios?.[dia])}
                                    </dd>
                                </React.Fragment>
                            );
                         })}
                    </dl>
                </div>

                 {/* Botón de Acción - */}
                 <div className="mt-auto pt-2"> 
                    <Link
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        to={`/veterinarias/perfil-veterinaria/${veterinaria.id}`}
                        onClick={onClose} // Cerrar este detalle al ir al perfil completo
                        title={`Ver perfil completo de ${veterinaria.nombre}`}
                    >
                        <RiExternalLinkLine className="me-1" /> Ver Perfil Completo
                    </Link>
                 </div>

            </CardBody>
        </Card>
    );
};

export default VeterinariaDetalle;