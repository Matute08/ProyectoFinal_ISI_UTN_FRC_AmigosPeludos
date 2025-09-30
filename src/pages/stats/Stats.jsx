import { useState } from "react";
import { Container, Grid } from "@mui/material";

import StatsToolbar from "../../components/stats/StatsToolbar";
import UsersByMonthChart from "../../components/stats/UsersByMonthChart";
import ActivityByMonthChart from "../../components/stats/ActivityByMonthChart";
import PublisByMonthChart from "../../components/stats/PublisByMonthChart";
import UsersTotalKpi from "../../components/stats/UsersTotalKpi";
import OrgsTotalsKpis from "../../components/stats/OrgsTotalsKpis";


export default function Stats() {
  const [months, setMonths] = useState(12);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <StatsToolbar months={months} setMonths={setMonths} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <UsersTotalKpi onlyEnabled={false} /> {/* total de usuarios hoy */}
        </Grid>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12}>
          <OrgsTotalsKpis /> {/* Veterinarias / Paseadores / Cuidadores / Fundaciones */}
        </Grid>
      </Grid>
        <Grid item xs={12}>
          <UsersByMonthChart months={months} />
        </Grid>

        <Grid item xs={12}>
          <ActivityByMonthChart months={months} />
        </Grid>

        <Grid item xs={12}>
          <PublisByMonthChart months={months} stacked />
        </Grid>
      </Grid>
    </Container>
  );
}
