import DashboardCard from '../components/DashboardCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const stats = [
    { title: "Total de Oficinas", value: "12" },
    { title: "Total de Alunos", value: "150" },
    { title: "Professores e Tutores", value: "15" },
    { title: "Temas Disponíveis", value: "25" },
  ];

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <DashboardCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
    </div>
  );
}