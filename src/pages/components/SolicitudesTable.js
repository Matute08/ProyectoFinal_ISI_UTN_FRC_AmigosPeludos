// components/SolicitudesTable.js
import React from 'react';
import { Card, CardBody, Table, Col } from 'reactstrap';
import Loading from '../components/Loading'; // Asumiendo ubicación
// import { formatDate } from '../utils/dateUtils'; // Asumiendo ubicación
// import { showUpdateStatusDialog } from '../utils/swalHelpers'; // Asumiendo ubicación
// import { openDetailsPage } from '../utils/navigationHelpers'; // Asumiendo ubicación
import { formatDate } from '../../utils/dateUtils'; // Asumiendo utils
import { showUpdateStatusDialog } from '../../utils/swalHelpers'; // Asumiendo utils
import { openDetailsPage } from '../../utils/navigationHelpers';


// Definición de columnas por defecto (ejemplo)
const defaultColumns = [
    { header: 'Numero Solicitud', accessor: 'id', isBold: true },
    { header: 'Fecha de Creación', accessor: 'fechaAlta', formatter: formatDate, isBold: true },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Telefono', accessor: 'telefono' }, // Ajusta accessor según la data real
    { header: 'Dirección', accessor: 'direccionCompleta' }, // Podrías necesitar componerla
    { header: 'CUIT/CUIL', accessor: 'cuit' }, // Ajusta accessor
    { header: 'Estado de Solicitud', accessor: 'estado' },
];

const SolicitudesTable = ({
    data,
    columns = defaultColumns,
    isLoading,
    entityTypeName, // "fundación" o "veterinaria"
    entityTypeApiPrefix, // "fundacion" o "veterinaria" - para rutas/api
    statuses, // Lista de estados para el dropdown
    updateStatusFunction, // La función API para actualizar (ej: updateEstadoFundacion)
    noDataMessage = "No tienes solicitudes",
}) => {

    const handleUpdateStateClick = (itemId, itemName) => {
         showUpdateStatusDialog(
             entityTypeName,
             itemId,
             itemName, // Podrías pasar el nombre para el título del Swal
             statuses,
             updateStatusFunction
         );
    };

    const handleViewDetailsClick = (itemId) => {
        openDetailsPage(entityTypeApiPrefix, itemId);
    };

 // Número total de columnas para el colSpan (columnas de datos + 1 para acciones)
    // Asegúrate que 'columns' sea siempre un array
    const totalColumns = Array.isArray(columns) ? columns.length + 1 : 1;


    return (
        <Col lg={12}>
            <Card>
                <CardBody>
                    <div className="live-preview">
                        <div className="table-responsive tabla-formularios">
                            <Table className="table-bordered align-middle table-nowrap mb-0">
                                <thead>
                                <tr>
                                        {/* Renderiza las cabeceras siempre */}
                                        {Array.isArray(columns) && columns.map((col) => (
                                            <th key={col.accessor || col.header} scope="col">{col.header}</th>
                                        ))}
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        // CASO 1: Está cargando
                                        <tr>
                                            <td colSpan={totalColumns} className="text-center py-5"> {/* Añadido padding */}
                                                {/* --- Elige UNA de estas opciones para el indicador --- */}

                                                {/* Opción A: Texto simple (Recomendado si no tienes spinner) */}
                                                <span>Cargando solicitudes...</span>

                                                {/* Opción B: Spinner de Reactstrap (si lo tienes instalado) */}
                                                {/* <Spinner size="md" color="primary" className="me-2">Loading...</Spinner>
                                                <span>Cargando...</span> */}

                                                {/* Opción C: Tu componente Loading (si puedes hacerlo pequeño) */}
                                                {/* Si tu <Loading /> puede aceptar props para hacerlo más pequeño: */}
                                                {/* <Loading small={true} /> */}
                                                {/* Si no, es mejor usar las opciones A o B */}

                                                {/* --- Fin de las opciones --- */}
                                            </td>
                                        </tr>
                                    ) : data && data.length > 0 ? (
                                        // CASO 2: Carga completa y hay datos
                                        data.map((item) => (
                                            <tr key={item.id}>
                                                {Array.isArray(columns) && columns.map((col) => (
                                                    <td key={col.accessor || col.header} className={col.isBold ? 'fw-medium' : ''}>
                                                        {/* Pasa el 'item' completo al formatter */}
                                                        {col.formatter
                                                            ? col.formatter(item)
                                                            : (item ? item[col.accessor] : '') /* Acceso seguro por si acaso */}
                                                    </td>
                                                ))}
                                                <td>
                                                    {/* Botones de acción */}
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button
                                                            className="btn btn-success btn-sm btn-formulario"
                                                            onClick={() => handleUpdateStateClick(item.id, item.nombre)}
                                                            aria-label={`Actualizar estado ${entityTypeName} ${item.id}`}
                                                        >
                                                            <i className="ri-edit-2-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-primary btn-sm btn-formulario btn-form"
                                                            onClick={() => handleViewDetailsClick(item.id)}
                                                            aria-label={`Ver detalles ${entityTypeName} ${item.id}`}
                                                        >
                                                            <i className="ri-eye-fill"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        // CASO 3: Carga completa pero NO hay datos
                                        <tr>
                                            <td colSpan={totalColumns} className="text-center">
                                                <h1>{noDataMessage}</h1>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

export default SolicitudesTable;