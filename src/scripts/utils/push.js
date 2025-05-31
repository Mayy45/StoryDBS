import { urlBase64ToUint8Array } from './helper.js';
import CONFIG, { vapidPublicKey } from '../config.js';

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
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const subscriptionJson = subscription?.toJSON();
    const p256dh = subscriptionJson?.keys?.p256dh;
    const auth = subscriptionJson?.keys?.auth;
    const endpoint = subscription?.endpoint;

    if (!endpoint || !p256dh || !auth) {
      console.error('Data subscription tidak lengkap.');
      return;
    }

    const subscriptionData = {
      endpoint,
      keys: {
        p256dh,
        auth,
      },
    };

    const yourToken = localStorage.getItem('token');
    if (!yourToken) {
      console.error('Token tidak ditemukan! Pastikan user sudah login dan token tersimpan.');
      return;
    }

    const sentFlag = localStorage.getItem('subscriptionSent');

    if (!sentFlag || sentFlag !== endpoint) {
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`
        },
        body: JSON.stringify(subscriptionData),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.message || 'Gagal mengirim subscription.');
      }

      localStorage.setItem('subscriptionSent', endpoint);
      console.log('Push subscription berhasil dikirim ke server.');
    } else {
      console.log('Push subscription sudah dikirim sebelumnya.');
    }

  } catch (err) {
    console.error('Gagal inisialisasi Push Notification:', err.message || err);
  }
};
