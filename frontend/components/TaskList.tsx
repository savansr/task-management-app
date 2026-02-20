'use client'

import { Task } from '@/app/dashboard/page'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  pagination: {
    page: number
    totalPages: number
    total: number
  }
  onPageChange: (page: number) => void
}

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggle,
  pagination,
  onPageChange,
}: TaskListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-completed text-white'
      case 'IN_PROGRESS':
        return 'bg-primary text-background'
      default:
        return 'bg-accent text-white'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text text-lg opacity-70">No tasks found. Create your first task!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-surface shadow-lg overflow-hidden sm:rounded-md border border-surface">
        <ul className="divide-y divide-background">
          {tasks.map((task) => (
            <li key={task.id} className="px-6 py-4 hover:bg-background transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggle(task.id)}
                      className={`flex-shrink-0 h-5 w-5 rounded-full border-2 ${
                        task.status === 'COMPLETED'
                          ? 'bg-completed border-completed'
                          : 'border-text opacity-50'
                      }`}
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-medium ${
                          task.status === 'COMPLETED' ? 'line-through text-text opacity-60' : 'text-text'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-text opacity-70">{task.description}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-text opacity-60">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-primary hover:opacity-80 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-accent hover:opacity-80 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-text opacity-80">
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total tasks)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-surface rounded-md text-sm font-medium text-text bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-surface rounded-md text-sm font-medium text-text bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
