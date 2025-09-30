import { useEffect, useMemo, useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Box, Chip, Container, Divider, Stack, TextField, Typography,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useAuth } from "../auth/AuthProvider";
import { getFaq, getFaqCategories, createFaq, updateFaq, deleteFaq } from "../api/faqApi";

const ORDER = [
  "Publicaciones","Adopciones","Perdidos y encontrados","Servicios",
  "Carnet de vacunación","Cuenta","Seguridad","IA de coincidencias",
  "Pagos y anuncios","Privacidad","Administración"
];

export default function PreguntasFrecuentes() {
  // Visible para todos; botones sólo si admin
  const { userData } = useAuth();
  const isAdmin = userData?.rolId === 1;

  const [query, setQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(null); // <— categoría activa
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  // dialog state
  const emptyForm = { id: 0, categoriaId: "", posicion: 0, pregunta: "", respuesta: "", habilitada: true };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const [faq, categories] = await Promise.all([getFaq(), getFaqCategories()]);
      setItems(faq);
      setCats(categories);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  // Filtro por categoría + texto
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(it => {
      const byCat = !selectedCatId || it.categoriaId === selectedCatId;
      const byText =
        !q ||
        it.pregunta.toLowerCase().includes(q) ||
        it.respuesta.toLowerCase().includes(q) ||
        it.categoria.toLowerCase().includes(q);
      return byCat && byText;
    });
  }, [query, items, selectedCatId]);

  // Agrupar por categoría (respetando orden)
  const groups = useMemo(() => {
    const map = new Map();
    for (const it of matches) {
      if (!map.has(it.categoria)) map.set(it.categoria, []);
      map.get(it.categoria).push(it);
    }
    const catOrder = (c) => {
      const i = ORDER.indexOf(c);
      return i === -1 ? 9999 : i;
    };
    const sortedCats = Array.from(map.keys()).sort((a,b) => catOrder(a) - catOrder(b));
    return sortedCats.map(cat => ({
      cat,
      items: map.get(cat).slice().sort((a,b) => (a.posicion ?? 0) - (b.posicion ?? 0))
    }));
  }, [matches]);

  const handleOpenAdd = () => {
    setEditingId(0);
    setForm({ ...emptyForm, categoriaId: cats[0]?.id ?? "" });
    setOpen(true);
  };
  const handleOpenEdit = (it) => {
    setEditingId(it.id);
    setForm({
      id: it.id,
      categoriaId: it.categoriaId,
      posicion: it.posicion ?? 0,
      pregunta: it.pregunta,
      respuesta: it.respuesta,
      habilitada: it.habilitada
    });
    setOpen(true);
  };
  const handleSave = async () => {
    const payload = {
      CategoriaId: Number(form.categoriaId),
      Pregunta: (form.pregunta || "").trim(),
      Respuesta: (form.respuesta || "").trim(),
      Posicion: Number(form.posicion || 0),
      Habilitada: !!form.habilitada
    };
    if (!payload.Pregunta || !payload.Respuesta) return;
    if (editingId) await updateFaq(editingId, payload);
    else await createFaq(payload);
    setOpen(false);
    await load();
  };
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar la pregunta? (se deshabilita)")) return;
    await deleteFaq(id);
    await load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h4" fontWeight={800}>Preguntas Frecuentes</Typography>
            <Typography color="text.secondary">
              Buscá por palabra clave o filtrá por categoría.
            </Typography>
          </div>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenAdd}>
              Agregar
            </Button>
          )}
        </Stack>

        <TextField
          size="small"
          placeholder={
            selectedCatId
              ? "Buscar dentro de esta categoría…"
              : "Buscar (ej: adopción, paseador, seguridad)…"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {cats.map(c => {
            const active = selectedCatId === c.id;
            return (
              <Chip
                key={c.id}
                label={c.nombre}
                onClick={() => setSelectedCatId(active ? null : c.id)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ borderRadius: 2, fontWeight: active ? 700 : 400 }}
              />
            );
          })}
          <Chip
            label="Limpiar filtros"
            onClick={() => { setSelectedCatId(null); setQuery(""); }}
            color="warning"
            variant="outlined"
            sx={{ borderRadius: 2, ml: 1, fontWeight: 600 }}
          />
        </Box>
      </Stack>

      {loading && <Typography color="text.secondary">Cargando…</Typography>}
      {!loading && groups.length === 0 && (
        <Typography sx={{ mt: 4 }} color="text.secondary">No encontramos respuestas para tu búsqueda.</Typography>
      )}

      {!loading && groups.map(({ cat, items }) => (
        <Box key={cat} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{cat}</Typography>
          <Divider sx={{ mb: 1 }} />
          <Stack>
            {items.map((it) => (
              <Accordion key={it.id} disableGutters elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                    <Typography fontWeight={600}>{it.pregunta}</Typography>
                    {isAdmin && (
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenEdit(it)}><EditRoundedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(it.id)}><DeleteRoundedIcon fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>{it.respuesta}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      ))}

      {/* Diálogo agregar/editar */}
<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>{editingId ? "Editar pregunta" : "Agregar pregunta"}</DialogTitle>

  {/* 👇 agregá overflow: 'visible' (y si querés un poco más de espacio arriba) */}
  <DialogContent sx={{ pt: 2, overflow: "visible" }}>
    <Stack spacing={2}>
      <TextField
        select
        label="Categoría"
        value={form.categoriaId}
        onChange={(e) => setForm(f => ({ ...f, categoriaId: e.target.value }))}
        fullWidth
        margin="dense"          // opcional: mejora el espaciado
      >
        {cats.map(c => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
      </TextField>

      <TextField
        label="Pregunta"
        value={form.pregunta}
        onChange={(e) => setForm(f => ({ ...f, pregunta: e.target.value }))}
        fullWidth
        margin="dense"          // opcional
      />

      <TextField
        label="Respuesta"
        value={form.respuesta}
        onChange={(e) => setForm(f => ({ ...f, respuesta: e.target.value }))}
        fullWidth
        multiline
        minRows={4}
        margin="dense"          // opcional
      />

      <Stack direction="row" spacing={2}>
        <TextField
          label="Posición (orden)"
          type="number"
          value={form.posicion}
          onChange={(e) => setForm(f => ({ ...f, posicion: e.target.value }))}
          sx={{ width: 180 }}
          margin="dense"        // opcional
        />
        <TextField
          select
          label="Habilitada"
          value={form.habilitada ? "true" : "false"}
          onChange={(e) => setForm(f => ({ ...f, habilitada: e.target.value === "true" }))}
          sx={{ width: 180 }}
          margin="dense"        // opcional
        >
          <MenuItem value="true">Sí</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="contained" onClick={handleSave}>
      {editingId ? "Guardar" : "Crear"}
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
}
