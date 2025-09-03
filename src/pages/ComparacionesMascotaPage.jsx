import React from "react";
import { useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import ComparacionesMascota from "../components/ComparacionesMascota";

const ComparacionesMascotaPage = () => {
  const { id } = useParams();

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box>
        <ComparacionesMascota publicacionId={id} />
      </Box>
    </Container>
  );
};

export default ComparacionesMascotaPage; 