import { useState, useEffect } from "react";
import { Container, Grid, Box, Typography, Fade } from "@mui/material";
import { motion } from "framer-motion";

import StatsToolbar from "../../components/stats/StatsToolbar";
import UsersByMonthChart from "../../components/stats/UsersByMonthChart";
import ActivityByMonthChart from "../../components/stats/ActivityByMonthChart";
import PublisByMonthChart from "../../components/stats/PublisByMonthChart";
import UsersTotalKpi from "../../components/stats/UsersTotalKpi";
import OrgsKpiCard from "../../components/stats/OrgsKpiCard";
import PublicacionesFinalizadasChart from "../../components/stats/PublicacionesFinalizadasChart";
import { getOrgsTotals } from "../../api/statsApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Stats() {
  const [months, setMonths] = useState(13);
  const [orgsData, setOrgsData] = useState(null);

  useEffect(() => {
    getOrgsTotals(true).then(setOrgsData).catch(() => setOrgsData(null));
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Fade in timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Header Section - Centrado */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: 32, textAlign: 'center', width: '100%' }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                color="black"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dashboard de Estadísticas
              </Typography>
              <Typography 
                variant="h6" 
                color="black"
                sx={{ fontWeight: 400 }}
              >
                Análisis completo de la actividad de Amigos Peludos
              </Typography>
            </motion.div>

            {/* Toolbar */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}
            >
              <StatsToolbar months={months} setMonths={setMonths} />
            </motion.div>

            {/* Main Content - Centrado */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}
            >
              <Grid container spacing={3} justifyContent="center">
                {/* KPI Cards - Todos del mismo tamaño */}
                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}>
                  <motion.div variants={itemVariants}>
                    <UsersTotalKpi onlyEnabled={false} />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}>
                  <motion.div variants={itemVariants}>
                    <OrgsKpiCard 
                      title="Veterinarias" 
                      value={orgsData?.veterinarias ?? null} 
                      icon="LocalHospitalRounded" 
                      color="error" 
                    />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}>
                  <motion.div variants={itemVariants}>
                    <OrgsKpiCard 
                      title="Paseadores" 
                      value={orgsData?.paseadores ?? null} 
                      icon="DirectionsWalkRounded" 
                      color="info" 
                    />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}>
                  <motion.div variants={itemVariants}>
                    <OrgsKpiCard 
                      title="Cuidadores" 
                      value={orgsData?.cuidadores ?? null} 
                      icon="HomeRounded" 
                      color="warning" 
                    />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}>
                  <motion.div variants={itemVariants}>
                    <OrgsKpiCard 
                      title="Fundaciones" 
                      value={orgsData?.fundaciones ?? null} 
                      icon="VolunteerActivismRounded" 
                      color="success" 
                    />
                  </motion.div>
                </Grid>

                {/* Charts Section - Mismo tamaño, 2 por fila */}
                <Grid size={{xs: 12, lg: 6}}>
                  <motion.div variants={itemVariants}>
                    <UsersByMonthChart months={months} />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12, lg: 6}}>
                  <motion.div variants={itemVariants}>
                    <ActivityByMonthChart months={months} />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12}}>
                  <motion.div variants={itemVariants}>
                    <PublisByMonthChart months={months} />
                  </motion.div>
                </Grid>

                <Grid size={{xs: 12}}>
                  <motion.div variants={itemVariants}>
                    <PublicacionesFinalizadasChart months={months} />
                  </motion.div>
                </Grid>

              </Grid>
            </motion.div>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
