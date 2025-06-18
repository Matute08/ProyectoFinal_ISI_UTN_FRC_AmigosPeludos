import { Fab, Zoom, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function FloatingActionButton({ destino = "/", tooltip= "Agregar Publicacion" }) {
  const navigate = useNavigate();

  return (
    <Zoom in={true}>
      <Tooltip title={tooltip} placement="left">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate(destino)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
