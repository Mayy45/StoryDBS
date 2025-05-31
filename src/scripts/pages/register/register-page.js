import Swal from "sweetalert2";

export default class RegisterView {
  constructor() {
    this.app = document.getElementById('main-content');
    this.form = null;
  }

  render(onRenderedCallback = () => {}) {
    const renderContent = () => {
      this.app.innerHTML = `
        <style>
          .register {
            max-width: 400px;
            margin: 80px auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', sans-serif;
          }

          .register h1 {
            text-align: center;
            margin-bottom: 24px;
            color: #333;
          }

          .register input {
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: border 0.3s;
          }

          .register input:focus {
            border-color: #4a90e2;
            outline: none;
          }

          .register button {
            width: 100%;
            padding: 12px 16px;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .register button:hover {
            background-color: #357ABD;
          }

          #registerError {
            margin-top: 16px;
            text-align: center;
            font-weight: bold;
          }

          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: fade-in 500ms ease-in-out;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>

        <section class="register">
          <h1>Register</h1>
          <form id="registerForm">
            <input type="text" id="name" name="name" placeholder="Name" required />
            <input type="email" id="email" name="email" placeholder="Email" required />
            <input type="password" id="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
          <p id="registerError" style="color: red;"></p>
        </section>
      `;

      this.form = this.app.querySelector('#registerForm');
      onRenderedCallback(); 
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => renderContent());
    } else {
      renderContent();
    }
  }


bindSubmit(handler) {
  this.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = this.form.name.value;
    const email = this.form.email.value;
    const password = this.form.password.value;

    if (!name || !email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Form tidak lengkap',
        text: 'Mohon isi semua field.'
      });
      return;
    }

    handler(name, email, password);
  });
}

showLoading() {
  Swal.fire({
    title: 'Saving...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });
}

closeLoading() {
  Swal.close();
}

showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Saved!',
    text: message,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  });
}

showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message
  });
}

loginPage() {
   window.location.hash = '/login';
}

}
