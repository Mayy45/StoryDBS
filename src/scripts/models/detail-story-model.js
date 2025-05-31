export default class DetailStoryModel {
    async getStoryById(token, storyId) {
      const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
  
      return result; 
    }
  }
  