import React from "react";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? "completed" : ""}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task)}
            />
            <span className="task-title">{task.title}</span>
          </label>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <button onClick={() => onDelete(task.id)} aria-label="Delete task">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
