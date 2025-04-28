import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

const PrivateRoute = () => {
  const { user, loading, error } = useContext(AuthContext);

  console.log('PrivateRoute - Auth state:', { 
    user, 
    loading, 
    error,
    hasUser: !!user,
    userId: user?._id,
    userName: user?.name,
    userToken: user?.token
  });

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected route
  return <Outlet />;
};

export default PrivateRoute; 