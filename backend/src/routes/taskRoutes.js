import { Router } from 'express';
import validateTask from '../middleware/validateTask.js';
import {
  listTasks,
  addTask,
  editTask,
  toggleTask,
  removeTask,
} from '../controllers/taskController.js';

function taskRoutes(db) {
  const router = Router();
  router.get('/', listTasks(db));
  router.post('/', validateTask, addTask(db));
  router.put('/:id', validateTask, editTask(db));
  router.patch('/:id/toggle', toggleTask(db));
  router.delete('/:id', removeTask(db));
  return router;
}

export default taskRoutes;
