'use client'

interface TaskFiltersProps {
  filters: {
    status: '' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    search: string
    page: number
    limit: number
  }
  onFiltersChange: (filters: any) => void
  onReset: () => void
}

export default function TaskFilters({ filters, onFiltersChange, onReset }: TaskFiltersProps) {
  return (
    <div className="bg-surface shadow-lg rounded-lg p-4 mb-6 border border-surface">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-text mb-1">
            Search by Title
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
            className="block w-full rounded-md border-surface text-text shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border bg-background placeholder-gray-500"
            placeholder="Search tasks..."
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text mb-1">
            Filter by Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value as '' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
                page: 1,
              })
            }
            className="block w-full rounded-md border-surface text-text shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border bg-background"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>
      {(filters.search || filters.status) && (
        <div className="mt-4">
          <button
            onClick={onReset}
            className="text-sm text-primary hover:opacity-80 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
