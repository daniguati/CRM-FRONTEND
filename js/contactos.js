
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
        alert("✅ Contacto guardado correctamente");

        window.location.href = "contactos.html";
      } else {
        alert("❌ Error al guardar");
      }
    } catch (error) {
      console.error(error);
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
            <td colspan="6" style="padding:20px;text-align:center;color:#6b7280;">
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

              <button 
                class="btn-edit"
                onclick="editarContacto(${contacto.id})">
                Editar
              </button>

              <button 
                class="btn-delete"
                data-id="${contacto.id}">
                Eliminar
              </button>

            </td>
          `;

          tabla.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Error al obtener contactos:", error);
    }
  };

  obtenerContactos();

  /* =============================
     ELIMINAR CONTACTO
  ============================= */

  tabla.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const id = e.target.getAttribute("data-id");

      try {
        const response = await fetch(
          `http://localhost:3000/api/contactos/${id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          alert("✅ Contacto eliminado correctamente");

          obtenerContactos();
        } else {
          alert("❌ Error al eliminar contacto");
        }
      } catch (error) {
        console.error("Error:", error);
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