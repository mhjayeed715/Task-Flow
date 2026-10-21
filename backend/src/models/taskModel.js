const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function getAllTasks(db) {
  return db.prepare(`
    SELECT * FROM tasks
    ORDER BY
      CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
      created_at DESC
  `).all();
}

function getTaskById(db, id) {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function createTask(db, { title, description, priority, due_date }) {
  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `).run(title, description ?? null, priority ?? 'medium', due_date ?? null);
  return getTaskById(db, result.lastInsertRowid);
}

function updateTask(db, id, fields) {
  const allowed = ['title', 'description', 'status', 'priority', 'due_date'];
  const sets = allowed
    .filter(k => k in fields)
    .map(k => `${k} = ?`);
  sets.push('updated_at = CURRENT_TIMESTAMP');
  const values = allowed.filter(k => k in fields).map(k => fields[k]);
  db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`).run(...values, id);
  return getTaskById(db, id);
}

function toggleTaskStatus(db, id) {
  const task = getTaskById(db, id);
  if (!task) return null;
  const next = task.status === 'pending' ? 'completed' : 'pending';
  return updateTask(db, id, { status: next });
}

function deleteTask(db, id) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

export { getAllTasks, getTaskById, createTask, updateTask, toggleTaskStatus, deleteTask };
