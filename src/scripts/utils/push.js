import { urlBase64ToUint8Array } from './helper.js';
import CONFIG from '../config.js';

export const initPush = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Izin notifikasi tidak diberikan.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const applicationServerKey = urlBase64ToUint8Array(CONFIG.vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    if (!subscription) {
      console.error('Langganan Push gagal.');
      return;
    }

    const subscriptionJson = subscription.toJSON();
    const { endpoint, keys } = subscriptionJson;
    const { p256dh, auth } = keys || {};

    if (!endpoint || !p256dh || !auth) {
      console.error('Data subscription tidak lengkap.');
      return;
    }

    const subscriptionData = {
      endpoint,
      keys: { p256dh, auth },
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan. Pengguna belum login.');
      return;
    }

    const sentEndpoint = localStorage.getItem('subscriptionSent');
    if (sentEndpoint === endpoint) {
      console.log('Push subscription sudah dikirim sebelumnya.');
      return;
    }

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscriptionData),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.message || 'Gagal mengirim subscription.');
    }

    localStorage.setItem('subscriptionSent', endpoint);
    console.log('✅ Push subscription berhasil dikirim ke server.');

  } catch (err) {
    console.error('❌ Gagal inisialisasi Push Notification:', err.message || err);
  }
};
