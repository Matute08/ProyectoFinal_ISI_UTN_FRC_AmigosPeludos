import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Stack, Typography, Box } from "@mui/material";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import DirectionsWalkRounded from "@mui/icons-material/DirectionsWalkRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import VolunteerActivismRounded from "@mui/icons-material/VolunteerActivismRounded";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { getOrgsTotals } from "../../api/statsApi";

const nf = (n) => new Intl.NumberFormat("es-AR").format(n);

const colorConfigs = {
  error: {
    gradient: 'linear-gradient(135deg, #E53935 0%, #D32F2F 100%)',
    light: '#FFEBEE',
    iconBg: 'rgba(229, 57, 53, 0.1)'
  },
  info: {
    gradient: 'linear-gradient(135deg, #039BE5 0%, #0277BD 100%)',
    light: '#E3F2FD',
    iconBg: 'rgba(3, 155, 229, 0.1)'
  },
  warning: {
    gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    light: '#FFF3E0',
    iconBg: 'rgba(255, 152, 0, 0.1)'
  },
  success: {
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
    light: '#E8F5E8',
    iconBg: 'rgba(46, 125, 50, 0.1)'
  }
};

function Kpi({ title, value, icon: Icon, color, delay = 0 }) {
  const theme = useTheme();
  const config = colorConfigs[color] || colorConfigs.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        sx={{
          background: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${config.iconBg}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: config.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon 
                sx={{ 
                  fontSize: 28, 
                  color: theme.palette[color]?.main || theme.palette.primary.main 
                }} 
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  letterSpacing: 1.2
                }}
              >
                {title.toUpperCase()}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  lineHeight: 1, 
                  fontWeight: 800,
                  color: 'text.primary',
                  mt: 0.5
                }}
              >
                {value === null ? "—" : nf(value)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function OrgsTotalsKpis({ onlyEnabled = true }) {
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    getOrgsTotals(onlyEnabled).then(setTotals).catch(() => setTotals(null));
  }, [onlyEnabled]);

  const v = totals || {};
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6} lg={3}>
        <Kpi 
          title="Veterinarias" 
          value={v.veterinarias ?? null} 
          icon={LocalHospitalRounded} 
          color="error" 
          delay={0.1}
        />
      </Grid>
      <Grid item xs={6} sm={6} lg={3}>
        <Kpi 
          title="Paseadores" 
          value={v.paseadores ?? null} 
          icon={DirectionsWalkRounded} 
          color="info" 
          delay={0.2}
        />
      </Grid>
      <Grid item xs={6} sm={6} lg={3}>
        <Kpi 
          title="Cuidadores" 
          value={v.cuidadores ?? null} 
          icon={HomeRounded} 
          color="warning" 
          delay={0.3}
        />
      </Grid>
      <Grid item xs={6} sm={6} lg={3}>
        <Kpi 
          title="Fundaciones" 
          value={v.fundaciones ?? null} 
          icon={VolunteerActivismRounded} 
          color="success" 
          delay={0.4}
        />
      </Grid>
    </Grid>
  );
}
