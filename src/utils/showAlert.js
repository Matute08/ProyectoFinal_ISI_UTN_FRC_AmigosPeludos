import Swal from "sweetalert2";

export const mostrarAlertaExito = (mensaje, redireccionar = null) => {
  Swal.fire({
    title: "¡Éxito!",
    text: mensaje,
    icon: "success",
    timer: 2500,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didClose: () => {
      if (redireccionar) {
        window.location.href = redireccionar;
      }
    },
  });
};

export const mostrarAlertaError = (mensaje) => {
  Swal.fire({
    title: "Error",
    text: mensaje || "Ocurrió un problema al guardar la publicación.",
    icon: "error",
    timer: 3000,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

export const mostrarAlertaInfo = (titulo, mensaje) => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "info",
    confirmButtonText: "Entendido",
    confirmButtonColor: "#3085d6",
  });
};
