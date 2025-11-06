import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./backend/src/db.js";
import loginRouter from "./backend/routes/login.js";

const app = express();
const PORT = process.env.PORT || 3001;
const isRender = !!process.env.PORT;
const FRONTEND_URL = isRender
  ? "https://server-web-pwa.onrender.com"
  : `http://localhost:${PORT}`;

// CORS
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// Healthcheck
app.get("/status", (req,res) => res.json({status:"ok",time:Date.now()}));

// Login API
app.use("/login", loginRouter);

// Carpeta frontend
const frontendPath = path.join(process.cwd(),"frontend");
console.log("🚀 process.cwd():", process.cwd());
console.log("🌐 Frontend path:", frontendPath);

// Servir archivos estáticos
app.use(express.static(frontendPath));

// === Rutas “limpias” sin .html ===
// "/" → index.html
app.get("/", (req,res) => res.sendFile(path.join(frontendPath,"index.html")));

// "/dashboard" → dashboard.html
app.get("/dashboard", (req,res) => res.sendFile(path.join(frontendPath,"dashboard.html")));

// Todo lo demás → 404
app.get("*", (req,res) => res.status(404).send("Not found"));

// Conectar DB y arrancar servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
      console.log(`🌐 Frontend servido desde: ${frontendPath}`);
      console.log(`🌐 URL pública: ${FRONTEND_URL}`);
    });
  })
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));
