import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./src/db.js";
import loginRouter from "./routes/login.js";

const app = express();

// Detecta entorno
const isRender = !!process.env.PORT;
const FRONTEND_URL = isRender
  ? "https://server-web-pwa.onrender.com"
  : "http://localhost:3000";

// CORS
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Healthcheck
app.get("/status", (req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

// Login API
app.use("/login", loginRouter);

// Carpeta frontend
const frontendPath = path.join(process.cwd(), "../frontend");
app.use(express.static(frontendPath));

// SPA fallback
app.get("*", (req, res) => {
  // Excluye rutas API
  if (req.path.startsWith("/login") || req.path.startsWith("/status")) {
    return res.status(404).send("Not found");
  }
  // Todo lo demás sirve index.html
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Puerto
const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
      console.log(`🌐 Frontend servido desde: ${frontendPath}`);
      console.log(`🌐 URL pública: ${FRONTEND_URL}`);
    });
  })
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));
