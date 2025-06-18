import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    CardActions,
    Tooltip,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
const CardServicio = ({ tipo, data, onEliminar, mostrarVer = false }) => {
    const navigate = useNavigate();

    const handleModificar = () => {
        navigate(`/modificar-${tipo}/${data.id}`);
    };

    const handleVer = () => {
        navigate(`/${tipo}s/perfil-${tipo}/${data.id}`);
    };

    // Selecciona la primera imagen disponible
    const getImage = () => data.fotos?.[0]?.foto || data.imagen || data.fotoUrl || "";

    return (
      <Card sx={{ maxWidth: 400, m: 2 }}>
        {getImage() && (
          <CardMedia
            component="img"
            height="200"
            sx={{ objectFit: "contain" }}
            image={getImage()}
            alt={tipo}
          />
        )}
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {data.titulo || data.nombre}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {data.presentacion || data.descripcion || "Sin descripción"}
          </Typography>
          {(data.experiencia || data.motivoDonaciones) && (
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              ✨ {data.experiencia || data.motivoDonaciones}
            </Typography>
          )}
          {(data.barrioTrabajo || data.barrio) && (
            <Typography variant="body2">
              📍 {data.barrioTrabajo || data.barrio}
            </Typography>
          )}
          {data.precioCuidado && (
            <Typography variant="body2">
              💲 ${data.precioCuidado} por hora
            </Typography>
          )}
          {data.precioPaseo && (
            <Typography variant="body2">
              💲 ${data.precioPaseo} por paseo
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
          {mostrarVer && (
            <Tooltip title="Ver detalles">
              <IconButton onClick={handleVer}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <IconButton onClick={handleModificar}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={onEliminar}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    );
};

export default CardServicio;
