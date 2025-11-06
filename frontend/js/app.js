import { saveSession, getSession, clearSession } from "./session.js";

const API_BASE_URL = window.location.origin;

// Contenedor principal donde se cargará contenido dinámico
const mainContainer = document.getElementById("main-container");

// ====================
// REDIRECCIÓN Y CARGA DE DASHBOARD
// ====================
async function initApp() {
  const session = await getSession();

  // Si hay sesión, carga dashboard
  if (session) {
    loadDashboard();
    // Cambia URL sin recargar
    window.history.replaceState({}, "", "/dashboard");
  } else {
    loadLogin();
    window.history.replaceState({}, "", "/");
  }
}

// ====================
// LOGIN VIEW
// ====================
function loadLogin() {
  mainContainer.innerHTML = `
    <h2>Login</h2>
    <input id="dni-input" placeholder="DNI">
    <input id="password-input" type="password" placeholder="Password">
    <button id="login-btn">Ingresar</button>
    <div id="login-error"></div>
  `;

  document.getElementById("login-btn").addEventListener("click", async () => {
    const dni = document.getElementById("dni-input").value;
    const password = document.getElementById("password-input").value;

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password })
      });
      const data = await res.json();

      if (res.ok) {
        await saveSession(data);
        loadDashboard();
        window.history.replaceState({}, "", "/dashboard");
      } else {
        document.getElementById("login-error").textContent = data.message || "Error";
      }
    } catch (err) {
      console.error(err);
      document.getElementById("login-error").textContent = "Error de conexión";
    }
  });
}

// ====================
// DASHBOARD VIEW
// ====================
function loadDashboard() {
  mainContainer.innerHTML = `
    <h1>Bienvenido al Dashboard</h1>
    <button id="logout-btn">Cerrar sesión</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await clearSession();
    loadLogin();
    window.history.replaceState({}, "", "/");
  });
}

// ====================
// SERVICE WORKER
// ====================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.warn("SW error:", err));
}

// Inicializa app
initApp();

export { API_BASE_URL, saveSession, getSession, clearSession };
