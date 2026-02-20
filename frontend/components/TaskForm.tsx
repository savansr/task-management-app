'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/app/dashboard/page'

interface TaskFormProps {
  task?: Task | null
  onSubmit: (title: string, description: string) => void
  onCancel: () => void
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    }
  }

  return (
    <div className="bg-surface shadow-lg rounded-lg p-6 border border-surface">
      <h3 className="text-lg font-medium text-text mb-4">
        {task ? 'Edit Task' : 'Create New Task'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface text-text shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border bg-background placeholder-gray-500"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface text-text shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border bg-background placeholder-gray-500"
            placeholder="Enter task description (optional)"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-surface rounded-md shadow-sm text-sm font-medium text-text bg-surface hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:opacity-90"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
