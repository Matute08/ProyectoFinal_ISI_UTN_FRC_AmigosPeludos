import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { getUserMail, updateUser } from "../../../api/userApi";
import { getFundacion, deleteFundacion } from "../../../api/fundacionesApi";
import CardServicio from "../../../components/CardServicio";
import Swal from "sweetalert2";
import CustomLoader from "../../../components/CustomLoader";

const ServicioFundacion = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fundaciones, setFundaciones] = useState([]);

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
          const data = await getFundacion();
          console.log("Datos de fundaciones:", data);
          const filtradas = data.data.filter((f) => f.usuarioId === userData.id);
          setFundaciones(filtradas);
          console.log("Fundaciones:", filtradas);
        } catch (error) {
          console.error("Error al obtener fundaciones", error);
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
      text: "Esta acción eliminará tu fundación",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (confirmar.isConfirmed) {
      await deleteFundacion(id);
      await updateUser(userData.id, { esFundacion: null });
      setFundaciones([]);
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
      {fundaciones.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {fundaciones.map((fundacion) => (
            <Grid item key={fundacion.id}>
              <CardServicio
                tipo="fundacion"
                data={fundacion}
                onEliminar={() => handleEliminar(fundacion.id)}
                mostrarVer={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center">
          <h3>No tenés una fundación registrada.</h3>
        </Box>
      )}
    </Box>
  );
};

export default ServicioFundacion;
