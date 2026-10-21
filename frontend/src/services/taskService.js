const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Server error');
  return body.data;
}

export const getTasks = () => request('/api/tasks');

export const createTask = (payload) =>
  request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });

export const updateTask = (id, payload) =>
  request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const toggleTask = (id) =>
  request(`/api/tasks/${id}/toggle`, { method: 'PATCH' });

export const deleteTask = (id) =>
  request(`/api/tasks/${id}`, { method: 'DELETE' });
