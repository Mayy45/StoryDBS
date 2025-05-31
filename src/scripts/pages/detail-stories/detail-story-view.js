export default class DetailStoryView {
  constructor() {
    this.app = document.getElementById('main-content');
  }

  renderSkeleton() {
    this.app.innerHTML = `
      <section class="story-detail loading">
        <p>Loading story details...</p>
      </section>
    `;
  }

  renderStory(story) {
    const photoUrl = story.photoUrl || 'placeholder.png'; // fallback jika gambar tidak ada

    this.app.innerHTML = `
      <section class="story-detail">
        <h2 class="story-title">${story.name}</h2>

        <div class="story-image-wrapper">
          <img src="${photoUrl}" alt="Foto ${story.name}" class="story-image" loading="lazy" />
        </div>

        <p class="story-description">${story.description}</p>
        <small class="story-date">
          ${story.createdAt ? new Date(story.createdAt).toLocaleString() : 'Tanggal tidak tersedia'}
        </small>

        <button id="save-offline-btn" class="btn-save-offline">
          Simpan Cerita untuk Offline
        </button>

        <div id="map" class="story-map" style="height: 300px; margin-top: 1rem;"></div>
      </section>
    `;

    if (story.lat && story.lon) {
      const map = L.map('map').setView([story.lat, story.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.marker([story.lat, story.lon]).addTo(map)
        .bindPopup(`<strong>${story.name}</strong><br>${story.description}`).openPopup();
    } else {
      document.getElementById('map').innerHTML = '<p class="no-location">Lokasi tidak tersedia</p>';
    }

    this.saveButton = document.getElementById('save-offline-btn');
  }

  bindSaveOffline(handler, story) {
    if (!this.saveButton) return;
    this.saveButton.addEventListener('click', () => handler(story));
  }

  showError(message) {
    this.app.innerHTML = `
      <section class="error">
        <p style="color: red;">${message}</p>
      </section>
    `;
  }
}
