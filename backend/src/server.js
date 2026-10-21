import 'dotenv/config';
import buildApp from './app.js';

const port = process.env.PORT ?? 4000;
const dbPath = process.env.DB_PATH ?? './data/tasks.db';

const app = buildApp(dbPath);

app.listen(port, () => {
  console.log(`Task-Flow backend listening on port ${port}`);
});
