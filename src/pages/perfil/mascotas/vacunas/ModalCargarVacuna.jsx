import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { postVacunaMascota, getVacunasPorTipo } from "../../../../api/vacunaApi";
import { getMascotaId } from "../../../../api/mascotasApi";
import { mostrarAlertaExito, mostrarAlertaError } from "../../../../utils/showAlert";

export default function ModalCargarVacuna({ open, handleClose, idMascota, onSuccess }) {
    const [vacunas, setVacunas] = useState([]);
    const [form, setForm] = useState({
        vacunaId: "",
        fechaAplicacion: dayjs().format("YYYY-MM-DD"),
        observacion: "",
    });
    const [fechaProxima, setFechaProxima] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const resMascota = await getMascotaId(idMascota);
                const tipoMascotaId = resMascota.data.raza.tipoMascota.id;
                const resVacunas = await getVacunasPorTipo(tipoMascotaId);
                setVacunas(resVacunas.data);
            } catch (err) {
                console.error("Error al cargar vacunas por tipo de mascota", err);
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
        try {
            const data = {
                MascotaId: parseInt(idMascota),
                VacunaId: parseInt(form.vacunaId),
                FechaAplicacion: new Date(form.fechaAplicacion).toISOString(),
                Observaciones: form.observacion || "",
                FechaProxima: new Date(fechaProxima).toISOString(),
            };
            await postVacunaMascota(data);
            mostrarAlertaExito("Vacuna registrada correctamente");
            
            onSuccess();
            handleClose();
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
                >
                    {vacunas.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.nombre}
                        </MenuItem>
                    ))}
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
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleGuardar}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
