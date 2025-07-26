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
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { mostrarAlertaInfo } from "../utils/showAlert";

const CardServicio = ({ tipo, data, onEliminar, mostrarVer = false }) => {
    const navigate = useNavigate();



    const handleModificar = () => {
        // Verificar si existe la ruta de modificación para el tipo de servicio
        const rutasModificacion = {
            'paseador': `/modificar-paseador/${data.id}`,
            'cuidador': `/modificar-cuidador/${data.id}`,
            'veterinaria': null, // No existe aún
            'fundacion': null, // No existe aún
        };

        const ruta = rutasModificacion[tipo];
        
        if (ruta) {
            navigate(ruta);
        } else {
            mostrarAlertaInfo("Función en desarrollo", "La modificación de este servicio estará disponible próximamente.");
        }
    };

    const handleVer = () => {
        const rutasPerfil = {
            'paseador': `/perfil-paseador/${data.id}`,
            'cuidador': `/perfil-cuidador/${data.id}`,
            'veterinaria': null, // No existe aún
            'fundacion': null, // No existe aún
        };

        const ruta = rutasPerfil[tipo];
        if (ruta) {
            navigate(ruta);
        } else {
            mostrarAlertaInfo("Función en desarrollo", "La vista de perfil estará disponible próximamente.");
        }
    };

    // Selecciona la primera imagen disponible
    const getImage = () => {
        // Para cuidadores, las fotos vienen como array de objetos {foto: url}
        if (data.fotos && data.fotos.length > 0) {
            const primeraFoto = data.fotos[0];
            
            // Si es un objeto con propiedad foto
            if (typeof primeraFoto === 'object' && primeraFoto.foto) {
                return primeraFoto.foto;
            }
            // Si es directamente una URL
            if (typeof primeraFoto === 'string') {
                return primeraFoto;
            }
        }
        
        // Fallbacks
        return data.imagen || data.fotoUrl || data.foto || "";
    };

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
