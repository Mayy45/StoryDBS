import Swal from "sweetalert2";

export default class AddStoryView {
  constructor() {
    this.app = document.getElementById('main-content');
    this.form = null;
    this.map = null;
    this.marker = null;
    this.coords = { lat: null, lon: null };
    this.videoStream = null;
  }

 render() {
  this.app.innerHTML = `
    <section class="add-story" style="max-width: 600px; margin: auto; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
      <h1 style="text-align: center; margin-bottom: 1rem;">Tambah Cerita</h1>
      <form id="addStoryForm" style="display: flex; flex-direction: column; gap: 1rem;">
        
        <textarea id="description" placeholder="Deskripsi cerita" required 
          style="padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; resize: vertical; min-height: 100px;"></textarea>

        <div style="text-align: center;">
          <video id="video" autoplay playsinline width="300" height="225" 
            style="border:1px solid #ccc; border-radius: 4px;"></video><br />
          <button type="button" id="captureBtn" 
            style="margin-top: 0.5rem; padding: 0.5rem 1rem; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer;">Ambil Gambar</button>
          <canvas id="canvas" width="300" height="225" style="display: none; margin-top: 0.5rem; border-radius: 4px;"></canvas>
        </div>

        <div id="map" style="height: 300px; border: 1px solid #ccc; border-radius: 6px;"></div>
        <p style="text-align: center;">Latitude: <span id="lat">-</span>, Longitude: <span id="lon">-</span></p>

        <button type="submit" 
          style="padding: 0.75rem; background-color: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">Kirim Cerita</button>
      </form>
      <p id="addStoryMessage" style="text-align: center; margin-top: 1rem;"></p>
    </section>
  `;

  this.form = this.app.querySelector('#addStoryForm');
  this._initMap();
  this._initCamera();
}


  async _initCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.videoStream;

      captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
      
        video.pause();
      });
    } catch (err) {
      console.error('Kamera tidak tersedia atau izin ditolak:', err);
      video.outerHTML = '<p style="color:red;">Tidak dapat mengakses kamera.</p>';
    }
  }

  _initMap() {
    this.map = L.map('map').setView([-6.9915, 109.1358], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.coords.lat = lat;
      this.coords.lon = lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      document.getElementById('lat').textContent = lat.toFixed(5);
      document.getElementById('lon').textContent = lng.toFixed(5);
    });
  }

  bindSubmit(handler) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = this.form.description.value;
      const canvas = document.getElementById('canvas');
      let photoBlob;

      if (canvas && canvas.style.display === 'block') {
        photoBlob = await new Promise((resolve) =>
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg')
        );
      }

      const { lat, lon } = this.coords;

      handler(description, photoBlob, lat, lon);
    });
  }

showMessage(message, isError = false) {
  Swal.fire({
    title: isError ? 'Gagal!' : 'Berhasil!',
    text: message,
    icon: isError ? 'error' : 'success',
    confirmButtonText: 'OK',
    timer: 2000,
    timerProgressBar: true,
  });
}

  destroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  goTohome() {
    window.location.hash = '/';
  }
}
