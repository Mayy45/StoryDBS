export default class HomeView {
  constructor() {
    this.app = document.getElementById('main-content');
    this.map = null;
    this.markers = [];
  }

  renderSkeleton() {
    this.app.innerHTML = '<p>Loading stories...</p>';
  }

  renderStories(stories) {
  if (!stories.length) {
    this.app.innerHTML = '<p>Tidak ada cerita.</p>';
    return;
  }

  this.app.innerHTML = `
    <style>
      .stories {
        font-family: 'Segoe UI', sans-serif;
        padding: 20px;
        max-width: 960px;
        margin: 0 auto;
      }

      .stories h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      }

      #map {
        height: 400px;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .story-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .story-item {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        transition: transform 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .story-item:hover {
        transform: translateY(-4px);
      }

      .story-item h2 {
        margin-top: 0;
        color: #4a90e2;
      }

      .story-item p {
        margin: 8px 0;
        color: #555;
      }

      .story-item small {
        color: #888;
        font-size: 0.85rem;
      }

      .detail-link {
        margin-top: 12px;
        color: #4a90e2;
        text-decoration: none;
        font-weight: 500;
        align-self: flex-start;
      }

      .detail-link:hover {
        text-decoration: underline;
      }
    </style>

    <section class="stories">
      <h1>Stories</h1>
      <div id="map"></div>
      <div class="story-list">
        ${stories
          .map(
            (story) => `
              <article class="story-item">
                <div>
                  <h2>${story.name}</h2>
                  <p>${story.description}</p>
                  <small>${new Date(story.createdAt).toLocaleString()}</small>
                </div>
                <a href="#/story/${story.id}" class="detail-link">Lihat Detail</a>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;

  this._initMap();
  this._addMarkers(stories);
}


  _initMap() {
    if (this.map) {
      this.map.remove(); 
    }

    this.map = L.map('map').setView([-6.9, 109.1], 6); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  _addMarkers(stories) {
    this.markers = [];

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this.map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        this.markers.push(marker);
      }
    });

    
    if (this.markers.length) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.5));
    }
  }

  showError(message) {
    this.app.innerHTML = `<p style="color: red;">${message}</p>`;
  }

  loginPage(){
      window.location.hash = '/login';
  }
}
