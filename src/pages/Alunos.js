import React from 'react';
import styles from './Alunos.module.css';

export default function Alunos() {
  const alunos = [
    { id: 1, nome: "Ana Pereira", email: "ana.p@example.com", oficina: "Introdução à Robótica" },
    { id: 2, nome: "Bruno Lima", email: "bruno.l@example.com", oficina: "Desenvolvimento Web" },
    { id: 3, nome: "Carla Souza", email: "carla.s@example.com", oficina: "Inteligência Artificial" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gerir Alunos</h2>
        <button className={styles.button}>Adicionar Aluno</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Oficina</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.oficina}</td>
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