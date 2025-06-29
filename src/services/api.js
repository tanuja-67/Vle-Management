const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Villager endpoints
  async getVillagers() {
    return this.request('/villagers');
  }

  async createVillager(villagerData) {
    return this.request('/villagers', {
      method: 'POST',
      body: JSON.stringify(villagerData),
    });
  }

  async updateVillagerQuiz(villagerId, quizScore) {
    return this.request(`/villagers/${villagerId}/quiz`, {
      method: 'PATCH',
      body: JSON.stringify({ quizScore }),
    });
  }

  // VLE endpoints
  async getVLEs() {
    return this.request('/vles');
  }

  async getVLECandidates(minScore = 50) {
    return this.request(`/vles/candidates?minScore=${minScore}`);
  }

  async selectVLEs(villagerIds) {
    return this.request('/vles/select', {
      method: 'POST',
      body: JSON.stringify({ villagerIds }),
    });
  }

  async updateVLEStatus(vleId, status) {
    return this.request(`/vles/${vleId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getVLEStats() {
    return this.request('/vles/stats');
  }
}

export default new ApiService();
