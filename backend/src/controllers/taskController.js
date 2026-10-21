import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from '../models/taskModel.js';

function isPositiveInt(val) {
  return /^\d+$/.test(val) && parseInt(val, 10) > 0;
}

function listTasks(db) {
  return (req, res) => {
    res.json({ data: getAllTasks(db) });
  };
}

function addTask(db) {
  return (req, res) => {
    const task = createTask(db, req.body);
    res.status(201).json({ data: task });
  };
}

function editTask(db) {
  return (req, res) => {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }
    const id = parseInt(req.params.id, 10);
    const task = getTaskById(db, id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const updated = updateTask(db, id, req.body);
    res.json({ data: updated });
  };
}

function toggleTask(db) {
  return (req, res) => {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }
    const id = parseInt(req.params.id, 10);
    const task = toggleTaskStatus(db, id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  };
}

function removeTask(db) {
  return (req, res) => {
    if (!isPositiveInt(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }
    const id = parseInt(req.params.id, 10);
    const task = getTaskById(db, id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    deleteTask(db, id);
    res.json({ data: { id } });
  };
}

export { listTasks, addTask, editTask, toggleTask, removeTask };
