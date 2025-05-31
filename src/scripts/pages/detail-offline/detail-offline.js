// src/views/OfflineStoryView.js
export default class OfflineStoryView {
  constructor() {
    this.container = document.getElementById('main-content');
  }

  render(stories) {
    if (!this.container) return;

    if (!stories || stories.length === 0) {
      this.container.innerHTML = '<p>Tidak ada cerita offline.</p>';
      return;
    }

    this.container.innerHTML = `
      <section class="offline-stories">
        <h2>Daftar Cerita Offline</h2>
        <div class="stories-grid">
          ${stories.map(story => `
            <article class="story-card" data-id="${story.id}">
              <img 
                src="${story.photoUrl || 'icons/placeholder.png'}" 
                alt="Foto ${story.name}" 
                class="story-image" 
                onerror="this.src='icons/placeholder.png';"
              />
              <div class="story-content">
                <h3 class="story-title">${story.name}</h3>
                <p class="story-description">${story.description}</p>
                <button class="delete-btn" data-id="${story.id}">Hapus</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    // Tambahkan CSS (bisa pakai Tailwind atau buat sendiri, contoh manual di bawah)
  }

  bindDeleteStory(handler) {
    if (!this.container) return;

    const deleteButtons = this.container.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        if (id) handler(id);
      });
    });
  }
}
