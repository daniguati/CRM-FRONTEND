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

if (loginForm) {
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

        const mensajeLogin = document.getElementById("mensajeLogin");

        mensajeLogin.className = "mensaje-login success";
        mensajeLogin.textContent = "Autenticación exitosa";;

        setTimeout(() => {
        window.location.href = "/crm-frontend/index.html";
        }, 1200);
      } else {
        mensajeLogin.className = "mensaje-login error";
        mensajeLogin.textContent = "Credenciales incorrectas";;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      amensajeLogin.className = "mensaje-login error";
    mensajeLogin.textContent = "Error al iniciar sesión";;
    }
  });
}
function logout() {

  // eliminar token
  localStorage.removeItem("token");

  // redirigir al login
  window.location.href = "/crm-frontend/login.html";

}