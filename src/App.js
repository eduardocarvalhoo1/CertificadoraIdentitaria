import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Oficinas from './pages/Oficinas';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Perfil from './pages/Perfil'; 
import AlunosInscritos from './pages/AlunosInscritos';
import styles from './App.module.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useTokenExpiration } from './hooks/useTokenExpiration';


function App() {
  useTokenExpiration();
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<SignUp />} /> 
            {/* Rotas comuns (qualquer usuário logado) */}
            <Route element={<ProtectedRoute roles={["aluno", "tutor", "professor"]} />}>
              <Route path="/oficinas" element={<Oficinas />} />
              <Route path="/alunos" element={<Alunos />} />
              <Route path="/perfil" element={<Perfil />} />
             <Route path="/professores" element={<Professores />} />  
            </Route>
            {/* Rotas exclusivas de professor */}
            <Route element={<ProtectedRoute roles={["professor"]} />}> 
              <Route path="/oficinas/:id/inscritos" element={<AlunosInscritos />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
