/* =============================
   GUARDAR CONTACTOS
============================= */

const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevenir que el formulario se envíe de manera convencional

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const empresa = document.getElementById("empresa").value;
        const notas = document.getElementById("notas").value;

        // Crear el objeto con los datos del formulario
        const nuevoContacto = {
            nombre,
            telefono,
            correo,
            empresa,
            notas
        };

        try {
            // Usamos fetch para enviar los datos al backend (API de contactos)
            const response = await fetch("http://localhost:3000/api/contactos", {
                method: "POST", // Método para enviar los datos
                headers: {
                    "Content-Type": "application/json" // Especificamos que el cuerpo es un JSON
                },
                body: JSON.stringify(nuevoContacto) // Convertimos el objeto a JSON
            });

            // Verificamos si la respuesta del servidor es correcta
            if (response.ok) {
                alert("✅ Contacto guardado correctamente");
                window.location.href = "contactos.html"; // Redirigir a la página de contactos
            } else {
                alert("❌ Hubo un error al guardar el contacto");
            }
        } catch (error) {
            console.error("Error al guardar el contacto:", error);
            alert("❌ Hubo un error al guardar el contacto");
        }
    });
}

/* =============================
   MOSTRAR CONTACTOS
============================= */

const tabla = document.getElementById("tablaContactos");

if (tabla) {

    // Función para obtener los contactos
    const obtenerContactos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/contactos");
            const contactos = await response.json();

            tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos contactos

            if (contactos.length === 0) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="5" style="padding: 20px; text-align:center; color:#6b7280;">
                            No hay contactos registrados. Presiona “+ Nuevo” para agregar el primero.
                        </td>
                    </tr>
                `;
            } else {
                contactos.forEach(contacto => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${contacto.nombre}</td>
                        <td>${contacto.telefono}</td>
                        <td>${contacto.correo}</td>
                        <td>${contacto.empresa}</td>
                        <td><span class="badge ${contacto.estado === 'Cliente' ? 'green' : 'orange'}">${contacto.estado}</span></td>
                        <td>
                            <button class="btn-edit" data-id="${contacto.id}">Editar</button>
                            <button class="btn-delete" data-id="${contacto.id}">Eliminar</button>
                        </td>
                    `;
                    tabla.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error al obtener los contactos:", error);
        }
    };

    // Llamamos a la función para obtener los contactos
    obtenerContactos();

    // Agregar el evento de eliminar contacto
    tabla.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-delete")) {
            const id = e.target.getAttribute("data-id");
            try {
                const response = await fetch(`http://localhost:3000/api/contactos/${id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert("✅ Contacto eliminado correctamente");
                    obtenerContactos(); // Recargar la lista de contactos
                } else {
                    alert("❌ Hubo un error al eliminar el contacto");
                }
            } catch (error) {
                console.error("Error al eliminar el contacto:", error);
                alert("❌ Hubo un error al eliminar el contacto");
            }
        }

        if (e.target.classList.contains("btn-edit")) {
            const id = e.target.getAttribute("data-id");
            // Aquí podrías agregar un formulario de edición, o redirigir a una nueva página con el contacto para editar
            window.location.href = `editar-contacto.html?id=${id}`;
        }
    });
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
