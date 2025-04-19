import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';

function AppContent() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}

export default AppContent;
