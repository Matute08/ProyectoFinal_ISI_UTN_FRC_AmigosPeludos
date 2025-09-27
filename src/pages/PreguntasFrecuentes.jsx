import { useMemo, useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Box, Chip, Container, Divider, Stack, TextField, Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const QA = [
  // ===== Publicaciones =====
  {
    cat: "Publicaciones",
    q: "¿Qué tipos de publicaciones puedo hacer?",
    a: "Podés publicar mascotas en adopción, perdidas o encontradas. Además, la plataforma reúne perfiles de paseadores, cuidadores, veterinarias y fundaciones."
  },
  {
    cat: "Publicaciones",
    q: "¿Cómo publico una mascota perdida o encontrada?",
    a: "Ingresá a Mascotas → seleccioná Perdidas o Encontradas → completá el formulario con detalles y fotos. Mientras más información cargues (color, raza, barrio, fecha), mejor."
  },
  {
    cat: "Publicaciones",
    q: "¿Puedo editar o deshabilitar una publicación?",
    a: "Sí. Desde tu perfil, en la sección de publicaciones, podés editar la información o deshabilitar la publicación cuando ya no sea necesaria."
  },
  {
    cat: "Publicaciones",
    q: "¿Cómo mejoro las chances de que identifiquen a mi mascota?",
    a: "Subí varias fotos nítidas (frente y perfil), agregá señas particulares y verificá el barrio en el mapa. Las fotos ayudan a que nuestra IA de comparación encuentre coincidencias."
  },
  {
    cat: "Publicaciones",
    q: "¿Qué estados tienen las publicaciones de adopción?",
    a: "Según el avance del proceso: Disponible → En evaluación → Aprobada/Aceptada → Cerrada. Desde el perfil de la publicación podés ver en qué estado está."
  },

  // ===== Adopciones =====
  {
    cat: "Adopciones",
    q: "¿Cómo funciona el proceso de adopción?",
    a: "Completás el formulario de adopción desde la publicación de la mascota. El responsable evalúa la solicitud y si todo sale bien, te contacta para continuar con el proceso."
  },
  {
    cat: "Adopciones",
    q: "¿Hay costos por adoptar?",
    a: "¡No! la adopción es complétamente gratuita."
  },
  {
    cat: "Adopciones",
    q: "¿Puedo retirar mi solicitud de adopción?",
    a: "Sí. Podés cancelar tu solicitud desde tu perfil, en la sección de formularios enviados."
  },
  {
    cat: "Adopciones",
    q: "¿Qué pasa si mi solicitud fue rechazada?",
    a: "Cada publicación define sus propios criterios. Si te la rechazaron, podés volver a postularte a otra publicación."
  },

  // ===== Perdidos / Encontrados =====
  {
    cat: "Perdidos y encontrados",
    q: "Perdí a mi mascota, ¿qué hago?",
    a: "Publicá de inmediato con fotos y última ubicación. Contactá a veterinarias y fundaciones cercanas. Actualizá la publicación si hay avistamientos."
  },
  {
    cat: "Perdidos y encontrados",
    q: "Encontré una mascota, ¿cómo aviso?",
    a: "Publicá como Encontrada, indicá la ubicación aproximada y subí fotos. Si tiene chapa, intentá contactar al dueño."
  },
  {
    cat: "Perdidos y encontrados",
    q: "¿Cómo reporto que mi mascota apareció?",
    a: "Entrá a tu publicación y marcala como resuelta para que deje de mostrarse en los listados."
  },

  // ===== Servicios (paseadores, cuidadores, veterinarias, fundaciones) =====
  {
    cat: "Servicios",
    q: "¿Cómo encuentro un paseador o cuidador de confianza?",
    a: "Entrá a Servicios y filtrá por barrio/ciudad. Revisá perfil, experiencia, disponibilidad y valoraciones de otros usuarios."
  },
  {
    cat: "Servicios",
    q: "¿Una persona puede ser paseador y cuidador al mismo tiempo?",
    a: "Sí. Un mismo usuario puede tener más de un rol. Cada perfil se muestra por separado en las búsquedas."
  },
  {
    cat: "Servicios",
    q: "¿Cómo se verifica una veterinaria o fundación?",
    a: "Revisamos información básica, redes y datos de contacto. Además, la comunidad puede dejar valoraciones públicas."
  },

  // ===== Cuenta y seguridad =====
  {
    cat: "Cuenta",
    q: "¿Necesito cuenta para publicar o contactar?",
    a: "Sí. Registrarte nos permite reducir fraudes, moderar contenido y mantener una comunidad más segura."
  },
  {
    cat: "Cuenta",
    q: "¿Cómo cambio mis datos o contraseña?",
    a: "Desde tu perfil, podés actualizar nombre, foto, teléfono, dirección y contraseña."
  },
  {
    cat: "Seguridad",
    q: "¿Cómo denuncio una publicación o un perfil?",
    a: "Cada ficha tiene la opción de Denunciar. Seleccioná el motivo y enviá la denuncia para que el equipo la revise."
  },
  {
    cat: "Seguridad",
    q: "¿Qué hace Amigos Peludos con las denuncias?",
    a: "Analizamos el caso, y podemos deshabilitar la publicación o el perfil en caso de incumplimientos."
  },

  // ===== IA y coincidencias =====
  {
    cat: "IA de coincidencias",
    q: "¿Cómo funciona la comparación por IA?",
    a: "Nuestra IA analiza características de las fotos y sugiere posibles coincidencias entre publicaciones de perdidos y encontrados. El usuario confirma o descarta la sugerencia."
  },
  {
    cat: "IA de coincidencias",
    q: "¿La IA reemplaza la revisión humana?",
    a: "No. Es una ayuda para acelerar hallazgos, pero la confirmación siempre la hace una persona."
  },

  // ===== Privacidad =====
  {
    cat: "Privacidad",
    q: "¿Qué datos personales se muestran?",
    a: "Sólo los que vos decidas compartir en tus publicaciones o perfiles (por ejemplo, teléfono de contacto). No compartimos información sensible sin tu consentimiento."
  },
  {
    cat: "Privacidad",
    q: "¿Puedo eliminar mi cuenta?",
    a: "Sí. Podés solicitar la baja de tu cuenta y tus datos. Recordá deshabilitar o cerrar tus publicaciones activas antes."
  },

 ];

// categorías con orden fijo
const ORDER = ["Publicaciones","Adopciones","Perdidos y encontrados","Servicios","Cuenta","Seguridad","IA de coincidencias","Privacidad"];

export default function Faq() {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QA;
    return QA.filter(item =>
      item.q.toLowerCase().includes(q) ||
      item.a.toLowerCase().includes(q) ||
      item.cat.toLowerCase().includes(q)
    );
  }, [query]);

  // agrupar por categoría con orden
  const groups = useMemo(() => {
    const map = new Map();
    for (const item of matches) {
      if (!map.has(item.cat)) map.set(item.cat, []);
      map.get(item.cat).push(item);
    }
    const sortedCats = Array.from(map.keys()).sort((a,b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    return sortedCats.map(cat => ({ cat, items: map.get(cat) }));
  }, [matches]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>Preguntas Frecuentes</Typography>
        <Typography color="text.secondary">
          Encontrá respuestas rápidas sobre publicaciones, adopciones, servicios, seguridad y más.
        </Typography>

        <TextField
          size="small"
          placeholder="Buscar en preguntas (ej: adopción, paseador, cuenta)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />

        {/* chips de categorías (actúan como filtros rápidos) */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {ORDER.map(cat => (
            <Chip
              key={cat}
              label={cat}
              variant="outlined"
              onClick={() => setQuery(cat)}
              sx={{ borderRadius: 2 }}
            />
          ))}
          {query && <Chip color="primary" label="Limpiar" onClick={() => setQuery("")} sx={{ borderRadius: 2 }} />}
        </Box>
      </Stack>

      {groups.length === 0 && (
        <Typography sx={{ mt: 4 }} color="text.secondary">No encontramos respuestas para tu búsqueda.</Typography>
      )}

      {groups.map(({ cat, items }) => (
        <Box key={cat} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{cat}</Typography>
          <Divider sx={{ mb: 1 }} />
          <Stack>
            {items.map((item, idx) => (
              <Accordion key={cat + idx} disableGutters elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      ))}
    </Container>
  );
}
