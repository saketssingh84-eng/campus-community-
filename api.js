
/*
 * Campus Community Centre
 * Frontend API integration layer
 */

const API_BASE = 'http://localhost:3000/api';

const API = {
  async request(url, options = {}) {
    const token = localStorage.getItem('token');
    const isFormData =
      typeof FormData !== 'undefined' &&
      options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    let response;

    try {
      response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
      });
    } catch {
      throw new Error(
        'Cannot connect to the backend. Check that the server is running on port 3000.'
      );
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        data && typeof data === 'object'
          ? data.message || data.error
          : data;

      if (
        response.status === 401 &&
        token &&
        !url.startsWith('/auth/login') &&
        !url.startsWith('/auth/register')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
      }

      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    return data;
  },

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.token) {
      localStorage.setItem('token', data.token);

      if (data.user) {
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userName', data.user.name);
      }
    }

    return data;
  },

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  async getCurrentUser() {
    const data = await this.request('/auth/me');
    return data.user || data;
  },

  // Announcements
  getAnnouncements(tag = '') {
    const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    return this.request(`/announcements${query}`);
  },

  createAnnouncement(data) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteAnnouncement(id) {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE'
    });
  },

  // Clubs
  getClubs() {
    return this.request('/clubs');
  },

  createClub(data) {
    return this.request('/clubs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteClub(id) {
    return this.request(`/clubs/${id}`, {
      method: 'DELETE'
    });
  },

  // Events
  getEvents() {
    return this.request('/events');
  },

  createEvent(data) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  // Reminders
  getReminders() {
    return this.request('/reminders');
  },

  createReminder(data) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteReminder(id) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE'
    });
  },

  // Schedules
  getSchedules() {
    return this.request('/schedules');
  },

  createSchedule(data) {
    return this.request('/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteSchedule(id) {
    return this.request(`/schedules/${id}`, {
      method: 'DELETE'
    });
  },

  // Resources
  getResources() {
    return this.request('/resources');
  },

  getResource(id) {
    return this.request(`/resources/${id}`);
  },

  downloadResourceUrl(id) {
    return `${API_BASE}/resources/${id}/download`;
  },

  // Discussions
  getCategories() {
    return this.request('/discussions/categories');
  },

  getThreads(categoryId) {
    const query = categoryId
      ? `?category_id=${encodeURIComponent(categoryId)}`
      : '';

    return this.request(`/discussions/threads${query}`);
  },

  getThread(threadId) {
    return this.request(`/discussions/threads/${threadId}`);
  },

  // Backend returns the thread and its posts from the thread endpoint.
  getPosts(threadId) {
    return this.getThread(threadId);
  },

  createThread(data) {
    return this.request('/discussions/threads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  createPost(threadId, data) {
    return this.request(`/discussions/threads/${threadId}/posts`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deletePost(postId) {
    return this.request(`/discussions/posts/${postId}`, {
      method: 'DELETE'
    });
  },

  // Tags
  getTags() {
    return this.request('/tags');
  },

  getItemTags(itemType, itemId) {
    return this.request(`/tags/${itemType}/${itemId}`);
  },

  // Search
  search(query) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  },

  // Pinned items
  getPinnedItems() {
    return this.request('/pinned-items');
  },

  pinItem(data) {
    return this.request('/pinned-items', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  unpinItem(id) {
    return this.request(`/pinned-items/${id}`, {
      method: 'DELETE'
    });
  },

  // Session helpers
  isLoggedIn() {
    return Boolean(localStorage.getItem('token'));
  },

  getRole() {
    return localStorage.getItem('role') || null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  }
};

window.API = API;