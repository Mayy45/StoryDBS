import { openDB } from 'idb';

const DB_NAME = 'story-db';
const STORE_NAME = 'offline-stories';

export default class OfflineStoryModel {
  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  async saveStory(story) {
    const db = await this.dbPromise;

    const photoResponse = await fetch(story.photoUrl);
    const photoBlob = await photoResponse.blob();

    const storyToSave = {
      id: story.id,
      name: story.name,
      description: story.description,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
      photoBlob, 
    };

    return db.put(STORE_NAME, storyToSave);
  }

  async getAllStories() {
    const db = await this.dbPromise;
    const stories = await db.getAll(STORE_NAME);

    // Ubah Blob ke objectURL
    return stories.map((story) => {
      if (story.photoBlob) {
        story.photoUrl = URL.createObjectURL(story.photoBlob);
      }
      return story;
    });
  }

  async deleteStory(id) {
    const db = await this.dbPromise;
    return db.delete(STORE_NAME, id);
  }
}
