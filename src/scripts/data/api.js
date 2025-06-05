import CONFIG from '../config';

const API_ENDPOINT = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

function getToken() {
  return localStorage.getItem('token');
}

export async function getStories() {
  try {
    const response = await fetch(API_ENDPOINT.STORIES, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data cerita');
    }

    return await response.json();
  } catch (error) {
    console.error('Gagal mengambil data cerita:', error);
    return { listStory: [] };
  }
}

export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat && lon) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  try {
    const response = await fetch(API_ENDPOINT.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Gagal menambahkan cerita');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Gagal menambahkan cerita:', error);
    return null; 
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.error && result.loginResult?.token) {
      localStorage.setItem('token', result.loginResult.token);
    }

    return result;
  } catch (error) {
    console.error('Login gagal:', error);
    return { error: true, message: 'Login gagal' };
  }
}

export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registrasi gagal');
    }

    return await response.json();
  } catch (error) {
    console.error('Registrasi gagal:', error);
    return { error: true, message: 'Registrasi gagal' };
  }
}
