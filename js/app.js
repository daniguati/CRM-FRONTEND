/* =============================
   GUARDAR CONTACTOS
============================= */

const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const empresa = document.getElementById("empresa").value;
        const estado = document.getElementById("estado").value;

        const nuevoContacto = {
            nombre,
            email,
            empresa,
            estado
        };

        let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

        contactos.push(nuevoContacto);

        localStorage.setItem("contactos", JSON.stringify(contactos));

        alert("✅ Contacto guardado correctamente");
        window.location.href = "contactos.html";
;
    });
}


/* =============================
   MOSTRAR CONTACTOS
============================= */

const tabla = document.getElementById("tablaContactos");

if (tabla) {

    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];

    if (contactos.length === 0) {

        tabla.innerHTML = `
        <tr>
            <td colspan="4" style="padding: 20px; text-align:center; color:#6b7280;">
                No hay contactos registrados. Presiona “+ Nuevo” para agregar el primero.
            </td>
        </tr>
        `;

    } else {

        contactos.forEach(contacto => {

            const fila = `
            <tr>
                <td>${contacto.nombre}</td>
                <td>${contacto.email}</td>
                <td>${contacto.empresa}</td>
                <td>
                    <span class="badge ${
                        contacto.estado === "Cliente" ? "green" : "orange"
                    }">
                        ${contacto.estado}
                    </span>
                </td>
            </tr>
            `;

            tabla.innerHTML += fila;
        });

    }
}
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

    // Esperamos a que el HTML se dibuje
    setTimeout(() => {

        const ctx1 = document.getElementById('graficaBarras');

        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Prospecto', 'Propuesta', 'Negociación', 'Cerrado'],
                datasets: [{
                    label: 'Ventas $',
                    data: [1200, 4500, 6000, 8000],
                    backgroundColor: '#3b82f6'
                }]
            }
        });

        const ctx2 = document.getElementById('graficaPie');

        new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['Clientes', 'Leads', 'Inactivos'],
                datasets: [{
                    data: [50, 30, 20],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            }
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
