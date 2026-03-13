
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