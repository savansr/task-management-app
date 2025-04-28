import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { TaskProvider } from './context/taskContext';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <TaskProvider>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </TaskProvider>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App; 