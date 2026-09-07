// Centralized API client for the demo backend.
//
// In production, Nginx is expected to reverse-proxy "/api/" to Gunicorn on
// the same domain, so REACT_APP_API_BASE_URL can simply be left unset and
// this will fall back to a same-origin relative path ("/api").
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  listTasks: () => request("/tasks/"),
  createTask: (task) =>
    request("/tasks/", { method: "POST", body: JSON.stringify(task) }),
  updateTask: (id, task) =>
    request(`/tasks/${id}/`, { method: "PATCH", body: JSON.stringify(task) }),
  deleteTask: (id) => request(`/tasks/${id}/`, { method: "DELETE" }),
};
