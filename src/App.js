import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// import pages
import Home from './pages/Home';
import About from './pages/About';


//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
