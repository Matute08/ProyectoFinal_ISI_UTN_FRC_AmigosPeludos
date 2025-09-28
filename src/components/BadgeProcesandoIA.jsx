import React from 'react';
import { Badge, Box, Typography, CircularProgress } from '@mui/material';
import { useEstadoIA } from '../hooks/useEstadoIA';

const BadgeProcesandoIA = ({ publicacionId, children }) => {
    const { estado, intentado } = useEstadoIA(publicacionId);

    const estaProcesando = !estado?.ia_matched;

    if (!estaProcesando) {
        return children;
    }

    return (
        <Badge
            badgeContent={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CircularProgress size={12} color="inherit" />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        IA
                    </Typography>
                </Box>
            }
            color="warning"
            sx={{
                '& .MuiBadge-badge': {
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontSize: '0.6rem',
                    minWidth: 'auto',
                    height: 'auto',
                    padding: '2px 4px',
                    borderRadius: '8px',
                }
            }}
        >
            {children}
        </Badge>
    );
};

export default BadgeProcesandoIA;
