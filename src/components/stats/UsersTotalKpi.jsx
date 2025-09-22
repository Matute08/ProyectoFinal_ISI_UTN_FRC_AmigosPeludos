import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { useTheme } from "@mui/material/styles";
import { getUsersTotal } from "../../api/statsApi";

const nf = (n) => new Intl.NumberFormat("es-AR").format(n);

export default function UsersTotalKpi({ onlyEnabled = true }) {
  const theme = useTheme();
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getUsersTotal(onlyEnabled).then(d => setTotal(d.total)).catch(() => setTotal(null));
  }, [onlyEnabled]);

  return (
    <Card sx={{
      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 70%)`,
      color: theme.palette.getContrastText(theme.palette.primary.main)
    }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <GroupRoundedIcon fontSize="large" />
          <div>
            <Typography variant="overline" sx={{ opacity: 0.9 }}>
              Usuarios registrados {onlyEnabled ? "(habilitados)" : ""}
            </Typography>
            <Typography variant="h3" sx={{ lineHeight: 1, fontWeight: 800 }}>
              {total === null ? "—" : nf(total)}
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
