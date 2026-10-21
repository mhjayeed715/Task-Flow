import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from './services/taskService.js';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(payload) {
    try {
      const task = await createTask(payload);
      setTasks((prev) => [task, ...prev].sort(byPriorityThenDate));
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      const task = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const task = await updateTask(id, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? task : t)).sort(byPriorityThenDate)
      );
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Task-Flow</h1>
        <p className="subtitle">Your simple personal task manager</p>
      </header>
      {serverError && <div className="error-banner" role="alert">{serverError}</div>}
      <TaskForm onAdd={handleAdd} />
      <FilterBar active={filter} onChange={setFilter} />
      <TaskList
        tasks={tasks}
        loading={loading}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function byPriorityThenDate(a, b) {
  const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  if (p !== 0) return p;
  return b.created_at.localeCompare(a.created_at);
}

export default App;
