import express from 'express';
import cors from 'cors';
import createDb from './db.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, malformedJson, serverError } from './middleware/errorHandlers.js';

function buildApp(dbPath) {
  const db = createDb(dbPath);
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());
  app.use(malformedJson);
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Task-Flow REST API is live',
      endpoints: {
        tasks: '/api/tasks'
      }
    });
  });
  app.use('/api/tasks', taskRoutes(db));
  app.use(notFound);
  app.use(serverError);

  return app;
}

export default buildApp;
