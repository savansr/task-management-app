'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'
import TaskFilters from '@/components/TaskFilters'

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  userId: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState({
    status: '' as '' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    search: '',
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user, filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      }
      if (filters.status) {
        params.status = filters.status
      }
      if (filters.search) {
        params.search = filters.search
      }

      const response = await api.get('/tasks', { params })
      setTasks(response.data.tasks)
      setPagination(response.data.pagination)
    } catch (error: any) {
      toast.error('Failed to fetch tasks')
      console.error('Fetch tasks error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (title: string, description: string) => {
    try {
      const response = await api.post('/tasks', { title, description })
      toast.success('Task created successfully!')
      setShowForm(false)
      fetchTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create task')
    }
  }

  const handleUpdateTask = async (id: string, title: string, description: string) => {
    try {
      await api.patch(`/tasks/${id}`, { title, description })
      toast.success('Task updated successfully!')
      setEditingTask(null)
      fetchTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update task')
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Task deleted successfully!')
      fetchTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete task')
    }
  }

  const handleToggleTask = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`)
      toast.success('Task status updated!')
      fetchTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to toggle task')
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface shadow-lg border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-text">Task Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text opacity-80">{user.email}</span>
              <button
                onClick={logout}
                className="bg-accent hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text">My Tasks</h2>
            <button
              onClick={() => {
                setEditingTask(null)
                setShowForm(true)
              }}
              className="bg-primary hover:opacity-90 text-background px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Task
            </button>
          </div>

          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters({ status: '', search: '', page: 1, limit: 10 })}
          />

          {showForm && (
            <div className="mb-6">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask
                  ? (title, description) => handleUpdateTask(editingTask.id, title, description)
                  : handleCreateTask}
                onCancel={() => {
                  setShowForm(false)
                  setEditingTask(null)
                }}
              />
            </div>
          )}

          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={(task) => {
              setEditingTask(task)
              setShowForm(true)
            }}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </main>
    </div>
  )
}
