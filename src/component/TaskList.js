import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [nextId, setNextId] = useState(1); // Counter for generating unique IDs

  // Add a new task
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

  // Update an existing task
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

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  // Get the selected task for editing
  const getSelectedTask = () => {
    return tasks.find(task => task.id === selectedTaskId);
  };

  return (
    <div className="task-list">
      <h3>Your Tasks</h3>

      {/* TaskForm component */}
      <TaskForm 
        selectedTask={getSelectedTask()}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
      />

      {/* Render the list of tasks */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              <span>{task.name}</span>
              <button onClick={() => setSelectedTaskId(task.id)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No tasks available</li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
