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

    if (!taskName.trim()) return;

    if (isEditing) {
      onUpdateTask(selectedTask.id, taskName);
    } else {
      onAddTask(taskName);
    }

    setTaskName('');
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-input-wrapper">
          <input
            type="text"
            placeholder={isEditing ? "Update task name..." : "Add a new task..."}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
            className="task-input"
          />
          <button type="submit" className={isEditing ? "btn-update" : "btn-add"}>
            {isEditing ? (
              <>
                <span>✓</span> Update
              </>
            ) : (
              <>
                <span>+</span> Add Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;