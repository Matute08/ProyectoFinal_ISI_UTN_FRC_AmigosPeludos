import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList
} from "recharts";
import { getAdoptionFunnel } from "../../api/statsApi";

const ORDER = ["Iniciado","Enviado","Revisando","Aprobado","Aceptado","Rechazado"];

export default function AdoptionFunnelChart() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => { getAdoptionFunnel().then(setRows).catch(e => setErr(e.message)); }, []);

  const data = useMemo(() => {
    const arr = rows.map(r => ({ estado: r.estado || "Sin estado", cantidad: r.cantidad || 0 }));
    arr.sort((a,b) => ORDER.indexOf(a.estado) - ORDER.indexOf(b.estado));
    return arr;
  }, [rows]);

  if (err) return <Card><CardHeader title="Embudo de adopción"/><CardContent><Typography color="error">{err}</Typography></CardContent></Card>;

  return (
    <Card>
      <CardHeader title="Embudo de adopción" subheader="Formularios por estado" />
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 4 }}>
            <defs>
              <linearGradient id="gFunnel" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity="0.5"/>
              </linearGradient>
            </defs>
            <CartesianGrid horizontal stroke={theme.palette.divider} strokeDasharray="3 3"/>
            <XAxis type="number" allowDecimals={false}/>
            <YAxis type="category" dataKey="estado" width={140}/>
            <Tooltip contentStyle={{ borderRadius: 10, borderColor: theme.palette.divider }}/>
            <Bar dataKey="cantidad" fill="url(#gFunnel)" radius={[0,10,10,0]} barSize={22}>
              <LabelList dataKey="cantidad" position="right" offset={8}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
