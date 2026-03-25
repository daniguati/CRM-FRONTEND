/* =============================
   CARGAR VISTAS
============================= */

function cargarVista(vista) {
  const contenedor = document.getElementById("contenidoDinamico");

  if (!contenedor) return;

  if (vista === "oportunidades") {
    contenedor.innerHTML = `
      <div class="vista-header">
        <h1>Oportunidades</h1>
        <p>Resumen rápido de negocios activos</p>
      </div>

      <div class="cards-grid">
        <div class="info-card">
          <span class="tag tag-blue">Nueva</span>
          <h3>Venta Software</h3>
          <p>Empresa interesada en el sistema CRM completo.</p>
          <strong>$2.500</strong>
        </div>

        <div class="info-card">
          <span class="tag tag-green">En proceso</span>
          <h3>Licencias Empresa</h3>
          <p>Renovación de licencias para equipo comercial.</p>
          <strong>$1.200</strong>
        </div>

        <div class="info-card">
          <span class="tag tag-purple">Prioritaria</span>
          <h3>Soporte Premium</h3>
          <p>Cliente solicitó plan avanzado de soporte técnico.</p>
          <strong>$800</strong>
        </div>
      </div>
    `;
  }

  if (vista === "calendario") {
  contenedor.innerHTML = `
   <div class="vista-header vista-header-flex">
        <div>
          <h1>Calendario</h1>
          <p>Gestiona tus eventos y actividades</p>
        </div>
        <button class="btn-primary" id="btnNuevaActividad">+ Nueva actividad</button>
      </div>

      <div class="panel panel-calendario">
        <div id="calendar"></div>
      </div>

      <!-- MODAL NUEVO EVENTO -->
      <div class="modal-overlay oculto" id="modalEventoOverlay">
        <div class="modal-evento">
          <div class="modal-header">
            <h2>Nueva actividad</h2>
            <button class="modal-close" id="cerrarModalEvento">&times;</button>
          </div>

          <form id="formEvento" class="form-evento">
            <label for="tituloEvento">Título</label>
            <input type="text" id="tituloEvento" placeholder="Ej: Reunión con cliente" required>

            <label for="fechaEvento">Fecha</label>
            <input type="date" id="fechaEvento" required>

            <label for="horaEvento">Hora</label>
            <input type="time" id="horaEvento" required>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" id="cancelarModalEvento">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar evento</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL DETALLE EVENTO -->
      <div class="modal-overlay oculto" id="modalDetalleOverlay">
        <div class="modal-evento">
          <div class="modal-header">
            <h2>Detalle del evento</h2>
            <button class="modal-close" id="cerrarModalDetalle">&times;</button>
          </div>

          <div class="detalle-evento">
            <p><strong>Título:</strong> <span id="detalleTituloEvento"></span></p>
            <p><strong>Fecha:</strong> <span id="detalleFechaEvento"></span></p>
            <p><strong>Hora:</strong> <span id="detalleHoraEvento"></span></p>
          </div>

          <div class="modal-actions">
      
  <button type="button" class="btn-secondary" id="cancelarModalDetalle">
    Cerrar
  </button>

  <button type="button" class="btn-warning" id="btnEditarEvento">
    Editar
  </button>

  <button type="button" class="btn-danger" id="btnEliminarEvento">
    Eliminar
  </button>
</div>
          </div>
        </div>
      </div>
      <!-- MODAL CONFIRMAR ELIMINACIÓN -->
<div class="modal-overlay oculto" id="modalConfirmarEliminarOverlay">
  <div class="modal-evento modal-confirmacion">
    <div class="modal-header">
      <h2>Eliminar evento</h2>
      <button class="modal-close" id="cerrarModalConfirmarEliminar">&times;</button>
    </div>

    <div class="detalle-evento">
      <p class="texto-confirmacion">
        ¿Estás seguro de eliminar este evento?
      </p>
      <p class="texto-confirmacion-sub" id="textoEventoAEliminar"></p>
      <p class="texto-confirmacion-warning">
        Esta acción no se puede deshacer.
      </p>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn-secondary" id="cancelarEliminarEvento">
        Cancelar
      </button>
      <button type="button" class="btn-danger" id="confirmarEliminarEvento">
        Sí, eliminar
      </button>
    </div>
  </div>
</div>
    `;


  inicializarCalendario();
  inicializarModalEvento();
  inicializarModalDetalleEvento();
  inicializarModalConfirmarEliminar();

  const btnNuevaActividad = document.getElementById("btnNuevaActividad");

  if (btnNuevaActividad) {
    btnNuevaActividad.addEventListener("click", () => {
      abrirModalEvento();
    });
  }
}

  if (vista === "reportes") {
    contenedor.innerHTML = `
      <div class="vista-header">
        <h1>Reportes</h1>
        <p>Indicadores comerciales del CRM</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span>Total ventas</span>
          <h2>$17.700</h2>
        </div>
        <div class="stat-card">
          <span>Clientes activos</span>
          <h2>50</h2>
        </div>
        <div class="stat-card">
          <span>Leads nuevos</span>
          <h2>30</h2>
        </div>
      </div>

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
      const ctx2 = document.getElementById("graficaPie");

      if (ctx1) {
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: ["Prospecto", "Propuesta", "Negociación", "Cerrado"],
            datasets: [
              {
                label: "Ventas $",
                data: [1200, 4500, 6000, 8000],
                backgroundColor: "#3b82f6",
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
      }

      if (ctx2) {
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
          options: {
            responsive: true,
          },
        });
      }
    }, 100);
  }
if (vista === "configuracion") {
  contenedor.innerHTML = `
    <div class="vista-header">
      <h1>Configuración</h1>
      <p>Administra tu cuenta, preferencias y datos del sistema</p>
    </div>

    <div class="config-grid">

      <div class="panel config-card">
        <h3>Perfil de usuario</h3>

        <div class="config-row">
          <span>Usuario</span>
          <strong>Admin</strong>
        </div>
        <div class="config-row">
          <span>Email</span>
          <strong>admin@crm.com</strong>
        </div>
        <div class="config-row">
          <span>Rol</span>
          <strong>Administrador</strong>
        </div>

        <div class="config-actions">
          <button class="btn-primary">Editar perfil</button>
          <button class="btn-secondary" id="btnCambiarPassword">Cambiar contraseña</button>
        </div>
      </div>

      <div class="panel config-card">
        <h3>Preferencias</h3>

        <div class="config-row">
          <span>Idioma</span>
          <strong>Español</strong>
        </div>
        <div class="config-row">
          <span>Zona horaria</span>
          <strong>América/Bogotá</strong>
        </div>
        <div class="config-row">
          <span>Formato de fecha</span>
          <strong>DD/MM/YYYY</strong>
        </div>

        <div class="config-actions">
          <button class="btn-primary">Guardar preferencias</button>
        </div>
      </div>

      <div class="panel config-card">
        <h3>Notificaciones</h3>

        <div class="config-check">
          <label><input type="checkbox" checked> Recordatorios de eventos</label>
        </div>
        <div class="config-check">
          <label><input type="checkbox" checked> Notificaciones por email</label>
        </div>
        <div class="config-check">
          <label><input type="checkbox"> Avisos de nuevos clientes</label>
        </div>
        <div class="config-check">
          <label><input type="checkbox" checked> Alertas de tareas pendientes</label>
        </div>

        <div class="config-actions">
          <button class="btn-primary">Guardar notificaciones</button>
        </div>
      </div>

      <div class="panel config-card">
        <h3>Sistema</h3>

        <div class="config-row">
          <span>Versión CRM</span>
          <strong>1.0.0</strong>
        </div>
        <div class="config-row">
          <span>Base de datos</span>
          <strong>LocalStorage</strong>
        </div>
        <div class="config-row">
          <span>Eventos guardados</span>
          <strong>${obtenerEventosLocalStorage().length}</strong>
        </div>

        <div class="config-actions">
          <button class="btn-secondary">Exportar datos</button>
        </div>
      </div>

    </div>

    <!-- Modal cambiar contraseña -->
    <div id="modalCambiarPassword" class="modal-password oculto">
      <div class="modal-password-content">
        <h3>Cambiar contraseña</h3>

        <input 
          type="password" 
          id="currentPassword" 
          placeholder="Contraseña actual"
          class="input-password"
        />

        <input 
          type="password" 
          id="newPassword" 
          placeholder="Nueva contraseña"
          class="input-password"
        />

        <input 
          type="password" 
          id="confirmPassword" 
          placeholder="Confirmar nueva contraseña"
          class="input-password"
        />

        <p id="passwordMessage" class="password-message"></p>

        <div class="modal-password-actions">
          <button class="btn-primary" id="guardarNuevaPassword">Guardar</button>
          <button class="btn-secondary" id="cerrarModalPassword">Cancelar</button>
        </div>
      </div>
    </div>
  `;

  inicializarCambioPassword();
}

function inicializarCambioPassword() {
  console.log("inicializarCambioPassword SI se ejecutó");

  const btnCambiarPassword = document.getElementById("btnCambiarPassword");
  const modal = document.getElementById("modalCambiarPassword");
  const btnCerrarModal = document.getElementById("cerrarModalPassword");
  const btnGuardar = document.getElementById("guardarNuevaPassword");
  const passwordMessage = document.getElementById("passwordMessage");

  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  console.log("btnCambiarPassword:", btnCambiarPassword);
  console.log("modal:", modal);
  console.log("btnCerrarModal:", btnCerrarModal);
  console.log("btnGuardar:", btnGuardar);

  if (!btnCambiarPassword || !modal) {
    console.log("No encontró botón o modal");
    return;
  }

  btnCambiarPassword.addEventListener("click", () => {
    console.log("Click en cambiar contraseña");
    modal.classList.remove("oculto");
    passwordMessage.textContent = "";
  });

  btnCerrarModal.addEventListener("click", () => {
    modal.classList.add("oculto");
    limpiarFormularioPassword();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("oculto");
      limpiarFormularioPassword();
    }
  });

  btnGuardar.addEventListener("click", async () => {
    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    const token = localStorage.getItem("token");

    if (!currentPassword || !newPassword || !confirmPassword) {
      passwordMessage.textContent = "Todos los campos son obligatorios";
      passwordMessage.style.color = "red";
      return;
    }

    if (newPassword !== confirmPassword) {
      passwordMessage.textContent = "Las nuevas contraseñas no coinciden";
      passwordMessage.style.color = "red";
      return;
    }

    if (!token) {
      passwordMessage.textContent = "No se encontró sesión activa. Inicia sesión nuevamente.";
      passwordMessage.style.color = "red";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        passwordMessage.textContent = data.message || "Error al cambiar contraseña";
        passwordMessage.style.color = "red";
        return;
      }

      passwordMessage.textContent = data.message || "Contraseña actualizada correctamente";
      passwordMessage.style.color = "green";

      currentPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";

      passwordMessage.textContent = "Contraseña actualizada correctamente";
passwordMessage.style.color = "green";

currentPasswordInput.value = "";
newPasswordInput.value = "";
confirmPasswordInput.value = "";

// cerrar después de 3 segundos
setTimeout(() => {
  modal.classList.add("oculto");
  limpiarFormularioPassword();
}, 3000);

    } catch (error) {
      passwordMessage.textContent = "Error de conexión con el servidor";
      passwordMessage.style.color = "red";
    }
  });

  function limpiarFormularioPassword() {
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    passwordMessage.textContent = "";
  }
}
  if (vista === "dashboard") {
    location.reload();
  }
}

/* =============================
   FULLCALENDAR + LOCALSTORAGE
============================= */

function obtenerEventosLocalStorage() {
  const eventos = localStorage.getItem("eventosCalendario");
  return eventos ? JSON.parse(eventos) : [];
}

function guardarEventosLocalStorage(eventos) {
  localStorage.setItem("eventosCalendario", JSON.stringify(eventos));
}

function inicializarCalendario() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const eventosGuardados = obtenerEventosLocalStorage();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    height: 650,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día"
    },
    events: eventosGuardados,
   dateClick: function(info) {
  abrirModalEvento(info.dateStr);
},
  eventClick: function(info) {
  abrirModalDetalleEvento(info.event);
}
  });

  calendar.render();
  window.crmCalendar = calendar;
}

function inicializarModalEvento() {
  const overlay = document.getElementById("modalEventoOverlay");
  const btnCerrar = document.getElementById("cerrarModalEvento");
  const btnCancelar = document.getElementById("cancelarModalEvento");
  const formEvento = document.getElementById("formEvento");

  if (!overlay || !formEvento) return;

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModalEvento);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cerrarModalEvento);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      cerrarModalEvento();
    }
  });

  formEvento.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("tituloEvento").value.trim();
    const fecha = document.getElementById("fechaEvento").value;
    const hora = document.getElementById("horaEvento").value;

    if (!titulo || !fecha || !hora) return;

    const nuevoEvento = {
      id: Date.now().toString(),
      title: titulo,
      start: `${fecha}T${hora}:00`
    };

    const eventos = obtenerEventosLocalStorage();
    eventos.push(nuevoEvento);
    guardarEventosLocalStorage(eventos);

    if (window.crmCalendar) {
      window.crmCalendar.addEvent(nuevoEvento);
    }

    cerrarModalEvento();
  });
}

function abrirModalEvento(fechaSeleccionada = "") {
  const overlay = document.getElementById("modalEventoOverlay");
  const tituloInput = document.getElementById("tituloEvento");
  const fechaInput = document.getElementById("fechaEvento");
  const horaInput = document.getElementById("horaEvento");

  if (!overlay) return;

  overlay.classList.remove("oculto");

  if (tituloInput) tituloInput.value = "";
  if (fechaInput) fechaInput.value = fechaSeleccionada || "";
  if (horaInput) horaInput.value = "10:00";

  if (tituloInput) tituloInput.focus();
}

function eliminarEvento(evento) {
  const eventos = obtenerEventosLocalStorage();
  const actualizados = eventos.filter(e => e.id !== evento.id);

  guardarEventosLocalStorage(actualizados);
  evento.remove();
}

function cerrarModalEvento() {
  const overlay = document.getElementById("modalEventoOverlay");
  const formEvento = document.getElementById("formEvento");

  if (overlay) {
    overlay.classList.add("oculto");
  }

  if (formEvento) {
    formEvento.reset();
  }
}
function inicializarModalDetalleEvento() {
  const overlay = document.getElementById("modalDetalleOverlay");
  const btnCerrar = document.getElementById("cerrarModalDetalle");
  const btnCancelar = document.getElementById("cancelarModalDetalle");
  const btnEliminar = document.getElementById("btnEliminarEvento");
  const btnEditar = document.getElementById("btnEditarEvento");

  if (!overlay) return;

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModalDetalleEvento);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cerrarModalDetalleEvento);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      cerrarModalDetalleEvento();
    }
  });

  if (btnEliminar) {
    btnEliminar.addEventListener("click", function () {
      if (!window.eventoSeleccionado) return;

      abrirModalConfirmarEliminar(window.eventoSeleccionado);
    });
  }

  if (btnEditar) {
    btnEditar.addEventListener("click", function () {
      if (!window.eventoSeleccionado) return;

      const evento = window.eventoSeleccionado;

      cerrarModalDetalleEvento();
      abrirModalEvento(evento.startStr ? evento.startStr.split("T")[0] : "");

      document.getElementById("tituloEvento").value = evento.title;

      const hora = evento.start
        ? evento.start.toTimeString().slice(0, 5)
        : "10:00";

      document.getElementById("horaEvento").value = hora;

      window.eventoEditando = evento;
    });
  }
}

function abrirModalDetalleEvento(evento) {
  const overlay = document.getElementById("modalDetalleOverlay");
  const titulo = document.getElementById("detalleTituloEvento");
  const fecha = document.getElementById("detalleFechaEvento");
  const hora = document.getElementById("detalleHoraEvento");

  if (!overlay || !evento) return;

  const fechaEvento = evento.start
    ? evento.start.toLocaleDateString("es-CO")
    : "Sin fecha";

  const horaEvento = evento.start
    ? evento.start.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Sin hora";

  if (titulo) titulo.textContent = evento.title;
  if (fecha) fecha.textContent = fechaEvento;
  if (hora) hora.textContent = horaEvento;

  window.eventoSeleccionado = evento;
  overlay.classList.remove("oculto");
}

function cerrarModalDetalleEvento() {
  const overlay = document.getElementById("modalDetalleOverlay");

  if (overlay) {
    overlay.classList.add("oculto");
  }

  window.eventoSeleccionado = null;
}
function inicializarModalConfirmarEliminar() {
  const overlay = document.getElementById("modalConfirmarEliminarOverlay");
  const btnCerrar = document.getElementById("cerrarModalConfirmarEliminar");
  const btnCancelar = document.getElementById("cancelarEliminarEvento");
  const btnConfirmar = document.getElementById("confirmarEliminarEvento");

  if (!overlay) return;

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModalConfirmarEliminar);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cerrarModalConfirmarEliminar);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      cerrarModalConfirmarEliminar();
    }
  });

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      if (!window.eventoAEliminar) return;

      eliminarEvento(window.eventoAEliminar);
      cerrarModalConfirmarEliminar();
      cerrarModalDetalleEvento();
    });
  }
}

function abrirModalConfirmarEliminar(evento) {
  const overlay = document.getElementById("modalConfirmarEliminarOverlay");
  const textoEvento = document.getElementById("textoEventoAEliminar");

  if (!overlay || !evento) return;

  window.eventoAEliminar = evento;

  if (textoEvento) {
    textoEvento.textContent = `"${evento.title}"`;
  }

  overlay.classList.remove("oculto");
}

function cerrarModalConfirmarEliminar() {
  const overlay = document.getElementById("modalConfirmarEliminarOverlay");

  if (overlay) {
    overlay.classList.add("oculto");
  }

  window.eventoAEliminar = null;
}