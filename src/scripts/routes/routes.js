import HomePresenter from '../pages/home/home-presenter.js';
import DetailStoryPresenter from '../pages/detail-stories/detail-story-presenter.js';
import AddStoryPresenter from '../pages/stories/add-story-presenter.js';
import LoginPresenter from '../pages/login/login-presenter.js';
import RegisterPresenter from '../pages/register/register-presenter.js';
import DetailOfflinePresenter from '../pages/detail-offline/detail-offline-presenter.js';

const routes = {
  '/': HomePresenter,
  '/story/:id': DetailStoryPresenter,
  '/add': AddStoryPresenter,
  '/login': LoginPresenter,
  '/register': RegisterPresenter,
  '/cerita': DetailOfflinePresenter
};

export default routes;
