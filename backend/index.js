import express from "express";
import cors from "cors";
import connectDB from "./src/db.js";
import loginRouter from "./routes/login.js";

const app = express();

// Detecta si estamos corriendo en local o en Render
const FRONTEND_URL = process.env.PORT ? "https://server-web-pwa.onrender.com" : "http://localhost:3000";

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

// Rutas
app.use("/login", loginRouter);

// Puerto dinámico
const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
      console.log(`🌐 URL: ${FRONTEND_URL}`);
    });
  })
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));
