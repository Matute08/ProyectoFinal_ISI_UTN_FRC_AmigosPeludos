import React from "react";
import HTMLFlipBook from "react-pageflip";
import { Button, Typography, Box, Avatar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const CarnetDigitalMascota = ({
    open,
    onClose,
    vacunas = [],
    mascota = null,
}) => {
    if (!open || !mascota || !vacunas || !mascota.nombre) return null;

    // Función para agrupar vacunas por tipo
    const agruparVacunasPorTipo = (vacunas) => {
        const grupos = {};
        
        vacunas.forEach(vacuna => {
            const nombreVacuna = vacuna?.nombreVacuna || "Sin nombre";
            if (!grupos[nombreVacuna]) {
                grupos[nombreVacuna] = [];
            }
            grupos[nombreVacuna].push(vacuna);
        });
        
        return grupos;
    };

    // Función para dividir las vacunas en páginas (máximo 3 dosis por página)
    const dividirVacunasEnPaginas = (vacunasAgrupadas) => {
        const paginas = [];
        
        Object.entries(vacunasAgrupadas).forEach(([nombreVacuna, dosis]) => {
            // Dividir las dosis en grupos de máximo 3
            for (let i = 0; i < dosis.length; i += 3) {
                const dosisEnPagina = dosis.slice(i, i + 3);
                paginas.push({
                    nombreVacuna,
                    dosis: dosisEnPagina,
                    inicioDosis: i + 1, // Número de la primera dosis en esta página
                    totalDosis: dosis.length // Total de dosis para este tipo de vacuna
                });
            }
        });
        
        return paginas;
    };

    const vacunasAgrupadas = agruparVacunasPorTipo(vacunas);
    const paginasVacunas = dividirVacunasEnPaginas(vacunasAgrupadas);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.7)",
                zIndex: 1300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backdropFilter: "blur(2px)",
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    maxWidth: 950,
                    height: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <HTMLFlipBook
                    width={420}
                    height={550}
                    showCover={true}
                    drawShadow={true}
                    flippingTime={800}
                    useMouseEvents={true}
                    style={{
                        margin: "0 auto",
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
                        borderRadius: "10px",
                        background: "#f57c00",
                    }}
                >
                    {/* TAPA */}
                    <div className="page-flipbook cover ">
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: "black", mb: 5 }}
                        >
                            Carnet de Vacunación
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                src={mascota.foto || "/placeholder.png"}
                                sx={{
                                    width: 230,
                                    height: 230,
                                    mb: 2,
                                    border: "4px solid white",
                                }}
                            />
                        </div>
                        <div style={{ color: "black", textAlign: "center" }}>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: "bold", mb: 3 }}
                            >
                                {mascota.nombre}
                            </Typography>
                            <Typography variant="body1">
                                Tipo: {mascota.raza?.tipoMascota?.tipo || mascota.tipoMascotaNombre || "-"} |
                                Sexo: {mascota.sexoMascota || "-"}
                            </Typography>
                        </div>
                    </div>

                    {/* DATOS DEL DUEÑO */}
                    <div className="page-flipbook">
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold", mb: 2 }}
                        >
                            Datos del Dueño
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Nombre: {mascota.usuario?.nombreCompleto || "-"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Teléfono: {mascota.usuario?.celular || "-"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Dirección: {mascota.usuario?.calle || "-"}{" "}
                            {mascota.usuario?.nroCalle || ""}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Correo: {mascota.usuario?.mail || "-"}
                        </Typography>

                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold", mb: 2 }}
                        >
                            Datos de la Mascota
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Nombre: {mascota.nombre || "-"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Especie: {mascota.tipoMascotaNombre || "-"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Sexo: {mascota.sexoMascota || "-"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Color: {mascota.color || "-"}
                        </Typography>
                    </div>

                    {/* DESCRIPCION */}
                    <div className="page-flipbook">
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                textAlign: "center",
                            }}
                        >
                            Libreta Digital de Vacunación Animal
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ mb: 2, textAlign: "justify" }}
                        >
                            La Libreta Digital de Vacunación Animal es un
                            documento oficial que certifica las prácticas
                            veterinarias aplicadas a una mascota. Solo puede ser
                            completada por profesionales autorizados,
                            garantizando la validez de las dosis registradas.
                            Esta libreta debe conservarse en buen estado y no
                            permite modificaciones posteriores.
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                textAlign: "justify",
                                fontStyle: "italic",
                            }}
                        >
                            The Digital Animal Vaccination Booklet is an
                            official record certifying veterinary practices
                            applied to a pet. It may only be completed by
                            authorized professionals and guarantees the
                            authenticity of the registered doses. This booklet
                            must be preserved in good condition and does not
                            allow amendments of any kind.
                        </Typography>
                    </div>

                    {/* PÁGINAS DE VACUNAS AGRUPADAS */}
                    {paginasVacunas.map((pagina, i) => (
                        <div key={i} className="page-flipbook">
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: "bold", mb: 2 }}
                            >
                                Vacuna: {pagina.nombreVacuna}
                            </Typography>
                            
                            {pagina.dosis.map((dosis, index) => (
                                <Box key={index} sx={{ mb: 2, p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                        Dosis {pagina.inicioDosis + index} de {pagina.totalDosis}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        Fecha aplicación:{" "}
                                        {dosis.fechaAplicacion
                                            ? new Date(dosis.fechaAplicacion).toLocaleDateString()
                                            : "-"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        Próxima dosis:{" "}
                                        {dosis.fechaProxima
                                            ? new Date(dosis.fechaProxima).toLocaleDateString()
                                            : "-"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        Observaciones: {dosis.observaciones || "-"}
                                    </Typography>
                                </Box>
                            ))}
                        </div>
                    ))}
                </HTMLFlipBook>

                <Box mt={3} display="flex" gap={2}>
                    <Button
                        variant="text"
                        onClick={onClose}
                        sx={{
                            color: "black",
                            backgroundColor: "#f57c00",
                            "&:hover": { backgroundColor: "#ef6c00" },
                        }}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CarnetDigitalMascota;
