let graficaBarrasInstance = null;
let graficaPieInstance = null;
let oportunidadEditandoId = null;

const etapasOportunidad = {
  prospecto: "Prospecto",
  propuesta: "Propuesta",
  negociacion: "Negociación",
  ganada: "Ganada",
  perdida: "Perdida",
};

const estadosContacto = {
  lead: "Lead",
  cliente: "Cliente",
  inactivo: "Inactivo",
};

function escapeHtml(value) {
  const elemento = document.createElement("div");
  elemento.textContent = value || "";
  return elemento.innerHTML;
}

function actualizarMenuActivo(vista) {
  const itemsMenu = document.querySelectorAll(".sidebar ul li");

  itemsMenu.forEach((item) => {
    item.classList.remove("active");
  });

  const itemActivo = document.querySelector(`.sidebar ul li[data-vista="${vista}"]`);

  if (itemActivo) {
    itemActivo.classList.add("active");
  }
}

async function cargarVista(vista) {
  const contenedor = document.getElementById("contenidoDinamico");

  if (!contenedor) return;

  actualizarMenuActivo(vista);

  if (vista === "dashboard") {
    location.reload();
    return;
  }

  if (vista === "oportunidades") {
    await cargarVistaOportunidades(contenedor);
    return;
  }

  if (vista === "calendario") {
    cargarVistaCalendario(contenedor);
    return;
  }

  if (vista === "reportes") {
    await cargarVistaReportes(contenedor);
    return;
  }

  if (vista === "configuracion") {
    await cargarVistaConfiguracion(contenedor);
  }
}

function crearTexto(tag, texto, className = "") {
  const elemento = document.createElement(tag);
  elemento.textContent = texto || "";

  if (className) {
    elemento.className = className;
  }

  return elemento;
}

function mostrarEstadoVacio(contenedor, mensaje) {
  contenedor.innerHTML = "";
  contenedor.appendChild(crearTexto("p", mensaje, "empty-state"));
}

function etiquetaEtapa(etapa) {
  const tag = document.createElement("span");
  tag.className = `tag tag-${etapa === "ganada" ? "green" : etapa === "perdida" ? "red" : "blue"}`;
  tag.textContent = etapasOportunidad[etapa] || etapa || "Prospecto";
  return tag;
}

async function cargarVistaOportunidades(contenedor) {
  contenedor.innerHTML = `
    <div class="vista-header vista-header-flex">
      <div>
        <h1>Oportunidades</h1>
        <p>Pipeline comercial conectado a la base de datos</p>
      </div>
      <button class="btn-primary" id="btnNuevaOportunidad">+ Nueva oportunidad</button>
    </div>

    <section class="panel">
      <div class="toolbar-panel">
        <input type="search" id="buscarOportunidades" class="search-table" placeholder="Buscar oportunidad...">
        <select id="filtroEtapa" class="input-inline">
          <option value="">Todas las etapas</option>
          <option value="prospecto">Prospecto</option>
          <option value="propuesta">Propuesta</option>
          <option value="negociacion">Negociación</option>
          <option value="ganada">Ganada</option>
          <option value="perdida">Perdida</option>
        </select>
      </div>
      <div class="cards-grid" id="listaOportunidades"></div>
    </section>

    <div class="modal-overlay oculto" id="modalOportunidadOverlay">
      <div class="modal-evento">
        <div class="modal-header">
          <h2 id="tituloModalOportunidad">Nueva oportunidad</h2>
          <button class="modal-close" id="cerrarModalOportunidad">&times;</button>
        </div>

        <form id="formOportunidad" class="form-evento">
          <label for="tituloOportunidad">Título</label>
          <input type="text" id="tituloOportunidad" required>

          <label for="contactoOportunidad">Contacto</label>
          <select id="contactoOportunidad">
            <option value="">Sin contacto asociado</option>
          </select>

          <label for="valorOportunidad">Valor</label>
          <input type="number" id="valorOportunidad" min="0" step="1000" value="0">

          <label for="etapaOportunidad">Etapa</label>
          <select id="etapaOportunidad">
            <option value="prospecto">Prospecto</option>
            <option value="propuesta">Propuesta</option>
            <option value="negociacion">Negociación</option>
            <option value="ganada">Ganada</option>
            <option value="perdida">Perdida</option>
          </select>

          <label for="fechaCierreOportunidad">Fecha estimada de cierre</label>
          <input type="date" id="fechaCierreOportunidad">

          <label for="notasOportunidad">Notas</label>
          <input type="text" id="notasOportunidad">

          <div class="modal-actions">
            <button type="button" class="btn-secondary" id="cancelarModalOportunidad">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  inicializarOportunidades();
  await cargarContactosSelect("contactoOportunidad");
  await cargarOportunidades();
}

function inicializarOportunidades() {
  const btnNueva = document.getElementById("btnNuevaOportunidad");
  const overlay = document.getElementById("modalOportunidadOverlay");
  const cerrar = document.getElementById("cerrarModalOportunidad");
  const cancelar = document.getElementById("cancelarModalOportunidad");
  const form = document.getElementById("formOportunidad");
  const buscar = document.getElementById("buscarOportunidades");
  const filtro = document.getElementById("filtroEtapa");

  btnNueva?.addEventListener("click", () => abrirModalOportunidad());
  cerrar?.addEventListener("click", cerrarModalOportunidad);
  cancelar?.addEventListener("click", cerrarModalOportunidad);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModalOportunidad();
  });

  form?.addEventListener("submit", guardarOportunidad);

  let timeoutBusqueda;
  buscar?.addEventListener("input", () => {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(cargarOportunidades, 300);
  });

  filtro?.addEventListener("change", cargarOportunidades);
}

async function cargarContactosSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  try {
    const contactos = await apiFetch("/contactos");

    contactos.forEach((contacto) => {
      const option = document.createElement("option");
      option.value = contacto.id;
      option.textContent = `${contacto.nombre}${contacto.empresa ? ` - ${contacto.empresa}` : ""}`;
      select.appendChild(option);
    });
  } catch (error) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No se pudieron cargar contactos";
    select.appendChild(option);
  }
}

async function cargarOportunidades() {
  const lista = document.getElementById("listaOportunidades");
  const buscar = document.getElementById("buscarOportunidades")?.value.trim() || "";
  const etapa = document.getElementById("filtroEtapa")?.value || "";

  if (!lista) return;

  lista.innerHTML = "";

  try {
    const params = new URLSearchParams();
    if (buscar) params.set("search", buscar);
    if (etapa) params.set("etapa", etapa);

    const query = params.toString() ? `?${params.toString()}` : "";
    const oportunidades = await apiFetch(`/oportunidades${query}`);

    if (oportunidades.length === 0) {
      mostrarEstadoVacio(lista, "No hay oportunidades registradas.");
      return;
    }

    oportunidades.forEach((oportunidad) => {
      lista.appendChild(crearCardOportunidad(oportunidad));
    });
  } catch (error) {
    mostrarEstadoVacio(lista, error.message || "Error al cargar oportunidades.");
  }
}

function crearCardOportunidad(oportunidad) {
  const card = document.createElement("article");
  card.className = "info-card";

  card.appendChild(etiquetaEtapa(oportunidad.etapa));
  card.appendChild(crearTexto("h3", oportunidad.titulo));
  card.appendChild(crearTexto("p", oportunidad.contacto_nombre || "Sin contacto asociado"));
  card.appendChild(crearTexto("strong", formatCurrency(oportunidad.valor)));

  const meta = crearTexto(
    "p",
    oportunidad.fecha_cierre ? `Cierre estimado: ${oportunidad.fecha_cierre}` : "Sin fecha estimada",
    "card-meta"
  );
  card.appendChild(meta);

  const acciones = document.createElement("div");
  acciones.className = "action-buttons action-buttons-card";

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "btn-action btn-edit";
  editar.textContent = "Editar";
  editar.addEventListener("click", () => abrirModalOportunidad(oportunidad));

  const eliminar = document.createElement("button");
  eliminar.type = "button";
  eliminar.className = "btn-action btn-delete";
  eliminar.textContent = "Eliminar";
  eliminar.addEventListener("click", async () => {
    const confirmar = await confirmarAccion({
      titulo: "Eliminar oportunidad",
      mensaje: "\u00bfQuieres eliminar esta oportunidad?",
      detalle: oportunidad.titulo || "Oportunidad seleccionada",
      confirmarTexto: "Eliminar",
    });

    if (!confirmar) return;

    try {
      await apiFetch(`/oportunidades/${oportunidad.id}`, { method: "DELETE" });
      await cargarOportunidades();
      mostrarNotificacion("Oportunidad eliminada correctamente", "success");
    } catch (error) {
      mostrarNotificacion(error.message || "Error al eliminar oportunidad", "error");
    }
  });

  acciones.appendChild(editar);
  acciones.appendChild(eliminar);
  card.appendChild(acciones);

  return card;
}

function abrirModalOportunidad(oportunidad = null) {
  const overlay = document.getElementById("modalOportunidadOverlay");
  const tituloModal = document.getElementById("tituloModalOportunidad");

  oportunidadEditandoId = oportunidad?.id || null;

  if (tituloModal) {
    tituloModal.textContent = oportunidad ? "Editar oportunidad" : "Nueva oportunidad";
  }

  document.getElementById("tituloOportunidad").value = oportunidad?.titulo || "";
  document.getElementById("contactoOportunidad").value = oportunidad?.contacto_id || "";
  document.getElementById("valorOportunidad").value = oportunidad?.valor || 0;
  document.getElementById("etapaOportunidad").value = oportunidad?.etapa || "prospecto";
  document.getElementById("fechaCierreOportunidad").value = oportunidad?.fecha_cierre || "";
  document.getElementById("notasOportunidad").value = oportunidad?.notas || "";

  overlay?.classList.remove("oculto");
}

function cerrarModalOportunidad() {
  oportunidadEditandoId = null;
  document.getElementById("formOportunidad")?.reset();
  document.getElementById("modalOportunidadOverlay")?.classList.add("oculto");
}

async function guardarOportunidad(e) {
  e.preventDefault();

  const payload = {
    titulo: document.getElementById("tituloOportunidad").value.trim(),
    contacto_id: document.getElementById("contactoOportunidad").value || null,
    valor: document.getElementById("valorOportunidad").value || 0,
    etapa: document.getElementById("etapaOportunidad").value,
    fecha_cierre: document.getElementById("fechaCierreOportunidad").value || null,
    notas: document.getElementById("notasOportunidad").value.trim(),
  };

  const path = oportunidadEditandoId
    ? `/oportunidades/${oportunidadEditandoId}`
    : "/oportunidades";
  const method = oportunidadEditandoId ? "PUT" : "POST";
  const editando = Boolean(oportunidadEditandoId);

  try {
    await apiFetch(path, {
      method,
      body: JSON.stringify(payload),
    });

    cerrarModalOportunidad();
    await cargarOportunidades();
    mostrarNotificacion(
      editando ? "Oportunidad actualizada correctamente" : "Oportunidad guardada correctamente",
      "success"
    );
  } catch (error) {
    mostrarNotificacion(error.message || "Error al guardar oportunidad", "error");
  }
}

function cargarVistaCalendario(contenedor) {
  contenedor.innerHTML = `
    <div class="vista-header vista-header-flex">
      <div>
        <h1>Calendario</h1>
        <p>Actividades guardadas en la base de datos</p>
      </div>
      <button class="btn-primary" id="btnNuevaActividad">+ Nueva actividad</button>
    </div>

    <div class="panel panel-calendario">
      <div id="calendar"></div>
    </div>

    <div class="modal-overlay oculto" id="modalEventoOverlay">
      <div class="modal-evento">
        <div class="modal-header">
          <h2 id="tituloModalEvento">Nueva actividad</h2>
          <button class="modal-close" id="cerrarModalEvento">&times;</button>
        </div>

        <form id="formEvento" class="form-evento">
          <label for="tituloEvento">Título</label>
          <input type="text" id="tituloEvento" required>

          <label for="tipoEvento">Tipo</label>
          <select id="tipoEvento">
            <option value="tarea">Tarea</option>
            <option value="llamada">Llamada</option>
            <option value="reunion">Reunión</option>
            <option value="correo">Correo</option>
          </select>

          <label for="fechaEvento">Fecha</label>
          <input type="date" id="fechaEvento" required>

          <label for="horaEvento">Hora</label>
          <input type="time" id="horaEvento">

          <div class="modal-actions">
            <button type="button" class="btn-secondary" id="cancelarModalEvento">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-overlay oculto" id="modalDetalleOverlay">
      <div class="modal-evento">
        <div class="modal-header">
          <h2>Detalle de actividad</h2>
          <button class="modal-close" id="cerrarModalDetalle">&times;</button>
        </div>
        <div class="detalle-evento">
          <p><strong>Título:</strong> <span id="detalleTituloEvento"></span></p>
          <p><strong>Fecha:</strong> <span id="detalleFechaEvento"></span></p>
          <p><strong>Hora:</strong> <span id="detalleHoraEvento"></span></p>
          <p><strong>Tipo:</strong> <span id="detalleTipoEvento"></span></p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" id="cancelarModalDetalle">Cerrar</button>
          <button type="button" class="btn-warning" id="btnEditarEvento">Editar</button>
          <button type="button" class="btn-danger" id="btnEliminarEvento">Eliminar</button>
        </div>
      </div>
    </div>
  `;

  inicializarCalendario();
  inicializarModalEvento();
  inicializarModalDetalleEvento();

  document.getElementById("btnNuevaActividad")?.addEventListener("click", () => {
    abrirModalEvento();
  });
}

function mapearActividadEvento(actividad) {
  const hora = actividad.hora || "00:00";

  return {
    id: String(actividad.id),
    title: actividad.titulo,
    start: `${actividad.fecha}T${hora}:00`,
    extendedProps: {
      actividad,
    },
  };
}

async function inicializarCalendario() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  let eventos = [];

  try {
    const actividades = await apiFetch("/actividades");
    eventos = actividades.map(mapearActividadEvento);
  } catch (error) {
    calendarEl.textContent = "No se pudieron cargar las actividades.";
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    height: 650,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
    },
    events: eventos,
    dateClick: function (info) {
      abrirModalEvento(info.dateStr);
    },
    eventClick: function (info) {
      abrirModalDetalleEvento(info.event);
    },
  });

  calendar.render();
  window.crmCalendar = calendar;
}

function inicializarModalEvento() {
  const overlay = document.getElementById("modalEventoOverlay");
  const btnCerrar = document.getElementById("cerrarModalEvento");
  const btnCancelar = document.getElementById("cancelarModalEvento");
  const formEvento = document.getElementById("formEvento");

  btnCerrar?.addEventListener("click", cerrarModalEvento);
  btnCancelar?.addEventListener("click", cerrarModalEvento);
  overlay?.addEventListener("click", function (e) {
    if (e.target === overlay) cerrarModalEvento();
  });

  formEvento?.addEventListener("submit", guardarActividad);
}

function abrirModalEvento(fechaSeleccionada = "", evento = null) {
  const overlay = document.getElementById("modalEventoOverlay");
  const tituloModal = document.getElementById("tituloModalEvento");
  const actividad = evento?.extendedProps?.actividad || null;

  window.eventoEditando = evento;

  if (tituloModal) {
    tituloModal.textContent = evento ? "Editar actividad" : "Nueva actividad";
  }

  document.getElementById("tituloEvento").value = actividad?.titulo || "";
  document.getElementById("tipoEvento").value = actividad?.tipo || "tarea";
  document.getElementById("fechaEvento").value = actividad?.fecha || fechaSeleccionada || "";
  document.getElementById("horaEvento").value = actividad?.hora || "10:00";

  overlay?.classList.remove("oculto");
  document.getElementById("tituloEvento")?.focus();
}

async function guardarActividad(e) {
  e.preventDefault();

  const payload = {
    titulo: document.getElementById("tituloEvento").value.trim(),
    tipo: document.getElementById("tipoEvento").value,
    fecha: document.getElementById("fechaEvento").value,
    hora: document.getElementById("horaEvento").value || null,
    estado: "pendiente",
  };

  const eventoEditando = window.eventoEditando;
  const path = eventoEditando ? `/actividades/${eventoEditando.id}` : "/actividades";
  const method = eventoEditando ? "PUT" : "POST";

  const actividad = await apiFetch(path, {
    method,
    body: JSON.stringify(payload),
  });

  if (eventoEditando) {
    eventoEditando.remove();
  }

  window.crmCalendar?.addEvent(mapearActividadEvento(actividad));
  cerrarModalEvento();
}

function cerrarModalEvento() {
  document.getElementById("modalEventoOverlay")?.classList.add("oculto");
  document.getElementById("formEvento")?.reset();
  window.eventoEditando = null;
}

function inicializarModalDetalleEvento() {
  const overlay = document.getElementById("modalDetalleOverlay");

  document.getElementById("cerrarModalDetalle")?.addEventListener("click", cerrarModalDetalleEvento);
  document.getElementById("cancelarModalDetalle")?.addEventListener("click", cerrarModalDetalleEvento);
  overlay?.addEventListener("click", function (e) {
    if (e.target === overlay) cerrarModalDetalleEvento();
  });

  document.getElementById("btnEliminarEvento")?.addEventListener("click", async function () {
    if (!window.eventoSeleccionado) return;

    const actividad = window.eventoSeleccionado.extendedProps?.actividad || {};
    const confirmar = await confirmarAccion({
      titulo: "Eliminar actividad",
      mensaje: "\u00bfQuieres eliminar esta actividad?",
      detalle: actividad.titulo || window.eventoSeleccionado.title || "Actividad seleccionada",
      confirmarTexto: "Eliminar",
    });

    if (!confirmar) return;

    try {
      await apiFetch(`/actividades/${window.eventoSeleccionado.id}`, {
        method: "DELETE",
      });

      window.eventoSeleccionado.remove();
      cerrarModalDetalleEvento();
      mostrarNotificacion("Actividad eliminada correctamente", "success");
    } catch (error) {
      mostrarNotificacion(error.message || "Error al eliminar actividad", "error");
    }
  });

  document.getElementById("btnEditarEvento")?.addEventListener("click", function () {
    if (!window.eventoSeleccionado) return;

    const evento = window.eventoSeleccionado;
    cerrarModalDetalleEvento();
    abrirModalEvento("", evento);
  });
}

function abrirModalDetalleEvento(evento) {
  const overlay = document.getElementById("modalDetalleOverlay");
  const actividad = evento.extendedProps?.actividad || {};

  document.getElementById("detalleTituloEvento").textContent = actividad.titulo || evento.title;
  document.getElementById("detalleFechaEvento").textContent = actividad.fecha || "Sin fecha";
  document.getElementById("detalleHoraEvento").textContent = actividad.hora || "Sin hora";
  document.getElementById("detalleTipoEvento").textContent = actividad.tipo || "Tarea";

  window.eventoSeleccionado = evento;
  overlay?.classList.remove("oculto");
}

function cerrarModalDetalleEvento() {
  document.getElementById("modalDetalleOverlay")?.classList.add("oculto");
  window.eventoSeleccionado = null;
}

async function cargarVistaReportes(contenedor) {
  contenedor.innerHTML = `
    <div class="vista-header">
      <h1>Reportes</h1>
      <p>Indicadores comerciales calculados desde la base de datos</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span>Total ventas ganadas</span>
        <h2 id="reporteTotalVentas">$0</h2>
      </div>
      <div class="stat-card">
        <span>Clientes activos</span>
        <h2 id="reporteClientes">0</h2>
      </div>
      <div class="stat-card">
        <span>Leads nuevos</span>
        <h2 id="reporteLeads">0</h2>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <h3>Ventas por etapa</h3>
        <canvas id="graficaBarras"></canvas>
      </div>

      <div class="panel">
        <h3>Contactos por estado</h3>
        <canvas id="graficaPie"></canvas>
      </div>
    </div>
  `;

  try {
    const data = await apiFetch("/dashboard/reportes");

    document.getElementById("reporteTotalVentas").textContent = formatCurrency(data.indicadores.ventas);
    document.getElementById("reporteClientes").textContent = data.indicadores.clientes;
    document.getElementById("reporteLeads").textContent = data.indicadores.leads;

    renderGraficasReportes(data);
  } catch (error) {
    contenedor.appendChild(crearTexto("p", error.message || "Error al cargar reportes.", "empty-state"));
  }
}

function renderGraficasReportes(data) {
  const ctx1 = document.getElementById("graficaBarras");
  const ctx2 = document.getElementById("graficaPie");

  graficaBarrasInstance?.destroy();
  graficaPieInstance?.destroy();

  if (ctx1) {
    graficaBarrasInstance = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: data.ventasPorEtapa.map((item) => etapasOportunidad[item.etapa] || item.etapa),
        datasets: [
          {
            label: "Valor",
            data: data.ventasPorEtapa.map((item) => item.total),
            backgroundColor: "#2563eb",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  if (ctx2) {
    graficaPieInstance = new Chart(ctx2, {
      type: "pie",
      data: {
        labels: data.clientesPorEstado.map((item) => estadosContacto[item.estado] || item.estado),
        datasets: [
          {
            data: data.clientesPorEstado.map((item) => item.total),
            backgroundColor: ["#10b981", "#f59e0b", "#64748b"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}

async function cargarVistaConfiguracion(contenedor) {
  let usuario = {};
  let resumen = { totales: { actividades: 0 } };

  try {
    [usuario, resumen] = await Promise.all([
      apiFetch("/auth/me"),
      apiFetch("/dashboard/resumen"),
    ]);
  } catch (error) {
    usuario = JSON.parse(localStorage.getItem("user") || "{}");
  }

  contenedor.innerHTML = `
    <div class="vista-header">
      <h1>Configuración</h1>
      <p>Perfil, preferencias y estado general del sistema</p>
    </div>

    <div class="config-grid">
      <div class="panel config-card">
        <h3>Perfil de usuario</h3>
        <div class="config-row">
          <span>Usuario</span>
          <strong>${escapeHtml(usuario.nombre || "Usuario")}</strong>
        </div>
        <div class="config-row">
          <span>Email</span>
          <strong>${escapeHtml(usuario.email || "Sin email")}</strong>
        </div>
        <div class="config-row">
          <span>Rol</span>
          <strong>${escapeHtml(usuario.rol || "admin")}</strong>
        </div>
        <div class="config-actions">
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
      </div>

      <div class="panel config-card">
        <h3>Sistema</h3>
        <div class="config-row">
          <span>Versión CRM</span>
          <strong>1.0.0 MVP</strong>
        </div>
        <div class="config-row">
          <span>Base de datos</span>
          <strong>MySQL</strong>
        </div>
        <div class="config-row">
          <span>Actividades pendientes</span>
          <strong>${resumen.totales?.actividades || 0}</strong>
        </div>
      </div>
    </div>

    <div id="modalCambiarPassword" class="modal-password oculto">
      <div class="modal-password-content">
        <h3>Cambiar contraseña</h3>
        <input type="password" id="currentPassword" placeholder="Contraseña actual" class="input-password">
        <input type="password" id="newPassword" placeholder="Nueva contraseña" class="input-password">
        <input type="password" id="confirmPassword" placeholder="Confirmar nueva contraseña" class="input-password">
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
  const btnCambiarPassword = document.getElementById("btnCambiarPassword");
  const modal = document.getElementById("modalCambiarPassword");
  const btnCerrarModal = document.getElementById("cerrarModalPassword");
  const btnGuardar = document.getElementById("guardarNuevaPassword");
  const passwordMessage = document.getElementById("passwordMessage");

  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  btnCambiarPassword?.addEventListener("click", () => {
    modal?.classList.remove("oculto");
    passwordMessage.textContent = "";
  });

  btnCerrarModal?.addEventListener("click", limpiarFormularioPassword);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) limpiarFormularioPassword();
  });

  btnGuardar?.addEventListener("click", async () => {
    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      passwordMessage.textContent = "Todos los campos son obligatorios";
      passwordMessage.className = "password-message error";
      return;
    }

    if (newPassword !== confirmPassword) {
      passwordMessage.textContent = "Las nuevas contraseñas no coinciden";
      passwordMessage.className = "password-message error";
      return;
    }

    try {
      const data = await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      passwordMessage.textContent = data.message || "Contraseña actualizada correctamente";
      passwordMessage.className = "password-message success";

      setTimeout(limpiarFormularioPassword, 1200);
    } catch (error) {
      passwordMessage.textContent = error.message || "Error al cambiar contraseña";
      passwordMessage.className = "password-message error";
    }
  });

  function limpiarFormularioPassword() {
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    passwordMessage.textContent = "";
    modal?.classList.add("oculto");
  }
}

async function cargarDashboardInicial() {
  const totalContactos = document.getElementById("totalContactosDashboard");
  const totalOportunidades = document.getElementById("totalOportunidadesDashboard");
  const ventas = document.getElementById("ventasDashboard");
  const actividades = document.getElementById("actividadesDashboard");
  const lista = document.getElementById("contactosRecientesDashboard");

  if (!totalContactos && !lista) return;

  try {
    const data = await apiFetch("/dashboard/resumen");

    if (totalContactos) totalContactos.textContent = data.totales.contactos;
    if (totalOportunidades) totalOportunidades.textContent = data.totales.oportunidades;
    if (ventas) ventas.textContent = formatCurrency(data.totales.ventas);
    if (actividades) actividades.textContent = data.totales.actividades;

    if (lista) {
      lista.innerHTML = "";

      if (data.contactosRecientes.length === 0) {
        lista.appendChild(crearTexto("li", "No hay contactos registrados.", "list-empty"));
        return;
      }

      data.contactosRecientes.forEach((contacto) => {
        const item = document.createElement("li");
        item.classList.add("contacto-reciente-item");
        item.appendChild(crearTexto("strong", contacto.nombre || "Sin nombre"));
        item.appendChild(crearTexto("span", contacto.empresa || contacto.correo || "Sin información"));
        lista.appendChild(item);
      });
    }
  } catch (error) {
    if (totalContactos) totalContactos.textContent = "0";
    if (totalOportunidades) totalOportunidades.textContent = "0";
    if (ventas) ventas.textContent = "$0";
    if (actividades) actividades.textContent = "0";

    if (lista) {
      lista.innerHTML = "";
      lista.appendChild(crearTexto("li", "Error al cargar contactos recientes.", "list-empty"));
    }
  }
}

document.addEventListener("DOMContentLoaded", cargarDashboardInicial);
