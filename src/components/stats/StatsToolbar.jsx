import { useMemo } from "react";
import {
  Card, CardContent, Stack, FormControl, InputLabel, Select, MenuItem, Typography, Box, Chip
} from "@mui/material";
import { CalendarTodayRounded } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function StatsToolbar({ months, setMonths }) {
  const options = useMemo(() => [
    { value: 3, label: "3 meses", color: "success" },
    { value: 6, label: "6 meses", color: "info" },
    { value: 12, label: "12 meses", color: "primary" },
    { value: 24, label: "24 meses", color: "warning" }
  ], []);

  const selectedOption = options.find(opt => opt.value === months);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.08) 0%, rgba(231, 111, 81, 0.08) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(244, 162, 97, 0.1)'
        }}
      >
        <CardContent sx={{ py: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CalendarTodayRounded fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Período de análisis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selecciona el rango temporal para visualizar los datos
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={selectedOption?.label || "12 meses"}
                color={selectedOption?.color || "primary"}
                variant="filled"
                sx={{ 
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  height: 'auto',
                  '& .MuiChip-label': {
                    fontSize: '0.9rem'
                  }
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="months-label">Período</InputLabel>
                <Select
                  labelId="months-label"
                  label="Período"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  sx={{
                    '& .MuiSelect-select': {
                      fontWeight: 600
                    }
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      Últimos {option.value} meses
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
