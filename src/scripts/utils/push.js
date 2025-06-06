import { urlBase64ToUint8Array } from './helper.js';
import CONFIG from '../config.js';

export const initPush = async () => {
  try {
    // Request izin notifikasi
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Izin notifikasi tidak diberikan.');
      return;
    }

    // Pastikan service worker sudah aktif
    const registration = await navigator.serviceWorker.ready;

    // Cek subscription push yang sudah ada
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      // Jika belum ada, buat langganan baru dengan VAPID key
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

    // Ambil data subscription
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

    // Cek token user untuk otentikasi
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan. Pengguna belum login.');
      return;
    }

    // Cek apakah subscription sudah dikirim ke server sebelumnya
    const sentEndpoint = localStorage.getItem('subscriptionSent');
    if (sentEndpoint === endpoint) {
      console.log('Push subscription sudah dikirim sebelumnya.');
      return;
    }

    // Kirim subscription ke server
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

    // Simpan flag sudah kirim subscription supaya tidak dobel
    localStorage.setItem('subscriptionSent', endpoint);
    console.log('✅ Push subscription berhasil dikirim ke server.');

  } catch (err) {
    console.error('❌ Gagal inisialisasi Push Notification:', err.message || err);
  }
};
