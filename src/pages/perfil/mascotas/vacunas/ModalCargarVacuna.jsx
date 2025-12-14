import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { postVacunaMascota, getVacunasPorTipo, getVacunas } from "../../../../api/vacunaApi";
import { getMascotaId } from "../../../../api/mascotasApi";
import { mostrarAlertaExito, mostrarAlertaError } from "../../../../utils/showAlert";

export default function ModalCargarVacuna({ open, handleClose, idMascota, onSuccess }) {
    const [vacunas, setVacunas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        vacunaId: "",
        fechaAplicacion: dayjs().format("YYYY-MM-DD"),
        observacion: "",
    });
    const [fechaProxima, setFechaProxima] = useState("");
    
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
        const fetch = async () => {
            if (!idMascota || idMascota === "undefined") {
                console.error("ID de mascota no válido en modal:", idMascota);
                setVacunas([]);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const resMascota = await getMascotaId(idMascota);
                
                // Verificar que la mascota y sus propiedades existan
                if (!resMascota.data || !resMascota.data.raza || !resMascota.data.raza.tipoMascota) {
                    console.warn("La mascota no tiene información completa de tipo, cargando todas las vacunas disponibles");
                    // Si no hay información de tipo, cargar todas las vacunas disponibles
                    const resVacunas = await getVacunas();
                    setVacunas(resVacunas.data);
                    return;
                }
                
                const tipoMascotaId = resMascota.data.raza.tipoMascota.id;
                const resVacunas = await getVacunasPorTipo(tipoMascotaId);
                setVacunas(resVacunas.data);
            } catch (err) {
                console.error("Error al cargar vacunas por tipo de mascota", err);
                setVacunas([]);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            const fechaHoyISO = dayjs().format("YYYY-MM-DD");
            setForm({
                vacunaId: "",
                fechaAplicacion: fechaHoyISO,
                observacion: "",
            });
            setFechaProxima("");
            // Inicializar valores visuales
            setFechaAplicacionVisual(formatearFecha(fechaHoyISO));
            setFechaProximaVisual("");
            fetch();
        }
    }, [open, idMascota]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "fechaAplicacion") {
            // Manejar fecha de aplicación con formato DD/MM/YYYY
            const valorConMascara = aplicarMascaraFecha(value);
            setFechaAplicacionVisual(valorConMascara);
            
            // Si tiene formato completo (DD/MM/YYYY), convertir a ISO y validar
            if (valorConMascara.length === 10) {
                const fechaISO = convertirAFechaISO(valorConMascara);
                if (fechaISO) {
                    const fechaSeleccionada = dayjs(fechaISO);
                    const fechaActual = dayjs();
                    
                    if (fechaSeleccionada.isAfter(fechaActual)) {
                        mostrarAlertaError("No se pueden registrar vacunas en fechas futuras");
                        return;
                    }
                    
                    setForm({ ...form, fechaAplicacion: fechaISO });
                }
            }
            return;
        }
        
        const nuevoForm = { ...form, [name]: value };
        setForm(nuevoForm);
    };

    const handleFechaAplicacionBlur = (e) => {
        const fechaISO = convertirAFechaISO(e.target.value);
        if (fechaISO) {
            const fechaSeleccionada = dayjs(fechaISO);
            const fechaActual = dayjs();
            
            if (fechaSeleccionada.isAfter(fechaActual)) {
                mostrarAlertaError("No se pueden registrar vacunas en fechas futuras");
                setFechaAplicacionVisual("");
                return;
            }
            
            setForm({ ...form, fechaAplicacion: fechaISO });
            setFechaAplicacionVisual(formatearFecha(fechaISO));
        } else if (e.target.value && e.target.value.length === 10) {
            setFechaAplicacionVisual("");
        }
    };

    const handleFechaProximaChange = (e) => {
        const valorConMascara = aplicarMascaraFecha(e.target.value);
        setFechaProximaVisual(valorConMascara);
        
        // Si tiene formato completo (DD/MM/YYYY), convertir a ISO
        if (valorConMascara.length === 10) {
            const fechaISO = convertirAFechaISO(valorConMascara);
            if (fechaISO) {
                setFechaProxima(fechaISO);
            }
        }
    };

    const handleFechaProximaBlur = (e) => {
        const fechaISO = convertirAFechaISO(e.target.value);
        if (fechaISO) {
            setFechaProxima(fechaISO);
            setFechaProximaVisual(formatearFecha(fechaISO));
        } else if (e.target.value && e.target.value.length === 10) {
            setFechaProximaVisual("");
        }
    };

    const handleGuardar = async () => {
        if (!idMascota || idMascota === "undefined") {
            mostrarAlertaError("ID de mascota no válido. No se puede guardar la vacuna.");
            return;
        }
        
        // Validación: verificar que la fecha de aplicación no sea futura
        const fechaSeleccionada = dayjs(form.fechaAplicacion);
        const fechaActual = dayjs();
        
        if (fechaSeleccionada.isAfter(fechaActual)) {
            mostrarAlertaError("No se pueden registrar vacunas en fechas futuras");
            return;
        }
        
        // Validación: verificar que se haya proporcionado la fecha próxima dosis
        if (!fechaProxima || fechaProxima.trim() === "") {
            mostrarAlertaError("Debes proporcionar una fecha próxima dosis");
            return;
        }
        
        try {
            // Usar dayjs para evitar problemas de timezone
            const fechaAplicacionISO = dayjs(form.fechaAplicacion).format("YYYY-MM-DD");
            const fechaProximaISO = fechaProxima ? dayjs(fechaProxima).format("YYYY-MM-DD") : null;
            
            const data = {
                MascotaId: parseInt(idMascota),
                VacunaId: parseInt(form.vacunaId),
                FechaAplicacion: dayjs(fechaAplicacionISO).toISOString(),
                Observaciones: form.observacion || "",
                FechaProxima: fechaProximaISO ? dayjs(fechaProximaISO).toISOString() : null,
            };
            await postVacunaMascota(data);
            
            // Cerrar el modal primero
            handleClose();
            
            // Actualizar la lista de vacunas sin redireccionar
            await onSuccess();
            
            // Mostrar mensaje de éxito SIN redirección
            mostrarAlertaExito("Vacuna registrada correctamente");
        } catch (err) {
            console.error("Error al guardar vacuna", err);
            mostrarAlertaError("No se pudo registrar la vacuna. Intente nuevamente.");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cargar nueva vacuna</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    fullWidth
                    label="Vacuna"
                    name="vacunaId"
                    value={form.vacunaId}
                    onChange={handleChange}
                    sx={{ mt: 2 }}
                    disabled={loading || vacunas.length === 0}
                    helperText={
                        loading 
                            ? "Cargando vacunas..." 
                            : vacunas.length === 0 
                                ? "No hay vacunas disponibles para este tipo de mascota" 
                                : ""
                    }
                >
                    {loading ? (
                        <MenuItem disabled>Cargando...</MenuItem>
                    ) : vacunas.length === 0 ? (
                        <MenuItem disabled>No hay vacunas disponibles</MenuItem>
                    ) : (
                        vacunas.map((v) => (
                            <MenuItem key={v.id} value={v.id}>
                                {v.nombre}
                            </MenuItem>
                        ))
                    )}
                </TextField>

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
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    placeholder="DD/MM/AAAA"
                    helperText="No se pueden registrar vacunas en fechas futuras"
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
                    value={fechaProxima}
                    onChange={(e) => {
                        if (e.target.value) {
                            setFechaProxima(e.target.value);
                            setFechaProximaVisual(formatearFecha(e.target.value));
                        }
                    }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                />

                <TextField
                    label="Fecha próxima dosis"
                    type="text"
                    name="fechaProxima"
                    value={fechaProximaVisual}
                    onChange={handleFechaProximaChange}
                    onBlur={handleFechaProximaBlur}
                    fullWidth
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    placeholder="DD/MM/AAAA"
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
                    name="observacion"
                    value={form.observacion || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mt: 2 }}
                    inputProps={{
                        maxLength: 75
                    }}
                    helperText={
                        form.observacion?.length > 75 
                            ? `Máximo 75 caracteres` 
                            : ""
                    }
                />
                <Typography 
                    variant="caption" 
                    color={form.observacion?.length > 75 ? "error" : "text.secondary"}
                    sx={{ mt: 0.5, display: 'block' }}
                >
                    {form.observacion?.length || 0}/75 caracteres
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button 
                    variant="contained" 
                    onClick={handleGuardar}
                    disabled={loading || !form.vacunaId || !fechaProxima || vacunas.length === 0}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
