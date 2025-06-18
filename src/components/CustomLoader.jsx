
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import pawIcon from "../assets/paw-icon.gif"; 

const CustomLoader = ({ text = "Cargando..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <img src={pawIcon} alt="Cargando..." style={{ width: 100, height: 100 }} />
      <Typography variant="subtitle1" mt={2}>
        {text}
      </Typography>
    </Box>
  );
};

export default CustomLoader;
