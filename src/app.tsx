import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import './styles.css';
import './media-styles.css';

const App = () => {
  const user = useSelector(selectCurrentUser);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? savedTheme === 'dark' : prefersDark;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="app-container">
      <button 
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/tasks" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/tasks" /> : <RegisterPage />} />
          <Route path="/tasks" element={user ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? '/tasks' : '/login'} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;