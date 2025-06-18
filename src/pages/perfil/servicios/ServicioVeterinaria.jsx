import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { getUserMail, updateUser } from "../../../api/userApi";
import { getVeterinarias, deleteVeterinaria } from "../../../api/commonApi";
import CardServicio from "../../../components/CardServicio";
import Swal from "sweetalert2";
import CustomLoader from "../../../components/CustomLoader";

const ServicioVeterinaria = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [veterinarias, setVeterinarias] = useState([]);

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
          const data = await getVeterinarias();
          const filtradas = data.data.filter((v) => v.usuarioId === userData.id);
          setVeterinarias(filtradas);
        } catch (error) {
          console.error("Error al obtener veterinarias", error);
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
      text: "Esta acción eliminará tu veterinaria",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (confirmar.isConfirmed) {
      await deleteVeterinaria(id);
      await updateUser(userData.id, { esVeterinaria: null });
      setVeterinarias([]);
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
      {veterinarias.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {veterinarias.map((veterinaria) => (
            <Grid item key={veterinaria.id}>
              <CardServicio
                tipo="veterinaria"
                data={veterinaria}
                onEliminar={() => handleEliminar(veterinaria.id)}
                mostrarVer={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center">
          <h3>No tenés una veterinaria registrada.</h3>
        </Box>
      )}
    </Box>
  );
};

export default ServicioVeterinaria;