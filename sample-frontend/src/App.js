import React, { useEffect, useState } from "react";
import "./App.css";
import { api } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.listTasks();
      // DRF pagination returns { results: [...] }; fall back to a plain array.
      setTasks(Array.isArray(data) ? data : data.results);
      setError(null);
    } catch (err) {
      setError("Could not reach the backend API. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (task) => {
    const created = await api.createTask(task);
    setTasks((prev) => [created, ...prev]);
  };

  const handleToggle = async (task) => {
    const updated = await api.updateTask(task.id, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <header>
        <h1>Demo Task Manager</h1>
        <p>React + Django REST Framework + PostgreSQL</p>
      </header>

      <main>
        <TaskForm onCreate={handleCreate} />

        {loading && <p>Loading tasks...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
