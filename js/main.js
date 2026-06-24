/* =============================
   FUNCIONES GENERALES
============================= */

function mostrarNotificacion(mensaje, tipo = "success") {
  let contenedor = document.querySelector(".toast-container");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.className = "toast-container";
    document.body.appendChild(contenedor);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;

  const icono = document.createElement("span");
  icono.className = "toast-icon";
  icono.textContent = tipo === "success" ? "OK" : "!";

  const texto = document.createElement("span");
  texto.className = "toast-message";
  texto.textContent = mensaje;

  toast.appendChild(icono);
  toast.appendChild(texto);
  contenedor.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");
  }, 2500);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function confirmarAccion({
  titulo = "Confirmar acci\u00f3n",
  mensaje = "\u00bfDeseas continuar?",
  detalle = "",
  confirmarTexto = "Aceptar",
  cancelarTexto = "Cancelar",
  tipo = "danger",
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay modal-confirmacion-overlay";

    const modal = document.createElement("div");
    modal.className = "modal-evento modal-confirmacion";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const header = document.createElement("div");
    header.className = "modal-confirmacion-header";

    const icono = document.createElement("span");
    icono.className = `modal-confirmacion-icon modal-confirmacion-icon-${tipo}`;
    icono.textContent = tipo === "danger" ? "!" : "OK";

    const textos = document.createElement("div");

    const tituloElemento = document.createElement("h2");
    tituloElemento.textContent = titulo;

    const mensajeElemento = document.createElement("p");
    mensajeElemento.className = "texto-confirmacion";
    mensajeElemento.textContent = mensaje;

    textos.appendChild(tituloElemento);
    textos.appendChild(mensajeElemento);
    header.appendChild(icono);
    header.appendChild(textos);
    modal.appendChild(header);

    if (detalle) {
      const detalleElemento = document.createElement("p");
      detalleElemento.className = "texto-confirmacion-sub";
      detalleElemento.textContent = detalle;
      modal.appendChild(detalleElemento);
    }

    const warning = document.createElement("p");
    warning.className = "texto-confirmacion-warning";
    warning.textContent = "Esta acci\u00f3n no se puede deshacer.";
    modal.appendChild(warning);

    const acciones = document.createElement("div");
    acciones.className = "modal-actions modal-confirmacion-actions";

    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "btn-secondary";
    cancelar.textContent = cancelarTexto;

    const confirmar = document.createElement("button");
    confirmar.type = "button";
    confirmar.className = tipo === "danger" ? "btn-danger" : "btn-primary";
    confirmar.textContent = confirmarTexto;

    acciones.appendChild(cancelar);
    acciones.appendChild(confirmar);
    modal.appendChild(acciones);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cerrar = (respuesta) => {
      overlay.classList.add("modal-saliendo");
      document.removeEventListener("keydown", cerrarConEscape);

      setTimeout(() => {
        overlay.remove();
        resolve(respuesta);
      }, 160);
    };

    function cerrarConEscape(e) {
      if (e.key === "Escape") cerrar(false);
    }

    cancelar.addEventListener("click", () => cerrar(false));
    confirmar.addEventListener("click", () => cerrar(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrar(false);
    });
    document.addEventListener("keydown", cerrarConEscape);

    confirmar.focus();
  });
}
