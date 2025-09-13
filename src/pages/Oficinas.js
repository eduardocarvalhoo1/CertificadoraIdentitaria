import styles from './Oficinas.module.css';

export default function Oficinas() {
  const oficinas = [
    { id: 1, tema: "Introdução à Robótica", professor: "Dr. Silva", vagas: 20 },
    { id: 2, tema: "Desenvolvimento Web", professor: "Dra. Costa", vagas: 15 },
    { id: 3, tema: "Inteligência Artificial", professor: "Dr. Almeida", vagas: 10 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gerenciar Oficinas</h2>
        <button className={styles.button}>Adicionar Oficina</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Professor</th>
              <th>Vagas</th>
            </tr>
          </thead>
          <tbody>
            {oficinas.map((oficina) => (
              <tr key={oficina.id}>
                <td>{oficina.tema}</td>
                <td>{oficina.professor}</td>
                <td className={styles.centerText}>{oficina.vagas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}