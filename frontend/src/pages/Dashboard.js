import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import TaskContext from '../context/taskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';

export default function Dashboard() {
  const [filter, setFilter] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useContext(TaskContext);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      toast.success('Task created successfully');
      setShowTaskForm(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status === 'incomplete';
    if (filter === 'completed') return task.status === 'complete';
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <TaskFilter filter={filter} setFilter={setFilter} />
        </div>

        {filteredTasks.length === 0 && !showTaskForm ? (
          <div className="mt-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new task.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              {showTaskForm ? (
                <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
              ) : (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="mb-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Task
                </button>
              )}
            </div>

            <div className="mt-8">
              <TaskList
                tasks={filteredTasks}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 