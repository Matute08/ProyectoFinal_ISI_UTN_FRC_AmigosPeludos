import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, CircularProgress } from "@mui/material";
import ServicioPaseador from "../servicios/ServicioPaseador";
import ServicioCuidador from "../servicios/ServicioCuidador";
import ServicioVeterinaria from "../servicios/ServicioVeterinaria";
import ServicioFundacion from "../servicios/ServicioFundacion";
import { getUserMail } from "../../../api/userApi";
import CustomLoader from "../../../components/CustomLoader";

const ServiciosTab = () => {
  const [userData, setUserData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabsDisponibles, setTabsDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const localUser = JSON.parse(localStorage.getItem("userData"));
      if (localUser?.email) {
        const response = await getUserMail(localUser.email);
        setUserData(response);
        const tabs = [];
        if (response.esPaseador) tabs.push("Paseador");
        if (response.esCuidador) tabs.push("Cuidador");
        if (response.esVeterinaria) tabs.push("Veterinaria");
        if (response.esFundacion) tabs.push("Fundacion");
        setTabsDisponibles(tabs);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const renderTabContent = (tipo) => {
    switch (tipo) {
      case "Paseador":
        return <ServicioPaseador />;
      case "Cuidador":
        return <ServicioCuidador />;
      case "Veterinaria":
        return <ServicioVeterinaria />;
      case "Fundacion":
        return <ServicioFundacion />;
      default:
        return <Typography>Servicio no disponible</Typography>;
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
    <Box sx={{ width: "100%" }}>
      {/* <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
       
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabsDisponibles.map((tab, index) => (
          <Tab label={tab} key={index} />
        ))}
      </Tabs> */}

      <Typography variant="h5" align="center" gutterBottom>
        Proximamente...
      </Typography>

      {/* <Box mt={4}>
        {renderTabContent(tabsDisponibles[tabIndex])}
      </Box> */}
    </Box>
  );
};

export default ServiciosTab;
