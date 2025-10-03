import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [nextId, setNextId] = useState(1);

  const handleAddTask = (taskName) => {
    const newTask = {
      id: nextId,
      name: taskName,
      created_at: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNextId(prevId => prevId + 1);
    setSelectedTaskId(null);
  };

  const handleUpdateTask = (taskId, taskName) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, name: taskName, updated_at: new Date().toISOString() }
          : task
      )
    );
    setSelectedTaskId(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const getSelectedTask = () => {
    return tasks.find(task => task.id === selectedTaskId);
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>My Tasks</h2>
        <p className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
      </div>

      <TaskForm 
        selectedTask={getSelectedTask()}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
      />

      <div className="tasks-wrapper">
        {tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className={`task-item ${selectedTaskId === task.id ? 'editing' : ''}`}
              >
                <div className="task-content">
                  <div className="task-check"></div>
                  <span className="task-name">{task.name}</span>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => setSelectedTaskId(task.id)}
                    className="btn-icon btn-edit"
                    title="Edit task"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-icon btn-delete"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Add your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;