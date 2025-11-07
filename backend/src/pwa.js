// backend/src/pwa.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import connectDB from './db.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { userMongoId, subscription } = req.body;
    if (!userMongoId || !subscription) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const db = await connectDB();
    const pwaCollection = db.collection('pwa_dispositivos');
    const usersCollection = db.collection('usuarios'); // tu colección de usuarios

    // Crear registro del PWA
    const userId = uuidv4();
    const pwaDoc = {
      userId,
      userMongoId,
      subscription,
      created_at: new Date(),
    };

    const insertResult = await pwaCollection.insertOne(pwaDoc);
    const pwaId = insertResult.insertedId;

    // Actualizar array pwas en el usuario
    await usersCollection.updateOne(
      { _id: userMongoId },
      { $addToSet: { pwas: pwaId } } // $addToSet evita duplicados
    );

    return res.status(200).json({ success: true, pwaId });
  } catch (err) {
    console.error('Error guardando PWA:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
