import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import TaskForm from './TaskForm';

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
    <div className="task-list">
      <h3>Your Tasks</h3>

      {/* TaskForm component */}
      <TaskForm taskId={selectedTaskId} onTaskUpdated={handleTaskUpdated} />

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
