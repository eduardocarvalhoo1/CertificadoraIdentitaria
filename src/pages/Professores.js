import React from 'react';
import styles from './Professores.module.css';

export default function Professores() {
  const professores = [
    { id: 1, nome: "Dr. Carlos Silva", especialidade: "Engenharia Mecatrônica", tipo: "Professor" },
    { id: 2, nome: "Dra. Beatriz Costa", especialidade: "Ciência da Computação", tipo: "Professor" },
    { id: 3, nome: "Mariana Dias", especialidade: "Robótica Educacional", tipo: "Tutor" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gerir Professores e Tutores</h2>
        <button className={styles.button}>Adicionar Profissional</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Tipo</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professores.map((prof) => (
              <tr key={prof.id}>
                <td>{prof.nome}</td>
                <td>{prof.especialidade}</td>
                <td>
                  <span className={`${styles.badge} ${prof.tipo === 'Professor' ? styles.badgeProfessor : styles.badgeTutor}`}>
                    {prof.tipo}
                  </span>
                </td>
                <td className={styles.actions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`}>Editar</button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}