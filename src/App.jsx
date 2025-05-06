import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(
      !darkMode ? "Dark mode enabled" : "Light mode enabled", 
      { icon: !darkMode ? "🌙" : "☀️" }
    );
  };
  
  return (
    <div className="min-h-screen">
      <motion.button
        className="fixed top-4 right-4 md:top-6 md:right-6 z-20 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-soft"
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </motion.button>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
        toastClassName="!rounded-xl !shadow-card"
      />
    </div>
  );
}

export default App;