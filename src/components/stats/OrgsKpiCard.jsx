import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import DirectionsWalkRounded from "@mui/icons-material/DirectionsWalkRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import VolunteerActivismRounded from "@mui/icons-material/VolunteerActivismRounded";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

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

const iconMap = {
  LocalHospitalRounded,
  DirectionsWalkRounded,
  HomeRounded,
  VolunteerActivismRounded
};

export default function OrgsKpiCard({ title, value, icon, color, delay = 0 }) {
  const theme = useTheme();
  const config = colorConfigs[color] || colorConfigs.error;
  const Icon = iconMap[icon] || LocalHospitalRounded;

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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          }
        }}
      >
        <CardContent sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          height: '100%'
        }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: config.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Icon 
              sx={{ 
                fontSize: 28, 
                color: theme.palette[color]?.main || theme.palette.primary.main 
              }} 
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                letterSpacing: 1.2,
                mb: 1
              }}
            >
              {title.toUpperCase()}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                lineHeight: 1, 
                fontWeight: 800,
                color: 'text.primary'
              }}
            >
              {value === null ? "—" : nf(value)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
