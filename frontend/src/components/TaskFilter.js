const TaskFilter = ({ filter, setFilter }) => {
  const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            filter === value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter; 