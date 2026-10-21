import TaskItem from './TaskItem.jsx';

function TaskList({ tasks, loading, filter, onToggle, onDelete, onUpdate }) {
  if (loading) return <p className="status-msg">Loading...</p>;

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  if (filtered.length === 0) {
    return <p className="status-msg">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {filtered.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;
