import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const TaskForm = ({ taskId, onTaskUpdated }) => {
  const [taskName, setTaskName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (taskId) {
      setIsEditing(true);
      // Fetch the task data when editing an existing task
      const fetchTask = async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', taskId)
          .single();
        if (data) {
          setTaskName(data.name);
        }
        if (error) {
          console.error(error.message);
        }
      };
      fetchTask();
    } else {
      setIsEditing(false);
      setTaskName('');
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) return; // Don't submit empty tasks

    const taskData = { name: taskName };

    if (isEditing) {
      const { data, error } = await supabase
        .from('tasks')
        .update({ name: taskName, updated_at: new Date() })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error.message);
      } else {
        onTaskUpdated(); // Notify parent component to refresh the task list
      }
    } else {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) {
        console.error('Error creating task:', error.message);
      } else {
        onTaskUpdated(); // Notify parent component to refresh the task list
      }
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
