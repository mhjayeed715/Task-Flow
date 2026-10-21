import { useState } from 'react';

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

function isOverdue(task) {
  if (!task.due_date || task.status === 'completed') return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.due_date < today;
}

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDue, setEditDue] = useState(task.due_date ?? '');
  const [titleError, setTitleError] = useState('');

  function handleEdit() {
    setEditTitle(task.title);
    setEditDesc(task.description ?? '');
    setEditPriority(task.priority);
    setEditDue(task.due_date ?? '');
    setTitleError('');
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setTitleError('');
  }

  function handleSave() {
    if (!editTitle.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError('');
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDesc,
      priority: editPriority,
      due_date: editDue || null,
    });
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  }

  const overdue = isOverdue(task);
  const cardClass = ['task-card', task.status === 'completed' ? 'completed' : ''].join(' ').trim();

  if (editing) {
    return (
      <div className={cardClass}>
        <div className="edit-form">
          <div className="form-row">
            <label htmlFor={`edit-title-${task.id}`}>Title *</label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            {titleError && <span className="field-error">{titleError}</span>}
          </div>
          <div className="form-row">
            <label htmlFor={`edit-desc-${task.id}`}>Description</label>
            <textarea
              id={`edit-desc-${task.id}`}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-row form-row-inline">
            <div>
              <label htmlFor={`edit-priority-${task.id}`}>Priority</label>
              <select
                id={`edit-priority-${task.id}`}
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor={`edit-due-${task.id}`}>Due Date</label>
              <input
                id={`edit-due-${task.id}`}
                type="date"
                value={editDue}
                onChange={(e) => setEditDue(e.target.value)}
              />
            </div>
          </div>
          <div className="task-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="task-header">
        <input
          type="checkbox"
          id={`toggle-${task.id}`}
          checked={task.status === 'completed'}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.status === 'completed' ? 'pending' : 'completed'}`}
        />
        <span className={`priority-badge priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className="task-title">{task.title}</span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        {task.due_date && (
          <span className={overdue ? 'due-date overdue' : 'due-date'}>
            Due: {task.due_date}
            {overdue && ' (Overdue)'}
          </span>
        )}
        <span className="created-date">Added: {task.created_at.slice(0, 10)}</span>
      </div>
      <div className="task-actions">
        <button className="btn" onClick={handleEdit} id={`edit-btn-${task.id}`}>Edit</button>
        <button className="btn btn-danger" onClick={handleDelete} id={`delete-btn-${task.id}`}>Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;