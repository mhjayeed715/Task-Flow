function isValidDate(val) {
  return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
}

function validateTask(req, res, next) {
  const { title, description, status, priority, due_date } = req.body;
  const isPost = req.method === 'POST';

  if (isPost && (title === undefined || title === null)) {
    return res.status(400).json({ error: 'title is required' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    if (title.trim().length > 255) {
      return res.status(400).json({ error: 'title must be 255 characters or fewer' });
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'description must be a string' });
  }

  if (status !== undefined && !['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'status must be pending or completed' });
  }

  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium or high' });
  }

  if (due_date !== undefined && due_date !== null && due_date !== '' && !isValidDate(due_date)) {
    return res.status(400).json({ error: 'due_date must be a valid YYYY-MM-DD date' });
  }

  if (title !== undefined) {
    req.body.title = title.trim();
  }

  next();
}

export default validateTask;
