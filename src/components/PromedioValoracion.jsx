import React from "react";
import { Rating } from "@mui/material";

const PromedioValoracion = ({ promedio = 0, size = "medium" }) => {
  return (
    <Rating
      name="promedio-valoracion"
      value={promedio}
      precision={0.5}
      readOnly
      size={size}
    />
  );
};

export default PromedioValoracion;



