import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./backend/src/db.js";        // MongoClient (si lo sigues usando)
import { connectMongoose } from "./backend/src/mongoose.js"; // Mongoose para modelos
import loginRouter from "./backend/routes/login.js";
import usersRouter from "./backend/routes/users.js";

const app = express();
const PORT = process.env.PORT || 3001;
const isRender = !!process.env.PORT;
const FRONTEND_URL = isRender
  ? "https://server-web-pwa.onrender.com"
  : `http://localhost:${PORT}`;

// =====================
// MIDDLEWARES
// =====================
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// =====================
// HEALTHCHECK
// =====================
app.get("/status", (req,res) => res.json({status:"ok",time:Date.now()}));

// =====================
// API ROUTES
// =====================
app.use("/login", loginRouter);
app.use("/users", usersRouter);

// =====================
// FRONTEND
// =====================
const frontendPath = path.join(process.cwd(),"frontend");
console.log("🚀 process.cwd():", process.cwd());
console.log("🌐 Frontend path:", frontendPath);
app.use(express.static(frontendPath));

// Rutas “limpias” sin .html
app.get("/", (req,res) => res.sendFile(path.join(frontendPath,"index.html")));
app.get("/dashboard", (req,res) => res.sendFile(path.join(frontendPath,"dashboard.html")));

// Todo lo demás → 404
app.get("*", (req,res) => res.status(404).send("Not found"));

// =====================
// INICIALIZACIÓN DE BASES
// =====================
(async () => {
  try {
    // Conectar MongoClient si lo necesitas para consultas directas
    await connectDB();

    // Conectar Mongoose para usar modelos
    await connectMongoose();

    // Arrancar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
      console.log(`🌐 Frontend servido desde: ${frontendPath}`);
      console.log(`🌐 URL pública: ${FRONTEND_URL}`);
    });

  } catch (err) {
    console.error("❌ Error inicializando servidor:", err);
  }
})();
