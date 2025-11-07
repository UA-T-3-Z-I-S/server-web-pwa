// frontend/js/pwa_register.js
import { urlBase64ToUint8Array } from './utils.js';

export async function registerPush(userMongoId, userId) {
  try {
    console.log('🟢 Iniciando registro PWA para usuario:', userMongoId);

    if (!('serviceWorker' in navigator)) {
      console.warn('❌ Service Worker no soportado');
      return;
    }

    // Registrar Service Worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker registrado:', registration);

    // Obtener la VAPID key del backend
    const res = await fetch('/key');
    if (!res.ok) throw new Error('No se pudo obtener la VAPID key');
    const { publicKey } = await res.json();
    console.log('🟢 PublicKey obtenida:', publicKey);

    // Subscribirse a notificaciones push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    console.log('🟢 Suscripción creada:', subscription);

    // Enviar suscripción al backend
    const subscribeRes = await fetch('/pwa/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMongoId, userId, subscription })
    });
    const subscribeResult = await subscribeRes.json();
    console.log('🟢 Respuesta backend /pwa/subscribe:', subscribeResult);

  } catch (err) {
    console.error('❌ Error en registerPush:', err);
  }
}
