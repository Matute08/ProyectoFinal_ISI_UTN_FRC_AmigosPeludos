import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { uploadFilesCuidador } from "../../../api/firebaseUploads";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Paso5CuidadorEdicion = ({ onUploadingChange }) => {
  const { setValue, watch } = useFormContext();
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fotosActuales, setFotosActuales] = useState([]);
  const [files, setFiles] = useState([]);

  // Obtener las fotos del formulario
  const formFotos = watch("fotos") || [];

  // Inicializar fotos actuales solo una vez
  useEffect(() => {
    if (formFotos.length > 0 && fotosActuales.length === 0) {
      // Crear objetos con estado temporal igual que ModificarMascota.jsx
      const fotosConEstado = formFotos.map(foto => ({
        url: foto,
        estadoTemporal: true // true = mantener, false = eliminar
      }));
      setFotosActuales(fotosConEstado);
      console.log("Fotos actuales inicializadas:", fotosConEstado);
    }
  }, [formFotos.length]);

  // Actualizar formulario cuando cambien las fotos activas
  useEffect(() => {
    const fotosParaEnviar = fotosActuales
      .filter(foto => foto.estadoTemporal)
      .map(foto => foto.url);
    
    console.log("Actualizando formulario con fotos:", fotosParaEnviar);
    setValue("fotos", fotosParaEnviar);
  }, [fotosActuales, setValue]);

  const handleToggleFoto = (index) => {
    setFotosActuales(prev => 
      prev.map((foto, i) => 
        i === index 
          ? { ...foto, estadoTemporal: !foto.estadoTemporal }
          : foto
      )
    );
  };

  const handleFilePondUpdate = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    // Notificar al componente padre que se está subiendo
    if (onUploadingChange) {
      onUploadingChange(true);
    }

    try {
      // Subir todas las fotos nuevas
      const nuevasURLs = [];
      for (const file of files) {
        const url = await uploadFilesCuidador(file.file);
        nuevasURLs.push(url);
      }

      // Agregar las nuevas fotos a las actuales
      const nuevasFotos = nuevasURLs.map(url => ({
        url: url,
        estadoTemporal: true
      }));

      setFotosActuales(prev => [...prev, ...nuevasFotos]);
      
      // Limpiar FilePond
      setFiles([]);
    } catch (err) {
      setError("Error al subir las imágenes");
    } finally {
      setIsUploading(false);
      
      // Notificar al componente padre que terminó la subida
      if (onUploadingChange) {
        onUploadingChange(false);
      }
    }
  };

  // Validar que haya al menos una foto
  const fotosActivas = fotosActuales.filter(foto => foto.estadoTemporal);
  useEffect(() => {
    if (fotosActuales.length > 0 && fotosActivas.length === 0) {
      setError("Debes mantener al menos una imagen.");
    } else {
      setError("");
    }
  }, [fotosActivas.length, fotosActuales.length]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fotos del cuidador
      </Typography>
      <Typography variant="body2" mb={2}>
        Adjuntá entre 1 y 4 fotos que representen tu experiencia como cuidador.
      </Typography>

      {/* Mostrar fotos actuales */}
      {fotosActuales.length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Fotos actuales:
          </Typography>
          <Grid container spacing={2}>
            {fotosActuales.map((foto, index) => (
              <Grid item xs={12} sm={6} md={3} key={`${foto.url}-${index}`}>
                <Box sx={{ display: 'inline-block', position: 'relative', mr: 1, mb: 2 }}>
                  <img
                    src={foto.url}
                    alt={`Foto ${index + 1}`}
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                      opacity: foto.estadoTemporal ? 1 : 0.5,
                      border: foto.estadoTemporal ? '2px solid green' : '2px solid red'
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleToggleFoto(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: foto.estadoTemporal ? 'error.main' : 'success.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: foto.estadoTemporal ? 'error.dark' : 'success.dark',
                      }
                    }}
                  >
                    {foto.estadoTemporal ? '✕' : '✓'}
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Haz clic en el botón ✕ para eliminar la foto, o ✓ para mantenerla. 
            Total: {fotosActivas.length}/4 fotos activas
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {fotosActuales.length > 0 ? 
              "Agregar más fotos" : 
              "Agregar fotos"
            }
          </Typography>
          
          <FilePond
            files={files}
            onupdatefiles={handleFilePondUpdate}
            acceptedFileTypes={["image/png", "image/jpeg"]}
            allowMultiple={true}
            maxFiles={4 - fotosActivas.length}
            labelIdle="Arrastrá o hacé click para subir más fotos"
            name="fotos"
            disabled={isUploading}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {isUploading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Subiendo imágenes...
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Paso5CuidadorEdicion;