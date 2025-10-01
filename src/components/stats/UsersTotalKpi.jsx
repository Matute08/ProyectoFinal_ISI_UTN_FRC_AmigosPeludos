import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography, Box, Chip } from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { getUsersTotal } from "../../api/statsApi";

const nf = (n) => new Intl.NumberFormat("es-AR").format(n);

export default function UsersTotalKpi({ onlyEnabled = true }) {
  const theme = useTheme();
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getUsersTotal(onlyEnabled).then(d => setTotal(d.total)).catch(() => setTotal(null));
  }, [onlyEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card 
        sx={{
          background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 50%, #D2691E 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(244, 162, 97, 0.3)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(244, 162, 97, 0.4)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            zIndex: 1
          }
        }}
      >
        <CardContent sx={{ 
          position: 'relative',
          zIndex: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          '&:last-child': { pb: 3 }
        }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <GroupRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 600,
                opacity: 0.9,
                fontSize: '0.75rem',
                letterSpacing: 1.2,
                mb: 1,
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              USUARIOS REGISTRADOS
            </Typography>
            <Typography variant="h4" sx={{ 
              lineHeight: 1, 
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {total === null ? "—" : nf(total)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
