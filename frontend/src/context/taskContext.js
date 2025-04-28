import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';
import AuthContext from './authContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Get all tasks
  const getTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/tasks');
      
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error fetching tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Call getTasks only when user changes and is authenticated
  useEffect(() => {
    if (user && user._id) {
      getTasks();
    } else {
      setTasks([]);
    }
  }, [user?._id]); // Only depend on user._id to prevent unnecessary calls

  const value = {
    tasks,
    loading,
    error,
    getTasks,
    createTask: async (taskData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        const { data } = await api.post('/tasks', taskData);
        setTasks(prevTasks => [data, ...prevTasks]);
        return data;
      } catch (error) {
        setError(error.response?.data?.message || 'Error creating task');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    updateTask: async (taskId, taskData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        const { data } = await api.put(`/tasks/${taskId}`, taskData);
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? data : task));
        return data;
      } catch (error) {
        setError(error.response?.data?.message || 'Error updating task');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    deleteTask: async (taskId) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        await api.delete(`/tasks/${taskId}`);
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting task');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 