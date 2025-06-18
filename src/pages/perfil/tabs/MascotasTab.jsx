import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Container,
    Alert,
    Dialog,
    IconButton,
    Tooltip,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CustomLoader from "../../../components/CustomLoader";
import { getMascotasUsuario, deletePet } from "../../../api/mascotasApi";
import { updateUser } from "../../../api/userApi";
import { deleteFileStorage } from "../../../api/firebaseUploads";
import { useNavigate } from "react-router-dom";
import ConsultarMascota from "../mascotas/ConsultarMascota";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert"; // ajustá el path si es distinto

const MascotasTab = ({ userData }) => {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [petToConsultId, setPetToConsultId] = useState(null);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        petId: null,
        petName: "",
    });

    const fetchMascotas = async () => {
        try {
            const res = await getMascotasUsuario(userData.id);
            setPets(res?.data || []);
        } catch {
            setError("No se pudieron cargar las mascotas.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        const isLast = pets.length === 1;

        try {
            await deletePet(id);
            mostrarAlertaExito(
                "La mascota fue eliminada correctamente",
                "/perfil"
            );
            if (isLast) {
                await updateUser(userData.id, { tieneMascota: false });
            }
            if (imageUrl) await deleteFileStorage(imageUrl);

            setPets((prev) => prev.filter((p) => p.id !== id));
            setConfirmDialog({ open: false, petId: null });
        } catch (err) {
            console.error("Error al eliminar mascota:", err);
            mostrarAlertaError("No se pudo eliminar la mascota");
        }
    };

    useEffect(() => {
        if (userData?.id) {
            fetchMascotas();
        } else {
            setLoading(false);
            setError("No se encontró el ID del usuario.");
        }
    }, [userData]);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (pets.length === 0) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                ¡Todavía no cargaste ninguna mascota!
            </Alert>
        );
    }

    if (petToConsultId !== null) {
        return (
            <ConsultarMascota
                mascotaId={petToConsultId}
                onCancel={() => setPetToConsultId(null)}
            />
        );
    }

    return (
        <>
            <Grid container spacing={2}>
                {pets.map((pet) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={pet.id}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="180"
                                image={
                                    pet.foto || "/images/placeholder-pet.png"
                                }
                                alt={pet.nombre}
                                sx={{
                                    objectFit: "cover",
                                }}
                            />

                            <CardContent>
                                <Typography variant="h6" align="center">
                                    {pet.nombre || "Sin nombre"}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Tooltip title="Ver detalles">
                                        <IconButton
                                            onClick={() =>
                                                setPetToConsultId(pet.id)
                                            }
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() =>
                                                navigate(
                                                    `/modificar-mascota/${pet.id}`
                                                )
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Vacunas">
                                        <IconButton
                                            onClick={() =>
                                                navigate(
                                                    `/vacunas-mascota/${pet.id}`
                                                )
                                            }
                                        >
                                            <VaccinesIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            onClick={() =>
                                                setConfirmDialog({
                                                    open: true,
                                                    petId: pet.id,
                                                    petName: pet.nombre,
                                                    petImage: pet.foto,
                                                })
                                            }
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false })}
            >
                <DialogTitle>¿Eliminar Mascota?</DialogTitle>
                <DialogContent>
                    ¿Estás seguro que querés eliminar{" "}
                    <strong>{confirmDialog.petName}</strong>? Esta acción no se
                    puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false })}>
                        Cancelar
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(confirmDialog.petId)}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MascotasTab;
