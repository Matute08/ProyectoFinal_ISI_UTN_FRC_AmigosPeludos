import React from 'react';
import { Button, Tooltip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEstadoIA } from '../hooks/useEstadoIA';

const BotonComparaciones = ({ publicacionId, variant = "outlined", color = "info" }) => {
    const navigate = useNavigate();
    const { estado, intentado } = useEstadoIA(publicacionId);

    const disabled = !estado?.ia_matched;

    const handleClick = () => {
        if (!disabled) {
            navigate(`/comparaciones/${publicacionId}`);
        }
    };

    const getTooltipText = () => {
        if (!estado) return "Verificando estado...";
        if (!estado.ia_matched) return "Analizando foto...";
        return "Ver comparaciones";
    };

    const getButtonText = () => {
        if (!estado) return "Verificando...";
        if (!estado.ia_matched) return "Analizando...";
        return "Ver comparaciones";
    };

    return (
        <Tooltip title={getTooltipText()} arrow>
            <span>
                <Button
                    variant={variant}
                    color={color}
                    onClick={handleClick}
                    disabled={disabled}
                    startIcon={
                        disabled ? (
                            <CircularProgress size={16} />
                        ) : null
                    }
                >
                    {getButtonText()}
                </Button>
            </span>
        </Tooltip>
    );
};

export default BotonComparaciones;
