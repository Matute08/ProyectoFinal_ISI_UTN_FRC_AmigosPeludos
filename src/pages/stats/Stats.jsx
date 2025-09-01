import { useState } from "react";
import { Container, Grid } from "@mui/material";

import StatsToolbar from "../../components/stats/StatsToolbar";

// Tus componentes
import UsersByMonthChart from "../../components/stats/UsersByMonthChart";
import ActivityByMonthChart from "../../components/stats/ActivityByMonthChart";
import RetentionCohortsTable from "../../components/stats/RetentionCohortsTable";
import ComparisonsByMonthChart from "../../components/stats/ComparisonsByMonthChart";
import PublisByMonthChart from "../../components/stats/PublisByMonthChart";
import UpcomingVaccinesTable from "../../components/stats/UpcomingVaccinesTable";
import AdoptionFunnelChart from "../../components/stats/AdoptionFunnelChart";
import RiskProfilesChart from "../../components/stats/RiskProfilesChart";

export default function Stats() {
  const [months, setMonths] = useState(12); // valor por defecto

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <StatsToolbar months={months} setMonths={setMonths} />

      <Grid container spacing={2}>
        {/* Crecimiento & engagement */}
        <Grid item xs={12}><UsersByMonthChart months={months} /></Grid>
        <Grid item xs={12}><ActivityByMonthChart months={months} /></Grid>
        <Grid item xs={12}><RetentionCohortsTable cohorts={Math.min(months, 12)} /></Grid>

        {/* Publicaciones & comparaciones (también reaccionan a months) */}
        <Grid item xs={12}><PublisByMonthChart months={months} stacked /></Grid>
        <Grid item xs={12}><ComparisonsByMonthChart months={months} /></Grid>

        {/* Otros */}
        <Grid item xs={12}><UpcomingVaccinesTable days={30} /></Grid>
        <Grid item xs={12}><AdoptionFunnelChart /></Grid>
        <Grid item xs={12}><RiskProfilesChart /></Grid>
      </Grid>
    </Container>
  );
}
