import { parseActivePathname } from '../../routes/url-parser.js';
import OfflineStoryModel from '../../models/detail-offline-model.js';
import DetailStoryModel from '../../models/detail-story-model.js'
import DetailStoryView from '../detail-stories/detail-story-view.js'


export default class DetailStoryPresenter {
  constructor() {
    this.model = new DetailStoryModel();
    this.view = new DetailStoryView();
    this.offlineModel = new OfflineStoryModel();

    this.view.renderSkeleton();
    this.loadStory();
  }

  async loadStory() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.view.showError('Anda harus login untuk melihat cerita detail.');
        window.location.hash = '/login';
        return;
      }

      const { id } = parseActivePathname();
      if (!id) {
        this.view.showError('ID cerita tidak ditemukan.');
        return;
      }

      const storyResponse = await this.model.getStoryById(token, id);
      const story = storyResponse.story;

      this.view.renderStory(story);

      // Bind tombol simpan offline setelah render selesai
      this.view.bindSaveOffline(this.handleSaveOffline.bind(this), story);

    } catch (error) {
      this.view.showError(error.message || 'Gagal memuat cerita.');
    }
  }

  async handleSaveOffline(story) {
    try {
      await this.offlineModel.saveStory({
        id: story.id,
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
      });

      alert('Cerita berhasil disimpan untuk offline.');
    } catch (error) {
      console.error('Save offline failed:', error);
      alert('Gagal menyimpan cerita offline: ' + error.message);
    }
  }
}
