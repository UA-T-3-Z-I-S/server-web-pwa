// backend/routes/users.js
import express from "express";
import Personal from "../models/personal_albergue.js";
import Resident from "../models/residentes_albergue.js";

const router = express.Router();

// GET /users
router.get("/", async (req, res) => {
  try {
    const personal = await Personal.find({ estado: true }).select("nombre apellido id _id");
    const residentes = await Resident.find({ estado: true }).select("nombre apellido id _id");
    res.json({ personal, residentes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// GET /users/personal
router.get("/personal", async (req, res) => {
  try {
    const personal = await Personal.find({ estado: true }).select("nombre apellido id _id");
    res.json(personal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener personal" });
  }
});

// GET /users/residentes
router.get("/residentes", async (req, res) => {
  try {
    const residentes = await Resident.find({ estado: true }).select("nombre apellido id _id");
    res.json(residentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener residentes" });
  }
});

export default router;
