import { saveSession, getSession, clearSession } from "./session.js";

const API_BASE_URL = window.location.origin;

// ====================
// REDIRECCIÓN SI YA HAY SESIÓN
// Solo se ejecuta en login (index.html o /)
// ====================
async function redirectToDashboardIfLogged() {
  const session = await getSession();

  // Verifica que estamos en login (index.html o /)
  const isLoginPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  if (session && isLoginPage) {
    // Redirige a dashboard físico
    window.location.href = "./dashboard.html";
  }
}

// ====================
// CONFIGURAR LOGIN
// Solo ejecuta si estamos en login
// ====================
function setupLogin() {
  const isLoginPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
  if (!isLoginPage) return; // no ejecutar en dashboard

  const loginBtn = document.getElementById("login-btn");
  const dniInput = document.getElementById("dni-input");
  const passwordInput = document.getElementById("password-input");
  const loginError = document.getElementById("login-error");

  if (!loginBtn || !dniInput || !passwordInput || !loginError) {
    console.error("Elementos de login no encontrados en DOM");
    return;
  }

  loginBtn.addEventListener("click", async () => {
    const dni = dniInput.value.trim();
    const password = passwordInput.value.trim();

    if (!dni || !password) {
      loginError.textContent = "Ingrese DNI y contraseña";
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password })
      });

      const data = await res.json();

      if (res.ok) {
        await saveSession(data);
        // Redirige al dashboard físico
        window.location.href = "./dashboard.html";
      } else {
        loginError.textContent = data.message || "Error de login";
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

// ====================
// INICIALIZACIÓN
// ====================
redirectToDashboardIfLogged();
setupLogin();

export { API_BASE_URL, saveSession, getSession, clearSession };
