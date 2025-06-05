import AddStoryModel from '../../models/add-story-model.js';
import AddStoryView from './add-story-view.js';
import CONFIG from '../../config.js';

export default class AddStoryPresenter {
  constructor() {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      window.location.hash = '/login';
      return;
    }

    this.model = new AddStoryModel();
    this.view = new AddStoryView();

    this.view.render();
    this.view.bindSubmit(this.handleSubmit.bind(this));
  }

  destroy() {
    if (this.view && typeof this.view.destroy === 'function') {
      this.view.destroy();
    }
  }

  async handleSubmit(description, photo, lat, lon) {
    try {
      const result = await this.model.addStory({
        token: this.token,
        description,
        photo,
        lat,
        lon,
      });

      this.view.showMessage(result.message);

      await this.sendPushNotification(description);

      setTimeout(() => {
        window.location.hash = '/';
      }, 1500);
    } catch (error) {
      this.view.showMessage(error.message, true);
    }
  }

  async sendPushNotification(description) {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;

    const payload = {
      title: 'Story berhasil dibuat',
      options: {
        body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: { url: '/' },
      }
    };

    await fetch(`${CONFIG.NOTIF_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        title: payload.title,
        description,
      }),
    });
  } catch (err) {
    console.error('❌ Gagal kirim notifikasi:', err);
  }
}
}
