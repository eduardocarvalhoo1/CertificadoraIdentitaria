import React, { useState, useEffect, useContext } from 'react';
import DashboardCard from '../components/DashboardCard';
import styles from './Dashboard.module.css';
// import { AuthContext } from '../context/AuthContext'; // Não precisamos mais do AuthContext aqui

// Ícones SVG para os cards
const OficinasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const AlunosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ProfessoresIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>;
const TemasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;

// Dados estáticos para o gráfico e próximas oficinas (poderiam vir da API também)
const workshopsData = [
    { name: 'Robótica', students: 45 },
    { name: 'Web Dev', students: 60 },
    { name: 'IA', students: 25 },
    { name: 'Design', students: 20 },
];

const upcomingWorkshops = [
    { title: "Fotografia para Iniciantes", date: "25/09/2025" },
    { title: "Marketing Digital", date: "28/09/2025" },
    { title: "Gestão de Projetos", date: "02/10/2025" },
];

// --- Componentes internos (Chart, UpcomingWorkshops) permanecem os mesmos ---
const Chart = ({ data }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(item => item.students)) : 1;
    return (
        <div className={styles.chart}>
            <h3 className={styles.sectionTitle}>Alunos por Oficina (Estático)</h3>
            <div className={styles.chartBars}>
                {data.map((item, index) => (
                    <div key={index} className={styles.chartBarWrapper}>
                        <div
                            className={styles.chartBar}
                            style={{ height: `${(item.students / maxValue) * 100}%` }}
                            title={`${item.name}: ${item.students} alunos`}
                        >
                            <span className={styles.barValue}>{item.students}</span>
                        </div>
                        <span className={styles.barLabel}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UpcomingWorkshops = ({ workshops }) => (
    <div className={styles.upcomingWorkshops}>
        <h3 className={styles.sectionTitle}>Próximas Oficinas (Estático)</h3>
        <ul>
            {workshops.map((workshop, index) => (
                <li key={index}>
                    <span>{workshop.title}</span>
                    <span className={styles.workshopDate}>{workshop.date}</span>
                </li>
            ))}
        </ul>
    </div>
);
// --- Fim dos componentes internos ---


export default function Dashboard() {
  // const { token } = useContext(AuthContext); // Não precisamos mais do token aqui
  const [stats, setStats] = useState([
    { title: "Total de Oficinas", value: "0", icon: <OficinasIcon />, color: "blue" },
    { title: "Total de Alunos", value: "0", icon: <AlunosIcon />, color: "green" },
    { title: "Professores e Tutores", value: "0", icon: <ProfessoresIcon />, color: "orange" },
    // O card de "Temas" será igual ao de "Oficinas" por enquanto
    { title: "Temas (Oficinas)", value: "0", icon: <TemasIcon />, color: "purple" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      // if (!token) { // Removida a verificação do token
      //   setIsLoading(false);
      //   setError("Faça login para ver os dados.");
      //   return;
      // }

      setIsLoading(true);
      setError(null);

      try {
        // const headers = { 'Authorization': token }; // Não precisamos mais de headers
        
        // Faz a chamada para o novo endpoint público
        const response = await fetch('http://localhost:8000/api/public/stats');

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do dashboard.");
        }

        const data = await response.json();

        // Atualiza o estado com os dados reais
        setStats([
          { title: "Total de Oficinas", value: data.totalOficinas.toString(), icon: <OficinasIcon />, color: "blue" },
          { title: "Total de Alunos", value: data.totalAlunos.toString(), icon: <AlunosIcon />, color: "green" },
          { title: "Professores e Tutores", value: data.totalProfessores.toString(), icon: <ProfessoresIcon />, color: "orange" },
          { title: "Temas (Oficinas)", value: data.totalOficinas.toString(), icon: <TemasIcon />, color: "purple" },
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // Remove o 'token' das dependências


  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={isLoading ? "..." : stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className={styles.bottomSection}>
          {/* Estes gráficos ainda são estáticos, mas poderiam ser alimentados pela API */}
          <Chart data={workshopsData} />
          <UpcomingWorkshops workshops={upcomingWorkshops} />
      </div>
    </div>
  );
}