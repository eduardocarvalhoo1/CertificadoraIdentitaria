import React, { useState, useEffect, useMemo } from 'react';
import styles from './Alunos.module.css';
import Modal from '../components/Modal';

// Ícones SVG
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAluno, setCurrentAluno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('Você precisa estar logado para acessar esta página.');
        }

        // Busca o perfil do usuário e a lista de alunos em paralelo
        const [userResponse, alunosResponse] = await Promise.all([
          fetch(`http://localhost:8000/api/auth/profile/${userId}`, {
            headers: { 'Authorization': token }
          }),
          fetch('http://localhost:8000/api/alunos', {
            headers: { 'Authorization': token }
          })
        ]);

        if (!userResponse.ok) {
            throw new Error('Não foi possível verificar sua permissão.');
        }
        const userData = await userResponse.json();
        setUserRole(userData.role);

        if (!alunosResponse.ok) {
            throw new Error('Falha ao buscar alunos.');
        }
        const data = await alunosResponse.json();
        setAlunos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAlunos = useMemo(() =>
    alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (aluno.oficina && aluno.oficina.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [alunos, searchTerm]);

  const handleOpenModal = (aluno = null) => {
    setCurrentAluno(aluno);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAluno(null);
  };

  const handleSave = async (formData) => {
    const token = localStorage.getItem('token');
    const method = currentAluno ? 'PUT' : 'POST';
    const url = currentAluno 
      ? `http://localhost:8000/api/alunos/${currentAluno.id}`
      : 'http://localhost:8000/api/alunos';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar aluno.');
      }
      handleCloseModal();
      // Re-fetch para atualizar a lista
      const alunosResponse = await fetch('http://localhost:8000/api/alunos', { headers: { 'Authorization': token }});
      const data = await alunosResponse.json();
      setAlunos(data);
    } catch (err) {
        setError(err.message); // Exibe o erro
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/alunos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao excluir aluno.');
            }
            // Re-fetch para atualizar a lista
            const alunosResponse = await fetch('http://localhost:8000/api/alunos', { headers: { 'Authorization': token }});
            const data = await alunosResponse.json();
            setAlunos(data);
        } catch (err) {
            setError(err.message);
        }
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.header}>
        <h2 className={styles.title}>Gerir Alunos</h2>
        <div className={styles.headerActions}>
            <input
                type="text"
                placeholder="Buscar por nome, email ou oficina..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {userRole === 'Professor' && (
              <button className={styles.button} onClick={() => handleOpenModal()}>
                  <AddIcon /> Adicionar Aluno
              </button>
            )}
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Oficina</th>
              {userRole === 'Professor' && <th className={styles.actionsHeader}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan={userRole === 'Professor' ? "4" : "3"} className={styles.loading}>Carregando...</td></tr>
            ) : filteredAlunos.length > 0 ? (
              filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.oficina}</td>
                  {userRole === 'Professor' && (
                    <td className={styles.actions}>
                      <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(aluno)}>
                        <EditIcon />
                      </button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(aluno.id)}>
                        <DeleteIcon />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === 'Professor' ? "4" : "3"} className={styles.emptyMessage}>Nenhum aluno encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AlunoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          aluno={currentAluno}
        />
      )}
    </div>
  );
}

// Componente do modal para o formulário de aluno
const AlunoModal = ({ isOpen, onClose, onSave, aluno }) => {
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      oficina: '',
    });
  
    useEffect(() => {
      if (aluno) {
        setFormData({
          nome: aluno.nome,
          email: aluno.email,
          oficina: aluno.oficina,
        });
      } else {
        setFormData({ nome: '', email: '', oficina: '' });
      }
    }, [aluno, isOpen]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={aluno ? 'Editar Aluno' : 'Adicionar Aluno'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="oficina">Oficina</label>
            <input type="text" id="oficina" name="oficina" value={formData.oficina} onChange={handleChange} required />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.button}>{aluno ? 'Salvar Alterações' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    );
};

