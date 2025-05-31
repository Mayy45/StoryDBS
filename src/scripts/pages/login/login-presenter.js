import LoginModel from '../../models/login-model.js';
import LoginView from './login-page.js';

export default class LoginPresenter {
 constructor() {
  this.model = new LoginModel();
  this.view = new LoginView();

  this.view.render(() => {
    this.view.bindSubmit(this.handleLogin.bind(this));
  });
}


  async handleLogin(email, password) {
    try {
      const result = await this.model.login(email, password);
      this.view.showSuccess('Berhasil Login');

      localStorage.setItem('token', result.loginResult.token);

      setTimeout(() => {
       this.view.goToHomePage();
      }, 1500);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
