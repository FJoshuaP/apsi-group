import React, { useState, useEffect } from 'react';

const TaskForm = ({ selectedTask, onAddTask, onUpdateTask }) => {
  const [taskName, setTaskName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setIsEditing(true);
      setTaskName(selectedTask.name);
    } else {
      setIsEditing(false);
      setTaskName('');
    }
  }, [selectedTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName.trim()) return; // Don't submit empty tasks

    if (isEditing) {
      onUpdateTask(selectedTask.id, taskName);
    } else {
      onAddTask(taskName);
    }

    setTaskName('');
  };

  return (
    <div className="task-form">
      <h3>{isEditing ? 'Edit Task' : 'Add Task'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
