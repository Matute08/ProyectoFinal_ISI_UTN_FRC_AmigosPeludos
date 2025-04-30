// SolicitudesVeterinaria.js
import React from 'react';
import { useAuth } from '../../../services/AuthContext';
import { useUserData } from '../../../hooks/useUserData';
import { useApplicationStatuses } from '../../../hooks/useApplicationStatuses';
import { useApplications } from '../../../hooks/useApplications';
import { getVeterinarias, updateEstadoVeterinaria } from '../../../services/commonApi';
import SolicitudesTable from '../../components/SolicitudesTable';
import { formatDate } from "../../../utils/dateUtils"; // Asumiendo utils

// Columnas específicas para veterinarias
const veterinariaColumns = [
    { header: 'Numero Solicitud', accessor: 'id', isBold: true },
    {
        header: 'Fecha de Creación',
        accessor: 'fechaAlta',
        formatter: formatDate, // Formateador de fecha
        isBold: true
    },
    { header: 'Nombre Veterinaria', accessor: 'nombre' },
    { header: 'Telefono', accessor: 'numeroTelefono' }, 
    {
        header: 'Dirección',
        accessor: 'direccion', 
    },
    { header: 'Altura', accessor: 'numeroCalle' },
    { header: 'CUIT/CUIL', accessor: 'cuil' }, // Verifica si este es el nombre correcto
    { header: 'Estado de Solicitud', accessor: 'estado' }, // Verifica si este es el nombre correcto
    
];



const SolicitudesVeterinaria = () => {
    const { user } = useAuth();
    const { userData } = useUserData();
    const { statuses, isLoading: isLoadingStatuses } = useApplicationStatuses();
     // Asegúrate que la API devuelva 'estado' o ajusta el accessor en las columnas
    const { applications: veterinarias, isLoading: isLoadingApplications, error } = useApplications(getVeterinarias, userData?.id);

    const isLoading = isLoadingApplications || isLoadingStatuses || !userData;
    return (
        <SolicitudesTable
            data={veterinarias}
            columns={veterinariaColumns} // Pasa columnas específicas
            isLoading={isLoading}
            entityTypeName="veterinaria"
            entityTypeApiPrefix="veterinaria"
            statuses={statuses}
            updateStatusFunction={updateEstadoVeterinaria}
            noDataMessage="No hay solicitudes de veterinaria"
        />
    );
};

export default SolicitudesVeterinaria;