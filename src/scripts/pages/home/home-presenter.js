import HomeModel from '../../models/home-model.js';
import HomeView from './home-page.js';

export default class HomePresenter {
  constructor() {
    this.model = new HomeModel();
    this.view = new HomeView();

    this.view.renderSkeleton();
    this.loadStories();
  }

  async loadStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.view.showError('Anda harus login terlebih dahulu.');
        this.view.loginPage();
        return;
      }

      const stories = await this.model.getStories(token);
      this.view.renderStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
