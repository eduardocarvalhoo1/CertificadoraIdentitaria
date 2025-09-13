import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Oficinas from './pages/Oficinas';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/oficinas" element={<Oficinas />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/professores" element={<Professores />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;