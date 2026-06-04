const token = localStorage.getItem("token");
const rutaActual = window.location.pathname;

const paginasProtegidas = [
  "/crm-frontend/index.html",
  "/crm-frontend/contactos.html",
  "/crm-frontend/nuevo-contacto.html",
];

if (paginasProtegidas.includes(rutaActual) && !token) {
  window.location.href = "/crm-frontend/login.html";
}

const loginForm = document.getElementById("LoginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const mensajeLogin = document.getElementById("mensajeLogin");

    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user || {}));

      mensajeLogin.className = "mensaje-login success";
      mensajeLogin.textContent = "Autenticación exitosa";

      setTimeout(() => {
        window.location.href = "/crm-frontend/index.html";
      }, 800);
    } catch (error) {
      mensajeLogin.className = "mensaje-login error";
      mensajeLogin.textContent = error.message || "Credenciales incorrectas";
    }
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/crm-frontend/login.html";
}
