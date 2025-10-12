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
} from "@mui/material";
import { useEffect, useState } from "react";
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
            setForm({
                vacunaId: "",
                fechaAplicacion: dayjs().format("YYYY-MM-DD"),
                observacion: "",
            });
            setFechaProxima("");
            fetch();
        }
    }, [open, idMascota]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validar que la fecha de aplicación no sea futura
        if (name === "fechaAplicacion") {
            const fechaSeleccionada = dayjs(value);
            const fechaActual = dayjs();
            
            if (fechaSeleccionada.isAfter(fechaActual)) {
                mostrarAlertaError("No se pueden registrar vacunas en fechas futuras");
                return; // No actualizar el formulario si la fecha es futura
            }
        }
        
        const nuevoForm = { ...form, [name]: value };

        // Si se cambia la vacuna o la fecha, recalculamos fechaProxima
        if (name === "vacunaId" || name === "fechaAplicacion") {
            const vacunaSeleccionada = vacunas.find(v => v.id === parseInt(nuevoForm.vacunaId));
            if (vacunaSeleccionada?.frecuenciaSemanas) {
                const proxima = dayjs(nuevoForm.fechaAplicacion)
                    .add(vacunaSeleccionada.frecuenciaSemanas, "week")
                    .format("YYYY-MM-DD");
                setFechaProxima(proxima);
            } else {
                setFechaProxima("");
            }
        }

        setForm(nuevoForm);
    };

    const handleGuardar = async () => {
        if (!idMascota || idMascota === "undefined") {
            mostrarAlertaError("ID de mascota no válido. No se puede guardar la vacuna.");
            return;
        }
        
        // Validación adicional: verificar que la fecha no sea futura
        const fechaSeleccionada = dayjs(form.fechaAplicacion);
        const fechaActual = dayjs();
        
        if (fechaSeleccionada.isAfter(fechaActual)) {
            mostrarAlertaError("No se pueden registrar vacunas en fechas futuras");
            return;
        }
        
        try {
            const data = {
                MascotaId: parseInt(idMascota),
                VacunaId: parseInt(form.vacunaId),
                FechaAplicacion: new Date(form.fechaAplicacion).toISOString(),
                Observaciones: form.observacion || "",
                FechaProxima: fechaProxima ? new Date(fechaProxima).toISOString() : null,
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

                <TextField
                    label="Fecha de aplicación"
                    type="date"
                    fullWidth
                    name="fechaAplicacion"
                    value={form.fechaAplicacion}
                    onChange={handleChange}
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        max: dayjs().format("YYYY-MM-DD")
                    }}
                    helperText="No se pueden registrar vacunas en fechas futuras"
                />

                {fechaProxima && (
                    <TextField
                        label="Fecha próxima dosis"
                        value={fechaProxima}
                        fullWidth
                        disabled
                        sx={{ mt: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                )}

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
                    disabled={loading || !form.vacunaId || vacunas.length === 0}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
