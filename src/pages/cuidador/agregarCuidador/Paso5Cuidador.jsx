import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { uploadFilesCuidador } from "../../../api/firebaseUploads";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Paso5Cuidador = () => {
  const { setValue, trigger } = useFormContext();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const subirFotos = async () => {
      if (files.length === 0) {
        setValue("fotos", []);
        setError("Debes subir al menos una imagen.");
        return;
      }
      
      // Solo procesar archivos que no han sido subidos aún
      const archivosNuevos = files.filter(file => !file.serverId);
      
      if (archivosNuevos.length === 0) {
        return;
      }
      
      try {
        const urls = [];
        for (let i = 0; i < archivosNuevos.length; i++) {
          const result = await uploadFilesCuidador(archivosNuevos[i].file);
          urls.push(result);
        }
        
        // Obtener URLs existentes y agregar las nuevas
        const urlsExistentes = files
          .filter(file => file.serverId)
          .map(file => file.serverId);
        
        const todasLasUrls = [...urlsExistentes, ...urls];
        setValue("fotos", todasLasUrls);
        await trigger("fotos");
        setError("");
      } catch (err) {
        setError("Error al subir las imágenes: " + err.message);
      }
    };

    subirFotos();
  }, [files, setValue, trigger]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fotos del cuidador
      </Typography>
      <Typography variant="body2" mb={2}>
        Adjuntá entre 1 y 4 fotos que representen tu experiencia como cuidador.
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            acceptedFileTypes={["image/png", "image/jpeg"]}
            allowMultiple={true}
            maxFiles={4}
            labelIdle="Arrastrá o hacé click para subir"
            name="fotos"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Paso5Cuidador;
