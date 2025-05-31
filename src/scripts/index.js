import '../styles/styles.css';
import App from './pages/app';
import { getActiveRoute } from './routes/url-parser';
import routes from './routes/routes';
import Swal from 'sweetalert2';
import { initPush } from './utils/push';
import { unsubscribePush } from './utils/unsubscribe';

let currentPresenter = null;

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});


const updateNavigationMenu = () => {
  const isUserLoggedIn = !!localStorage.getItem('token');

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  if (loginLink && registerLink && logoutLink) {
    loginLink.style.display = isUserLoggedIn ? 'none' : 'block';
    registerLink.style.display = isUserLoggedIn ? 'none' : 'block';
    logoutLink.style.display = isUserLoggedIn ? 'block' : 'none';

    // Hapus dulu listener lama agar tidak bertumpuk
    logoutLink.replaceWith(logoutLink.cloneNode(true));
    const newLogoutLink = document.getElementById('logout-link');

    newLogoutLink.addEventListener('click', async () => {
      const result = await Swal.fire({
        title: 'Yakin ingin logout?',
        text: 'Anda akan keluar dari akun saat ini.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, logout',
        cancelButtonText: 'Batal',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: 'Melakukan logout...',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        localStorage.removeItem('token');
        updateNavigationMenu();

        Swal.fire({
          title: 'Berhasil logout!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.reload();
        });

        window.location.hash = '/';
      }
    });
  }
};


document.addEventListener('DOMContentLoaded', async () => {
  
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }


  const subscribeBtn = document.getElementById('btn-subscribe');
  const unsubscribeBtn = document.getElementById('btn-unsubscribe');

  if (subscribeBtn && unsubscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda belum login. Silakan login terlebih dahulu untuk mengaktifkan notifikasi.');
        return;
      }

      try {
        await initPush();
        alert('Berhasil subscribe notifikasi!');
      } catch (error) {
        console.error('Gagal subscribe:', error);
        alert('Gagal subscribe notifikasi. Cek console untuk detail.');
      }
    });

    unsubscribeBtn.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda belum login. Silakan login terlebih dahulu untuk menghapus notifikasi.');
        return;
      }

      try {
        await unsubscribePush();
        alert('Berhasil unsubscribe notifikasi!');
      } catch (error) {
        console.error('Gagal unsubscribe:', error);
        alert('Gagal unsubscribe notifikasi. Cek console untuk detail.');
      }
    });
  }

  renderPage();
  window.addEventListener('hashchange', renderPage);
});


const renderPage = async () => {
  const activeRoute = getActiveRoute(window.location.hash);
  const PresenterClass = routes[activeRoute] || routes['/'];

  if (currentPresenter && typeof currentPresenter.destroy === 'function') {
    currentPresenter.destroy();
  }

  const mainContent = document.querySelector('.main-content');
  mainContent.classList.remove('visible');

  currentPresenter = await app.renderPage(PresenterClass);

  mainContent.classList.add('visible');

  updateNavigationMenu();
};

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      console.log('✅ Service Worker terdaftar:', reg);

      if (Notification.permission === 'granted') {
        await initPush();
      }
    } catch (err) {
      console.error('❌ Registrasi Service Worker gagal:', err);
    }
  });
}


