import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleUpdate = async (taskData) => {
    await onUpdate(editingTask._id, taskData);
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'complete'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="p-6">
            {editingTask?._id === task._id ? (
              <TaskForm
                initialData={editingTask}
                onSubmit={handleUpdate}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {task.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task._id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === 'complete' ? 'Completed' : 'Incomplete'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Created:{' '}
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(task._id, {
                        status: task.status === 'complete' ? 'incomplete' : 'complete',
                      })
                    }
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    {task.status === 'complete' ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 