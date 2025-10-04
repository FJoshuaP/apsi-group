import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import TaskForm from './origTaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch all tasks from the tasks table
  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');  // Fetch all tasks from Supabase

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      console.log('Fetched tasks:', data); // Log fetched tasks to the console
      setTasks(data); // Set tasks in state
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Error deleting task:', error.message);
    } else {
      fetchTasks(); // Refresh tasks after deleting
    }
  };

  // Effect hook to fetch tasks when component is mounted
  useEffect(() => {
    fetchTasks();  // Fetch all tasks when the component mounts
  }, []);

  // After a task is created or updated, refresh the tasks list
  const handleTaskUpdated = () => {
    fetchTasks();  // Refresh tasks after add/edit
    setSelectedTaskId(null);  // Deselect task after update
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>My Tasks</h2>
        <p className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
      </div>

      {/* TaskForm component */}
      <TaskForm taskId={selectedTaskId} onTaskUpdated={handleTaskUpdated} />

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
