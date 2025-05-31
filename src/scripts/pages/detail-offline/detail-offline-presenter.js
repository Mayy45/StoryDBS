import OfflineStoryModel from '../../models/detail-offline-model.js';
import OfflineStoryView from './detail-offline.js';

export default class OfflineStoryPresenter {
  constructor() {
    this.model = new OfflineStoryModel();
    this.view = new OfflineStoryView();

    // Bind handler supaya context this presenter tetap benar
    this.handleDeleteStory = this.handleDeleteStory.bind(this);
  }

  async init() {
    try {
      const stories = await this.model.getAllStories();
      this.view.render(stories);

      // Pasang event listener hapus di view
      this.view.bindDeleteStory(this.handleDeleteStory);
    } catch (error) {
      console.error('Gagal load offline stories:', error);
      this.view.render([]);
    }
  }

  async handleDeleteStory(id) {
    try {
      await this.model.deleteStory(id);
      // Reload daftar cerita setelah hapus
      await this.init();
    } catch (error) {
      console.error('Gagal hapus cerita offline:', error);
    }
  }

  async saveStory(story) {
    try {
      await this.model.saveStory(story);
      await this.init();
    } catch (error) {
      console.error('Gagal simpan cerita offline:', error);
    }
  }
}
