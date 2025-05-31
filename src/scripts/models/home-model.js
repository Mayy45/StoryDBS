export default class HomeModel {
  async getStories(token) {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.listStory;
  }
}
