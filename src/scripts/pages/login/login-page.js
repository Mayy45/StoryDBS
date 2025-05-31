import Swal from "sweetalert2";


export default class LoginView {
  constructor() {
    this.app = document.getElementById('main-content');
    this.form = null;
  }

  async render(onRenderedCallback = () => {}) {
    // Pastikan SweetAlert ditutup dulu jika masih aktif
    if (Swal.isVisible()) {
      await Swal.close();
      await new Promise(resolve => setTimeout(resolve, 250)); // Tambah delay sedikit
    }

    const renderContent = () => {
      this.app.innerHTML = `
        <style>
          label {
            padding: 2px;
            margin-bottom: 5px;
          } 
          .login {
            max-width: 400px;
            margin: 80px auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', sans-serif;
            view-transition-name: login-container;
          }
          .login h1 {
            text-align: center;
            margin-bottom: 24px;
            color: #333;
          }
          .login input[type="email"],
          .login input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: border 0.3s;
          }
          .login input:focus {
            border-color: #4a90e2;
            outline: none;
          }
          .login button {
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
          .login button:hover {
            background-color: #357ABD;
          }
          #loginError {
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

        <section class="login">
          <h1>Welcome Back</h1>
          <form id="loginForm">
            <label>Email<label/>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />
            <label>Password<label/>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />
            <button type="submit">Login</button>
          </form>
          <p id="loginError"></p>
        </section>
      `;

      this.form = this.app.querySelector('#loginForm');
      onRenderedCallback();
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        renderContent();
      });
    } else {
      renderContent();
    }
  }

  bindSubmit(handler) {
    if (!this.form) {
      console.error("Form is not yet available. Call bindSubmit after render.");
      return;
    }

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = this.form.email.value;
      const password = this.form.password.value;

      Swal.fire({
        title: 'Logging in...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await handler(email, password);
        Swal.close();

          Swal.fire({
        title: 'Login Sukses',
        icon: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        timer: 1500 
      }).then(() => {
          window.location.reload();
      });
      } catch (error) {
        Swal.close();
        this.showError(error.message || 'Terjadi kesalahan saat login.');
      }
    });
  }

  showError(message) {
    const errorElem = this.app.querySelector('#loginError');
    if (errorElem) {
      errorElem.style.color = 'red';
      errorElem.textContent = message;
    }
  }

  showSuccess(message) {
    const errorElem = this.app.querySelector('#loginError');
    if (errorElem) {
      errorElem.style.color = 'green';
      errorElem.textContent = message;
    }
  }

  goToHomePage() {
    window.location.hash = "/";
  }
}
