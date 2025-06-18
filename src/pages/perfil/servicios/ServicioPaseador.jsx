import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { getUserMail, updateUser } from "../../../api/userApi";
import { getPaseadores, deletePaseador } from "../../../api/paseadoresApi";
import CardServicio from "../../../components/CardServicio";
import Swal from "sweetalert2";
import CustomLoader from "../../../components/CustomLoader";
const ServicioPaseador = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paseadores, setPaseadores] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const cachedUserData = localStorage.getItem("userData");
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        const res = await getUserMail(parsed.email);
        setUserData(res);
      }
    };
    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchServicios = async () => {
      if (userData) {
        try {
          const data = await getPaseadores();
          const filtrados = data.data.filter((p) => p.idUsuario === userData.id);
          setPaseadores(filtrados);
        } catch (error) {
          console.error("Error al obtener paseadores", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (userData?.id) fetchServicios();
  }, [userData]);

  const handleEliminar = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará tu perfil de paseador",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (confirmar.isConfirmed) {
      await deletePaseador(id);
      await updateUser(userData.id, { esPaseador: null });
      setPaseadores([]);
      Swal.fire("Eliminado", "Tu servicio fue eliminado.", "success");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CustomLoader />
      </Box>
    );
  }

  return (
    <Box mt={3}>
      {paseadores.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {paseadores.map((paseador) => (
            <Grid item key={paseador.id}>
              <CardServicio
                tipo="paseador"
                data={paseador}
                onEliminar={() => handleEliminar(paseador.id)}
                mostrarVer={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center">
          <h3>No tenés un servicio de paseador registrado.</h3>
        </Box>
      )}
    </Box>
  );
};

export default ServicioPaseador;
