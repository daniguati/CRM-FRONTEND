const API_BASE_URL = window.CRM_API_BASE_URL || "http://localhost:3000/api";

async function apiFetch(path, options = {}) {
  const { auth = true, headers = {}, ...fetchOptions } = options;
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (auth && (response.status === 401 || response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.endsWith("/login.html")) {
        window.location.href = "/crm-frontend/login.html";
      }
    }

    const error = new Error(data?.message || "Error de comunicación con el servidor");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
