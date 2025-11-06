import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // npm i uuid

const personalSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: () => uuidv4() }, // UUIDv4
  nombre: String,
  apellido: String,
  dni: String,
  telefono: String,
  tipo: String,
  estado: Boolean,
  test: Boolean,
  horario: Array,
  pwas: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: "personal_albergue" });

// Incluir ambos en JSON
personalSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    ret.id = ret.id || ret._id; // UUIDv4 o _id si no existe
    return ret;
  }
});

const Personal = mongoose.model("Personal", personalSchema);

export default Personal;
