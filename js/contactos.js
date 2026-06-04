/* =============================
   NOTIFICACIONES ELEGANTES
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

/* =============================
   DETECTAR EDICION
============================= */

const params = new URLSearchParams(window.location.search);
const idEditar = params.get("id");

if (idEditar) {
  const titulo = document.getElementById("tituloFormulario");

  if (titulo) {
    titulo.innerText = "Editar Contacto";
  }

  apiFetch(`/contactos/${idEditar}`)
    .then((contacto) => {
      document.getElementById("nombre").value = contacto.nombre || "";
      document.getElementById("telefono").value = contacto.telefono || "";
      document.getElementById("correo").value = contacto.correo || "";
      document.getElementById("empresa").value = contacto.empresa || "";
      document.getElementById("estado").value = contacto.estado || "lead";
      document.getElementById("notas").value = contacto.notas || "";
    })
    .catch(() => {
      mostrarNotificacion("Error al cargar el contacto", "error");
    });
}

/* =============================
   GUARDAR CONTACTOS
============================= */

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const contacto = {
      nombre: document.getElementById("nombre").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      empresa: document.getElementById("empresa").value.trim(),
      estado: document.getElementById("estado").value,
      notas: document.getElementById("notas").value.trim(),
    };

    try {
      const path = idEditar ? `/contactos/${idEditar}` : "/contactos";
      const method = idEditar ? "PUT" : "POST";

      await apiFetch(path, {
        method,
        body: JSON.stringify(contacto),
      });

      mostrarNotificacion(
        idEditar ? "Contacto actualizado correctamente" : "Contacto guardado correctamente",
        "success"
      );

      setTimeout(() => {
        window.location.href = "contactos.html";
      }, 900);
    } catch (error) {
      mostrarNotificacion(error.message || "Error al guardar el contacto", "error");
    }
  });
}

/* =============================
   MOSTRAR CONTACTOS
============================= */

const tabla = document.getElementById("tablaContactos");
const buscadorContactos = document.getElementById("buscarContactos");

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto || "-";
  return celda;
}

function crearFilaContacto(contacto) {
  const row = document.createElement("tr");

  row.appendChild(crearCelda(contacto.nombre));
  row.appendChild(crearCelda(contacto.telefono));
  row.appendChild(crearCelda(contacto.correo));
  row.appendChild(crearCelda(contacto.empresa));
  row.appendChild(crearCelda(contacto.estado));
  row.appendChild(crearCelda(contacto.notas));

  const acciones = document.createElement("td");
  const accionesWrapper = document.createElement("div");
  accionesWrapper.className = "action-buttons";

  const btnEditar = document.createElement("button");
  btnEditar.className = "btn-action btn-edit";
  btnEditar.type = "button";
  btnEditar.textContent = "Editar";
  btnEditar.addEventListener("click", () => editarContacto(contacto.id));

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn-action btn-delete";
  btnEliminar.type = "button";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.dataset.id = contacto.id;

  accionesWrapper.appendChild(btnEditar);
  accionesWrapper.appendChild(btnEliminar);
  acciones.appendChild(accionesWrapper);
  row.appendChild(acciones);

  return row;
}

async function obtenerContactos(search = "") {
  if (!tabla) return;

  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const contactos = await apiFetch(`/contactos${query}`);

    tabla.innerHTML = "";

    if (contactos.length === 0) {
      const row = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 7;
      celda.className = "empty-table";
      celda.textContent = "No hay contactos registrados.";
      row.appendChild(celda);
      tabla.appendChild(row);
      return;
    }

    contactos.forEach((contacto) => {
      tabla.appendChild(crearFilaContacto(contacto));
    });
  } catch (error) {
    mostrarNotificacion(error.message || "Error al cargar los contactos", "error");
  }
}

if (tabla) {
  obtenerContactos();

  /* =============================
     ELIMINAR CONTACTO
  ============================= */

  tabla.addEventListener("click", async (e) => {
    const botonEliminar = e.target.closest(".btn-delete");

    if (!botonEliminar) return;

    const confirmar = window.confirm("¿Eliminar este contacto?");
    if (!confirmar) return;

    try {
      await apiFetch(`/contactos/${botonEliminar.dataset.id}`, {
        method: "DELETE",
      });

      mostrarNotificacion("Contacto eliminado correctamente", "success");
      obtenerContactos(buscadorContactos?.value.trim() || "");
    } catch (error) {
      mostrarNotificacion(error.message || "Error al eliminar contacto", "error");
    }
  });
}

/* =============================
   FUNCION EDITAR
============================= */

if (buscadorContactos) {
  let timeoutBusqueda;

  buscadorContactos.addEventListener("input", () => {
    clearTimeout(timeoutBusqueda);

    timeoutBusqueda = setTimeout(() => {
      obtenerContactos(buscadorContactos.value.trim());
    }, 300);
  });
}

function editarContacto(id) {
  window.location.href = `nuevo-contacto.html?id=${id}`;
}
