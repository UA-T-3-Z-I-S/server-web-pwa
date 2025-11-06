import { saveSession, getSession, clearSession } from "./session.js";

const API_BASE_URL = window.location.origin;

// ====================
// REDIRECCIÓN SI YA HAY SESIÓN
// ====================
async function redirectToDashboardIfLogged() {
  const session = await getSession();
  if (session && window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    // Redirige a dashboard.html físico
    window.location.href = "./dashboard.html";
  }
}

// Lógica de login
function setupLogin() {
  const loginBtn = document.getElementById("login-btn");
  const dniInput = document.getElementById("dni-input");
  const passwordInput = document.getElementById("password-input");
  const loginError = document.getElementById("login-error");

  loginBtn.addEventListener("click", async () => {
    const dni = dniInput.value;
    const password = passwordInput.value;

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password })
      });

      const data = await res.json();
      if (res.ok) {
        await saveSession(data);
        window.location.href = "./dashboard.html";
      } else {
        loginError.textContent = data.message || "Error";
      }
    } catch (err) {
      console.error(err);
      loginError.textContent = "Error de conexión";
    }
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
redirectToDashboardIfLogged();
setupLogin();

export { API_BASE_URL, saveSession, getSession, clearSession };
