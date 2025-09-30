// src/pages/perfil/tabs/PublicacionesTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Grid, Card, CardContent, Typography, IconButton,
  Box, Container, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../auth/AuthProvider";
import {
  getPublicacionesUser,
  deletePost,
  markPublicacionEncontrada,
} from "../../../api/userApi";
import { mostrarAlertaExito, mostrarAlertaError } from "../../../utils/showAlert";
import CustomLoader from "../../../components/CustomLoader";
import ConsultarPublicacion from "../publicaciones/ConsultarPublicacion";

/** Detecta el email desde varias fuentes para no colgarnos */
function pickEmail(auth) {
  return (
    auth?.email ||
    auth?.user?.email ||
    auth?.usuario?.email ||
    auth?.correoElectronico ||
    auth?.user?.correoElectronico ||
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    null
  );
}

const PublicacionesTab = () => {
  const auth = useAuth();
  const email = useMemo(() => pickEmail(auth), [auth]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postToViewId, setPostToViewId] = useState(null);
  const navigate = useNavigate();

  // Eliminar
  const [confirmDialog, setConfirmDialog] = useState({ open: false, postId: null, postName: "" });

  // Encontrada
  const [foundDialog, setFoundDialog] = useState({ open: false, postId: null, postName: "" });
  const [graciasSitio, setGraciasSitio] = useState(null);
  const [savingFound, setSavingFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const cargar = async (mail) => {
      setLoading(true);
      try {
        const resp = await getPublicacionesUser(mail);
        const data = resp?.data ?? [];
        const visibles = Array.isArray(data) ? data.filter(p => p?.habilitado !== false) : [];
        if (!cancelled) {
          setPosts(visibles);
          setLoading(false);
        }
      } catch (e) {
        console.error("getPublicacionesUser error:", e);
        if (!cancelled) {
          mostrarAlertaError("No se pudieron cargar tus publicaciones");
          setLoading(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (email) {
      cargar(email);
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [email]);

  const handleDelete = async (publicacionId) => {
    try {
      await deletePost(publicacionId);
      setPosts(prev => prev.filter(p => p.id !== publicacionId));
      mostrarAlertaExito("Publicación eliminada");
    } catch (error) {
      console.error(error);
      mostrarAlertaError("No se pudo eliminar la publicación");
    }
  };

  // --- Encontrada: abrir/cerrar modal
  const abrirModalEncontrada = (post) => {
    setFoundDialog({ open: true, postId: post.id, postName: post.nombre || "" });
    setGraciasSitio(null);
  };

  const cerrarModalEncontrada = () => {
    if (!savingFound) {
      setFoundDialog({ open: false, postId: null, postName: "" });
      setGraciasSitio(null);
    }
  };

  // --- Encontrada: confirmar
  const confirmarEncontrada = async () => {
    if (!foundDialog.postId || graciasSitio === null) return;
    setSavingFound(true);
    try {
      await markPublicacionEncontrada(foundDialog.postId, graciasSitio);
      setPosts(prev => prev.filter(p => p.id !== foundDialog.postId)); // desaparece al instante
      mostrarAlertaExito("¡Nos alegra que hayas encontrado a tu mascota!");
    } catch (e) {
      console.error(e);
      mostrarAlertaError("No se pudo marcar como encontrada");
    } finally {
      setSavingFound(false);
      cerrarModalEncontrada();
    }
  };

  // --- Render
  if (loading) return <CustomLoader />;

  if (postToViewId !== null) {
    return <ConsultarPublicacion id={postToViewId} onCancel={() => setPostToViewId(null)} />;
  }

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h6" mb={2}>Mis Publicaciones</Typography>

          <Grid container spacing={2}>
            {(!email || posts.length === 0) && (
              <Grid item xs={12}>
                <Typography color={!email ? "text.secondary" : "inherit"}>
                  {!email
                    ? "No pudimos identificar tu email todavía. Si ya iniciaste sesión, volvé a esta pestaña en unos segundos."
                    : "No tenés publicaciones aún."}
                </Typography>
              </Grid>
            )}

            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Contenedor con relación de aspecto fija para que la imagen NUNCA deforme la card */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",      // altura automática en función del ancho
                      bgcolor: "#f5f5f5",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={post?.fotos?.[0]?.foto || "/images/placeholder-post.png"}
                      alt={post.nombre || "Publicación"}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",       // recorta sin deformar
                      }}
                      loading="lazy"
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 120,
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom noWrap>
                      {post.nombre || "-"}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" gap={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton onClick={() => setPostToViewId(post.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <IconButton onClick={() => navigate(`/perfil/publicaciones/modificar/${post.id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      {post?.publicacionTipo === "Perdida" && (
                        <Tooltip title="Marcar como encontrada">
                          <Button size="small" variant="contained" onClick={() => abrirModalEncontrada(post)}>
                            Encontrada
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => setConfirmDialog({ open: true, postId: post.id, postName: post.nombre || "" })}
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
      </Container>

      {/* Dialog eliminar */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, postId: null, postName: "" })}
      >
        <DialogTitle>¿Eliminar publicación?</DialogTitle>
        <DialogContent>
          ¿Estás seguro que querés eliminar <strong>{confirmDialog.postName}</strong>? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, postId: null, postName: "" })}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete(confirmDialog.postId);
              setConfirmDialog({ open: false, postId: null, postName: "" });
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog encontrada (nuevo copy) */}
      <Dialog open={foundDialog.open} onClose={cerrarModalEncontrada} fullWidth maxWidth="xs">
        <DialogTitle>¡Qué alegría! 🎉</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            ¡Nos alegra que hayas encontrado a tu mascota! Para ayudarnos a mejorar, ¿nos contás si
            <strong> AmigosPeludos</strong> te fue útil en el reencuentro?
          </Typography>
          <Box display="flex" gap={1.5} mt={2}>
            <Button
              variant={graciasSitio === true ? "contained" : "outlined"}
              onClick={() => setGraciasSitio(true)}
            >
              Sí, ayudó
            </Button>
            <Button
              variant={graciasSitio === false ? "contained" : "outlined"}
              onClick={() => setGraciasSitio(false)}
            >
              No, no ayudó
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
            Gracias por marcarla como encontrada: así mantenemos la comunidad actualizada. 💛
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalEncontrada} disabled={savingFound}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmarEncontrada}
            disabled={savingFound || graciasSitio === null}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PublicacionesTab;
