import {BrowserRouter, Route, Routes} from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/storybook' element={<div className="header__nav__storybook">Storybook</div>} />
        <Route path='/about' element={<About /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
