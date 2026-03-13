/* =============================
   PROTEGER RUTAS PRIVADAS
============================= */

const token = localStorage.getItem("token");
const rutaActual = window.location.pathname;

const paginasProtegidas = [
  "/crm-frontend/index.html",
  "/crm-frontend/contactos.html",
  "/crm-frontend/nuevo-contacto.html"
];

if (paginasProtegidas.includes(rutaActual) && !token) {
  window.location.href = "/crm-frontend/login.html";
}
/* =============================
   LOGIN
============================= */
const loginForm = document.getElementById("LoginForm");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {

      const result = await response.json();

      localStorage.setItem("token", result.token);

      alert("Login exitoso!");

     window.location.href = "/crm-frontend/index.html";

    } else {

      alert("❌ Credenciales incorrectas");

    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("❌ Hubo un error al intentar iniciar sesión");
  }
});
function logout() {

  // eliminar token
  localStorage.removeItem("token");

  // redirigir al login
  window.location.href = "/crm-frontend/login.html";

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

/* =============================
   CARGAR VISTAS
============================= */

function cargarVista(vista) {
  const contenedor = document.getElementById("contenidoDinamico");

  if (!contenedor) return;

  if (vista === "oportunidades") {
    contenedor.innerHTML = `
      <h1>Oportunidades</h1>
      <div class="panel">
        <div class="card blue">Venta Software - $2.500</div>
        <div class="card green">Licencias Empresa - $1.200</div>
        <div class="card purple">Soporte Premium - $800</div>
      </div>
    `;
  }

  if (vista === "calendario") {
    contenedor.innerHTML = `
      <h1>Calendario</h1>
      <div class="panel">
        <p>📅 Reunión con Cliente - 10:00 AM</p>
        <p>📅 Llamada seguimiento - 2:00 PM</p>
        <p>📅 Presentación propuesta - Mañana</p>
      </div>
    `;
  }

  if (vista === "reportes") {
    contenedor.innerHTML = `
      <h1>Reportes</h1>

      <div class="panels">

        <div class="panel">
          <h3>Ventas por etapa</h3>
          <canvas id="graficaBarras"></canvas>
        </div>

        <div class="panel">
          <h3>Distribución de clientes</h3>
          <canvas id="graficaPie"></canvas>
        </div>

      </div>
    `;

    setTimeout(() => {
      const ctx1 = document.getElementById("graficaBarras");

      new Chart(ctx1, {
        type: "bar",
        data: {
          labels: ["Prospecto", "Propuesta", "Negociación", "Cerrado"],
          datasets: [
            {
              label: "Ventas $",
              data: [1200, 4500, 6000, 8000],
              backgroundColor: "#3b82f6",
            },
          ],
        },
      });

      const ctx2 = document.getElementById("graficaPie");

      new Chart(ctx2, {
        type: "pie",
        data: {
          labels: ["Clientes", "Leads", "Inactivos"],
          datasets: [
            {
              data: [50, 30, 20],
              backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
            },
          ],
        },
      });
    }, 100);
  }

  if (vista === "configuracion") {
    contenedor.innerHTML = `
      <h1>Configuración</h1>
      <div class="panel">
        <p><b>Usuario:</b> Admin</p>
        <p><b>Email:</b> admin@crm.com</p>
        <button class="btn-primary">Cambiar contraseña</button>
      </div>
    `;
  }

  if (vista === "dashboard") {
    location.reload();
  }
}
