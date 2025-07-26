import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getDenuncias } from "../../api/denunciasApi";
import CustomLoader from "../../components/CustomLoader";

const PanelDenuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDenuncias = async () => {
    try {
      const res = await getDenuncias();
      setDenuncias(res.data || []);
    } catch (error) {
      console.error("Error al obtener denuncias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const obtenerRutaPublicacion = (tipo, idPublicacion) => {
    switch (tipo) {
      case "Perdida":
        return `/consultar-posteo-perdida/${idPublicacion}`;
      case "Encontrada":
        return `/consultar-posteo-encontrada/${idPublicacion}`;
      case "Adopcion":
        return `/consultar-posteo-adopcion/${idPublicacion}`;
      default:
        return `/publicacion/${idPublicacion}`;
    }
  };

  const eliminarPublicacion = (idPublicacion) => {
    // TODO: Llamar a la API para eliminar publicación y refrescar la lista
  };

  const descartarDenuncia = (idDenuncia) => {
    // TODO: Llamar a la API para ocultar o marcar como revisada la denuncia y refrescar la lista
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CustomLoader />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Panel de Denuncias
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Usuario denunciante</TableCell>
              <TableCell>Tipo Publicación</TableCell>
              <TableCell>Ver Publicación</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {denuncias.length > 0 ? (
              denuncias.map((denuncia) => (
                <TableRow key={denuncia.id}>
                  <TableCell>
                    {new Date(denuncia.fechaDenuncia).toLocaleString()}
                  </TableCell>
                  <TableCell>{denuncia.motivo}</TableCell>
                  <TableCell>{denuncia.usuarioDenunciante}</TableCell>
                  <TableCell>{denuncia.tipoPublicacion}</TableCell>
                  <TableCell>
                    <MuiLink
                      component={RouterLink}
                      to={obtenerRutaPublicacion(
                        denuncia.tipoPublicacion,
                        denuncia.idPublicacion
                      )}
                      underline="hover"
                      color="primary"
                    >
                      Ver
                    </MuiLink>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Aceptar denuncia y eliminar publicación">
                      <IconButton
                        color="success"
                        onClick={() =>
                          eliminarPublicacion(denuncia.idPublicacion)
                        }
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Descartar denuncia">
                      <IconButton
                        color="error"
                        onClick={() => descartarDenuncia(denuncia.id)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay denuncias para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PanelDenuncias;
