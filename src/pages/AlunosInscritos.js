import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AlunosInscritos.module.css';
import { AuthContext } from '../context/AuthContext';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

export default function AlunosInscritos() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlunosInscritos = async () => {
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8000/api/oficinas/${id}/inscritos`, {
          headers: { 'Authorization': token }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Oficina não encontrada.');
          }
          throw new Error('Falha ao buscar alunos inscritos.');
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlunosInscritos();
  }, [id, token]);

  const handleVoltar = () => {
    navigate('/oficinas');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button className={styles.backButton} onClick={handleVoltar}>
          <BackIcon /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleVoltar}>
          <BackIcon /> Voltar
        </button>
        <h2 className={styles.title}>{data?.oficina}</h2>
      </div>

      <div className={styles.infoCards}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Total de Inscritos</span>
          <span className={styles.infoValue}>{data?.totalInscritos}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Total de Vagas</span>
          <span className={styles.infoValue}>{data?.vagas}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Vagas Restantes</span>
          <span className={styles.infoValue}>{data?.vagasRestantes}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {data?.alunos.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {data.alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyMessage}>
            Não há alunos inscritos nesta oficina no momento.
          </div>
        )}
      </div>
    </div>
  );
}