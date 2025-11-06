import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export async function connectMongoose() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Mongoose conectado a MongoDB");
    } catch (err) {
      console.error("❌ Error conectando Mongoose:", err);
      throw err;
    }
  }
  return mongoose;
}
