import { saveSession, getSession, clearSession } from "./session.js";

const API_BASE_URL = window.location.origin;

// ====================
// REDIRECCIÓN SEGÚN SESIÓN
// ====================
async function redirectIfLogged() {
  const session = await getSession();
  const path = window.location.pathname;

  // Login page: si hay sesión, ir a dashboard
  const isLoginPage = path === "/" || path.endsWith("index.html");
  if (session && isLoginPage) {
    window.location.href = "/dashboard"; // sin .html
    return;
  }

  // Dashboard page: si no hay sesión, volver a login
  const isDashboardPage = path === "/dashboard";
  if (!session && isDashboardPage) {
    window.location.href = "/";
    return;
  }
}

// ====================
// CONFIGURAR LOGIN
// ====================
function setupLogin() {
  const path = window.location.pathname;
  const isLoginPage = path === "/" || path.endsWith("index.html");
  if (!isLoginPage) return; // solo correr en login

  document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const dniInput = document.getElementById("dni-input");
    const passwordInput = document.getElementById("password-input"); // opcional
    const loginError = document.getElementById("login-error");

    if (!loginBtn || !dniInput || !loginError) {
      console.warn("Elementos de login no encontrados en DOM, abortando setupLogin");
      return;
    }

    loginBtn.addEventListener("click", async () => {
      const dni = dniInput.value.trim();
      if (!dni) {
        loginError.textContent = "Ingrese DNI";
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dni })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error de login");

        await saveSession(data.user); // guardar en indexedDB
        window.location.href = "/dashboard"; // redirige sin .html
      } catch (err) {
        loginError.textContent = err.message;
      }
    });
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

// ====================
// INICIALIZACIÓN
// ====================
redirectIfLogged();
setupLogin();

export { API_BASE_URL, saveSession, getSession, clearSession };
