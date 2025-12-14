import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

// Componente de la patita (icono)
const PawIcon = ({ color = '#F4A261' }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color }}>
        <PetsIcon sx={{ fontSize: 28 }} />
    </Box>
);

const CalendarioVacunacionGatos = () => {
    return (
        <Box
            sx={{
                maxWidth: '900px',
                mx: 'auto',
                p: 3,
            }}
        >
            {/* HEADER MINIMALISTA */}
            <Box
                sx={{
                    mb: 3,
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                    }}
                >
                    Calendario de Vacunación - Gatos
                </Typography>
            </Box>

            {/* Información adicional - MOVIDA ARRIBA */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                    Vacunación en Gatos
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>
                    Los gatos necesitan de la aplicación de ciertas vacunas una vez que cumplan las 8 semanas de edad. Es muy importante que lleves a tu mascota al veterinario para que pueda hacerle el adecuado seguimiento y te indique qué vacunas son las requeridas de acuerdo a cada etapa de vida de tu mascota.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>
                    Nuestros gatos necesitan de muchos cuidados: alimento para gatos de calidad acorde a su edad, actividad física y controles en el veterinario para garantizar que tu mascota crezca sana y fuerte. Y obviamente la vacunación, que es el corazón de esta nota, que es muy importante para complementar todo lo mencionado anteriormente.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    No sólo para nosotros las vacunas son muy importantes, sino también para nuestros animales, ya que los ayudarán a estar protegidos frente a enfermedades que pueden resultar graves en tu mascota.
                </Typography>
            </Box>

            {/* TABLA VISUAL */}
            <Paper
                elevation={2}
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                }}
            >
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    py: 2,
                                    px: 2,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    width: '25%',
                                }}
                            >
                                Vacuna
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                8
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                12
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                16
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: 'grey.800',
                                    color: 'primary.light',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    width: '15%',
                                }}
                            >
                                Refuerzo
                                <br />
                                Anual
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* FILA 1: TRIPLE FELINA (CORE) */}
                        <TableRow
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.1)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell sx={{ py: 2, px: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Triple Felina
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                                >
                                    (Rinotraqueítis, Calici, Panleucopenia)
                                </Typography>
                                <Chip
                                    label="OBLIGATORIA"
                                    size="small"
                                    sx={{
                                        bgcolor: 'primary.light',
                                        color: 'primary.dark',
                                        fontSize: '0.65rem',
                                        height: '20px',
                                        fontWeight: 'bold',
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F4A261" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F4A261" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F4A261" />
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#E76F51" />
                            </TableCell>
                        </TableRow>

                        {/* FILA 2: LEUCEMIA (NON-CORE) */}
                        <TableRow
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.1)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell sx={{ py: 2, px: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Leucemia Felina
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Recomendada si sale al exterior
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#42A5F5" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#42A5F5" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', bgcolor: 'grey.50' }}></TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#1976D2" />
                            </TableCell>
                        </TableRow>

                        {/* FILA 3: RABIA (LEY) */}
                        <TableRow
                            sx={{
                                bgcolor: 'rgba(244, 162, 97, 0.05)',
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.15)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 2,
                                    borderLeft: '4px solid',
                                    borderColor: 'error.main',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Antirrábica
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Obligatoria por Ley
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', bgcolor: 'grey.50' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F44336" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', bgcolor: 'grey.50' }}></TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#F44336" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    * Esquema sugerido. Consulta siempre a tu veterinario.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                            }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Esencial
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#42A5F5',
                            }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Estilo de vida
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const CalendarioVacunacionPerros = () => {
    return (
        <Box
            sx={{
                maxWidth: '900px',
                mx: 'auto',
                p: 3,
            }}
        >
            {/* HEADER MINIMALISTA */}
            <Box
                sx={{
                    mb: 3,
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                    }}
                >
                    Calendario de Vacunación - Perros
                </Typography>
            </Box>

            {/* Información adicional - MOVIDA ARRIBA */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                    Calendario de vacunas para perros
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>
                    El plan de vacunación ideal comienza a los 45 días de vida con las primeras dosis contra el moquillo, el Parvovirus y el Adenovirus canino. Muchas vacunas son polivalentes, es decir que pueden incluir más de una vacuna en la misma aplicación, dependiendo del fabricante y de lo que elija tu veterinario.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>
                    La segunda vacuna se aplica a partir de las 9 semanas de vida como refuerzo de las ya aplicadas. A los 3 meses (12 semanas) se repite una dosis y se puede aplicar la antirrábica, que es obligatoria en casi todos los países de latinoamérica y debe recibir un refuerzo anual.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Las vacunas contra la Leptospira y la Leishmania son opcionales, pero de colocarlas, se debe hacer a partir de las 9 semanas de vida con un refuerzo anual.
                </Typography>
            </Box>

            {/* TABLA VISUAL */}
            <Paper
                elevation={2}
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                }}
            >
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    bgcolor: '#F4A261',
                                    color: 'white',
                                    py: 2,
                                    px: 2,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    width: '25%',
                                }}
                            >
                                Vacuna
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#E76F51',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                6 a 8
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#F4A261',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                9 a 11
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#F4A261',
                                    color: 'white',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    width: '15%',
                                }}
                            >
                                12 a 16
                                <br />
                                Semanas
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: 'grey.800',
                                    color: '#F4A261',
                                    py: 2,
                                    px: 1,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    width: '15%',
                                }}
                            >
                                Refuerzo
                                <br />
                                Anual
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* FILA 1: BASICA */}
                        <TableRow
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.1)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell sx={{ py: 2, px: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Básica Cachorro
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', display: 'block' }}
                                >
                                    (Moquillo y Parvovirus)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F4A261" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F4A261" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', bgcolor: 'grey.50' }}></TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    bgcolor: 'grey.50',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            ></TableCell>
                        </TableRow>

                        {/* FILA 2: POLIVALENTE */}
                        <TableRow
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.1)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell sx={{ py: 2, px: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Súper Protección
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', display: 'block' }}
                                >
                                    (Séxtuple: Viral + Lepto)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', bgcolor: 'grey.50' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#9C27B0" />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#9C27B0" />
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#2E7D32" />
                            </TableCell>
                        </TableRow>

                        {/* FILA 3: RABIA */}
                        <TableRow
                            sx={{
                                bgcolor: 'rgba(244, 162, 97, 0.05)',
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.15)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 2,
                                    borderLeft: '4px solid',
                                    borderColor: 'error.main',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}
                                >
                                    Antirrábica
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Obligatoria por Ley
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#F44336" />
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#F44336" />
                            </TableCell>
                        </TableRow>

                        {/* FILA 4: TOS */}
                        <TableRow
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(244, 162, 97, 0.1)',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <TableCell sx={{ py: 2, px: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}
                                >
                                    Tos de las Perreras
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Opcional (Guarderías/Parques)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}></TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <PawIcon color="#42A5F5" />
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.300',
                                }}
                            >
                                <PawIcon color="#42A5F5" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    * Consulta siempre a tu veterinario. Las fechas pueden variar según la salud de la mascota.
                </Typography>
            </Box>
        </Box>
    );
};

export default CalendarioVacunacionGatos;
export { CalendarioVacunacionPerros };

