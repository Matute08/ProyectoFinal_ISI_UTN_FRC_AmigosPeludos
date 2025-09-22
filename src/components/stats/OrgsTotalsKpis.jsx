import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Stack, Typography } from "@mui/material";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import DirectionsWalkRounded from "@mui/icons-material/DirectionsWalkRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import VolunteerActivismRounded from "@mui/icons-material/VolunteerActivismRounded";
import { useTheme } from "@mui/material/styles";
import { getOrgsTotals } from "../../api/statsApi";

const nf = (n) => new Intl.NumberFormat("es-AR").format(n);

function Kpi({ title, value, icon: Icon, color }) {
  const theme = useTheme();
  const bg = theme.palette[color]?.main ?? theme.palette.primary.main;
  return (
    <Card sx={{
      background: `linear-gradient(135deg, ${bg} 0%, ${theme.palette[color]?.dark || bg} 85%)`,
      color: theme.palette.getContrastText(bg)
    }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Icon fontSize="large" />
          <div>
            <Typography variant="overline" sx={{ opacity: 0.9 }}>{title}</Typography>
            <Typography variant="h4" sx={{ lineHeight: 1, fontWeight: 800 }}>
              {value === null ? "—" : nf(value)}
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
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
      <Grid item xs={12} md={3}><Kpi title="Veterinarias" value={v.veterinarias ?? null} icon={LocalHospitalRounded} color="error" /></Grid>
      <Grid item xs={12} md={3}><Kpi title="Paseadores"   value={v.paseadores ?? null}   icon={DirectionsWalkRounded} color="info" /></Grid>
      <Grid item xs={12} md={3}><Kpi title="Cuidadores"   value={v.cuidadores ?? null}   icon={HomeRounded} color="warning" /></Grid>
      <Grid item xs={12} md={3}><Kpi title="Fundaciones"  value={v.fundaciones ?? null}  icon={VolunteerActivismRounded} color="success" /></Grid>
    </Grid>
  );
}
