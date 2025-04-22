import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import About from './pages/About';
import Home from './pages/Home';

function AppContent() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppContent;
