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

  const icono = tipo === "success" ? "✅" : "❌";

  toast.innerHTML = `
    <span class="toast-icon">${icono}</span>
    <span class="toast-message">${mensaje}</span>
  `;

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

  fetch(`http://localhost:3000/api/contactos/${idEditar}`)
    .then((res) => res.json())
    .then((contacto) => {
      document.getElementById("nombre").value = contacto.nombre;
      document.getElementById("telefono").value = contacto.telefono;
      document.getElementById("correo").value = contacto.correo;
      document.getElementById("empresa").value = contacto.empresa;
      document.getElementById("notas").value = contacto.notas;
    })
    .catch((error) => {
      console.error("Error al cargar contacto:", error);
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

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const empresa = document.getElementById("empresa").value;
    const notas = document.getElementById("notas").value;

    const nuevoContacto = {
      nombre,
      telefono,
      correo,
      empresa,
      notas,
    };

    try {
      let url = "http://localhost:3000/api/contactos";
      let metodo = "POST";

      if (idEditar) {
        url = `http://localhost:3000/api/contactos/${idEditar}`;
        metodo = "PUT";
      }

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoContacto),
      });

      if (response.ok) {
        const mensaje = idEditar
          ? "Contacto actualizado correctamente"
          : "Contacto guardado correctamente";

        mostrarNotificacion(mensaje, "success");

        setTimeout(() => {
          window.location.href = "contactos.html";
        }, 1200);
      } else {
        mostrarNotificacion("Error al guardar el contacto", "error");
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error de conexión con el servidor", "error");
    }
  });
}

/* =============================
   MOSTRAR CONTACTOS
============================= */

const tabla = document.getElementById("tablaContactos");

if (tabla) {
  const obtenerContactos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/contactos");

      const contactos = await response.json();

      tabla.innerHTML = "";

      if (contactos.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="6" class="empty-table">
              No hay contactos registrados. Presiona "+ Nuevo"
            </td>
          </tr>
        `;
      } else {
        contactos.forEach((contacto) => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${contacto.nombre}</td>
            <td>${contacto.telefono}</td>
            <td>${contacto.correo}</td>
            <td>${contacto.empresa}</td>
            <td>${contacto.notas}</td>

            <td>
              <div class="action-buttons">
                <button 
                  class="btn-action btn-edit"
                  onclick="editarContacto(${contacto.id})">
                  <span>✏️</span>
                  Editar
                </button>

                <button 
                  class="btn-action btn-delete"
                  data-id="${contacto.id}">
                  <span>🗑️</span>
                  Eliminar
                </button>
              </div>
            </td>
          `;

          tabla.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      mostrarNotificacion("Error al cargar los contactos", "error");
    }
  };

  obtenerContactos();

  /* =============================
     ELIMINAR CONTACTO
  ============================= */

  tabla.addEventListener("click", async (e) => {
    const botonEliminar = e.target.closest(".btn-delete");

    if (botonEliminar) {
      const id = botonEliminar.getAttribute("data-id");

      try {
        const response = await fetch(
          `http://localhost:3000/api/contactos/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          mostrarNotificacion("Contacto eliminado correctamente", "success");
          obtenerContactos();
        } else {
          mostrarNotificacion("Error al eliminar contacto", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("Error de conexión con el servidor", "error");
      }
    }
  });
}

/* =============================
   FUNCION EDITAR
============================= */

function editarContacto(id) {
  window.location.href = `nuevo-contacto.html?id=${id}`;
}