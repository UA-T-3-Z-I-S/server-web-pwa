import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // npm i uuid

const residenteSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: () => uuidv4() }, // UUIDv4
  nombre: String,
  apellido: String,
  dni: String,
  sexo: String,
  fecha_nacimiento: Date,
  pabellon: String,
  estado: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: "residentes_albergue" });

// Incluir ambos en JSON
residenteSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    ret.id = ret.id || ret._id; // UUIDv4 o _id si no existe
    return ret;
  }
});

const Resident = mongoose.model("Resident", residenteSchema);

export default Resident;
