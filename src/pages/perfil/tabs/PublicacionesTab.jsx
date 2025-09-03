// src/pages/perfil/tabs/PublicacionesTab.jsx

import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    Container,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";
import { getPublicacionesUser, deletePost } from "../../../api/userApi";
import {
    mostrarAlertaExito,
    mostrarAlertaError,
} from "../../../utils/showAlert";
import CustomLoader from "../../../components/CustomLoader";
import ConsultarPublicacion from "../publicaciones/ConsultarPublicacion";
const PublicacionesTab = () => {
    const [posts, setPosts] = useState([]);
    const user = useAuth();
    const [loading, setLoading] = useState(true);
    const [postToViewId, setPostToViewId] = useState(null);
    const navigate = useNavigate();
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        postId: null,
        postName: "",
    });

    const cargarPublicaciones = async () => {
        try {
            const res = await getPublicacionesUser(user.user.email);
            setPosts(res.data);
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPublicaciones();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            mostrarAlertaExito(
                "Publicación eliminada correctamente",
                "/perfil"
            );
            cargarPublicaciones();
        } catch (error) {
            console.error(error);
            setLoading(false);
            mostrarAlertaError("No se pudo eliminar la publicación");
        }
    };

    if (postToViewId !== null) {
        return (
            <ConsultarPublicacion
                id={postToViewId}
                onCancel={() => setPostToViewId(null)}
            />
        );
    }

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 5 }}>
                <CustomLoader />
            </Container>
        );
    }

    return (
        <>
            <Box mt={2}>
                <Typography variant="h6" mb={2}>
                    Mis Publicaciones
                </Typography>
                <Grid container spacing={2}>
                    {posts.length === 0 && (
                        <Grid item size={{xs:12}} >
                            <Typography>No tenés publicaciones aún.</Typography>
                        </Grid>
                    )}
                    {posts.map((post) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={
                                        post.fotos[0].foto ||
                                        "/images/placeholder-post.png"
                                    }
                                    alt={post.nombre}
                                    sx={{ 
                                        objectFit: "contain",
                                        width: "100%",
                                        backgroundColor: "#f5f5f5"
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                        sx={{ minHeight: '24px', display: 'flex', alignItems: 'center' }}
                                    >
                                        {post.nombre || "-"}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        mt="auto"
                                    >
                                        <Tooltip title="Ver detalles">
                                            <IconButton
                                                onClick={() =>
                                                    setPostToViewId(post.id)
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() =>
                                                    navigate(
                                                        `/modificar-publicacion/${post.id}`
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                onClick={() =>
                                                    setConfirmDialog({
                                                        open: true,
                                                        postId: post.id,
                                                        postName: post.nombre,
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
            </Box>

            <Dialog
                open={confirmDialog.open}
                onClose={() =>
                    setConfirmDialog({
                        open: false,
                        postId: null,
                        postName: "",
                    })
                }
            >
                <DialogTitle>¿Eliminar publicación?</DialogTitle>
                <DialogContent>
                    ¿Estás seguro que querés eliminar{" "}
                    <strong>{confirmDialog.postName}</strong>? Esta acción no se
                    puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            setConfirmDialog({ open: false, postId: null })
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            handleDelete(confirmDialog.postId);
                            setConfirmDialog({ open: false, postId: null });
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PublicacionesTab;
