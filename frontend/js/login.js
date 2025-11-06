import { API_BASE_URL, saveSession } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const dniInput = document.getElementById("dni-input");
  const loginError = document.getElementById("login-error");

  if (!loginBtn || !dniInput || !loginError) return;

  loginBtn.addEventListener("click", async () => {
    const dni = dniInput.value.trim();

    if (!/^\d{8}$/.test(dni)) {
      loginError.textContent = "DNI inválido.";
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Validando...";

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al validar");

      await saveSession(data.user);
      window.location.href = "/dashboard"; // redirige sin .html
    } catch (err) {
      loginError.textContent = err.message;
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Ingresar";
    }
  });
});
