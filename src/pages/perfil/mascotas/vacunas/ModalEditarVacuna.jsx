import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        if (open && dosis) {
            setForm({
                fechaAplicacion: dayjs(dosis.fechaAplicacion).format("YYYY-MM-DD"),
                fechaProxima: dosis.fechaProxima ? dayjs(dosis.fechaProxima).format("YYYY-MM-DD") : "",
                observaciones: dosis.observaciones || "",
            });
        }
    }, [open, dosis]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
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
            const data = {
                FechaAplicacion: new Date(form.fechaAplicacion).toISOString(),
                FechaProxima: form.fechaProxima ? new Date(form.fechaProxima).toISOString() : null,
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

                <TextField
                    label="Fecha de aplicación"
                    type="date"
                    fullWidth
                    name="fechaAplicacion"
                    value={form.fechaAplicacion}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                />

                <TextField
                    label="Fecha próxima dosis"
                    type="date"
                    fullWidth
                    name="fechaProxima"
                    value={form.fechaProxima}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                    helperText="Dejar vacío si no aplica"
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
