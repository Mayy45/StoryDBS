import RegisterModel from '../../models/register-model.js';
import RegisterView from './register-page.js';

export default class RegisterPresenter {
 constructor() {
  this.model = new RegisterModel();
  this.view = new RegisterView();

  this.view.render(() => {
    this.view.bindSubmit(this.handleRegister.bind(this));
  });
}


  async handleRegister(name, email, password) {
  try {
    this.view.showLoading();

    const result = await this.model.register(name, email, password);

    this.view.closeLoading();
    this.view.showSuccess(result.message);

    setTimeout(() => {
     this.view.loginPage();
    }, 1500);
  } catch (error) {
    this.view.closeLoading();
    this.view.showError(error.message);
  }
}


}
