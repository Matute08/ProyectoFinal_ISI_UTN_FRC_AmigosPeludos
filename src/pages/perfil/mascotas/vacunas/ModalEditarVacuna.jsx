import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { updateDosisVacuna } from "../../../../api/vacunaApi";
import Swal from "sweetalert2";

export default function ModalEditarVacuna({ open, handleClose, dosis, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fechaAplicacion: "",
        fechaProxima: "",
        observaciones: "",
    });
    
    // Estados para los valores visuales de las fechas (DD/MM/YYYY)
    const [fechaAplicacionVisual, setFechaAplicacionVisual] = useState("");
    const [fechaProximaVisual, setFechaProximaVisual] = useState("");
    
    // Referencias para los inputs de fecha nativos (ocultos)
    const fechaAplicacionInputRef = React.useRef(null);
    const fechaProximaInputRef = React.useRef(null);

    // Función helper para formatear fecha de ISO (YYYY-MM-DD) a DD/MM/YYYY
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '';
        const [año, mes, dia] = fechaISO.split('-');
        return `${dia}/${mes}/${año}`;
    };

    // Función para convertir DD/MM/YYYY a YYYY-MM-DD (ISO)
    const convertirAFechaISO = (fechaDDMMYYYY) => {
        if (!fechaDDMMYYYY) return '';
        const fechaLimpia = fechaDDMMYYYY.replace(/[^\d/]/g, '');
        const partes = fechaLimpia.split('/');
        
        if (partes.length === 3) {
            const [dia, mes, año] = partes;
            if (dia.length === 2 && mes.length === 2 && año.length === 4) {
                const diaNum = parseInt(dia, 10);
                const mesNum = parseInt(mes, 10);
                const añoNum = parseInt(año, 10);
                
                const fecha = new Date(añoNum, mesNum - 1, diaNum);
                if (!isNaN(fecha.getTime()) && 
                    fecha.getDate() === diaNum && 
                    fecha.getMonth() + 1 === mesNum && 
                    fecha.getFullYear() === añoNum) {
                    return `${año}-${mes}-${dia}`;
                }
            }
        }
        return '';
    };

    // Función para aplicar máscara DD/MM/YYYY mientras el usuario escribe
    const aplicarMascaraFecha = (valor) => {
        const soloNumeros = valor.replace(/\D/g, '');
        const limitado = soloNumeros.slice(0, 8);
        
        if (limitado.length <= 2) {
            return limitado;
        } else if (limitado.length <= 4) {
            return `${limitado.slice(0, 2)}/${limitado.slice(2)}`;
        } else {
            return `${limitado.slice(0, 2)}/${limitado.slice(2, 4)}/${limitado.slice(4)}`;
        }
    };

    useEffect(() => {
        if (open && dosis) {
            const fechaAplicacionISO = dayjs(dosis.fechaAplicacion).format("YYYY-MM-DD");
            const fechaProximaISO = dosis.fechaProxima ? dayjs(dosis.fechaProxima).format("YYYY-MM-DD") : "";
            
            setForm({
                fechaAplicacion: fechaAplicacionISO,
                fechaProxima: fechaProximaISO,
                observaciones: dosis.observaciones || "",
            });
            
            // Inicializar valores visuales
            setFechaAplicacionVisual(formatearFecha(fechaAplicacionISO));
            setFechaProximaVisual(formatearFecha(fechaProximaISO));
        }
    }, [open, dosis]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "fechaAplicacion") {
            const valorConMascara = aplicarMascaraFecha(value);
            setFechaAplicacionVisual(valorConMascara);
            
            if (valorConMascara.length === 10) {
                const fechaISO = convertirAFechaISO(valorConMascara);
                if (fechaISO) {
                    setForm(prev => ({
                        ...prev,
                        fechaAplicacion: fechaISO
                    }));
                }
            }
            return;
        }
        
        if (name === "fechaProxima") {
            const valorConMascara = aplicarMascaraFecha(value);
            setFechaProximaVisual(valorConMascara);
            
            if (valorConMascara.length === 10) {
                const fechaISO = convertirAFechaISO(valorConMascara);
                if (fechaISO) {
                    setForm(prev => ({
                        ...prev,
                        fechaProxima: fechaISO
                    }));
                }
            } else if (valorConMascara === "") {
                setForm(prev => ({
                    ...prev,
                    fechaProxima: ""
                }));
            }
            return;
        }
        
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFechaAplicacionBlur = (e) => {
        const fechaISO = convertirAFechaISO(e.target.value);
        if (fechaISO) {
            setForm(prev => ({
                ...prev,
                fechaAplicacion: fechaISO
            }));
            setFechaAplicacionVisual(formatearFecha(fechaISO));
        } else if (e.target.value && e.target.value.length === 10) {
            setFechaAplicacionVisual("");
        }
    };

    const handleFechaProximaBlur = (e) => {
        const fechaISO = convertirAFechaISO(e.target.value);
        if (fechaISO) {
            setForm(prev => ({
                ...prev,
                fechaProxima: fechaISO
            }));
            setFechaProximaVisual(formatearFecha(fechaISO));
        } else if (e.target.value && e.target.value.length === 10) {
            setFechaProximaVisual("");
        } else if (e.target.value === "") {
            setForm(prev => ({
                ...prev,
                fechaProxima: ""
            }));
        }
    };

    const handleGuardar = async () => {
        if (!dosis?.id) {
            Swal.fire({
                title: "Error",
                text: "No se encontró la información de la dosis",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: 'swal-over-mui'
                },
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }
                }
            });
            return;
        }
        
        setLoading(true);
        try {
            // Usar dayjs para evitar problemas de timezone
            const fechaAplicacionISO = dayjs(form.fechaAplicacion).format("YYYY-MM-DD");
            const fechaProximaISO = form.fechaProxima ? dayjs(form.fechaProxima).format("YYYY-MM-DD") : null;
            
            const data = {
                FechaAplicacion: dayjs(fechaAplicacionISO).toISOString(),
                FechaProxima: fechaProximaISO ? dayjs(fechaProximaISO).toISOString() : null,
                Observaciones: form.observaciones || "",
            };

            await updateDosisVacuna(dosis.id, data);
            
            // Cerrar el modal primero
            handleClose();
            
            // Actualizar la lista de vacunas sin redireccionar
            await onSuccess();
            
            // Mostrar mensaje de éxito SIN redirección con z-index alto
            Swal.fire({
                title: "¡Éxito!",
                text: "Dosis actualizada correctamente",
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: 'swal-over-mui'
                },
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }
                }
            });
        } catch (err) {
            console.error("Error al actualizar dosis", err);
            
            // Mostrar mensaje de error con z-index alto
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar la dosis. Intente nuevamente.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: 'swal-over-mui'
                },
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ 
                backgroundColor: "#F4A261", 
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 1.5
            }}>
                📝 Editar dosis - {dosis?.nombreVacuna || "Vacuna"}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Dosis {dosis?.dosisNumero || ""}
                    </Typography>
                </Box>

                <input
                    ref={fechaAplicacionInputRef}
                    type="date"
                    value={form.fechaAplicacion}
                    onChange={(e) => {
                        if (e.target.value) {
                            setForm({ ...form, fechaAplicacion: e.target.value });
                            setFechaAplicacionVisual(formatearFecha(e.target.value));
                        }
                    }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                />

                <TextField
                    label="Fecha de aplicación"
                    type="text"
                    fullWidth
                    name="fechaAplicacion"
                    value={fechaAplicacionVisual}
                    onChange={handleChange}
                    onBlur={handleFechaAplicacionBlur}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    placeholder="DD/MM/AAAA"
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        if (fechaAplicacionInputRef.current) {
                                            if (typeof fechaAplicacionInputRef.current.showPicker === 'function') {
                                                fechaAplicacionInputRef.current.showPicker();
                                            } else {
                                                fechaAplicacionInputRef.current.click();
                                            }
                                        }
                                    }}
                                    size="small"
                                    disabled={loading}
                                >
                                    <CalendarTodayIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    inputProps={{
                        maxLength: 10
                    }}
                />

                <input
                    ref={fechaProximaInputRef}
                    type="date"
                    value={form.fechaProxima}
                    onChange={(e) => {
                        if (e.target.value) {
                            setForm({ ...form, fechaProxima: e.target.value });
                            setFechaProximaVisual(formatearFecha(e.target.value));
                        } else {
                            setForm({ ...form, fechaProxima: "" });
                            setFechaProximaVisual("");
                        }
                    }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                />

                <TextField
                    label="Fecha próxima dosis"
                    type="text"
                    fullWidth
                    name="fechaProxima"
                    value={fechaProximaVisual}
                    onChange={handleChange}
                    onBlur={handleFechaProximaBlur}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    placeholder="DD/MM/AAAA"
                    disabled={loading}
                    helperText="Dejar vacío si no aplica"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        if (fechaProximaInputRef.current) {
                                            if (typeof fechaProximaInputRef.current.showPicker === 'function') {
                                                fechaProximaInputRef.current.showPicker();
                                            } else {
                                                fechaProximaInputRef.current.click();
                                            }
                                        }
                                    }}
                                    size="small"
                                    disabled={loading}
                                >
                                    <CalendarTodayIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    inputProps={{
                        maxLength: 10
                    }}
                />

                <TextField
                    label="Observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    disabled={loading}
                    inputProps={{
                        maxLength: 200
                    }}
                    helperText={`${form.observaciones?.length || 0}/200 caracteres`}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{ px: 3 }}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleGuardar}
                    disabled={loading || !form.fechaAplicacion}
                    sx={{ 
                        px: 4,
                        backgroundColor: "#F4A261",
                        "&:hover": { backgroundColor: "#E76F51" },
                        fontWeight: "bold"
                    }}
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
