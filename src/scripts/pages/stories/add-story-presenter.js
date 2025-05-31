import AddStoryModel from '../../models/add-story-model.js';
import AddStoryView from './add-story-view.js';

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

      // 🔔 Tampilkan notifikasi lokal jika diizinkan
      if (Notification.permission === 'granted') {
        new Notification('Cerita berhasil ditambahkan!', {
          body: result.message,
          icon: './icons/placeholder.png', // Ganti dengan ikon yang tersedia di proyekmu
        });
      }

      setTimeout(() => {
        window.location.hash = '/';
      }, 1500);
    } catch (error) {
      this.view.showMessage(error.message, true);
    }
  }
}
