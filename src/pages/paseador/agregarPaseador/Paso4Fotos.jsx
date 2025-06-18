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
import { uploadFilesPaseador } from "../../../api/firebaseUploads";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Paso4Fotos = () => {
  const { setValue, trigger } = useFormContext();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const subirFotos = async () => {
      if (files.length === 0) {
        setError("Debes subir al menos una imagen.");
        return;
      }
      try {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
          const result = await uploadFilesPaseador(files[i].file);
          urls.push(result);
        }
        setValue("fotos", urls);
        await trigger("fotos");
        setError("");
      } catch (err) {
        setError("Error al subir las imágenes",err);
      }
    };

    subirFotos();
  }, [files, setValue, trigger]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fotos de paseos
      </Typography>
      <Typography variant="body2" mb={2}>
        Adjuntá entre 1 y 4 fotos de paseos anteriores o momentos con mascotas.
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

export default Paso4Fotos;
