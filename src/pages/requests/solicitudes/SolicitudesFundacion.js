// SolicitudesFundacion.js
import React from 'react';
import { useAuth } from '../../../services/AuthContext'; // Ajusta ruta
import { useUserData } from '../../../hooks/useUserData'; // Ajusta ruta
import { useApplicationStatuses } from '../../../hooks/useApplicationStatuses'; // Ajusta ruta
import { useApplications } from '../../../hooks/useApplications'; // Ajusta ruta
import { getFundacion, updateEstadoFundacion } from '../../../services/commonApi'; // Ajusta ruta
import SolicitudesTable from '../../components/SolicitudesTable'
import { formatDate } from '../../../utils/dateUtils'; // Asumiendo utils
// Definir columnas específicas si difieren mucho del default
const fundacionColumns = [
     { header: 'Numero Solicitud', accessor: 'id', isBold: true },
     { header: 'Fecha de Creación', accessor: 'fechaAlta', formatter: formatDate, isBold: true },
     { header: 'Nombre Fundación', accessor: 'nombre' },
     { header: 'Telefono', accessor: 'telefono' },
     {
        header: 'Dirección',
        accessor: 'direccion', 
      
    },
    { header: 'Altura', accessor: 'nroCalle' },
     { header: 'CUIT', accessor: 'cuit' },
     { header: 'Estado de Solicitud', accessor: 'estado' },
];


const SolicitudesFundacion = () => {
    const { user } = useAuth(); // Podría no ser necesario si useUserData lo maneja
    const { userData } = useUserData(); // Obtiene datos del usuario
    const { statuses, isLoading: isLoadingStatuses } = useApplicationStatuses();
    const { applications: fundaciones, isLoading: isLoadingApplications, error } = useApplications(getFundacion, userData?.id); // Pasa la función y userId

    // Combina estados de carga si es necesario
    const isLoading = isLoadingApplications || isLoadingStatuses || !userData;

    return (
        <SolicitudesTable
            data={fundaciones}
            columns={fundacionColumns} // Pasa columnas específicas
            isLoading={isLoading}
            entityTypeName="fundación"
            entityTypeApiPrefix="fundacion" // Para la ruta de detalles
            statuses={statuses}
            updateStatusFunction={updateEstadoFundacion} // Pasa la función de update específica
            noDataMessage="No hay solicitudes de fundación"
        />
    );
};

export default SolicitudesFundacion;

// Necesitarás implementar useUserData, useApplicationStatuses, formatDate, showUpdateStatusDialog, openDetailsPage
// Y ajustar las rutas de importación