import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Alert,
  Paper,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as ScrollLink, Element } from "react-scroll";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Block as BlockIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const sections = [
  {
    id: "CuentaUsuario",
    title: "👤 Cuenta de Usuario",
    subsections: [
    {
        id: "Registro",
        title: "Registro",
        steps: [
            {
            subtitle: 'Hacer clic en "Registrarse" en la página principal.',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/d394e6bc-1df3-45a5-9268-b4f8e3b4d76b/71352166-8b94-4af9-a41b-f99510972ac4.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario y hacer clic en "Registrarme"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/b927d0fb-58c0-47c9-b2db-d2b4ccf80d7b/7a7f076b-e40a-4e04-a888-f9ab565cc813.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Recuerda que al registrarte estás aceptando los términos y condiciones.",
          },
        ],
      },
      {
        id: "IniciarSesion",
        title: "Iniciar sesión",
        steps: [
            {
            subtitle: 'En la Pantalla principal, hacer clic en "Iniciar sesión"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/22ce2d37-1c90-40c4-84f4-aa69c4f04ac8/ab83da7f-1708-4357-b745-6abb9f781bc0.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar correo electrónico y contraseña y hacer clic en "Iniciar sesión"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/09c70f8b-64a3-48f8-82b4-99b37e31fb7b/26587138-9c13-4901-a09f-79caaeb0e1a8.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
      },
      {
        id: "RecuperarContrasena",
        title: "Recuperar contraseña",
        steps: [
          {
            subtitle: 'En la pantalla de Inicio de sesión, hacer clic en el botón "¿Olvidó su contraseña?"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/ad9f09f9-0de6-4dac-b3c7-434772b6caeb/001188bf-45b1-4c87-9f25-31f244428654.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5821&fp-y=0.4962&fp-z=2.3472&w=1200",
          },
          {
            subtitle: 'Ingresar tu correo electrónico y presionar "Enviar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c646268f-899d-4ae9-af0f-ef7db869583d/f61b33f8-6f52-4d80-8ff2-6fd228b63553.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5230&fp-z=1.3910&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Revisa tu casilla de correo electrónico. Recibirás un mail de Amigos Peludos con un enlace para restablecer tu contraseña.",
          },
        ],
      },
      {
        id: "VerPerfil",
        title: "Ver mi perfil",
        steps: [
            {
            subtitle: 'En la parte superior derecha de la pantalla, haz clic en tu foto de perfil para abrir el menú desplegable. Luego, selecciona la opción "Perfil"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/59ef2959-2ca1-4e54-82ac-fe53e3fd63c8/404f3e37-d2c8-4fe1-b5ca-bdc5d66da8a7.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6975&fp-y=0.3147&fp-z=1.6453&w=1200",
          },
          {
            subtitle: "Se abrirá la página de tu perfil, donde podrás revisar tu información personal.",
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/b66319cc-01d3-4975-bb8c-6a0d1d8dbb5f/5fa6e718-4b3d-4a1a-9971-0631e4b4a9c7.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1712&fp-y=0.6023&fp-z=1.2654&w=1200",
          },
        ],
      },
      {
        id: "ActualizarPerfil",
        title: "Actualizar información personal",
        steps: [
          {
            subtitle: 'Desde tu Perfil, desplázate hasta el final y haz clic en el botón "Editar perfil"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/a1a3a85a-792f-48db-bce0-fd18d3cc158d/ef845e89-95df-482d-add5-bba5efcae107.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Edita los campos que desees actualizar. Al finalizar, haz clic en el botón "Guardar cambios"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/605ac787-3a9d-4a4d-bab6-fff6e5397b39/e359fffd-93b6-4d2a-a1cd-4faaacdb4ef0.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
      },
      {
        id: "GenerarQR",
        title: "Generar mi código QR",
        steps: [
            {
            subtitle: 'Desde tu perfil, ir a "Mis QR". Hacer clic en el botón "Generar QR"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/60b1576b-5e80-4da2-9f7e-09da6a761a3d/5503edca-748f-40fd-ba7e-ebcb4d561e63.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6051&fp-y=0.3986&fp-z=2.0000&w=1200",
          },
          {
            subtitle: 'Una vez generado, hacer clic en el botón "Descargar PDF"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/dfc4576d-6bc1-4c03-936d-efa74f9c3ce1/6763434d-fa01-4067-b41b-84aaf1b3dd6d.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6204&fp-y=0.4514&fp-z=2.4114&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Esta función te permite crear un código QR único vinculado a tu usuario. Puedes imprimirlo y colocarlo en el collar de tu mascota para que quien la encuentre pueda contactarte de inmediato.",
          },
          {
            type: "warning",
            text: "Los datos utilizados para generar el código QR se obtienen de tu perfil de usuario, por lo que es importante mantenerlo siempre actualizado.",
          },
        ],
      },
      {
        id: "EliminarCuenta",
        title: "Eliminar cuenta de usuario",
        steps: [
          {
            subtitle: 'Desde la página de Perfil, haz clic en el botón "Eliminar cuenta"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/9f57c6ba-d71c-4de3-bbcf-968f5c34f2e3/85d7d9f8-8168-4e4a-9187-eaf9ac32f133.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Confirmar contraseña y hace clic en el botón "Eliminar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/83828a5b-8b5e-43e8-b426-d1e8952cc5e9/fa64f946-2371-4ca5-a7e3-c607e453dd2a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5146&fp-y=0.4900&fp-z=1.5947&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Una vez confirmado, tu cuenta será eliminada permanentemente del sistema.",
          },
        ],
      },
      {
        id: "CerrarSesion",
        title: "Cerrar sesión",
        steps: [
          {
            subtitle: 'Haz clic en tu foto de perfil para abrir el menú desplegable. Luego, selecciona la opción "Cerrar sesión"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/00a53c0c-0f2c-4b75-b723-469c2b3691fd/3a9bfbeb-9f89-43dd-8449-95cad2d4beb2.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6955&fp-y=0.2969&fp-z=1.8118&w=1200",
          },
        ],
      },
    ],
  },
  {
    id: "AdministrarMascotas",
    title: "🐶 Administrar mis mascotas",
    subsections: [
      {
        id: "RegistrarMascota",
        title: "Registrar mis mascotas",
        steps: [
          {
            subtitle: 'Desde tu Perfil, haz clic en el signo "+" que está abajo a la derecha (Agregar mascota)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/8f812558-c076-4d92-9f73-49a7c7e4c455/a8417e37-3af5-4633-b72c-4fa60c3d8a83.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar los datos de la mascota y hacer clic en el botón "Agregar mascota"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/d28f8de9-3cc7-49e2-9d83-7dc300133237/a769790f-e0c1-472f-b04e-9f2424bea258.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: 'Usar "Mis mascotas" solo para registrar las mascotas propias. Para publicar una mascota perdida o encontrada, hacerlo desde el menú Mascotas → Perdidas/Encontradas',
          },
        ],
      },
      {
        id: "ConsultarMascota",
        title: "Consultar mis mascotas",
        steps: [
          {
            subtitle: 'Desde tu perfil, ir a "Mis publicaciones". Buscar la tarjeta de la mascota y presionar "Ver detalles" (ícono del ojito)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/246866e6-9e7f-4e03-80cb-f1906e2db21e/8f919445-d6f8-4bf6-a9b0-38d9d527a713.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Las mascotas registradas en esta sección son visibles y accesibles solo por el usuario que las registra.",
          },
        ],
      },
      {
        id: "ModificarMascota",
        title: "Modificar mis mascotas",
        steps: [
            {
            subtitle: 'Desde tu perfil, hacer clic en "Mis mascotas". Buscar la tarjeta de la mascota que se quiere editar y presionar el ícono del lápiz (Editar)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/d45186d5-62fd-4fcf-b220-cb6f16bcaae7/6ff76a5e-bb80-44b1-9577-484b043c7f66.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Modificar los datos requeridos y presionar el botón "Guardar cambios"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/9556292d-8ca1-48bf-9144-b6f221e827b2/ec85b62a-386b-468e-a524-a42c2f4d6211.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
      },
      {
        id: "EliminarMascota",
        title: "Eliminar mis mascotas",
        steps: [
          {
            subtitle: 'Desde tu perfil, hacer clic en "Mis mascotas". Buscar la tarjeta de la mascota que se quiere eliminar y presionar el ícono del tachito (Eliminar)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/eb4180b2-316d-472c-ab26-53bb11cee692/0d9c5334-5fe1-4152-b95e-7de44140a64a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Aparecerá un mensaje de confirmación; al confirmar, esa mascota será eliminada permanentemente del sistema.",
          },
        ],
      },
    ],
  },
  {
    id: "PosteosMascotas",
    title: "📰 Posteos de Mascotas",
    subsections: [
      {
        id: "VerPublicaciones",
        title: "Ver publicaciones",
        steps: [
          {
            subtitle: 'Ir desde la página inicial al menú "Mascotas" y seleccionar en el desplegable la opción correspondiente (Perdidas, Encontradas o En adopción)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c63355e1-dd77-493a-8b2a-fc6d3412982f/1857f4ec-a2b1-49aa-a52c-28748a4eab5a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1878&fp-y=0.0633&fp-z=2.6059&w=1200",
          },
          {
            subtitle: 'Hacer clic en el botón "Ver detalles" de una tarjeta para acceder a la información completa',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/93a05484-6720-4912-84c8-2ea33ef7558a/99b41426-4c5c-4a40-a206-b77a1fbdcd72.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Las tarjetas de publicaciones se muestran ordenadas por fecha, mostrando primero la más reciente.",
          },
          {
            type: "tip",
            text: "Se recomienda aplicar filtros como tipo de mascota, sexo, ciudad y barrio para refinar la búsqueda.",
          },
        ],
      },
      {
        id: "CrearPosteo",
        title: "Crear posteo",
        steps: [
            {
            subtitle: 'Hacer clic en el signo "+" (Agregar publicación)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c3dd80ff-f514-4e1a-8326-06e3fe6d89c3/f11f2832-6f95-4d47-8342-a2e0e4781f4f.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar los datos solicitados, seleccionar la ubicación donde perdiste/encontraste la mascota y presionar el botón "Publicar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/1e2ffed5-df58-47f9-b4db-d1049a1669a0/e7d050ac-86bd-4b35-a7df-dbefd94478ab.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Foto de la mascota: Subir una imagen clara y bien iluminada, sin texto ni personas. Mostrar solo una mascota, preferiblemente de cuerpo completo.",
          },
          {
            type: "warning",
            text: "Verificar que la información ingresada sea correcta antes de publicar. Una vez creado el posteo, no se puede eliminar, solo cambiar su estado.",
          },
        ],
      },
      {
        id: "AdoptarMascota",
        title: "Adoptar una mascota",
        steps: [
          {
            subtitle: 'Ingresar al Detalle de la mascota que se desea adoptar, desplazarse hasta la sección "Postularse para adoptar" y hacer clic en el botón "📄 Completar Formulario"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/3a75460f-e015-4abc-ba38-76531e9957a2/98f078d2-e274-4ab3-8188-af414bb0e188.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar todos los campos solicitados en el formulario y hacer clic en "Enviar solicitud"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/190de68b-564f-4f1b-934a-431fd944a62a/5f415c4f-694c-49f6-973d-913f9dc01679.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Solo podrás completar este formulario una vez. Tu solicitud será revisada por quien ofrece la adopción. Cuando haya una respuesta, se te notificará.",
          },
        ],
      },
      {
        id: "CambiarEstadoPosteo",
        title: "Cambiar estado de un posteo",
        steps: [
          {
            subtitle: 'Desde tu perfil, ir a "Mis publicaciones", identificar la tarjeta de la mascota cuyo estado se quiere cambiar y hacer clic en "Finalizar publicación" (signo ✔)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/f2323feb-7cf9-4b1c-b194-6006ed82ffac/97c14473-ba72-4f10-b80d-fd3e0746fb5e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Seleccionar el estado deseado y presiona el botón "Confirmar cambio"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/0973a8b2-4b6e-4b78-b4aa-e4e92e8f57d5/3ec81960-35d5-4b6b-a552-62c6fe994b92.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4975&fp-y=0.5521&fp-z=1.8129&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "No es posible eliminar los posteos. En su lugar, se puede cambiar el estado a Cancelada o Finalizada.",
          },
          {
            type: "info",
            text: "Cancelada: El usuario decide que el posteo ya no es válido. Finalizada: La mascota ha sido encontrada o la situación se ha resuelto exitosamente.",
          },
        ],
      },
    ],
  },
  {
    id: "CarnetVacunas",
    title: "💉 Carnet de vacunas de mis mascotas",
    subsections: [
      {
        id: "RegistrarVacuna",
        title: "Registrar una nueva vacuna",
        steps: [
          {
            subtitle: 'Desde tu perfil, hacer clic en "Mis mascotas". Buscar la tarjeta de la mascota y presionar el ícono de la jeringa (Vacunas)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/57a48c57-73f5-4e26-bb3a-38d61692159f/02cd9fb2-ab5b-4966-8b66-bc7916199d50.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'En la nueva pantalla, seleccionar "Cargar nueva vacuna"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/76e448ad-7dfd-440e-a1d0-ff9605602dd5/2e6c8a66-9e26-4ae4-a833-f4ff3d6e369b.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4919&fp-y=0.2433&fp-z=2.0000&w=1200",
          },
          {
            subtitle: 'Completar el formulario con la información requerida y presionar "Guardar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/b61e9822-9a73-4292-a779-db5a49976f50/8d2b7e7d-1a7c-4db6-aee6-eb1898f2a59e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4909&fp-y=0.5101&fp-z=1.7809&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Si se quiere agregar una nueva dosis de una vacuna ya registrada, se debe seguir los mismos pasos. El sistema sumará automáticamente la dosis a la misma tarjeta de la vacuna.",
          },
        ],
      },
      {
        id: "ModificarDosis",
        title: "Modificar una dosis cargada",
        steps: [
          {
            subtitle: 'Si la vacuna tiene una sola dosis, hacer clic en el ícono del lápiz (Editar dosis) en la tarjeta principal',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c5d31a26-c8bc-4103-98b3-7b9aa13c01a6/890f6d10-539f-41e8-9381-dd9ced591259.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Si la vacuna tiene más de una dosis, hacer clic en "Ver historial completo" y seleccionar el ícono del lápiz en la dosis que se desea editar',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/baf34ea8-ed56-4e97-8c32-0341753fc47f/41d26d06-76e6-4f4b-a5bd-58913f24b68a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4935&fp-y=0.4671&fp-z=2.0000&w=1200",
          },
          {
            subtitle: 'Modificar los datos necesarios y presionar "Guardar cambios"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/db2e4811-d49a-445c-864f-22b0f595a557/058759a3-3439-49c8-bca7-82e427c1dddd.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5042&fp-y=0.5145&fp-z=1.3898&w=1200",
          },
        ],
      },
      {
        id: "EliminarDosis",
        title: "Eliminar una dosis de una vacuna",
        steps: [
          {
            subtitle: 'Luego de presionar "Ver historial completo" en la tarjeta de la vacuna, identificar la dosis a eliminar y hacer clic en el ícono del tachito',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/09cd58c9-25c7-4898-8ef3-6b4a1ccfac94/41714f3d-1a3e-4252-8d92-365bc28171f8.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4897&fp-y=0.4594&fp-z=2.0000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Aparecerá un mensaje de confirmación; al confirmar, se borrará la dosis seleccionada de esa vacuna de manera definitiva.",
          },
        ],
      },
      {
        id: "EliminarVacuna",
        title: "Eliminar todas las dosis de una vacuna",
        steps: [
          {
            subtitle: 'Desde la página "Carnet de vacunación", en la tarjeta correspondiente, seleccionar el ícono del tachito (Eliminar todas las dosis)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/ea8df700-1e6e-4f48-a74b-58159ebe4fa6/7a4b2a96-5048-4c4a-ab12-7a9bccd2a695.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Aparecerá un mensaje de confirmación; al confirmar, se borrará la vacuna completa de manera definitiva.",
          },
        ],
      },
      {
        id: "VerCarnet",
        title: "Ver carnet de vacunación (libreta digital)",
        steps: [
          {
            subtitle: 'Desde "Carnet de vacunación", hacer clic en el botón "Visualizar carnet"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/53fead78-8972-4960-8670-05974b3ee8cb/f46a86c1-8966-4359-bc2d-33a5f0c24172.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5102&fp-y=0.3383&fp-z=3.0000&w=1200",
          },
          {
            subtitle: "Pasar las páginas haciendo clic sobre ellas para ver todo el contenido de la libreta",
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/9e192725-23e5-45a4-beff-ffbde3972534/792bc6a0-1ed3-4197-8d09-661b91ec92cc.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Esta funcionalidad permite visualizar todas las vacunas de tu mascota en formato de libreta digital interactiva con la foto, datos del dueño y las vacunas registradas organizadas por página.",
          },
        ],
      },
    ],
  },
  {
    id: "FormulariosAdopcion",
    title: "📝 Formularios de Adopción",
    subsections: [
      {
        id: "AccederFormularios",
        title: "Acceder a Formularios",
        steps: [
          {
            subtitle: 'En la parte superior derecha, haz clic en tu foto de perfil y selecciona la opción "Formularios"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/0b74e412-e2c7-41d2-9bd9-38723921fb08/8cff0861-ac00-413b-bd0e-ed478b611e5c.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.8715&fp-y=0.1877&fp-z=2.9240&w=1200",
          },
        ],
      },
      {
        id: "FormulariosEnviados",
        title: "Formularios enviados",
        steps: [
          {
            subtitle: 'Seleccionar la sección "Enviados" para visualizar las solicitudes que realizaste',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/8c97a4ce-b1fb-4be6-8498-72435896b08f/40a55b0e-ddc4-43ea-a089-680cf3e0b31b.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: 'Cada fila representa una solicitud de adopción enviada. En la columna Publicación puedes hacer clic en "Ver mascota" para ver los detalles. En la columna Estado verás el estado de tu solicitud. En Acciones puedes descargar el PDF del formulario.',
          },
        ],
      },
      {
        id: "FormulariosRecibidos",
        title: "Formularios recibidos",
        steps: [
          {
            subtitle: 'Seleccionar la sección "Recibidos" para visualizar las solicitudes que recibiste',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/24fd3c2d-9c56-403d-b1c9-1259dffe0a61/c33c4bdc-f950-4b33-a690-8e28143cc5bb.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: 'Cada fila representa una solicitud recibida. Puedes ver la mascota, descargar el PDF y cambiar el estado del formulario entre: Revisión, Aceptado, Rechazado.',
          },
        ],
      },
    ],
  },
  {
    id: "PaseadoresCuidadores",
    title: "🦮 Paseadores y Cuidadores",
    subsections: [
      {
        id: "VerPerfilPaseador",
        title: "Ver perfil de paseadores/cuidadores",
        steps: [
          {
            subtitle: 'Ir desde la página inicial al menú "Servicios" y seleccionar en el desplegable la opción correspondiente (Paseadores, Cuidadores)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/e9237c2d-7b24-455a-9daa-7d7cbcf234e3/b7bc70b4-d4d4-4222-a390-330d05dc04bb.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2777&fp-y=0.1115&fp-z=2.5191&w=1200",
          },
          {
            subtitle: 'Hacer clic en el botón "Ver perfil" de una tarjeta para abrir los datos completos',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/f2363897-7dfb-457f-b384-1273bc0d8069/6906c786-f744-4f93-baae-739f2096bb7a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
      },
      {
        id: "ExplorarPerfil",
        title: "Explorar perfil",
        steps: [
          {
            subtitle: 'Hacer clic en "Ver perfil" y navegar a "Datos del paseador/cuidador" para ver información detallada',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/357fa088-ad19-452a-a2d6-eb04797c9743/def073e4-7f05-44e3-96df-abc08aec332a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Revisar la sección "Imágenes" para ver fotos que comprueban el servicio',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/327c8e46-db12-48ff-84d4-159e94e67730/df6ab4bb-2597-4068-aaec-dc3f5bc7e94d.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6550&fp-y=0.4263&fp-z=1.6482&w=1200",
          },
          {
            subtitle: 'Ir a la sección "Horarios" para conocer los días y horarios en que trabaja',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/f4df5123-dc93-4dea-83b4-7cc5de40c718/f7d62dc5-b409-4406-937f-65b031faef67.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6410&fp-y=0.3281&fp-z=1.5732&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: 'En la sección de datos encontrarás la descripción del servicio, zona de trabajo y precio. Puedes contactar por WhatsApp desde el botón disponible.',
          },
        ],
      },
      {
        id: "ValorarPerfil",
        title: "Valorar un perfil",
        steps: [
          {
            subtitle: 'Ir a la sección "Valoraciones", seleccionar las estrellas deseadas, escribir tu comentario y hacer clic en "Enviar valoración"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/976411f8-feab-42e7-9ce4-512c77fa0ea4/23052aa1-3895-406f-99ec-c8b9af3fad17.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5575&fp-y=0.3466&fp-z=2.5120&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Cuantas más estrellas, mejor es la valoración del perfil.",
          },
          {
            type: "tip",
            text: "Valora de manera honesta y justa; tu opinión ayuda a otros usuarios a tomar decisiones y permite al paseador o cuidador mantener su reputación.",
          },
        ],
      },
      {
        id: "EditarValoracion",
        title: "Editar/Eliminar mi valoración",
        steps: [
          {
            subtitle: 'Localizar tu comentario en la lista, hacer clic en los tres puntitos y seleccionar "✏️ Editar" o "🗑️ Eliminar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/32979e3f-55a6-4da6-81f9-de5b739d855a/9f3c2d5a-13bf-4b59-b4c9-f479090c4601.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "La valoración se elimina de manera inmediata, sin solicitar confirmación.",
          },
        ],
      },
      {
        id: "RegistrarsePaseador",
        title: "Registrarme como paseador",
        steps: [
            {
            subtitle: 'Ir desde la página inicial al menú "Servicios" > Paseadores. Hacer clic en el signo "+" (Registrate como paseador)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/4d2cf91b-4c8b-479d-af06-051743d00a7e/a01d35bc-cf92-4a1f-99bc-4b528ac80172.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario de información personal y hacer clic en "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c7605e4f-c377-442f-bf40-1b8dac19171c/2ccf8acf-1557-4e75-b6fb-8188d429e4a4.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario de presentación profesional y hacer clic en "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/a8846afb-b3fc-4b43-81c0-74fa71c8e1a2/8fe7d79d-b22a-4014-8689-1f3a11c2745e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar la disponibilidad horaria y el precio por hora. Hacer clic en "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/fc83357b-66ac-44cb-ae49-3c1a0dd31497/71969439-3416-4d38-8828-084fd5417ada.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Agregar fotos que comprueben su labor como paseador y hacer clic en "Enviar solicitud"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/ec30648d-cb3e-4ba2-8009-f3920731c5b1/54ab4bec-a7b8-408d-aa7b-5d8a508bcba0.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Para registrarse como paseador es necesario ser mayor de edad.",
          },
          {
            type: "info",
            text: "Se debe subir al menos 1 foto que sea real y muestre su experiencia o interacción con mascotas para validar la solicitud. El precio corresponde a lo que cobra por hora.",
          },
        ],
      },
      {
        id: "RegistrarseCuidador",
        title: "Registrarme como cuidador",
        steps: [
            {
            subtitle: 'Ir al menú "Servicios" > Cuidadores. Hacer clic en el signo "+" (Registrate como cuidador)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/0f187266-c5b0-451b-8621-208deb3d80b9/efaa8cbc-03e0-4cf6-baa5-e50ed255d2d8.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario de información personal y hacer clic en "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/6eebc461-9aa7-49dc-b760-d406bb5a2b4a/20e17181-cc3a-42bf-bf39-99baf7637469.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario de información de tu vivienda y hacer clic en "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/4ddafd42-f093-4080-bf7f-0e88ddff7937/6445e675-8320-418b-a2f5-7309a2c3fc23.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar presentación profesional, horarios y precio. Agregar fotos y hacer clic en "Enviar solicitud"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/d0c8ee6e-d554-43d5-a3f6-49bc00c07667/57b9b7d9-0743-4ff2-b912-800365579bf6.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Es importante declarar si vivís en casa o departamento, si tenés patio/balcón y si contás con movilidad propia, ya que esta información permite que quienes quieran contratar tu servicio puedan verificar si cumple con sus requerimientos.",
          },
        ],
      },
      {
        id: "EditarPerfilServicio",
        title: "Editar/Eliminar mi perfil",
        steps: [
          {
            subtitle: 'Desde tu perfil, hacer clic en "Mis servicios" y seleccionar la pestaña correspondiente. Hacer clic en el ícono del lápiz (Editar) o tachito (Eliminar)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/54b89fd4-ca4c-49e9-9c8b-599609e72716/ad5c03c9-eaa3-4fdb-879d-a5bca87849ed.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6199&fp-y=0.4174&fp-z=1.9107&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Aparecerá un mensaje de confirmación; al confirmar, se borrará de manera definitiva tu perfil de paseador/cuidador.",
          },
        ],
      },
    ],
  },
  {
    id: "Veterinarias",
    title: "💊 Veterinarias",
    subsections: [
      {
        id: "VerPerfilVeterinaria",
        title: "Ver perfil de una veterinaria",
        steps: [
            {
            subtitle: 'Ir desde la página inicial al menú "Servicios" y seleccionar "Veterinarias"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/245fd458-73fb-448c-8870-46441a558f2f/cb872bb5-842b-45b6-bda1-1dbe0afca635.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3105&fp-y=0.2034&fp-z=2.4526&w=1200",
          },
          {
            subtitle: 'En el mapa hacer clic en la veterinaria que quieras consultar. Se desplegará la información principal',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/8faeaaaf-ce07-46bd-86cd-0d5593ea6f85/0ba405d1-2c05-498a-b193-92ba0a77e08d.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3497&fp-y=0.6102&fp-z=2.7953&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Todas las veterinarias visibles en esta sección han sido previamente verificadas por el equipo de Amigos Peludos.",
          },
        ],
      },
      {
        id: "ExplorarVeterinaria",
        title: "Explorar perfil de veterinaria",
        steps: [
          {
            subtitle: 'Ir a la sección "Horarios" para consultar los días y horas de atención',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/2ae8e0f1-ccd1-4fad-aff9-6c0062e9ea2b/46c089e5-848d-412b-9dbe-a2525c743881.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Ir a la sección "Servicios" para ver los servicios que ofrece la veterinaria',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/edc9e670-74e0-405a-a393-4208239359c7/1ced7a24-3b70-410c-84b9-4a0d0d4e7847.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Ir a la sección "Donar" para consultar los datos necesarios para realizar donaciones',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/6deb18e1-a9d3-4dde-8e2b-810a1eaf3d24/9ead8572-96ef-4f77-b5f2-6962eb9d8c25.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Antes de enviar cualquier donación, asegúrate de utilizar únicamente los datos proporcionados en esta sección. Los mismos han sido verificados por el personal de Amigos Peludos.",
          },
        ],
      },
      {
        id: "RegistrarVeterinaria",
        title: "Registrar una veterinaria",
        steps: [
            {
            subtitle: 'Desde la sección Veterinarias, hacer clic en el signo "+" (Agregar Veterinaria) para iniciar el registro',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/e80f0e40-7567-4bed-93b8-cd72ed4f3bbf/7e06e4fe-a0d0-46f8-a25a-abb0f8bfd592.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Llenar los campos solicitados y presionar "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/9afe785c-0a50-4def-b0e5-fd769abca775/89c7d563-eceb-4ec5-ba96-626a0cdbc589.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Ingresar los horarios de atención y presionar "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/7badbd4e-68ff-45de-8934-6ebfb312aaf2/0b358410-c517-49c7-8224-4482e120b07d.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Marcar los servicios que brinda la veterinaria y presionar "Siguiente"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/5422fa5f-f4a8-4d64-9afd-98bf8449a905/b0e88c65-80bf-4c80-8e95-37ffc01edfe5.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar los datos de donaciones y redes sociales. Luego presionar "Registrar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/37a7ebdd-0eae-4f09-917f-8894ca0d3861/01a5f8d4-0d33-459a-8ec1-28ecabbe33d5.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Es importante tener en cuenta que la veterinaria no se registra automáticamente. El equipo de Amigos Peludos revisará los datos ingresados y, si es necesario, se pondrán en contacto para verificar la información.",
          },
          {
            type: "error",
            text: "Verificar que los datos de CBU y Alias ingresados sean correctos antes de guardar.",
          },
        ],
      },
      {
        id: "EditarVeterinaria",
        title: "Editar/Eliminar mi veterinaria",
        steps: [
          {
            subtitle: 'Desde tu perfil, hacer clic en "Mis servicios" y seleccionar la pestaña Veterinarias. Hacer clic en el ícono del lápiz (Editar) o tachito (Eliminar)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/44a26c1d-9800-433e-94b7-f2fe2a0b8f79/158beec9-1776-4898-97df-a4c55336482a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6237&fp-y=0.4163&fp-z=1.9107&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Aparecerá un mensaje de confirmación; al confirmar, se borrará de manera definitiva tu veterinaria.",
          },
        ],
      },
    ],
  },
  {
    id: "Fundaciones",
    title: "🏚️ Fundaciones",
    subsections: [
      {
        id: "VerPerfilFundacion",
        title: "Ver perfil de una fundación",
        steps: [
          {
            subtitle: 'Ir desde la página inicial al menú "Servicios" y seleccionar "Fundaciones"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/b10d718d-f13b-4dd0-8f95-c8c79e4f7622/fc1d6ab3-5131-4d2e-a0ea-e84f9cc3c8cb.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.2371&fp-y=0.2155&fp-z=2.6115&w=1200",
          },
          {
            subtitle: 'En la tarjeta de la fundación de interés, hacer clic en "Más info"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/9ae62c84-ca5f-49b4-8545-430e6ea66574/a85d3e95-698f-477c-89dc-66d690f28f26.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: "Revisar la información del perfil de la fundación",
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/a1994a6b-eed1-4261-afd5-b0beaf470a6b/c3edc512-c5b4-4378-8ac4-bc16e2ddf2be.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4942&fp-y=0.5000&fp-z=1.0051&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Todas las fundaciones visibles en esta sección han sido previamente verificadas por el equipo de Amigos Peludos.",
          },
          {
            type: "tip",
            text: "Antes de donar o contactar, revisar detenidamente la información para tener claro el propósito de la fundación.",
          },
          {
            type: "error",
            text: "Usar el botón de copiar que se encuentra junto al CBU y Alias, para asegurarse de que los datos estén correctos antes de realizar la transferencia.",
          },
        ],
      },
      {
        id: "RegistrarFundacion",
        title: "Registrar mi fundación",
        steps: [
            {
            subtitle: 'Desde la sección Fundaciones, hacer clic en el signo "+" (Nueva Fundación) para iniciar el registro',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/6551bb92-fabb-47c1-9564-f78b87209e58/a87cb15d-ef4a-4405-8b29-b18bade3da2f.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Llenar los campos solicitados y presionar "Registrar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/2690ae75-3266-43ce-8aa6-aeec63df077e/6f3b597c-dec5-4dbb-a02a-db18f0a9a272.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Es importante tener en cuenta que la fundación no se registra automáticamente. El equipo de Amigos Peludos revisará los datos ingresados.",
          },
          {
            type: "tip",
            text: 'En la "Descripción", agregar el nombre del titular de la cuenta y una breve descripción que los represente.',
          },
        ],
      },
      {
        id: "EditarFundacion",
        title: "Editar/Eliminar mi fundación",
        steps: [
          {
            subtitle: 'Desde tu perfil, hacer clic en "Mis servicios" y seleccionar la pestaña Fundaciones. Hacer clic en el ícono del lápiz (Editar) o tachito (Eliminar)',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/f2c9a64f-fc07-494f-a6ee-0268863260fa/a80d78ff-0d25-4dcb-8016-738661543541.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.6283&fp-y=0.3679&fp-z=1.9107&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: "Aparecerá un mensaje de confirmación; al confirmar, se borrará de manera definitiva tu fundación.",
          },
        ],
      },
    ],
  },
  {
    id: "Denuncias",
    title: "🚨 Denuncias",
    subsections: [
      {
        id: "DenunciarPerfil",
        title: "Denunciar un perfil o publicación",
        steps: [
          {
            subtitle: 'En la tarjeta del perfil o publicación que deseas denunciar, hacer clic en los tres puntitos en la esquina superior derecha y seleccionar "Reportar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/c092bc12-8a6c-4096-b271-4131b3869091/9fec3dce-3dbc-43b9-97f2-66a98ce58e5e.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario seleccionando el motivo de la denuncia y hacer clic en "Enviar"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/71677cfb-6d1b-43d3-a8af-f33b663b2d70/6ce1ef4e-820e-4b28-8f3c-d6fc4937c066.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4956&fp-y=0.5054&fp-z=1.6652&w=1200",
          },
        ],
        alerts: [
          {
            type: "info",
            text: "Esta función permite reportar perfiles o publicaciones inapropiadas dentro de la plataforma, como paseadores, cuidadores, veterinarias, fundaciones o posteos de mascotas. Es importante denunciar cuando observes irregularidades.",
          },
          {
            type: "warning",
            text: "El proceso es idéntico para todos los tipos de perfiles y publicaciones. La denuncia será analizada por el equipo de Amigos Peludos.",
          },
        ],
      },
    ],
  },
  {
    id: "Publicidades",
    title: "📢 Publicidades",
    subsections: [
      {
        id: "AgregarPublicidad",
        title: "Agregar una publicidad",
        steps: [
            {
            subtitle: 'Desde la sección "Publicidad" en la página principal, seleccionar un plan de publicidad',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/7bfdc0f7-8da7-4bef-a067-e36240d14a29/85c97a2f-ae2c-41e1-b081-dae5182b50b6.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Completar el formulario con los datos solicitados y hacer clic en "Registrar solicitud"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/bbb0e642-1250-4248-8915-13bb77d6703b/4e3209a1-0730-43c0-bba6-b8e4c9261c23.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.4934&fp-y=0.8919&fp-z=1.4059&w=1200",
          },
        ],
        alerts: [
          {
            type: "warning",
            text: "Los planes están sujetos a cambios; se recomienda revisar cuidadosamente los detalles antes de realizar la selección.",
          },
          {
            type: "info",
            text: "Una vez registrada tu publicidad, será revisada por nuestro equipo. Te contactaremos para coordinar el pago y activación. Las fechas de inicio y fin se configurarán según el plan seleccionado.",
          },
        ],
      },
      {
        id: "ConsultarPublicidad",
        title: "Consultar mis publicidades",
        steps: [
          {
            subtitle: 'Desde el logo de tu perfil, desplegar el menú y seleccionar "Dashboard de publicidades". Allí podrás ver las estadísticas y consultar el detalle de cada una',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/65a2fe5c-204d-41b6-99b7-ccf3d34d0ceb/9656f00b-9f24-450a-a8bc-9fde349ba660.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
      },
      {
        id: "ModificarPublicidad",
        title: "Modificar mi publicidad",
        steps: [
          {
            subtitle: 'Desde "Dashboard de publicidades", en la tabla de detalle, localizar la fila correspondiente y hacer clic en el icono de lápiz (Editar publicidad) en la columna Acciones',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/e61f850a-1dd1-4379-b41f-18a1c9c215fb/7fb73288-5527-4665-b8ba-1be3d56cb84b.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
          {
            subtitle: 'Se abrirá un formulario donde podrás actualizar la información. Una vez realizados los cambios, hacer clic en "Actualizar publicidad"',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/dcd7eb0d-dd96-4aa0-a08a-e1ca68d9a5b4/bb6c42f9-0627-4ba3-a30a-0b40169d41a6.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5075&fp-y=0.6656&fp-z=1.3457&w=1200",
          },
        ],
      },
      {
        id: "EliminarPublicidad",
        title: "Eliminar mi publicidad",
        steps: [
          {
            subtitle: 'Desde "Dashboard de publicidades", localizar en la tabla la fila correspondiente y hacer clic en el icono de tachito (Eliminar) en la columna Acciones',
            image: "https://images.tango.us/workflows/3e6a9478-e65a-496f-897c-2ce190a565ff/steps/447553a7-dd00-4623-b38d-a3f22e8b5fae/3130675e-4660-4402-8e65-2007560a5634.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&w=1200",
          },
        ],
        alerts: [
          {
            type: "error",
            text: 'Aparecerá un mensaje de confirmación; al confirmar, la publicidad cambiará su estado a "Eliminada". Seguirás viendo la publicación en la lista, pero ya no estará activa.',
          },
        ],
      },
    ],
  },
];

const getAlertIcon = (type) => {
  switch (type) {
    case "warning":
      return <WarningIcon />;
    case "info":
      return <InfoIcon />;
    case "tip":
      return <LightbulbIcon />;
    case "error":
      return <BlockIcon />;
    default:
      return <InfoIcon />;
  }
};

const Ayuda = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const SidebarContent = () => (
    <Box sx={{ width: 320, height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" fontWeight="bold" color="#C94B59">
          📑 Índice de Contenidos
      </Typography>
      </Box>
      
      <List sx={{ p: 1 }}>
        {sections.map((section) => {
          const isExpanded = expandedSections[section.id];
          
          return (
            <ListItem key={section.id} disablePadding>
              <Box sx={{ width: '100%',marginRight: '15px' }}>
                {/* Sección Principal - Solo flecha collapsible */}
                <ListItemButton
                  onClick={() => toggleSection(section.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pr: 3, // Margen derecho fijo para la flecha
                    '&:hover': {
                      backgroundColor: '#C94B59',
                      color: 'white',
                      borderColor: '#C94B59',
                      '& .expand-icon': {
                        color: 'white',
                      },
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flex: 1,
                    mr: 2, // Margen derecho adicional para separar del icono
                  }}>
                    <ListItemText 
                      primary={section.title}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box 
                    className="expand-icon"
                    sx={{ 
                      color: '#C94B59',
                      transition: 'color 0.2s, transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      minWidth: '20px', // Ancho mínimo para evitar movimiento
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </Box>
                </ListItemButton>
                
                {/* Subsecciones - Solo se muestran si está expandida */}
                {isExpanded && (
                  <Box sx={{ pl: 2, pb: 1, animation: 'fadeIn 0.3s ease-in' }}>
                    {section.subsections?.map((subsection) => (
          <ScrollLink
                        key={subsection.id}
                        to={subsection.id}
            smooth
            duration={500}
                        offset={-100}
                        onClick={() => isMobile && setSidebarOpen(false)}
          >
                        <ListItemButton
              sx={{
                            py: 0.5,
                            px: 1,
                            borderRadius: 0.5,
                            mb: 0.5,
                            minHeight: 32,
                            '&:hover': {
                              backgroundColor: '#C94B59',
                              color: 'white',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <ListItemText 
                            primary={subsection.title}
                            primaryTypographyProps={{
                              fontSize: '0.8rem',
                            }}
                          />
                        </ListItemButton>
          </ScrollLink>
        ))}
                  </Box>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
          transform: 'translateY(-10px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Paper 
          elevation={2}
          sx={{
            width: 320,
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'auto',
            borderRadius: 0,
            borderRight: '1px solid #e0e0e0',
          }}
        >
          <SidebarContent />
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <Container sx={{ flex: 1, py: 5 }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                backgroundColor: '#C94B59',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#aa3f4c',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="#C94B59">
              Manual de Usuario
            </Typography>
          </Box>
        )}

        {/* Header */}
        <Box mb={6} textAlign="center">
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Manual de Usuario - Amigos Peludos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Guía completa para usar todas las funcionalidades de la plataforma
          </Typography>
      </Box>

      {/* Sections Content */}
      {sections.map((section) => (
        <Element name={section.id} key={section.id}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={4}
              sx={{
                borderBottom: "3px solid #C94B59",
                pb: 2,
              }}
            >
              {section.title}
            </Typography>

            {section.subsections?.map((subsection, subIdx) => (
              <Element name={subsection.id} key={subsection.id}>
                <Box mb={4} id={subsection.id}>
          <Typography
            variant="h5"
            fontWeight="bold"
                    mb={3}
                    sx={{
                      color: "#C94B59",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={subIdx + 1}
                      size="small"
                      sx={{
                        backgroundColor: "#C94B59",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                    {subsection.title}
          </Typography>

                  {/* Steps */}
                  <Grid container spacing={3} mb={2}>
                    {subsection.steps.map((step, stepIdx) => (
                      <Grid item xs={12} md={6} key={stepIdx}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            height: "100%",
                            borderLeft: "4px solid #C94B59",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <Chip
                            label={`Paso ${stepIdx + 1}`}
                            size="small"
                            sx={{
                              mb: 1,
                              backgroundColor: "#C94B59",
                              color: "white",
                            }}
                          />
                          <Typography variant="body1" fontWeight="500" mb={2}>
                    {step.subtitle}
                  </Typography>
                  {step.image && (
                    <Box
                      component="img"
                      src={step.image}
                              alt={step.subtitle}
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: 2,
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                              onClick={() => window.open(step.image, "_blank")}
                    />
                  )}
                  {step.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={2}
                            >
                      {step.description}
                    </Typography>
                  )}
                        </Paper>
              </Grid>
            ))}
          </Grid>

                  {/* Alerts */}
                  {subsection.alerts?.map((alert, alertIdx) => (
                    <Alert
                      key={alertIdx}
                      severity={alert.type}
                      icon={getAlertIcon(alert.type)}
                      sx={{ mb: 2 }}
                    >
                      {alert.text}
                    </Alert>
                  ))}

                  {subIdx < section.subsections.length - 1 && (
          <Divider sx={{ my: 4 }} />
                  )}
                </Box>
              </Element>
            ))}
          </Paper>
        </Element>
      ))}

      {/* Footer */}
      <Box textAlign="center" mt={6} py={4}>
        <Typography variant="body2" color="text.secondary">
          Creado con{" "}
          <a
            href="https://tango.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#256EFF", textDecoration: "none" }}
          >
            Tango.ai
          </a>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Fecha de creación: Octubre 2025 | Equipo Amigos Peludos
        </Typography>
      </Box>
    </Container>
    </Box>
  );
};

export default Ayuda;
