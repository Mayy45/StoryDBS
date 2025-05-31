import CONFIG from '../config';

export const unsubscribePush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    const token = localStorage.getItem('token');

    if (!subscription) {
      console.warn('Tidak ada subscription aktif.');
      return;
    }

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    if (response.ok) {
      console.log('Berhasil unsubscribe dari push notification.');
      await subscription.unsubscribe();
      localStorage.removeItem('subscriptionSent');
    } else {
      console.error('Gagal unsubscribe:', await response.text());
    }
  } catch (err) {
    console.error('Error saat unsubscribe:', err);
  }
};
