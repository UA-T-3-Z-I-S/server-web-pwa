import express from 'express';
import { ObjectId } from 'mongodb';
import connectDB from './db.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  console.log('📩 /pwa/subscribe llamado', req.body);

  try {
    const { userMongoId, userId, subscription } = req.body;

    if (!userMongoId || !userId || !subscription) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const db = await connectDB();
    const pwaCollection = db.collection('pwa_dispositivos');
    const personalCollection = db.collection('personal_albergue');

    // Upsert en pwa_dispositivos
    const result = await pwaCollection.updateOne(
      { userMongoId },
      { $set: { subscription, created_at: new Date(), userId } },
      { upsert: true }
    );

    // Obtener _id del PWA
    const pwaDoc = await pwaCollection.findOne({ userMongoId });
    const pwaId = pwaDoc._id;

    // Actualizar personal_albergue agregando el PWA
    // Convertimos userMongoId a ObjectId si _id es ObjectId
    await personalCollection.updateOne(
      { _id: new ObjectId(userMongoId) }, // O ajusta al campo que corresponda
      { $addToSet: { pwas: pwaId } }
    );

    console.log(`🟢 PWA registrado/actualizado: ${pwaId} para usuario ${userMongoId}`);
    return res.status(200).json({ success: true, pwaId });

  } catch (err) {
    console.error('❌ Error guardando PWA:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
